import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const sourceRoots = ["app", "components", "lib", "blocks", "collections"];
const sourceFiles = ["README.md", "index.html", "payload.config.ts"];
const allowedExtensions = new Set([".css", ".html", ".js", ".jsx", ".md", ".ts", ".tsx"]);
const disallowedBrandPatterns = [
  { label: "GoBe", pattern: new RegExp("\\bGo" + "Be\\b") },
  { label: "Gobe", pattern: new RegExp("Gobe(?=\\b|-)") },
  { label: "Gobeyond", pattern: new RegExp("Go" + "beyond") },
  { label: "GOBEYOND", pattern: new RegExp("GO" + "BEYOND") },
];

function collectSourceFiles(path: string, files: string[] = []) {
  const stat = statSync(path);

  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      collectSourceFiles(join(path, entry), files);
    }
    return files;
  }

  if (path.endsWith(".test.ts")) {
    return files;
  }

  const extension = path.slice(path.lastIndexOf("."));
  if (allowedExtensions.has(extension)) {
    files.push(path);
  }

  return files;
}

test("keeps public GoBeyond brand casing consistent", () => {
  const files = [
    ...sourceRoots.flatMap((root) => collectSourceFiles(root)),
    ...sourceFiles,
  ];
  const mismatches: string[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const { label, pattern } of disallowedBrandPatterns) {
      if (pattern.test(content)) {
        mismatches.push(`${relative(process.cwd(), file)} contains ${label}`);
      }
    }
  }

  assert.deepEqual(mismatches, []);
});
