"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 35, opacity: 0.15 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
          },
        );
      });
      gsap.to(".hero-copy", {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom 40%",
          scrub: true,
        },
      });
    });
    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
