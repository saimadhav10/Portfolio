"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Only the outside contour is used. No photo, luminance, or facial data is rendered.
const contour =
  "M 0 667 L 0 515 Q 49 478 136 446 L 155 409 L 153 341 L 147 294 L 146 237 L 153 166 L 168 122 L 201 89 L 242 78 L 289 82 L 335 103 L 368 134 L 389 166 L 391 241 L 384 289 L 392 315 L 381 347 L 365 376 L 360 413 Q 385 450 445 479 L 500 516 L 500 667 Z";
export default function ParticleSilhouette() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.z = 7;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) {
      renderer.dispose();
      renderer.domElement.remove();
      return;
    }
    const mask = new Path2D(contour);
    ctx.lineWidth = 9;
    const positions: number[] = [],
      lights: number[] = [],
      seeds: number[] = [];
    const step = innerWidth < 700 ? 3.2 : 2.5;
    for (let y = 78; y < 667; y += step)
      for (let x = 0; x < 500; x += step) {
        const px = x + (Math.random() - 0.5) * step,
          py = y + (Math.random() - 0.5) * step;
        if (!ctx.isPointInPath(mask, px, py)) continue;
        const edge = ctx.isPointInStroke(mask, px, py);
        if (!edge && Math.random() > 0.64) continue;
        positions.push(
          (px / 500 - 0.5) * 3.6,
          (0.5 - py / 667) * 4.8,
          (Math.random() - 0.5) * 0.16,
        );
        lights.push(
          edge ? 0.6 + Math.random() * 0.4 : 0.1 + Math.random() * 0.28,
        );
        seeds.push(Math.random());
      }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      "aLight",
      new THREE.Float32BufferAttribute(lights, 1),
    );
    geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScatter: { value: reduced ? 0 : 1 },
        uPixel: { value: renderer.getPixelRatio() },
        uPointer: { value: new THREE.Vector2(10, 10) },
        uHover: { value: 0 },
      },
      vertexShader: `attribute float aLight; attribute float aSeed; varying float vLight;
        uniform float uTime; uniform float uScatter; uniform float uPixel; uniform vec2 uPointer; uniform float uHover;
        void main(){vec3 p=position; vec2 d=p.xy-uPointer; float influence=exp(-dot(d,d)*3.0)*uHover;
        p.xy+=normalize(d+vec2(.001))*influence*.38; p.z+=sin(aSeed*35.0+uTime*2.0)*influence*.35;
        p.x+=sin(aSeed*75.0+uTime*.18)*uScatter*3.0;
        p.y+=cos(aSeed*50.0+uTime*.12)*uScatter*2.0;
        vLight=aLight+influence*.22;
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
        gl_PointSize=(.8+aLight*.7)*uPixel*(7.0/-mv.z);}`,
      fragmentShader: `varying float vLight; void main(){float d=length(gl_PointCoord-.5); if(d>.5)discard; gl_FragColor=vec4(vec3(.93,.93,.96),vLight*(1.0-smoothstep(.1,.5,d)));}`,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    element.classList.add("ready");
    let frame = 0,
      disposed = false,
      visible = true,
      px = 0,
      py = 0,
      hover = 0;
    const pointer = new THREE.Vector2(10, 10);
    const resize = () => {
      const r = element.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const visibility = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    visibility.observe(element);
    const move = (e: PointerEvent) => {
      const r = element.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      hover = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0;
      px = x - 0.5;
      py = y - 0.5;
      const height = 2 * Math.tan(THREE.MathUtils.degToRad(18)) * 7;
      pointer.set(px * height * camera.aspect, -py * height);
    };
    const leave = () => {
      hover = 0;
      px = py = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    const start = performance.now();
    const render = () => {
      if (disposed) return;
      const time = (performance.now() - start) / 1000;
      material.uniforms.uTime.value = reduced ? 0 : time;
      material.uniforms.uScatter.value = reduced
        ? 0
        : Math.max(0, 1 - time / 2) ** 3 +
          Math.min(scrollY / innerHeight, 1) * 0.6;
      material.uniforms.uPointer.value.lerp(pointer, 0.12);
      material.uniforms.uHover.value +=
        ((reduced ? 0 : hover) - material.uniforms.uHover.value) * 0.08;
      points.rotation.y +=
        ((reduced ? 0 : px * 0.24 * hover) - points.rotation.y) * 0.04;
      points.rotation.x +=
        ((reduced ? 0 : py * 0.1 * hover) - points.rotation.x) * 0.04;
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
      document.removeEventListener("pointerleave", leave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div ref={host} className="portrait" aria-hidden="true">
      <svg className="silhouette-fallback" viewBox="0 0 500 667">
        <defs>
          <pattern
            id="silhouette-dots"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r=".7" fill="#eeedf0" opacity=".3" />
          </pattern>
        </defs>
        <path
          d={contour}
          fill="url(#silhouette-dots)"
          stroke="#eeedf0"
          strokeWidth="1.3"
          strokeDasharray="1 5"
        />
      </svg>
    </div>
  );
}
