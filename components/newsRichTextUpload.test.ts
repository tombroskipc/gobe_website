import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renders Payload upload nodes nested inside rich text paragraphs", () => {
  const source = readFileSync("components/NewsRenderer.tsx", "utf8");

  assert.match(source, /pushMixedChildren/);
  assert.match(source, /node\.type === "paragraph"[\s\S]*child\.type === "upload" \|\| child\.type === "externalImage"/);
  assert.match(source, /pushUploadBlock\(child, `\$\{key\}-upload-\$\{index\}`\)/);
});

test("renders external image nodes pasted into news rich text without media upload", () => {
  const rendererSource = readFileSync("components/NewsRenderer.tsx", "utf8");
  const newsSource = readFileSync("collections/News.ts", "utf8");
  const featureSource = readFileSync("features/externalImage/server/ExternalImageNode.ts", "utf8");

  assert.match(newsSource, /ExternalImageFeature\(\)/);
  assert.match(featureSource, /static importDOM\(\)[\s\S]*priority:\s*4/);
  assert.match(rendererSource, /node\.type === "externalImage"/);
  assert.match(rendererSource, /pushExternalImageBlock/);
});

test("does not require alt text when uploading media through Payload", () => {
  const source = readFileSync("collections/Media.ts", "utf8");

  assert.match(source, /name: "alt"[\s\S]*required: false/);
});

test("allows MP4 uploads and renders video media from rich text uploads", () => {
  const mediaSource = readFileSync("collections/Media.ts", "utf8");
  const rendererSource = readFileSync("components/NewsRenderer.tsx", "utf8");

  assert.match(mediaSource, /mimeTypes:\s*\["image\/\*", "video\/mp4"\]/);
  assert.match(rendererSource, /"image" \| "video"/);
  assert.match(rendererSource, /mimeType\?\.startsWith\("video\/"\)/);
  assert.match(rendererSource, /<video[\s\S]*controls[\s\S]*playsInline[\s\S]*preload="metadata"/);
});

test("renders standalone pasted MP4 URLs as videos in news rich text", () => {
  const source = readFileSync("components/NewsRenderer.tsx", "utf8");

  assert.match(source, /function isMp4Url/);
  assert.match(source, /url\.pathname\.toLowerCase\(\)\.endsWith\("\.mp4"\)/);
  assert.match(source, /videoUrl:\s*normalizeCmsAssetUrl\(text\)/);
  assert.match(source, /block\.videoUrl \|\| getMediaUrl\(block\.media\)/);
});

test("hides internal content source metadata from news article details", () => {
  const source = readFileSync("components/NewsRenderer.tsx", "utf8");

  assert.doesNotMatch(source, /Content source/);
  assert.doesNotMatch(source, /Payload text editor/);
  assert.doesNotMatch(source, /Legacy content/);
});
