import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("allows the company scale heading to wrap without clipping the brand name", () => {
  const source = readFileSync("components/LegacySections.tsx", "utf8");
  const headingMatch = source.match(
    /<h2[^>]*className="bento-title"[^>]*>\s*How GoBeyond\s*<span className="bento-title-accent">\s*Scales\s*<\/span>\s*<\/h2>/,
  );

  assert.ok(headingMatch, "company scale heading should keep both words unclipped");
});
