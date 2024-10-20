import { useCallback } from "react";
import useThrottle from "~/hooks/use-throttle";
import useVideoStore from "~/store/video.store";
import type { LayerId, LiteSequenceItemType } from "~/types/timeline.types";

const SNAP_THRESHOLD = 10; // Define this based on your requirements

// 1. DOM Event Handler Layer, takes care of frame delta calculation, throttling.
export const useSeqItemResizeHandler = (pixelsPerFrame: number) => {
  const validateAndUpdateResize = useSeqItemResizeValidation();

  const handleResize = useCallback(
    (
      layerId: LayerId,
      itemId: string,
      deltaPixels: number,
      direction: "left" | "right",
      nextItemStartFrame: number | undefined,
    ) => {
      const frameDelta = Math.round(deltaPixels / pixelsPerFrame);
      console.log("moving to updateSequenceItemDuration validation layer");

      validateAndUpdateResize(
        layerId,
        itemId,
        frameDelta,
        direction,
        nextItemStartFrame,
      );
    },
    [pixelsPerFrame, validateAndUpdateResize],
  );

  // Throttle the resize handler
  return useThrottle(handleResize, 50);
};

// 2. Validation and Cleanup Layer
const useSeqItemResizeValidation = () => {
  const layers = useVideoStore((state) => state.props.layers);
  const updateSequenceItemDuration = useVideoStore(
    (state) => state.updateSequenceItemDuration,
  );

  return useCallback(
    (
      layerId: LayerId,
      itemId: string,
      frameDelta: number,
      direction: "left" | "right",
      nextItemStartFrame: number | undefined,
    ) => {
      const layer = layers[layerId];

      const item = layer.liteItems.find((liteItem) => liteItem.id === itemId);
      if (!item) return;

      let adjustedFrameDelta = frameDelta;

      if (direction === "left" && frameDelta > item.offset) {
        const overlapBy = frameDelta - item.offset;
        if (overlapBy < SNAP_THRESHOLD) {
          adjustedFrameDelta = item.offset;
        } else {
          return;
        }
      } else if (
        direction === "right" &&
        nextItemStartFrame &&
        frameDelta + item.startFrame + item.effectiveDuration >
          nextItemStartFrame
      ) {
        const overlapBy =
          frameDelta +
          item.startFrame +
          item.effectiveDuration -
          nextItemStartFrame;
        if (overlapBy < SNAP_THRESHOLD) {
          adjustedFrameDelta =
            nextItemStartFrame - (item.startFrame + item.effectiveDuration);
        } else {
          return;
        }
      }

      // If all validations pass, update the store
      updateSequenceItemDuration(
        layerId,
        itemId,
        adjustedFrameDelta,
        direction,
      );
    },
    [layers, updateSequenceItemDuration],
  );
};

export const checkCollisionAndSnap = (
  layerItems: LiteSequenceItemType[],
  itemId: string,
  newStartFrame: number,
  newEndFrame: number,
): {
  hasCollision: boolean;
  snapTo: number | null;
  collisionExtent: number;
} => {
  let snapTo: number | null = null;
  let minCollision = Infinity;

  const currentItem = layerItems.find((item) => item.id === itemId);
  if (!currentItem)
    return { hasCollision: false, snapTo: null, collisionExtent: 0 };

  const isRightResize =
    newEndFrame !== currentItem.startFrame + currentItem.effectiveDuration;

  for (const liteItem of layerItems) {
    if (liteItem.id === itemId) continue;

    const otherStartFrame = liteItem.startFrame;
    const otherEndFrame = otherStartFrame + liteItem.effectiveDuration;

    // Check for collision or gap
    if (newEndFrame > otherStartFrame && newStartFrame < otherEndFrame) {
      // Calculate the extent of collision or gap
      const leftCollision = newEndFrame - otherStartFrame;
      const rightCollision = otherEndFrame - newStartFrame;
      const collision = Math.min(
        Math.abs(leftCollision),
        Math.abs(rightCollision),
      );

      if (collision < minCollision) {
        minCollision = collision;
        if (collision <= SNAP_THRESHOLD) {
          if (isRightResize) {
            snapTo =
              leftCollision < rightCollision ? otherStartFrame : otherEndFrame;
          } else {
            snapTo =
              leftCollision < rightCollision ? otherEndFrame : otherStartFrame;
          }
        }
      }
    }
  }

  return {
    hasCollision: minCollision !== Infinity,
    snapTo,
    collisionExtent: minCollision,
  };
};

export const calculateNewDimensions = (
  item: LiteSequenceItemType,
  frameDelta: number,
  direction: "left" | "right",
) => {
  let newStartFrame = item.startFrame;
  let newDurationInFrames = item.effectiveDuration;

  if (direction === "left") {
    // Expanding to the left: start earlier
    // Shrinking from the left: start later
    newStartFrame += frameDelta;
    newDurationInFrames -= frameDelta;
  } else {
    // direction === "right"
    // Expanding to the right: increase duration
    // Shrinking from the right: decrease duration
    newDurationInFrames += frameDelta;
  }

  const newEndFrame = newStartFrame + newDurationInFrames;

  return { newStartFrame, newDurationInFrames, newEndFrame };
};
