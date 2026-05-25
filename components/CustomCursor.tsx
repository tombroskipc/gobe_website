"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;

    function onMove(event: PointerEvent) {
      tx = event.clientX;
      ty = event.clientY;
      document.documentElement.style.setProperty("--cursor-x", `${tx}px`);
      document.documentElement.style.setProperty("--cursor-y", `${ty}px`);
    }

    function onCursor(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      setState(detail || "idle");
    }

    function tick() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${x + 24}px, ${y + 20}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("gobe-cursor", onCursor);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("gobe-cursor", onCursor);
      cancelAnimationFrame(frame);
    };
  }, []);

  const active = state !== "idle";

  return (
    <>
      <div
        ref={cursor}
        className={`pointer-events-none fixed left-0 top-0 z-50 hidden h-8 w-8 rounded-full border mix-blend-screen transition-[height,width,border-color,background,box-shadow] duration-200 md:block ${
          active
            ? "h-16 w-16 border-gobeOrange/90 bg-gobeOrange/15 shadow-orangeGlow"
            : "border-gobeOrange/80 bg-gobeOrange/10 shadow-orangeGlow"
        }`}
      />
      <div
        ref={label}
        className={`pointer-events-none fixed left-0 top-0 z-50 hidden rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition-opacity duration-200 md:block ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        {state}
      </div>
    </>
  );
}
