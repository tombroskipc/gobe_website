import assert from "node:assert/strict";
import test from "node:test";
import {
  getQueuedStoryDirection,
  getStorySectionIdentifier,
  getStoryTransition,
  isHeroModelAnimationActive,
} from "./homeSectionStory.ts";

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

test("keeps the latest gesture direction while a section transition is animating", () => {
  assert.equal(getQueuedStoryDirection({ incomingDirection: 1, pendingDirection: null }), 1);
  assert.equal(getQueuedStoryDirection({ incomingDirection: -1, pendingDirection: 1 }), -1);
});

test("uses the section id as the active story identifier", () => {
  assert.equal(getStorySectionIdentifier({ id: "stack" }, 1), "stack");
  assert.equal(getStorySectionIdentifier({ id: "" }, 2), "section-2");
});

test("pauses the hero model animation while another story section is active", () => {
  assert.equal(
    isHeroModelAnimationActive({
      activeSectionId: "home",
      isModelOpen: false,
      storyActive: true,
    }),
    true,
  );
  assert.equal(
    isHeroModelAnimationActive({
      activeSectionId: "stack",
      isModelOpen: false,
      storyActive: true,
    }),
    false,
  );
  assert.equal(
    isHeroModelAnimationActive({
      activeSectionId: "stack",
      isModelOpen: true,
      storyActive: true,
    }),
    true,
  );
  assert.equal(
    isHeroModelAnimationActive({
      activeSectionId: null,
      isModelOpen: false,
      storyActive: false,
    }),
    true,
  );
});
