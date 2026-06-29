import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("marks long page headings with mobile-safe typography hooks", () => {
  const aboutSource = readFileSync("components/AboutPage.tsx", "utf8");

  assert.ok((aboutSource.match(/mobile-page-title/g) ?? []).length >= 4);
  assert.ok((aboutSource.match(/mobile-card-title/g) ?? []).length >= 2);
});

test("marks the home hero with mobile layout hooks for short devices", () => {
  const heroSource = readFileSync("components/LandingHeroSection.tsx", "utf8");

  assert.match(heroSource, /home-hero-layout/);
  assert.match(heroSource, /home-hero-copy/);
  assert.match(heroSource, /home-hero-title/);
  assert.match(heroSource, /home-hero-model/);
});

test("defines mobile guards for heading scale and Samsung Galaxy S8 class viewports", () => {
  const css = readFileSync("app/(frontend)/globals.css", "utf8");

  assert.match(css, /\.mobile-page-title/);
  assert.match(css, /\.mobile-card-title/);
  assert.match(css, /max-width:\s*390px\)\s*and\s*\(max-height:\s*760px/);
  assert.match(css, /\.home-hero-layout/);
});

test("enlarges the inline home hero globe on mobile viewports", () => {
  const heroSource = readFileSync("components/LandingHeroSection.tsx", "utf8");
  const css = readFileSync("app/(frontend)/globals.css", "utf8");

  assert.match(heroSource, /getInlineHeroModelSizing/);
  assert.match(heroSource, /scale:\s*1\.38/);
  assert.match(css, /height:\s*min\(55svh,\s*470px\)/);
  assert.match(css, /padding:\s*3px/);
  assert.match(css, /width:\s*min\(calc\(100vw - 20px\),\s*460px\)/);
  assert.match(css, /height:\s*min\(58svh,\s*410px\)/);
  assert.match(css, /width:\s*min\(calc\(100vw - 20px\),\s*420px\)/);
});

test("disables the hero globe detail opener on mobile", () => {
  const heroSource = readFileSync("components/LandingHeroSection.tsx", "utf8");

  assert.match(heroSource, /getInlineHeroModelExpandable/);
  assert.match(heroSource, /window\.innerWidth >= 768/);
  assert.match(heroSource, /hidden cursor-zoom-in[\s\S]*md:block/);
  assert.match(heroSource, /tabIndex=\{isInlineModelExpandable \? 0 : -1\}/);
});

test("keeps all core value cards reachable on Samsung Galaxy S8 class viewports", () => {
  const css = readFileSync("app/(frontend)/globals.css", "utf8");
  const shortPhoneBlock = css.match(/@media \(max-width:\s*390px\) and \(max-height:\s*760px\) \{(?<body>[\s\S]*?)\n\}/);

  assert.match(shortPhoneBlock?.groups?.body ?? "", /\.values-showcase \.core-values/);
  assert.match(shortPhoneBlock?.groups?.body ?? "", /\.values-showcase \.values-panel-track/);
  assert.match(shortPhoneBlock?.groups?.body ?? "", /overflow:\s*visible/);
});

test("wraps long core value focus titles inside mobile modals", () => {
  const css = readFileSync("app/(frontend)/globals.css", "utf8");
  const mobileFocusStart = css.indexOf("@media (max-width: 767px) {\n  .value-focus-overlay");
  const mobileFocusEnd = css.indexOf("\n}\n\n@media (max-width: 1279px)", mobileFocusStart);
  const mobileFocusBlock = mobileFocusStart >= 0 && mobileFocusEnd >= 0 ? css.slice(mobileFocusStart, mobileFocusEnd) : "";
  const shortPhoneBlock = css.match(/@media \(max-width:\s*390px\) and \(max-height:\s*760px\) \{(?<body>[\s\S]*?)\n\}/);

  assert.match(mobileFocusBlock, /\.value-focus-title/);
  assert.match(mobileFocusBlock, /overflow-wrap:\s*anywhere/);
  assert.match(mobileFocusBlock, /max-width:\s*100%/);
  assert.match(shortPhoneBlock?.groups?.body ?? "", /\.value-focus-title/);
});
