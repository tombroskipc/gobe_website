"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("hero-model-open", isModelOpen);

    if (!isModelOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModelOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("hero-model-open");
    };
  }, [isModelOpen]);

  return (
    <section
      id="home"
      data-reveal
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

      <div className="relative z-[3] mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-10 pb-[clamp(4rem,12vh,8rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.82fr)]">
        <div className="relative z-[3] flex max-w-3xl flex-col text-left">
          <h1 data-scroll-reveal className="max-w-5xl text-[clamp(2.5rem,6vw,6.8rem)] font-black leading-[0.9] tracking-normal text-white">
            GOBEYOND LLC
            <span className="block text-[clamp(1.15rem,2.4vw,2.5rem)] font-medium italic leading-tight text-white/86">
              Go Global or Go Home
            </span>
          </h1>
          <p data-scroll-reveal className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
            Building global e-commerce teams, creative operations, and scalable systems from Vietnam to worldwide markets.
          </p>
          <a
            href="#contact"
            data-scroll-reveal
            className="magnetic mt-8 inline-flex min-h-12 items-center rounded-full border border-white px-7 text-sm font-semibold text-white transition duration-300 hover:border-[#F26522] hover:bg-[#F26522] hover:shadow-[0_0_42px_rgba(242,101,34,0.38)] w-fit"
          >
            Talk to Us
          </a>
        </div>
        <div
          data-hero-model
          className={[
            "transition-[background-color,opacity,transform,width,height,inset] duration-700 ease-[cubic-bezier(.2,.72,.18,1)]",
            isModelOpen
              ? "fixed inset-0 z-[80] flex h-screen w-screen cursor-grab items-center justify-center bg-[#000314]/96 p-3 active:cursor-grabbing sm:p-5"
              : "pointer-events-auto relative z-[2] hidden aspect-[16/9] w-full max-w-[660px] cursor-zoom-in items-center justify-center justify-self-end overflow-hidden rounded-lg border border-white/12 bg-[#111827]/58 shadow-[0_28px_90px_rgba(0,0,0,0.38)] lg:flex",
          ].join(" ")}
          role="button"
          tabIndex={0}
          aria-label={isModelOpen ? "3D showroom fullscreen" : "Open 3D showroom"}
          aria-expanded={isModelOpen}
          onClick={() => {
            if (!isModelOpen) {
              setIsModelOpen(true);
            }
          }}
          onKeyDown={(event) => {
            if (!isModelOpen && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              setIsModelOpen(true);
            }
          }}
        >
          <div
            className={[
              "pointer-events-none absolute top-1/2 h-[42%] -translate-y-1/2 rounded-full bg-[#F26522]/12 blur-3xl transition-all duration-700",
              isModelOpen ? "inset-x-[8%] opacity-60" : "inset-x-[-8%] opacity-100",
            ].join(" ")}
            aria-hidden="true"
          />
          <GobeModel
            className={[
              "relative z-[2] transition-[height,width,transform] duration-700 ease-[cubic-bezier(.2,.72,.18,1)]",
              isModelOpen ? "h-full w-full" : "h-full w-full",
            ].join(" ")}
            scale={1}
            autoRotate={false}
          />
          {isModelOpen ? (
            <button
              type="button"
              aria-label="Close 3D showroom"
              className="magnetic absolute left-5 top-1/2 z-[4] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-xl font-semibold leading-none text-white shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#F26522]/70 hover:bg-[#F26522]"
              onClick={(event) => {
                event.stopPropagation();
                setIsModelOpen(false);
              }}
            >
              X
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
