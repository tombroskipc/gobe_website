"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type HeroStyle = CSSProperties & {
  "--mx": string;
  "--my": string;
};

const LazyGobeModel = dynamic(() => import("./GobeModel").then((mod) => mod.GobeModel), {
  ssr: false,
  loading: () => null,
});
const INLINE_MODEL_LAZY_DELAY_MS = 9000;

export function LandingHeroSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [shouldLoadInlineModel, setShouldLoadInlineModel] = useState(false);
  const modelStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoadInlineModel) {
      return;
    }

    let delayTimer: number | undefined;
    let idleHandle: number | undefined;
    const startLazyTimer = () => {
      delayTimer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleHandle = window.requestIdleCallback(
            () => {
              setShouldLoadInlineModel(true);
            },
            { timeout: 3000 },
          );
          return;
        }

        setShouldLoadInlineModel(true);
      }, INLINE_MODEL_LAZY_DELAY_MS);
    };

    if (document.readyState === "complete") {
      startLazyTimer();
    } else {
      window.addEventListener("load", startLazyTimer, { once: true });
    }

    return () => {
      window.removeEventListener("load", startLazyTimer);
      if (delayTimer) {
        window.clearTimeout(delayTimer);
      }
      if (idleHandle && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, [shouldLoadInlineModel]);

  useEffect(() => {
    if (!isModelOpen) {
      return;
    }

    document.documentElement.classList.add("hero-model-open");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    const resizeTimer = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 260);

    return () => {
      window.clearTimeout(resizeTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("hero-model-open");
    };
  }, [isModelOpen]);

  const openModel = () => {
    setShouldLoadInlineModel(true);
    setIsModelOpen(true);
  };

  const closeModel = () => {
    document.documentElement.classList.remove("hero-model-open");
    setIsModelOpen(false);
  };

  return (
    <>
      <section
      id="home"
      data-reveal
      data-home-story-section
      data-scroll-section
      className={`relative min-h-svh overflow-hidden bg-[#000314] px-4 pt-20 text-white sm:px-6 sm:pt-[5.5rem] lg:min-h-screen lg:px-8 lg:pt-24 ${isModelOpen ? "z-[120]" : "z-10"}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x, y });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ "--mx": `${tilt.x}`, "--my": `${tilt.y}` } as HeroStyle}
    >
      <div data-home-story-content className="relative min-h-svh overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(49,183,255,0.13),transparent_28%),radial-gradient(circle_at_60%_78%,rgba(242,101,34,0.16),transparent_34%),linear-gradient(180deg,#000314_0%,#060B26_52%,#000314_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F26522]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-[3] mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl grid-cols-1 content-center items-center gap-4 pb-8 sm:min-h-[calc(100svh-5.5rem)] sm:gap-6 sm:pb-10 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[minmax(0,0.82fr)_minmax(480px,1.08fr)] lg:gap-8 lg:pb-[clamp(4rem,12vh,8rem)] xl:grid-cols-[minmax(0,0.82fr)_minmax(540px,1.08fr)]">
          <div className="relative z-[3] flex w-full min-w-0 max-w-[40rem] flex-col text-left">
            <h1 data-scroll-reveal className="max-w-full text-4xl font-black leading-[0.9] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              GOBEYOND LLC
              <span className="mt-2 block text-lg font-medium italic leading-tight text-white/86 sm:text-xl md:text-2xl lg:text-3xl">
                Go Big Or Go Home
              </span>
            </h1>
            <p data-scroll-reveal data-pretext-fit data-pretext-max-lines="3" data-pretext-min-scale="0.86" className="mt-5 max-w-full text-sm font-medium leading-7 text-white/70 sm:text-base md:max-w-2xl md:text-lg md:leading-8">
              From Vietnam to the world. GoBeyond is building a global e-commerce powerhouse — 5 million orders by 2030.            </p>
          </div>
          <div
            ref={modelStageRef}
            data-hero-model
            className="pointer-events-none relative z-[2] flex h-[min(46svh,360px)] w-[min(108vw,560px)] max-w-none items-center justify-center justify-self-center overflow-visible sm:h-[min(52svh,470px)] sm:w-[min(104vw,720px)] md:h-[min(56svh,600px)] md:w-[min(96vw,820px)] lg:h-[clamp(540px,58vw,860px)] lg:w-[min(54vw,820px)] lg:-translate-x-[clamp(0rem,1vw,1rem)] lg:justify-self-end xl:h-[clamp(600px,58vw,900px)] xl:w-[min(54vw,860px)]"
            aria-label="3D globe"
          >
            <div className="relative z-[2] h-full w-full">
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F26522]/16 blur-3xl"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                aria-hidden="true"
              />
              {!isModelOpen ? (
                shouldLoadInlineModel ? (
                  <LazyGobeModel
                    className="relative z-[2] h-full w-full"
                    scale={1.3}
                    modelOffsetX={0}
                    autoRotate
                  />
                ) : null
              ) : null}
              <button
                type="button"
                className="pointer-events-auto absolute inset-0 z-[3] cursor-zoom-in appearance-none border-0 bg-transparent p-0 outline-none"
                aria-label="Phóng to quả địa cầu"
                onClick={openModel}
              />
            </div>
          </div>
        </div>
      </div>
      </section>
      {isModelOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[190] cursor-zoom-out bg-[#02040c]/78 opacity-100 backdrop-blur-2xl transition-opacity duration-300"
            aria-label="Đóng mô hình quả địa cầu"
            onClick={closeModel}
          />
          <div
            className="pointer-events-none fixed inset-0 z-[200] flex h-[100dvh] w-screen origin-center items-center justify-center overflow-visible opacity-100 transition-[opacity,transform] duration-500 ease-out"
            aria-hidden="true"
          >
            <div className="relative h-full w-full">
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F26522]/16 blur-3xl"
                aria-hidden="true"
              />
              <LazyGobeModel
                className="relative z-[2] h-full w-full"
                scale={1.3}
                modelOffsetX={0}
                autoRotate
              />
            </div>
          </div>
          <button
            type="button"
            className="pointer-events-auto fixed right-5 top-5 z-[210] grid h-12 w-12 place-items-center rounded-full border border-white/18 bg-white/10 text-2xl font-light leading-none text-white shadow-[0_18px_54px_rgba(0,0,0,0.38)] backdrop-blur-xl transition hover:border-[#F26522]/70 hover:bg-[#F26522]/20 sm:right-8 sm:top-8"
            aria-label="Đóng mô hình quả địa cầu"
            onClick={closeModel}
          >
            ×
          </button>
        </>
      ) : null}
    </>
  );
}
