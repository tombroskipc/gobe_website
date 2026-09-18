import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("news and activity posts expose admin sort controls", () => {
  const source = readFileSync("collections/News.ts", "utf8");

  assert.match(source, /defaultSort:\s*"displayOrder"/);
  assert.match(source, /defaultColumns:\s*\["displayOrder", "title", "tag", "team", "status", "updatedAt"\]/);
  assert.match(source, /name:\s*"team"[\s\S]*description:\s*"Used to filter and sort posts by team in the admin\."/);
  assert.match(source, /name:\s*"displayOrder"[\s\S]*Lower numbers appear first/);
});

test("career roles expose admin sort controls", () => {
  const source = readFileSync("collections/Careers.ts", "utf8");

  assert.match(source, /defaultSort:\s*"displayOrder"/);
  assert.match(source, /defaultColumns:\s*\["displayOrder", "title", "team", "tag", "status", "updatedAt"\]/);
  assert.match(source, /name:\s*"team"[\s\S]*description:\s*"Used to filter and sort roles by team in the admin\."/);
  assert.match(source, /name:\s*"displayOrder"[\s\S]*Lower numbers appear first/);
});

test("public listings prioritize manual display order without requiring it", () => {
  const newsSource = readFileSync("lib/news.ts", "utf8");
  const careersSource = readFileSync("lib/careers.ts", "utf8");

  assert.match(newsSource, /displayOrder\?: number \| null/);
  assert.match(newsSource, /function sortByDisplayOrder/);
  assert.match(newsSource, /function normalizeLegacyPosts/);
  assert.match(newsSource, /return sortByDisplayOrder\(normalizeLegacyPosts\(result\.docs as NewsPost\[\]\)\)/);
  assert.match(careersSource, /displayOrder\?: number \| null/);
  assert.match(careersSource, /function sortByDisplayOrder/);
  assert.match(careersSource, /function normalizeLegacyCareers/);
  assert.match(careersSource, /return sortByDisplayOrder\(normalizeLegacyCareers\(result\.docs as CareerItem\[\]\)\)/);
});

test("sort control fields have a database migration", () => {
  const migrationSource = readFileSync("migrations/20260716_172600_content_sort_controls.ts", "utf8");
  const indexSource = readFileSync("migrations/index.ts", "utf8");

  assert.match(migrationSource, /ALTER TABLE \\`news\\` ADD \\`team\\` text/);
  assert.match(migrationSource, /ALTER TABLE \\`news\\` ADD \\`display_order\\` numeric/);
  assert.match(migrationSource, /ALTER TABLE \\`_news_v\\` ADD \\`version_team\\` text/);
  assert.match(migrationSource, /ALTER TABLE \\`careers\\` ADD \\`team\\` text/);
  assert.match(migrationSource, /ALTER TABLE \\`careers\\` ADD \\`display_order\\` numeric/);
  assert.match(migrationSource, /ALTER TABLE \\`_careers_v\\` ADD \\`version_display_order\\` numeric/);
  assert.match(indexSource, /20260716_172600_content_sort_controls/);
});
