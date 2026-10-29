"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Portrait() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.z = 7;
    let geometry: THREE.BufferGeometry | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let points: THREE.Points | undefined;
    let disposed = false,
      frame = 0,
      pointerX = 0,
      pointerY = 0,
      visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(element);
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 667;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, 500, 667);
      const pixels = ctx.getImageData(0, 0, 500, 667).data;
      // Silhouette follows the supplied reference; the background is never sampled.
      const mask = new Path2D(
        "M 0 667 L 0 515 L 49 482 L 136 446 L 155 409 L 153 341 L 147 294 L 146 237 L 153 166 L 168 122 L 201 89 L 242 78 L 289 82 L 335 103 L 368 134 L 389 166 L 391 241 L 384 289 L 392 315 L 381 347 L 365 376 L 360 413 L 385 445 L 445 479 L 500 516 L 500 667 Z",
      );
      const positions: number[] = [],
        brightness: number[] = [],
        seeds: number[] = [];
      const step = window.innerWidth < 700 ? 3.1 : 2.1;
      for (let y = 78; y < 667; y += step)
        for (let x = 0; x < 500; x += step) {
          if (!ctx.isPointInPath(mask, x, y)) continue;
          const value = pixels[(Math.floor(y) * 500 + Math.floor(x)) * 4] / 255;
          const jitter = () => (Math.random() - 0.5) * 0.011;
          positions.push(
            (x / 500 - 0.5) * 3.6 + jitter(),
            (0.5 - y / 667) * 4.8 + jitter(),
            (value - 0.4) * 0.45,
          );
          brightness.push(value);
          seeds.push(Math.random());
        }
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute(
        "aBrightness",
        new THREE.Float32BufferAttribute(brightness, 1),
      );
      geometry.setAttribute(
        "aSeed",
        new THREE.Float32BufferAttribute(seeds, 1),
      );
      material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uScatter: { value: reduced ? 0 : 1 },
          uPixel: { value: renderer.getPixelRatio() },
        },
        vertexShader: `attribute float aBrightness; attribute float aSeed; varying float vLight; uniform float uTime; uniform float uScatter; uniform float uPixel;
        void main(){vLight=aBrightness; vec3 p=position; p.x+=sin(aSeed*75.0+uTime*.16)*uScatter*3.0; p.y+=cos(aSeed*50.0+uTime*.12)*uScatter*2.0; p.z+=sin(aSeed*90.0)*uScatter*2.0; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=(.65+aBrightness*.85)*uPixel*(7.0/-mv.z);}`,
        fragmentShader: `varying float vLight; void main(){float d=length(gl_PointCoord-.5); if(d>.5) discard; float a=(.07+pow(vLight,1.1)*.78)*(1.0-smoothstep(.15,.5,d)); gl_FragColor=vec4(vec3(.93,.93,.96),a);}`,
      });
      points = new THREE.Points(geometry, material);
      scene.add(points);
      element.classList.add("ready");
    };
    image.src = "/images/portrait-reference.png";
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const move = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move, { passive: true });
    const start = performance.now();
    const render = () => {
      if (disposed) return;
      const time = (performance.now() - start) / 1000;
      if (material && points) {
        const scroll = Math.min(window.scrollY / window.innerHeight, 1);
        material.uniforms.uTime.value = time;
        material.uniforms.uScatter.value = reduced
          ? 0
          : Math.max(0, 1 - time / 2.2) ** 3 + scroll * 0.65;
        points.rotation.y +=
          ((reduced ? 0 : pointerX * 0.14) - points.rotation.y) * 0.035;
        points.rotation.x +=
          ((reduced ? 0 : pointerY * 0.06) - points.rotation.x) * 0.035;
      }
      if (visible && !document.hidden) renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", move);
      geometry?.dispose();
      material?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div ref={host} className="portrait" aria-hidden="true">
      <img
        className="portrait-fallback"
        src="/images/portrait-reference.png"
        alt=""
      />
    </div>
  );
}
