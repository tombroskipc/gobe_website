"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const loadingWords = [
  "GOBEYOND",
  "GOAL-ORIENTED",
  "OPEN-MINDEDNESS",
  "BALANCED",
  "EMPOWERMENT",
  "ENTREPRENEURSHIP",
  "RESULTS-DRIVEN",
];

type PageLoadingOverlayProps = {
  ready: boolean;
};

export function PageLoadingOverlay({ ready }: PageLoadingOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const exitStartedRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("page-loading-active");

    return () => {
      document.documentElement.classList.remove("page-loading-active");
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;

    if (!root || !word) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(root, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
    const chars = word.querySelectorAll<HTMLElement>(".loading-page__char");

    if (reduceMotion) {
      gsap.set(chars, { autoAlpha: 1, yPercent: 0 });
      return;
    }

    gsap.fromTo(
      chars,
      { autoAlpha: 0, yPercent: 118, rotateX: -72 },
      {
        autoAlpha: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 0.68,
        ease: "power4.out",
        stagger: { each: 0.018, from: "center" },
      },
    );

    return () => {
      gsap.killTweensOf(chars);
    };
  }, [activeWordIndex]);

  useEffect(() => {
    if (ready || exitStartedRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => {
        const chars = wordRef.current?.querySelectorAll<HTMLElement>(".loading-page__char") || [];
        const nextIndex = (activeWordIndex + 1) % loadingWords.length;

        if (reduceMotion || chars.length === 0) {
          setActiveWordIndex(nextIndex);
          return;
        }

        gsap.to(chars, {
          autoAlpha: 0,
          duration: 0.24,
          ease: "power2.in",
          stagger: { each: 0.012, from: "edges" },
          yPercent: -92,
          onComplete: () => setActiveWordIndex(nextIndex),
        });
      },
      reduceMotion ? 820 : 1120,
    );

    return () => {
      window.clearTimeout(timer);
      gsap.killTweensOf(wordRef.current?.querySelectorAll(".loading-page__char") || []);
    };
  }, [activeWordIndex, ready]);

  useEffect(() => {
    const root = rootRef.current;

    if (!ready || !root || exitStartedRef.current) {
      return;
    }

    exitStartedRef.current = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.documentElement.classList.remove("page-loading-active");
          setVisible(false);
        },
      })
      .to(root.querySelectorAll(".loading-page__char, [data-loading-word]"), {
        autoAlpha: 0,
        duration: reduceMotion ? 0 : 0.34,
        stagger: reduceMotion ? 0 : { each: 0.012, from: "center" },
        y: reduceMotion ? 0 : -22,
      })
      .to(
        root,
        {
          autoAlpha: 0,
          clipPath: reduceMotion ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          duration: reduceMotion ? 0 : 0.78,
        },
        reduceMotion ? 0 : "-=0.08",
      );
  }, [ready]);

  if (!visible) {
    return null;
  }

  return (
    <div ref={rootRef} className="loading-page" aria-live="polite" aria-busy={!ready}>
      <div className="loading-page__backdrop" aria-hidden="true" />
      <div className="loading-page__inner">
        <div className="loading-page__eyebrow">Loading GoBeyond World</div>
        <div ref={wordRef} className="loading-page__word" data-loading-word aria-label="GoBeyond loading value">
          {Array.from(loadingWords[activeWordIndex]).map((char, index) => (
            <span className="loading-page__char" key={`${loadingWords[activeWordIndex]}-${index}`}>
              {char}
            </span>
          ))}
        </div>
        <div className="loading-page__ticker" aria-hidden="true">
          Loading 3D model
        </div>
      </div>
    </div>
  );
}
