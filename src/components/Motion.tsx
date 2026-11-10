"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let hasRestoredHash = false;

    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 901px)",
        gallery: "(min-width: 1000px) and (min-height: 760px)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        const root = document.documentElement;
        const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
        const lenis = new Lenis({ duration: 0.95, anchors: false });
        const tick = (time: number) => lenis.raf(time * 1000);
        let disposed = false;
        let horizontal: {
          gallery: HTMLElement;
          track: HTMLElement;
          trigger: ScrollTrigger;
        } | undefined;

        root.dataset.motion = "ready";
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.set(chapters, { zIndex: (index) => index + 1 });

        if (desktop) {
          chapters.slice(0, 1).forEach((chapter) => {
            const surface = chapter.querySelector<HTMLElement>(
              "[data-chapter-surface]",
            );
            if (!surface) return;
            gsap.to(surface, {
              scale: 0.97,
              transformOrigin: "50% 100%",
              borderRadius: "32px",
              "--chapter-shade": 0.45,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "bottom bottom",
                end: () => `+=${window.innerHeight * 0.9}`,
                pin: chapter,
                pinSpacing: false,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });
        }

        const gallery = document.querySelector<HTMLElement>(".project-gallery");
        const track = gallery?.querySelector<HTMLElement>(".project-track");
        if (context.conditions.gallery && gallery && track) {
          root.dataset.gallery = "horizontal";
          const distance = () => track.scrollWidth - gallery.clientWidth;
          const animation = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: gallery,
              start: "top 110px",
              end: () => `+=${distance()}`,
              pin: gallery,
              pinSpacing: true,
              scrub: 0.45,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
          if (animation.scrollTrigger)
            horizontal = { gallery, track, trigger: animation.scrollTrigger };
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          if (element.closest("#skills, #resume, #contact")) return;
          gsap.fromTo(
            element,
            { y: desktop ? 65 : 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        gsap.to(".hero-copy, .hero-bottom, .hero-coordinate", {
          y: -80,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 45%",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".project-visual").forEach((visual) => {
          gsap.fromTo(
            visual,
            { clipPath: "inset(8% 5% 8% 5% round 18px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: visual,
                start: "top 92%",
                end: "top 25%",
                scrub: true,
              },
            },
          );
        });

        // The closing sections move through their content, rather than pinning
        // entire screens into another stack of cards.
        gsap.fromTo("#skills-title", { y: 45 }, {
          y: -25,
          ease: "none",
          scrollTrigger: {
            trigger: "#skills",
            start: "top 85%",
            end: "bottom 20%",
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".skill-row").forEach((row, index) => {
          gsap.fromTo(row, {
            x: (index % 2 ? 1 : -1) * (desktop ? 85 : 25),
            opacity: 0.2,
            "--row-line": 0,
          }, {
            x: 0,
            opacity: 1,
            "--row-line": 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 95%",
              end: "top 68%",
              scrub: true,
            },
          });
        });
        gsap.fromTo(".resume-content > div:first-child > *", {
          y: 45,
          opacity: 0.15,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".resume-content",
            start: "top 90%",
            end: "top 45%",
            scrub: true,
          },
        });
        gsap.fromTo(".resume-document", {
          x: desktop ? 100 : 0,
          y: desktop ? 140 : 65,
          opacity: 0.15,
        }, {
          x: 0,
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".resume-document",
            start: "top 95%",
            end: "top 40%",
            scrub: true,
          },
        });
        gsap.fromTo(".contact-heading h2", { x: desktop ? -70 : -20 }, {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-heading",
            start: "top 95%",
            end: "top 45%",
            scrub: true,
          },
        });
        gsap.fromTo(".contact-heading h2 > span", { x: 70, y: -45, opacity: 0.2 }, {
          x: 0,
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-heading",
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".socials > *, .contact-form > *").forEach((element) => {
          gsap.fromTo(element, { y: 35, opacity: 0.3 }, {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 97%",
              end: "top 75%",
              scrub: true,
            },
          });
        });

        // Anchor positions come from normal layout, even during a pinned transition.
        const destination = (target: HTMLElement) => {
          const project = target.closest<HTMLElement>(".project");
          if (horizontal && project && horizontal.gallery.contains(project)) {
            const offset = project.getBoundingClientRect().left -
              horizontal.track.getBoundingClientRect().left;
            return horizontal.trigger.start + offset;
          }
          const chapter = target.closest<HTMLElement>("[data-chapter]");
          if (!chapter)
            return target.getBoundingClientRect().top + window.scrollY;
          const layout = chapter.parentElement?.classList.contains("pin-spacer")
            ? chapter.parentElement
            : chapter;
          let offset = 0;
          let node: HTMLElement | null = target;
          while (node && node !== chapter) {
            offset += node.offsetTop;
            node = node.offsetParent as HTMLElement | null;
          }
          return Math.max(
            0,
            layout.getBoundingClientRect().top + window.scrollY + offset - 88,
          );
        };
        const revealFocusedProject = (event: FocusEvent) => {
          const project = (event.target as HTMLElement).closest<HTMLElement>(".project");
          if (!horizontal || !project || !horizontal.gallery.contains(project)) return;
          const bounds = project.getBoundingClientRect();
          if (bounds.left < 0 || bounds.right > window.innerWidth)
            lenis.scrollTo(destination(project), { duration: 0.75 });
        };
        const restoreHash = () => {
          let target: HTMLElement | null;
          try {
            target = document.getElementById(
              decodeURIComponent(location.hash.slice(1)) || "home",
            );
          } catch {
            return;
          }
          if (target) lenis.scrollTo(destination(target), { immediate: true });
        };
        const navigate = (event: MouseEvent) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) return;
          const anchor = (event.target as Element).closest<HTMLAnchorElement>(
            'a[href^="#"]',
          );
          if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
          let target: HTMLElement | null;
          try {
            target = document.getElementById(
              decodeURIComponent(anchor.hash.slice(1)),
            );
          } catch {
            return;
          }
          if (!target) return;
          event.preventDefault();
          if (location.hash !== anchor.hash)
            history.pushState(null, "", anchor.hash);
          lenis.scrollTo(destination(target), {
            duration: 1.4,
            onComplete: () => {
              target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
            },
          });
        };

        document.addEventListener("click", navigate);
        document.addEventListener("focusin", revealFocusedProject);
        window.addEventListener("popstate", restoreHash);
        window.addEventListener("hashchange", restoreHash);
        const refresh = () => {
          if (disposed) return;
          ScrollTrigger.refresh();
          lenis.resize();
        };
        const frame = requestAnimationFrame(() => {
          refresh();
          if (!hasRestoredHash) {
            restoreHash();
            hasRestoredHash = true;
          }
        });
        document.fonts.ready.then(refresh);

        return () => {
          disposed = true;
          cancelAnimationFrame(frame);
          document.removeEventListener("click", navigate);
          document.removeEventListener("focusin", revealFocusedProject);
          window.removeEventListener("popstate", restoreHash);
          window.removeEventListener("hashchange", restoreHash);
          gsap.ticker.remove(tick);
          lenis.destroy();
          delete root.dataset.motion;
          delete root.dataset.gallery;
        };
      },
    );

    return () => media.revert();
  }, []);
  return null;
}
