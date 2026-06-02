export type StoryDirection = 1 | -1;

export type StoryTransition =
  | {
      direction: StoryDirection;
      index: number;
      type: "section";
    }
  | {
      direction: 1;
      index: number;
      type: "release";
    };

export function getStoryTransition({
  currentIndex,
  direction,
  released,
  sectionCount,
}: {
  currentIndex: number;
  direction: StoryDirection;
  released: boolean;
  sectionCount: number;
}): StoryTransition {
  const lastIndex = Math.max(0, sectionCount - 1);

  if (released && direction === -1) {
    return {
      direction,
      index: lastIndex,
      type: "section",
    };
  }

  if (direction === 1 && currentIndex >= lastIndex) {
    return {
      direction,
      index: lastIndex,
      type: "release",
    };
  }

  return {
    direction,
    index: Math.max(0, Math.min(lastIndex, currentIndex + direction)),
    type: "section",
  };
}
