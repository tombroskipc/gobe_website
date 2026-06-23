export type StoryDirection = 1 | -1;

export const HOME_STORY_ACTIVE_SECTION_ATTRIBUTE =
  "data-home-story-active-section";
export const HOME_STORY_ACTIVE_SECTION_EVENT =
  "gobe:home-story-active-section";
export const HOME_STORY_HERO_SECTION_ID = "home";

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

export function getQueuedStoryDirection({
  incomingDirection,
  pendingDirection,
}: {
  incomingDirection: StoryDirection;
  pendingDirection: StoryDirection | null;
}): StoryDirection {
  if (pendingDirection === incomingDirection) {
    return pendingDirection;
  }

  return incomingDirection;
}

export function getStorySectionIdentifier(
  section: { id?: string | null },
  index: number,
) {
  return section.id?.trim() || `section-${index}`;
}

export function isHeroModelAnimationActive({
  activeSectionId,
  isModelOpen,
  storyActive,
}: {
  activeSectionId: string | null;
  isModelOpen: boolean;
  storyActive: boolean;
}) {
  if (isModelOpen || !storyActive || activeSectionId === null) {
    return true;
  }

  return activeSectionId === HOME_STORY_HERO_SECTION_ID;
}
