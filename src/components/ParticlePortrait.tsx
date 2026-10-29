"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
const portraitOutline =
  "M 48 667 L 48 599 L 57 538 L 70 477 Q 75 445 103 432 L 153 413 L 189 395 L 203 374 L 200 349 L 193 321 Q 180 313 179 287 L 183 265 L 189 261 L 185 233 L 185 212 L 193 187 L 213 168 L 239 163 L 269 161 L 299 163 L 324 169 L 343 177 L 351 188 L 347 198 L 356 215 L 357 234 L 347 255 L 339 271 L 338 299 L 332 325 L 321 351 L 321 374 L 330 396 L 344 411 L 390 430 L 426 451 Q 442 472 446 506 L 460 575 L 473 667 Z";

export default function ParticlePortrait() {
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
        float front=1.0;
        vec2 d=mv.xy-uPointer; float influence=exp(-dot(d,d)*5.0)*uHover*front;
        mv.xy+=normalize(d+vec2(.001))*influence*.12;
        mv.z+=sin(aSeed*40.0+uTime*2.0)*influence*.12;
        mv.xy*=.88+.12*uReveal;
        vLight=aLight*(.07+.93*front)*uReveal+influence*.12;
        gl_Position=projectionMatrix*mv;
        gl_PointSize=(.85+aLight*.7)*uPixel*(7.0/-mv.z);}`,
      fragmentShader: `varying float vLight; void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.89,.91,.96),vLight*(1.0-smoothstep(.12,.5,d)));}`,
    });
    const portrait = new THREE.Points(geometry, material);
    portrait.rotation.y = 0;

    scene.add(portrait);
    let disposed = false,
      frame = 0,
      visible = true,
      loadedAt = 0,
      hover = 0,
      px = 0,
      py = 0;
    const pointer = new THREE.Vector2(10, 10);
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      const sample = document.createElement("canvas");
      sample.width = 500;
      sample.height = 667;
      const ctx = sample.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, 500, 667);
      const pixels = ctx.getImageData(0, 0, 500, 667).data;
      const mask = new Path2D(portraitOutline);
      ctx.lineWidth = 3;
      const positions: number[] = [],
        lights: number[] = [],
        seeds: number[] = [];
      const step = innerWidth < 600 ? 2.4 : 1.8;
      for (let y = 160; y < 667; y += step)
        for (let x = 45; x < 475; x += step) {
          const xx = x + (Math.random() - 0.5) * step,
            yy = y + (Math.random() - 0.5) * step;
          if (!ctx.isPointInPath(mask, xx, yy)) continue;
          const offset = (Math.floor(yy) * 500 + Math.floor(xx)) * 4;
          const luminance =
            (pixels[offset] * 0.2126 +
              pixels[offset + 1] * 0.7152 +
              pixels[offset + 2] * 0.0722) /
            255;
          const edge = ctx.isPointInStroke(mask, xx, yy);
          positions.push(
            ((xx - 250) * 4.5) / 507,
            ((413.5 - yy) * 4.5) / 507,
            (luminance - 0.45) * 0.14,
          );
          lights.push(
            edge
              ? 0.5 + Math.random() * 0.25
              : 0.04 + Math.pow(luminance, 1.1) * 0.9,
          );
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
    };
    image.src = "/images/sai-madhav.jpg";
    const resize = () => {
      const r = element.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.position.z = Math.max(
        7.5,
        4.3 / (2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.aspect),
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
    let rotation = 0;
    const render = () => {
      if (disposed) return;
      const now = performance.now();
      if (visible && !document.hidden) {
        rotation = reduced ? 0 : Math.sin((now - start) / 5000) * 0.035;
        material.uniforms.uTime.value = reduced ? 0 : (now - start) / 1000;
        material.uniforms.uReveal.value = reduced
          ? 1
          : loadedAt
            ? Math.min((now - loadedAt) / 1300, 1)
            : 0;
        material.uniforms.uPointer.value.lerp(pointer, 0.1);
        material.uniforms.uHover.value +=
          ((reduced ? 0 : hover) - material.uniforms.uHover.value) * 0.08;
        portrait.rotation.y +=
          (rotation + (reduced ? 0 : px * 0.18 * hover) - portrait.rotation.y) *
          0.035;
        portrait.rotation.x +=
          ((reduced ? 0 : py * 0.12 * hover) - portrait.rotation.x) * 0.035;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      disposed = true;
      image.onload = null;
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
      <svg
        className="portrait-fallback"
        viewBox="0 150 500 517"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 5"
      >
        <defs>
          <pattern
            id="portrait-dot-pattern"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r=".7" fill="currentColor" stroke="none" />
          </pattern>
        </defs>
        <path d={portraitOutline} fill="url(#portrait-dot-pattern)" />
      </svg>
    </div>
  );
}
