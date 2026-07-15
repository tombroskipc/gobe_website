"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_MIN_ACTIVE_WIDTH = 768;

function activateScrollController() {
  const magneticCleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    const revealLineSpans = gsap.utils.toArray<HTMLElement>(".reveal-line > span");
    if (revealLineSpans.length) {
      gsap.set(revealLineSpans, { yPercent: 110 });
    }

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      const lineSpans = element.querySelectorAll<HTMLElement>(".reveal-line > span");
      if (!lineSpans.length) {
        return;
      }

      gsap.to(lineSpans, {
        yPercent: 0,
        duration: 1.08,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>(".floating-panel").forEach((panel, index) => {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 44, rotateX: -8 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 84%",
          },
          delay: index * 0.03,
        },
      );
    });

    const isHomeStoryModeActive = document.documentElement.classList.contains("home-story-active");

    gsap.utils.toArray<HTMLElement>("[data-scroll-section]").forEach((section) => {
      const shouldUseScrollReveal = !section.hasAttribute("data-home-story-section") || !isHomeStoryModeActive;

      if (shouldUseScrollReveal) {
        const revealTargets = section.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
        if (revealTargets.length) {
          gsap.fromTo(
            revealTargets,
            { autoAlpha: 0, y: 72, rotateX: -5, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 74%",
                once: true,
              },
            },
          );
        }

        const cards = section.querySelectorAll<HTMLElement>("[data-scroll-card]");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 36, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.95,
              ease: "power3.out",
              stagger: 0.055,
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                once: true,
              },
            },
          );
        }
      }

      const media = section.querySelectorAll<HTMLElement>("[data-scroll-media]");
      media.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 80, scale: 1.08 },
          {
            y: -24,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          },
        );
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-logo-marquee]").forEach((track) => {
      const width = track.scrollWidth / 2;
      if (width <= 0) return;
      gsap.to(track, {
        x: -width,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    });

    gsap.utils.toArray<HTMLElement>(".magnetic").forEach((element) => {
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(element, { x: x * 0.18, y: y * 0.28, duration: 0.35, ease: "power3.out" });
      };
      const onLeave = () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.35)" });
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      magneticCleanups.push(() => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      });
    });

    ScrollTrigger.refresh();
  });

  return () => {
    magneticCleanups.forEach((cleanup) => cleanup());
    ctx.revert();
  };
}

export function initScrollController({ minActiveWidth = DEFAULT_MIN_ACTIVE_WIDTH }: { minActiveWidth?: number } = {}) {
  const activeViewport = window.matchMedia(`(min-width: ${minActiveWidth}px)`);
  let cleanup: (() => void) | undefined;

  const stop = () => {
    cleanup?.();
    cleanup = undefined;
  };

  const syncActivation = () => {
    if (!activeViewport.matches) {
      stop();
      return;
    }

    if (!cleanup) {
      cleanup = activateScrollController();
    }
  };

  syncActivation();
  activeViewport.addEventListener("change", syncActivation);

  return () => {
    activeViewport.removeEventListener("change", syncActivation);
    stop();
  };
}
