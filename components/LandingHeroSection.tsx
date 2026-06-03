"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { EarthAssetModel } from "./EarthAssetModel";
import { GobeModel } from "./GobeModel";
import { SHOW_GLOBES } from "./globeVisibility";

type HeroStyle = CSSProperties & {
  "--mx": string;
  "--my": string;
};

const ORANGE = "#F26522";

const globeConfigs = [
  { position: [-4.6, 1.55, 0] as [number, number, number], scale: 0.88, speed: 0.42, float: 0.35, offset: -1.2 },
  { position: [4.65, 1.42, 0] as [number, number, number], scale: 0.76, speed: 0.58, float: 0.28, offset: 1.15 },
  { position: [-4.35, -2.05, 0] as [number, number, number], scale: 0.74, speed: 0.38, float: 0.31, offset: 0.3 },
  { position: [4.35, -2.12, 0] as [number, number, number], scale: 0.92, speed: 0.5, float: 0.26, offset: 2.35 },
];

function FloatingEarth({
  position,
  scale,
  speed,
  float,
  offset,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  float: number;
  offset: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;

    const time = clock.elapsedTime + offset;
    group.current.position.set(
      position[0] + pointer.x * 0.16,
      position[1] + Math.sin(time * 0.85) * float + pointer.y * 0.1,
      position[2],
    );
    group.current.rotation.x = -0.18 + Math.sin(time * 0.42) * 0.05;
    group.current.rotation.y = offset + clock.elapsedTime * speed;
    group.current.rotation.z = Math.sin(time * 0.35) * 0.04;
  });

  return (
    <group ref={group}>
      <EarthAssetModel scale={scale} />
    </group>
  );
}

function HeroEarthCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 92, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.25} />
        <hemisphereLight args={["#ffffff", "#40506d", 1.15]} />
        <directionalLight position={[4, 6, 7]} intensity={2.6} />
        <directionalLight position={[-5, -2, 4]} intensity={1.25} color={ORANGE} />
        <pointLight position={[0, 0, 5]} intensity={1.4} color="#ffffff" />

        {globeConfigs.map((globe) => (
          <FloatingEarth key={`${globe.position[0]}-${globe.position[1]}`} {...globe} />
        ))}
      </Canvas>
    </div>
  );
}

export function LandingHeroSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section
      id="home"
      data-reveal
      data-home-story-section
      data-scroll-section
      className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-6 lg:px-8 opacity-80"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x, y });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ "--mx": `${tilt.x}`, "--my": `${tilt.y}` } as HeroStyle}
    >
      <div data-home-story-content className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(49,183,255,0.13),transparent_28%),radial-gradient(circle_at_60%_78%,rgba(242,101,34,0.16),transparent_34%),linear-gradient(180deg,#000314_0%,#060B26_52%,#000314_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F26522]/10 blur-3xl"
          aria-hidden="true"
        />

        {SHOW_GLOBES ? (
          <div
            className="absolute inset-0 z-[1] transition-transform duration-200 ease-out"
            style={{
              transform: `translate3d(${tilt.x * -28}px, ${tilt.y * -20}px, 0) rotateX(${tilt.y * -2.5}deg) rotateY(${tilt.x * 3.5}deg)`,
            }}
            aria-hidden="true"
          >
            <HeroEarthCanvas />
          </div>
        ) : null}

        <div className="relative z-[3] mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-8 pb-[clamp(4rem,12vh,8rem)] lg:grid-cols-[minmax(0,0.82fr)_minmax(520px,1.08fr)]">
          <div className="relative z-[3] flex w-full min-w-0 max-w-3xl flex-col text-left">
            <h1 data-scroll-reveal className="max-w-full text-[clamp(2rem,9vw,6.8rem)] font-black leading-[0.9] tracking-normal text-white">
              GOBEYOND LLC
              <span className="block text-[clamp(1rem,5vw,2.5rem)] font-medium italic leading-tight text-white/86">
                Đi toàn cầu, không dừng lại
              </span>
            </h1>
            <p data-scroll-reveal className="mt-6 max-w-full text-base font-medium leading-8 text-white/70 md:max-w-2xl md:text-lg">
              Xây dựng đội ngũ thương mại điện tử toàn cầu, vận hành sáng tạo và hệ thống có khả năng mở rộng từ Việt Nam ra thị trường quốc tế.
            </p>
            <a
              href="#contact"
              data-scroll-reveal
              className="magnetic mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-white px-7 text-sm font-semibold text-white transition duration-300 hover:border-[#F26522] hover:bg-[#F26522] hover:shadow-[0_0_42px_rgba(242,101,34,0.38)]"
            >
              Liên hệ
            </a>
          </div>
          <div
            data-hero-model
            className="pointer-events-none relative z-[2] flex h-[clamp(360px,58vw,760px)] w-full max-w-full items-center justify-center justify-self-center overflow-visible sm:w-[min(112vw,760px)] sm:max-w-none lg:h-[clamp(500px,52vw,840px)] lg:w-[min(60vw,960px)] lg:translate-x-[clamp(0rem,2vw,2rem)] lg:justify-self-end"
            aria-label="3D globe"
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F26522]/16 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.025]"
              aria-hidden="true"
            />
            <GobeModel
              className="relative z-[2] h-full w-full"
              scale={1}
              autoRotate
            />
          </div>
        </div>
      </div>
    </section>
  );
}
