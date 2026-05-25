"use client";

import { useEffect } from "react";
import { CustomCursor } from "./CustomCursor";
import { GlobeScene } from "./GlobeScene";
import { LandingHeroSection } from "./LandingHeroSection";
import {
  ContactCtaSection,
  CoreValuesSection,
  FooterSection,
  OperationsSection,
  ScaleSection,
} from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

export function Experience() {
  useEffect(() => initScrollController(), []);

  return (
    <main id="scroll-story" className="relative min-h-screen overflow-x-hidden bg-[#0c1018]/45 text-white">
      <GlobeScene />
      <CustomCursor />
      <Navbar />
      <LandingHeroSection />
      <CoreValuesSection />
      <OperationsSection />
      <ScaleSection />
      <ContactCtaSection />
      <FooterSection />
    </main>
  );
}
