import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCmsAssetUrl } from "./cmsClient.ts";

test("keeps Payload media API URLs usable on the public site", () => {
  assert.equal(normalizeCmsAssetUrl("/api/media/file/example.png"), "/api/media/file/example.png");
});

test("keeps external CMS asset URLs unchanged", () => {
  assert.equal(normalizeCmsAssetUrl("https://assets.example.com/example.png"), "https://assets.example.com/example.png");
});
