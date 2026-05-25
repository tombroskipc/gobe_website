"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { EarthAssetModel } from "./EarthAssetModel";

const ORANGE = "#F26522";

function MiniGlobeModel({
  offset = 0,
  position,
  scale = 0.72,
  speed = 0.45,
}: {
  offset?: number;
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = offset + clock.elapsedTime * speed;
    group.current.rotation.x = -0.18 + Math.sin(clock.elapsedTime * 0.45) * 0.04;
  });

  return (
    <group ref={group} position={position}>
      <EarthAssetModel scale={scale} />
    </group>
  );
}

function HeroGlobesCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="hero-float h-full w-full">
        <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 92, near: 0.1, far: 40 }} dpr={[1, 1.45]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
          <ambientLight intensity={1.25} />
          <hemisphereLight args={["#ffffff", "#7b949d", 1.1]} />
          <directionalLight position={[4, 5, 6]} intensity={2.4} />
          <pointLight position={[-4, -2, 5]} intensity={1.2} color={ORANGE} />
          <MiniGlobeModel offset={-1.4} position={[-5.05, 1.25, 0]} scale={0.78} speed={0.42} />
          <MiniGlobeModel offset={1.45} position={[5.1, 1.15, 0]} scale={0.7} speed={0.58} />
          <MiniGlobeModel offset={0.15} position={[-4.75, -2.25, 0]} scale={0.7} speed={0.38} />
          <MiniGlobeModel offset={2.65} position={[4.85, -2.35, 0]} scale={0.86} speed={0.52} />
        </Canvas>
      </div>
    </div>
  );
}

export function HeroShowcaseSection() {
  return (
    <section id="home" className="relative z-10 overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.66)_58%,rgba(255,255,255,0.86))] backdrop-blur-[1px]"
        aria-hidden="true"
      />
      <div
        className="grid-mask pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-14 h-72 w-72 -translate-x-1/2 rounded-full bg-gobeOrange/10 blur-3xl md:h-[30rem] md:w-[30rem]"
        aria-hidden="true"
      />

      <div className="relative mx-auto min-h-[68vh] max-w-7xl">
        <HeroGlobesCanvas />

        <div className="flex min-h-[68vh] items-center justify-center">
          <figure className="relative z-10 w-full max-w-5xl">
            <div
              className="absolute -inset-5 rounded-[2rem] bg-white/42 shadow-[0_34px_90px_rgba(24,36,82,0.12)] backdrop-blur-md md:-inset-8 md:rounded-[3rem]"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.65rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(24,36,82,0.16)] md:rounded-[2.3rem]">
              <img
                src="/hero-showcase.jpg?v=3"
                alt="GoBeyond team showcase"
                className="aspect-video h-full w-full object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(242,101,34,0.08))]"
                aria-hidden="true"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
