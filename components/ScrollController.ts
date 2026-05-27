"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollRig } from "./scrollRig";

gsap.registerPlugin(ScrollTrigger);

export function initScrollController() {
  const magneticCleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    gsap.set(".reveal-line > span", { yPercent: 110 });

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      gsap.to(element.querySelectorAll(".reveal-line > span"), {
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

    gsap.utils.toArray<HTMLElement>("[data-scroll-section]").forEach((section) => {
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
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const cards = section.querySelectorAll<HTMLElement>("[data-scroll-card]");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, clipPath: "inset(18% 0% 0% 0%)", filter: "blur(10px)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.055,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
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

    if (document.querySelector("#scroll-story")) {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "#scroll-story",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.12,
          },
        })
        // Section 1: cinematic hero, large tilted globe.
        .to(scrollRig.camera, { x: 0, y: 0.2, z: 6.3, duration: 0.28 }, 0)
        .to(scrollRig.globe, { x: 0, y: 0, z: 0, scale: 1, tilt: -0.28, yaw: -0.86, autoRotate: 1, duration: 0.28 }, 0)
        .to(scrollRig, { arcReveal: 0.18, landGlow: 0.76, networkGlow: 0.24, duration: 0.28 }, 0)
        // Section 2: zoom into Southeast Asia and reveal core-value icons.
        .to(scrollRig.camera, { x: -0.82, y: 0.62, z: 3.12, duration: 1 }, 0.58)
        .to(scrollRig.target, { x: -0.34, y: -0.04, z: 0.08, duration: 1 }, 0.58)
        .to(scrollRig.globe, { x: 0.18, y: -0.06, z: 0, scale: 1.24, tilt: -0.2, yaw: -1.18, autoRotate: 0.25, duration: 1 }, 0.58)
        .to(scrollRig, { vietnamGlow: 1.9, iconReveal: 1, arcReveal: 0.48, landGlow: 1.35, duration: 1 }, 0.66)
        // Section 3: one unified globe rotates through Asia, Americas and EMEA perspectives.
        .to(scrollRig.camera, { x: 0, y: 0.34, z: 7.18, duration: 1.05 }, 1.65)
        .to(scrollRig.target, { x: 0, y: 0, z: 0, duration: 1.05 }, 1.65)
        .to(scrollRig.globe, { x: 0, y: -0.05, z: 0, scale: 0.94, tilt: -0.18, yaw: -1.2, autoRotate: 0, duration: 0.7 }, 1.65)
        .to(scrollRig, { networkGlow: 1.5, arcReveal: 1, iconReveal: 0.25, vietnamGlow: 0.72, duration: 0.7 }, 1.78)
        .to(scrollRig.globe, { yaw: 2.05, duration: 0.62 }, 2.18)
        .to(scrollRig.globe, { yaw: 0.45, duration: 0.62 }, 2.74)
        // Section 4: dissolve to particles and shift composition for contact.
        .to(scrollRig.camera, { x: -1.2, y: 0.18, z: 5.8, duration: 1 }, 3.32)
        .to(scrollRig.target, { x: 0.5, y: 0, z: 0, duration: 1 }, 3.32)
        .to(scrollRig.globe, { x: 1.58, y: -0.02, z: 0, scale: 0.84, tilt: -0.16, yaw: 0.1, duration: 1 }, 3.32)
        .to(scrollRig, { dissolve: 1, particleReveal: 1, contactShift: 1, networkGlow: 0.5, arcReveal: 0.22, duration: 1 }, 3.42);
    }

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
