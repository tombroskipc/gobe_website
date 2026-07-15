import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renders Payload upload nodes nested inside rich text paragraphs", () => {
  const source = readFileSync("components/NewsRenderer.tsx", "utf8");

  assert.match(source, /pushMixedChildren/);
  assert.match(source, /node\.type === "paragraph"[\s\S]*node\.children\?\.some\(\(child\) => child\.type === "upload"\)/);
  assert.match(source, /pushUploadBlock\(child, `\$\{key\}-upload-\$\{index\}`\)/);
});

test("does not require alt text when uploading media through Payload", () => {
  const source = readFileSync("collections/Media.ts", "utf8");

  assert.match(source, /name: "alt"[\s\S]*required: false/);
});
