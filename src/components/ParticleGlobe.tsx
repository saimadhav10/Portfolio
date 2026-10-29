"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleGlobe() {
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
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixel: { value: renderer.getPixelRatio() },
        uReveal: { value: reduced ? 1 : 0 },
        uHover: { value: 0 },
        uPointer: { value: new THREE.Vector2(10, 10) },
      },
      vertexShader: `attribute float aLight; attribute float aSeed; varying float vLight;
        uniform float uTime; uniform float uPixel; uniform float uReveal; uniform float uHover; uniform vec2 uPointer;
        void main(){vec3 p=position; vec4 mv=modelViewMatrix*vec4(p,1.0);
        vec3 normal=normalize(mat3(modelViewMatrix)*normalize(p));
        float front=smoothstep(-.2,.65,normal.z);
        vec2 d=mv.xy-uPointer; float influence=exp(-dot(d,d)*5.0)*uHover*front;
        mv.xy+=normalize(d+vec2(.001))*influence*.12;
        mv.z+=sin(aSeed*40.0+uTime*2.0)*influence*.12;
        mv.xy*=.88+.12*uReveal;
        vLight=aLight*(.07+.93*front)*uReveal+influence*.12;
        gl_Position=projectionMatrix*mv;
        gl_PointSize=(.85+aLight*.7)*uPixel*(7.0/-mv.z);}`,
      fragmentShader: `varying float vLight; void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.89,.91,.96),vLight*(1.0-smoothstep(.12,.5,d)));}`,
    });
    const globe = new THREE.Points(geometry, material);
    globe.rotation.y = -0.65;
    globe.rotation.z = -0.12;
    scene.add(globe);
    let disposed = false,
      frame = 0,
      visible = true,
      loadedAt = 0,
      hover = 0,
      px = 0,
      py = 0;
    const pointer = new THREE.Vector2(10, 10);
    const controller = new AbortController();
    fetch("/globe-points.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Globe unavailable");
        return r.json();
      })
      .then((data: number[]) => {
        if (disposed) return;
        const positions: number[] = [],
          lights: number[] = [],
          seeds: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
          positions.push(data[i] * 1.7, data[i + 1] * 1.7, data[i + 2] * 1.7);
          lights.push(data[i + 3]);
          seeds.push(Math.random());
        }
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute(
          "aLight",
          new THREE.Float32BufferAttribute(lights, 1),
        );
        geometry.setAttribute(
          "aSeed",
          new THREE.Float32BufferAttribute(seeds, 1),
        );
        geometry.computeBoundingSphere();
        loadedAt = performance.now();
        element.classList.add("ready");
      })
      .catch(() => {
        /* The SVG globe remains visible if loading fails. */
      });
    const resize = () => {
      const r = element.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.position.z = Math.max(
        6.7,
        3.9 / (2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.aspect),
      );
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(element);
    const move = (e: PointerEvent) => {
      const r = element.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      hover = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0;
      px = x - 0.5;
      py = y - 0.5;
      const height =
        2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.position.z;
      pointer.set(px * height * camera.aspect, -py * height);
    };
    const leave = () => {
      hover = 0;
      px = py = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    const start = performance.now();
    let previous = start,
      rotation = -0.65;
    const render = () => {
      if (disposed) return;
      const now = performance.now(),
        delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (visible && !document.hidden) {
        if (!reduced) rotation += delta * 0.055;
        material.uniforms.uTime.value = reduced ? 0 : (now - start) / 1000;
        material.uniforms.uReveal.value = reduced
          ? 1
          : loadedAt
            ? Math.min((now - loadedAt) / 1300, 1)
            : 0;
        material.uniforms.uPointer.value.lerp(pointer, 0.1);
        material.uniforms.uHover.value +=
          ((reduced ? 0 : hover) - material.uniforms.uHover.value) * 0.08;
        globe.rotation.y +=
          (rotation + (reduced ? 0 : px * 0.3 * hover) - globe.rotation.y) *
          0.035;
        globe.rotation.x +=
          ((reduced ? 0 : py * 0.12 * hover) - globe.rotation.x) * 0.035;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      disposed = true;
      controller.abort();
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
    <div ref={host} className="globe" aria-hidden="true">
      <svg
        className="globe-fallback"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 5"
      >
        <circle cx="200" cy="200" r="170" />
        <ellipse cx="200" cy="200" rx="90" ry="170" />
        <ellipse cx="200" cy="200" rx="150" ry="170" />
        <ellipse cx="200" cy="200" rx="170" ry="70" />
        <ellipse cx="200" cy="200" rx="170" ry="130" />
        <path d="M30 200h340M200 30v340" />
      </svg>
    </div>
  );
}
