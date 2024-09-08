import {
  LayerId,
  LiteSequenceItemType,
  NestedCompositionProjectType,
} from "~/types/timeline.types";

export const getItemStyle = (type: string) => {
  switch (type) {
    case "audio":
      return "bg-blue-500 border-blue-600 ";
    case "caption":
      return "bg-green-600 border-green-600";
    case "text":
      return "bg-yellow-600/60 border-yellow-600";
    case "video":
      return "bg-pink-600/60 border-pink-600 ";
    case "image":
      return "bg-purple-600 border-purple-600/70 ";
    case "preset":
      return "bg-gray-200 border-indigo-500 border-dashed border ";
    default:
      return "bg-gray-600 border-gray-600";
  }
};

export const LAYERS_IN_ORDER: {
  label: string;
  id: LayerId;
}[] = [
  {
    label: "Foreground Layer",
    id: "layerForeground",
  },
  {
    label: "Middle Layer",
    id: "layerMiddle",
  },
  {
    label: "Background Layer",
    id: "layerBackground",
  },
] as const;

// Utility function to calculate offset between two items
export function calculateOffset(
  prev: LiteSequenceItemType | null,
  current: LiteSequenceItemType
): number {
  if (!prev) return current.startFrame;
  return current.startFrame - (prev.startFrame + prev.effectiveDuration);
}

/* export const calculateLayerDuration = (items: SequenceItem[]): number => {
  if (items.length === 0) return 0;

  return Math.max(...items.map((item) => item.from + item.durationInFrames));
}; */

/* export const calculateAdjustedTimelineDuration = (
  project: DynamicCompositionType,
): number => {
  const layerDurations = Object.entries(project.layers)
    .filter(([layerId]) => layerId !== "caption-layer") // Ignore caption layer
    .map(([_, layer]) => calculateLayerDuration(layer.sequenceItems));

  const maxDuration = Math.max(0, ...layerDurations);

  return Math.min(maxDuration, TIMELINE.MAX_TIMELINE_DURATION);
};
 */
// Fake API call function to simulate loading a project
/* export const fetchProject = async (
  projectId: string,
): Promise<DynamicCompositionType> => {
  // Simulating API call delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // Return fake project data based on projectId
  let projectData: DynamicCompositionType;
  if (projectId === "project-1") {
    projectData = DUMMY_PROJECT;
  } else {
    throw new Error("Project not found");
  }

  return projectData;
}; */

// Helper function to create a new project with updated sequence items for a specific layer
/* export const getProjectWithUpdatedLayers = (
  currentProject: DynamicCompositionType,
  layerId: string,
  updatedSequenceItems: SequenceItem[],
): DynamicCompositionType => {
  return {
    ...currentProject,
    layers: {
      ...currentProject.layers,
      [layerId]: {
        ...currentProject.layers[layerId],
        sequenceItems: updatedSequenceItems,
      },
    },
  };
};
 */

// TODO : can we use binary search here?
// Helper function to find nearest sequences
export function findNearestSequences(
  liteItems: LiteSequenceItemType[],
  startFrame: number
): {
  prevItem: LiteSequenceItemType | null;
  nextItem: LiteSequenceItemType | null;
} {
  let prevItem: LiteSequenceItemType | null = null;
  let nextItem: LiteSequenceItemType | null = null;

  for (const item of liteItems) {
    if (item.startFrame <= startFrame) {
      if (!prevItem || item.startFrame > prevItem.startFrame) {
        prevItem = item;
      }
    } else {
      nextItem = item;
      break;
    }
  }

  return { prevItem, nextItem };
}

export function binarySearch<T>(
  arr: T[],
  searchValue: number,
  getCompareValue: (item: T) => number
): number {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (getCompareValue(arr[mid]) > searchValue) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}

export function canAddTransition(
  layerId: LayerId,
  itemId: string,
  position: "incoming" | "outgoing",
  state: NestedCompositionProjectType
) {
  // Implementation to check if a transition can be added
  // This would check for the existence of adjacent items and their offsets
}

interface PlaceholderDuration {
  duration: number;
  offsetFrames: number;
  adjustedStartFrame: number;
}

export function calculatePlaceholderDuration(
  liteItems: LiteSequenceItemType[],
  startFrame: number,
  duration: number,
  MAX_PLACEHOLDER_DURATION_IN_FRAMES: number
): PlaceholderDuration {
  const { prevItem, nextItem } = findNearestSequences(liteItems, startFrame);

  // Calculate the earliest possible start frame
  const earliestStartFrame = prevItem ? prevItem.startFrame + prevItem.effectiveDuration : 0;

  // Adjust the start frame if it's before the earliest possible start
  const adjustedStartFrame = Math.max(startFrame, earliestStartFrame);

  // Calculate the latest possible end frame
  const latestEndFrame = nextItem ? nextItem.startFrame : duration;

  // Calculate available duration
  const availableDuration = latestEndFrame - adjustedStartFrame;

  // Cap the duration at MAX_PLACEHOLDER_DURATION if needed
  const finalDuration = Math.min(availableDuration, MAX_PLACEHOLDER_DURATION_IN_FRAMES);

  return {
    duration: finalDuration,
    offsetFrames: adjustedStartFrame - earliestStartFrame,
    adjustedStartFrame,
  };
}
