"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { getStoryTransition, type StoryDirection } from "./homeSectionStory";

gsap.registerPlugin(Observer);

const SECTION_SELECTOR = "[data-home-story-section]";
const CONTENT_SELECTOR = "[data-home-story-content]";
const DEFAULT_MIN_ACTIVE_WIDTH = 768;
const HEADER_SCROLL_OFFSET = 78;
const FOOTER_REENTRY_TOLERANCE = 12;

function isStoryInteractionPaused() {
  return (
    document.documentElement.classList.contains("hero-model-open") ||
    document.documentElement.classList.contains("value-card-open") ||
    document.body.style.overflow === "hidden"
  );
}

function activateHomeSectionStory() {
  const root = document.querySelector<HTMLElement>("#scroll-story");
  const footer = document.querySelector<HTMLElement>(
    "[data-home-story-footer]",
  );
  const sections = gsap.utils.toArray<HTMLElement>(SECTION_SELECTOR);

  if (!root || !footer || sections.length === 0) {
    return;
  }

  const html = document.documentElement;
  const panels = sections.map((section) => ({
    content: section.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? section,
    section,
  }));

  let animating = false;
  let currentIndex = -1;
  let released = false;

  const ctx = gsap.context(() => {
    html.classList.add("home-story-active");

    gsap.set(
      panels.map(({ section }) => section),
      {
        autoAlpha: 0,
        yPercent: 0,
        zIndex: 0,
      },
    );
    gsap.set(
      panels.map(({ content }) => content),
      {
        autoAlpha: 1,
        yPercent: 0,
      },
    );

    const showSection = (index: number, direction: StoryDirection) => {
      if (animating || index === currentIndex) {
        return;
      }

      animating = true;
      const previousIndex = currentIndex;
      const directionFactor = direction === -1 ? -1 : 1;
      const panel = panels[index];
      const revealSelector =
        panel.section.classList.contains("values-showcase") ||
        panel.section.classList.contains("operation-showcase")
          ? "[data-scroll-reveal]"
          : "[data-scroll-reveal], [data-scroll-card]";
      const revealTargets =
        panel.content.querySelectorAll<HTMLElement>(revealSelector);

      html.classList.remove("home-story-released");
      released = false;
      gsap.set(panel.section, {
        autoAlpha: 1,
        yPercent: 100 * directionFactor,
        zIndex: 3,
      });
      gsap.set(panel.content, {
        autoAlpha: 1,
        yPercent: -100 * directionFactor,
      });

      const timeline = gsap.timeline({
        defaults: {
          duration: 1.1,
          ease: "power3.inOut",
        },
        onComplete: () => {
          currentIndex = index;
          animating = false;
        },
      });

      if (previousIndex >= 0) {
        const previousPanel = panels[previousIndex];

        gsap.set(previousPanel.section, { zIndex: 1 });
        timeline
          .to(
            previousPanel.content,
            {
              autoAlpha: 0.35,
              yPercent: -16 * directionFactor,
            },
            0,
          )
          .set(previousPanel.section, { autoAlpha: 0, yPercent: 0, zIndex: 0 });
      }

      timeline
        .to(panel.section, { yPercent: 0 }, 0)
        .to(panel.content, { yPercent: 0 }, 0)
        .fromTo(
          revealTargets,
          {
            autoAlpha: 0,
            y: 54 * directionFactor,
          },
          {
            autoAlpha: 1,
            duration: 0.78,
            ease: "power3.out",
            stagger: 0.06,
            y: 0,
          },
          0.2,
        );
    };

    let observer: ReturnType<typeof Observer.create> | undefined;

    const reenterStoryFromFooter = () => {
      if (!released || animating || isStoryInteractionPaused()) {
        return;
      }

      observer?.enable();
      window.scrollTo({ left: 0, top: 0 });
      currentIndex = -1;
      showSection(sections.length - 1, -1);
    };

    const setInitialSection = (index: number) => {
      const panel = panels[index];
      const revealSelector =
        panel.section.classList.contains("values-showcase") ||
        panel.section.classList.contains("operation-showcase")
          ? "[data-scroll-reveal]"
          : "[data-scroll-reveal], [data-scroll-card]";
      const revealTargets =
        panel.content.querySelectorAll<HTMLElement>(revealSelector);

      html.classList.remove("home-story-released");
      released = false;
      currentIndex = index;
      window.scrollTo({ left: 0, top: 0 });
      gsap.set(panel.section, {
        autoAlpha: 1,
        yPercent: 0,
        zIndex: 3,
      });
      gsap.set(panel.content, {
        autoAlpha: 1,
        yPercent: 0,
      });
      gsap.set(revealTargets, {
        autoAlpha: 1,
        y: 0,
      });
    };

    const getFooterScrollTop = () => {
      const maxScrollTop = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const footerTop = footer.getBoundingClientRect().top + window.scrollY;

      return Math.max(
        0,
        Math.min(maxScrollTop, footerTop - HEADER_SCROLL_OFFSET),
      );
    };

    const isNearFooterEntry = () =>
      window.scrollY <= getFooterScrollTop() + FOOTER_REENTRY_TOLERANCE;

    const scrollToFooter = () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          behavior: "smooth",
          left: 0,
          top: getFooterScrollTop(),
        });
      });
    };

    const releaseToFooter = () => {
      if (animating || released) {
        return;
      }

      animating = true;
      const panel = panels[currentIndex];

      gsap
        .timeline({
          defaults: {
            duration: 0.48,
            ease: "power2.inOut",
          },
          onComplete: () => {
            released = true;
            html.classList.add("home-story-released");
            gsap.set(panel.section, { autoAlpha: 1, yPercent: 0, zIndex: 2 });
            gsap.set(panel.content, { autoAlpha: 1, yPercent: 0 });
            observer?.disable();
            animating = false;
            scrollToFooter();
          },
        })
        .to(panel.content, { autoAlpha: 0.9, yPercent: -8 }, 0);
    };

    const handleGesture = (direction: StoryDirection) => {
      if (animating || isStoryInteractionPaused()) {
        return;
      }

      if (released && direction === 1) {
        return;
      }

      if (released && direction === -1 && !isNearFooterEntry()) {
        return;
      }

      const transition = getStoryTransition({
        currentIndex: Math.max(0, currentIndex),
        direction,
        released,
        sectionCount: sections.length,
      });

      if (transition.type === "release") {
        releaseToFooter();
        return;
      }

      if (released) {
        currentIndex = -1;
      }

      showSection(transition.index, transition.direction);
    };

    observer = Observer.create({
      onDown: () => handleGesture(-1),
      onUp: () => handleGesture(1),
      preventDefault: false,
      tolerance: 10,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
    });

    const onReleasedWheel = (event: WheelEvent) => {
      if (
        !released ||
        animating ||
        event.deltaY >= -8 ||
        !isNearFooterEntry()
      ) {
        return;
      }

      event.preventDefault();
      reenterStoryFromFooter();
    };

    const onAnchorClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (!target) {
        return;
      }

      const url = new URL(target.href);

      if (url.pathname !== window.location.pathname || !url.hash) {
        return;
      }

      const targetIndex = sections.findIndex(
        (section) => `#${section.id}` === url.hash,
      );

      if (targetIndex < 0) {
        return;
      }

      event.preventDefault();
      const direction: StoryDirection = targetIndex < currentIndex ? -1 : 1;

      if (released) {
        currentIndex = -1;
        observer?.enable();
      }

      showSection(targetIndex, direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (
        ["ArrowDown", "PageDown", " "].includes(event.key) &&
        !event.shiftKey
      ) {
        if (released) {
          return;
        }

        event.preventDefault();

        handleGesture(1);
      }

      if (
        ["ArrowUp", "PageUp"].includes(event.key) ||
        (event.key === " " && event.shiftKey)
      ) {
        if (released) {
          if (isNearFooterEntry()) {
            event.preventDefault();
            reenterStoryFromFooter();
          }

          return;
        }

        event.preventDefault();

        handleGesture(-1);
      }
    };

    document.addEventListener("click", onAnchorClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onReleasedWheel, { passive: false });

    const getHashIndex = () =>
      sections.findIndex(
        (section) => `#${section.id}` === window.location.hash,
      );
    const initialIndex = getHashIndex();
    setInitialSection(initialIndex >= 0 ? initialIndex : 0);

    let hashReconcileAttempts = 0;
    const hashReconcileTimer = window.setInterval(() => {
      hashReconcileAttempts += 1;
      const hashIndex = getHashIndex();

      if (
        hashIndex < 0 ||
        hashIndex === currentIndex ||
        hashReconcileAttempts > 16
      ) {
        window.clearInterval(hashReconcileTimer);
        return;
      }

      if (animating) {
        return;
      }

      window.clearInterval(hashReconcileTimer);
      showSection(hashIndex, hashIndex < currentIndex ? -1 : 1);
    }, 180);

    return () => {
      window.clearInterval(hashReconcileTimer);
      document.removeEventListener("click", onAnchorClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onReleasedWheel);
      observer?.kill();
    };
  }, root);

  return () => {
    ctx.revert();
    html.classList.remove("home-story-active", "home-story-released");
  };
}

export function HomeSectionStoryController({
  minActiveWidth = DEFAULT_MIN_ACTIVE_WIDTH,
}: {
  minActiveWidth?: number;
}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const activeViewport = window.matchMedia(
      `(min-width: ${minActiveWidth}px)`,
    );
    let cleanup: (() => void) | undefined;

    const stop = () => {
      cleanup?.();
      cleanup = undefined;
    };

    const syncActivation = () => {
      if (reduceMotion.matches || !activeViewport.matches) {
        stop();
        return;
      }

      if (!cleanup) {
        cleanup = activateHomeSectionStory();
      }
    };

    syncActivation();
    reduceMotion.addEventListener("change", syncActivation);
    activeViewport.addEventListener("change", syncActivation);

    return () => {
      reduceMotion.removeEventListener("change", syncActivation);
      activeViewport.removeEventListener("change", syncActivation);
      stop();
    };
  }, [minActiveWidth]);

  return null;
}
