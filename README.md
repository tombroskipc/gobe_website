# GoBeyond Immersive 3D Website Concept

Premium scroll-driven WebGL concept for `gobe.asia`, built around a cinematic interactive globe.

## Stack

- Next.js App Router + TypeScript
- React Three Fiber, Drei and Three.js
- Tailwind CSS
- GSAP ScrollTrigger
- Lenis smooth scroll

## Directory Structure

```txt
app/
  globals.css          Global Tailwind styles, glass panels, cursor glow
  layout.tsx           App shell and metadata
  page.tsx             Renders the immersive experience
components/
  CustomCursor.tsx     Magnetic glowing cursor
  Experience.tsx       Scroll sections, Lenis and GSAP ScrollTrigger
  GlobeScene.tsx       Single frosted-white globe, solid orange land meshes, arcs, dissolve particles
  ScrollController.ts  GSAP ScrollTrigger camera path and Lenis smooth scroll
  scrollRig.ts         Mutable camera/globe rig driven by GSAP
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scroll Story

1. Hero: globe centered, slow rotation, cinematic title reveal.
2. Core Values: camera zooms toward Southeast Asia; Speed, Quality and Innovation icons emerge.
3. Global Network: one globe rotates through Asia, Americas and EMEA perspectives.
4. Contact: globe dissolves into orange particles, leaving space for a glass contact form.
