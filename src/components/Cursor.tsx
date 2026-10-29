"use client";
import { useEffect, useRef } from "react";
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = root.current,
      surface = canvas.current;
    if (!el || !surface) return;
    const ctx = surface.getContext("2d");
    if (!ctx) return;
    let x = 0,
      y = 0,
      frame = 0,
      visible = false;
    const trail = Array.from({ length: 18 }, () => ({ x: 0, y: 0 }));
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      surface.width = innerWidth * dpr;
      surface.height = innerHeight * dpr;
      surface.style.width = `${innerWidth}px`;
      surface.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!visible)
        trail.forEach((p) => {
          p.x = x;
          p.y = y;
        });
      visible = true;
      el.dataset.visible = "true";
      document.documentElement.classList.add("custom-cursor-enabled");
      el.dataset.hover = String(
        (event.target as Element).closest("a,button,input,textarea,summary") !==
          null,
      );
      el.style.setProperty("--cursor-x", `${x}px`);
      el.style.setProperty("--cursor-y", `${y}px`);
    };
    const hide = () => {
      visible = false;
      el.dataset.visible = "false";
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
    const render = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let previous = { x, y };
      trail.forEach((p, i) => {
        p.x += (previous.x - p.x) * 0.32;
        p.y += (previous.y - p.y) * 0.32;
        previous = p;
        if (visible) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.3, 2.4 - i * 0.12), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(238,237,240,${(1 - i / trail.length) * 0.3})`;
          ctx.fill();
        }
      });
      frame = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);
  return (
    <div ref={root} className="custom-cursor" aria-hidden="true">
      <canvas ref={canvas} />
      <div className="cursor-head" />
    </div>
  );
}
