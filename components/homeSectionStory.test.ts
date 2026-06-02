import assert from "node:assert/strict";
import test from "node:test";
import { getStoryTransition } from "./homeSectionStory.ts";

test("moves to the next section on downward scroll", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 0, direction: 1, released: false, sectionCount: 5 }), {
    direction: 1,
    index: 1,
    type: "section",
  });
});

test("moves to the previous section on upward scroll", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 2, direction: -1, released: false, sectionCount: 5 }), {
    direction: -1,
    index: 1,
    type: "section",
  });
});

test("releases to native scroll after the final section", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 4, direction: 1, released: false, sectionCount: 5 }), {
    direction: 1,
    index: 4,
    type: "release",
  });
});

test("re-enters the story at the final section from the footer", () => {
  assert.deepEqual(getStoryTransition({ currentIndex: 4, direction: -1, released: true, sectionCount: 5 }), {
    direction: -1,
    index: 4,
    type: "section",
  });
});
