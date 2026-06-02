# Home GSAP Section Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GSAP Observer-driven full-screen section slider for the home page.

**Architecture:** A pure navigation helper owns section index and footer release decisions. A client-side React controller initializes GSAP Observer and animates the existing home sections. CSS activates fixed full-screen panels only while the controller is enabled, leaving native scroll as the reduced-motion fallback.

**Tech Stack:** Next.js 15, React 19, GSAP Observer, TypeScript, Tailwind/global CSS, Node built-in test runner.

---

## File Structure

- Create `components/homeSectionStory.ts`: pure helper for wrap, section transitions, footer release, and re-entry decisions.
- Create `components/homeSectionStory.test.mjs`: Node test for the helper's observable behavior.
- Create `components/HomeSectionStoryController.tsx`: client component that registers GSAP Observer and animates story sections.
- Modify `components/Experience.tsx`: mount the controller on the home page and add a story root marker.
- Modify `components/LandingHeroSection.tsx`: add stable story panel/content wrappers and metadata.
- Modify `components/LegacySections.tsx`: add story metadata/wrappers for home sections, leave footer outside the story.
- Modify `app/(frontend)/globals.css`: add story-mode fixed panel styles and reduced-motion fallback guard.

### Task 1: Test Story Navigation Rules

**Files:**
- Create: `components/homeSectionStory.ts`
- Create: `components/homeSectionStory.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import assert from "node:assert/strict";
import test from "node:test";
import { getStoryTransition } from "./homeSectionStory.js";

test("moves to the next section on downward scroll", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 0, direction: 1, sectionCount: 5, released: false }), {
    type: "section",
    index: 1,
    direction: 1,
  });
});

test("moves to the previous section on upward scroll", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 2, direction: -1, sectionCount: 5, released: false }), {
    type: "section",
    index: 1,
    direction: -1,
  });
});

test("releases to native scroll after final section", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 4, direction: 1, sectionCount: 5, released: false }), {
    type: "release",
    index: 4,
    direction: 1,
  });
});

test("re-enters the story from the footer on upward scroll", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 4, direction: -1, sectionCount: 5, released: true }), {
    type: "section",
    index: 4,
    direction: -1,
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test components/homeSectionStory.test.mjs`

Expected: FAIL because `components/homeSectionStory.js` does not exist.

- [ ] **Step 3: Write minimal helper**

```typescript
export type StoryTransition =
  | { type: "section"; index: number; direction: 1 | -1 }
  | { type: "release"; index: number; direction: 1 };

export function getStoryTransition({
  currentIndex,
  direction,
  sectionCount,
  released,
}: {
  currentIndex: number;
  direction: 1 | -1;
  sectionCount: number;
  released: boolean;
}): StoryTransition {
  if (released && direction === -1) {
    return { type: "section", index: sectionCount - 1, direction };
  }

  if (direction === 1 && currentIndex >= sectionCount - 1) {
    return { type: "release", index: currentIndex, direction };
  }

  const index = Math.max(0, Math.min(sectionCount - 1, currentIndex + direction));
  return { type: "section", index, direction };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test components/homeSectionStory.test.mjs`

Expected: PASS.

### Task 2: Add Story Controller

**Files:**
- Create: `components/HomeSectionStoryController.tsx`
- Modify: `components/Experience.tsx`

- [ ] **Step 1: Implement controller**

Create a client component that imports `gsap`, `Observer`, and `getStoryTransition`; collects `[data-home-story-section]`; sets active panel state; handles wheel/touch/pointer gestures; releases to footer at the end; cleans up GSAP context and observer on unmount.

- [ ] **Step 2: Mount controller**

Render `<HomeSectionStoryController />` inside `components/Experience.tsx` near the navbar so it initializes once for the home page.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

### Task 3: Mark Up Existing Sections

**Files:**
- Modify: `components/LandingHeroSection.tsx`
- Modify: `components/LegacySections.tsx`

- [ ] **Step 1: Add section metadata**

Add `data-home-story-section` to the five story sections and `data-home-story-footer` to the footer.

- [ ] **Step 2: Add content wrappers**

Wrap each story section's current visible content in a `data-home-story-content` container. Existing section backgrounds stay inside the section and remain animatable.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

### Task 4: Add Story CSS

**Files:**
- Modify: `app/(frontend)/globals.css`

- [ ] **Step 1: Add active story styles**

Add styles under `html.home-story-active` that make `[data-home-story-section]` fixed, full-screen, hidden by default, and controlled by GSAP. Keep existing native layout outside that class.

- [ ] **Step 2: Add release and reduced-motion rules**

Add `html.home-story-released` styles that allow footer access, and a `prefers-reduced-motion: reduce` rule that disables the story fixed-panel behavior.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

### Task 5: Browser Verification

**Files:**
- No source edits expected.

- [ ] **Step 1: Start dev server**

Run: `npm run dev -- --port 3003`

Expected: Next starts and serves the site.

- [ ] **Step 2: Verify desktop**

Open `http://localhost:3003`, scroll down through all story sections, confirm one-section-at-a-time transitions, then confirm the footer is reachable after contact.

- [ ] **Step 3: Verify mobile**

Use a mobile viewport, repeat the section scrolling, and confirm text does not overlap after the fixed-panel conversion.

