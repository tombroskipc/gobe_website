import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("allows the company scale heading to wrap without clipping the brand name", () => {
  const source = readFileSync("components/LegacySections.tsx", "utf8");
  const headingMatch = source.match(/<h2[^>]*data-pretext-max-lines="(?<maxLines>\d+)"[^>]*>\s*How GoBeyond Scales\s*<\/h2>/);

  assert.equal(headingMatch?.groups?.maxLines, "3");
});
