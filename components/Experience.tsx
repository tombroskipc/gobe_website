"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CustomCursor } from "./CustomCursor";
import { LandingHeroSection } from "./LandingHeroSection";
import {
  ContactCtaSection,
  CoreValuesSection,
  FooterSection,
  OperationsSection,
  ScaleSection,
} from "./LegacySections";
import { Navbar } from "./Navbar";
import { usePretextHomeTextFit } from "./usePretextHomeTextFit";

const DeferredHomeSectionStoryController = dynamic(
  () => import("./HomeSectionStoryController").then((mod) => mod.HomeSectionStoryController),
  {
    ssr: false,
    loading: () => null,
  },
);

function useDeferredEnhancements() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      return;
    }

    let fallbackTimer: number | undefined;
    let loadTimer: number | undefined;
    let idleHandle: number | undefined;
    const enable = () => setEnabled(true);
    const enableAfterLoad = () => {
      loadTimer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleHandle = window.requestIdleCallback(enable, { timeout: 2500 });
          return;
        }

        enable();
      }, 7000);
    };
    const enableOnInteraction = () => {
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
      if (loadTimer) {
        window.clearTimeout(loadTimer);
      }
      if (idleHandle && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      enable();
    };
    const interactionOptions = { once: true, passive: true } as AddEventListenerOptions;

    window.addEventListener("pointerdown", enableOnInteraction, interactionOptions);
    window.addEventListener("touchstart", enableOnInteraction, interactionOptions);
    window.addEventListener("wheel", enableOnInteraction, interactionOptions);
    window.addEventListener("keydown", enableOnInteraction, { once: true });

    if (document.readyState === "complete") {
      enableAfterLoad();
    } else {
      window.addEventListener("load", enableAfterLoad, { once: true });
    }

    return () => {
      window.removeEventListener("pointerdown", enableOnInteraction);
      window.removeEventListener("touchstart", enableOnInteraction);
      window.removeEventListener("wheel", enableOnInteraction);
      window.removeEventListener("keydown", enableOnInteraction);
      window.removeEventListener("load", enableAfterLoad);
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
      if (loadTimer) {
        window.clearTimeout(loadTimer);
      }
      if (idleHandle && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, [enabled]);

  return enabled;
}

export function Experience() {
  const enhancementsEnabled = useDeferredEnhancements();

  useEffect(() => {
    if (!enhancementsEnabled) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("./ScrollController").then((mod) => {
      if (cancelled) {
        return;
      }
      cleanup = mod.initScrollController();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enhancementsEnabled]);

  usePretextHomeTextFit(enhancementsEnabled);

  return (
    <main id="scroll-story" className="relative min-h-screen overflow-x-hidden bg-[#0c1018]/45 text-white">
      <CustomCursor />
      <Navbar />
      {enhancementsEnabled ? <DeferredHomeSectionStoryController /> : null}
      <LandingHeroSection />
      <CoreValuesSection />
      <OperationsSection />
      <ScaleSection />
      <ContactCtaSection />
      <FooterSection />
    </main>
  );
}
