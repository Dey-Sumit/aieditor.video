import { type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentPlayerFrame } from "./use-current-player-frame";
import useThrottle from "./use-throttle";

import { useTimeline } from "~/context/useTimeline";
import { PRESET_COLLECTION } from "~/data/nested-composition.data";
import { LAYOUT } from "~/lib/constants/layout.constants";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type {
  ContentType,
  LayerId,
  LiteSequenceItemType,
  PresetName,
  StoreType,
} from "~/types/timeline.types";
import { genId } from "~/utils/misc.utils";
import { calculatePlaceholderDuration } from "~/utils/timeline.utils";

const { MAX_PLACEHOLDER_FRAMES: MAX_PLACEHOLDER_DURATION_IN_FRAMES } = TIMELINE;
const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;
// Hook for managing container dimensions
const useContainerDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  return { containerRef, containerWidth };
};

// Hook for managing playhead position
const usePlayhead = (currentFrame: number, pixelsPerFrame: number) => {
  const [playheadPosition, setPlayheadPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newX = currentFrame * pixelsPerFrame;
    setPlayheadPosition({ x: newX, y: 0 });
  }, [currentFrame, pixelsPerFrame]);

  return { playheadPosition, setPlayheadPosition };
};

// Hook for handling timeline interactions
const useTimelineInteractions = (
  containerWidth: number,
  pixelsPerFrame: number,
  playerRef: React.RefObject<PlayerRef>,
  setPlayheadPosition: (position: { x: number; y: number }) => void,
) => {
  const handlePlayheadDrag = useCallback(
    (e: any, d: { x: number; y: number }) => {
      const newX = Math.max(0, Math.min(d.x, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });
      if (playerRef.current) {
        playerRef.current.seekTo(Math.round(newX / pixelsPerFrame));
      }
    },
    [containerWidth, pixelsPerFrame, playerRef, setPlayheadPosition],
  );

  const handleTimeLayerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!playerRef.current) return;

      const containerRect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - containerRect.left;

      const newX = Math.max(0, Math.min(clickX, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });

      playerRef.current.seekTo(Math.round(newX / pixelsPerFrame));
    },
    [containerWidth, pixelsPerFrame, playerRef, setPlayheadPosition],
  );

  return { handlePlayheadDrag, handleTimeLayerClick };
};
const SNAP_THRESHOLD = 10; // Define a threshold in frames for snapping

const useItemDrag = (
  pixelsPerFrame: number,
  updateSequenceItemPositionInLayer: StoreType["updateSequenceItemPositionInLayer"],
) => {
  const layers = useVideoStore((store) => store.props.layers);
  const orderedLayers = useVideoStore((store) => store.props.layerOrder);
  const checkCollisionAndSnap = (
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

    for (const liteItem of layerItems) {
      if (liteItem.id === itemId) continue;

      const otherStartFrame = liteItem.startFrame;
      const otherEndFrame = otherStartFrame + liteItem.effectiveDuration;

      // Check for collision
      if (newStartFrame < otherEndFrame && newEndFrame > otherStartFrame) {
        // Calculate the extent of collision
        const leftCollision = Math.abs(newEndFrame - otherStartFrame);
        const rightCollision = Math.abs(newStartFrame - otherEndFrame);
        const collision = Math.min(leftCollision, rightCollision);

        if (collision < minCollision) {
          minCollision = collision;
          if (collision <= SNAP_THRESHOLD) {
            snapTo =
              leftCollision < rightCollision
                ? otherStartFrame - liteItem.effectiveDuration
                : otherEndFrame;
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

  const handleItemDrag = useCallback(
    (
      oldLayerId: LayerId,
      itemId: string,
      deltaPositionX: number,
      deltaPositionY: number,
    ) => {
      const oldLayer = layers[oldLayerId];
      if (!oldLayer) return;

      const item = oldLayer.liteItems.find(
        (liteItem) => liteItem.id === itemId,
      );
      if (!item) return;

      const centerY = deltaPositionY + TRACK_LAYER_HEIGHT_IN_PX / 2;
      const rawLayerIndex = centerY / TRACK_LAYER_HEIGHT_IN_PX;
      const snapLayerIndex = Math.floor(rawLayerIndex);
      const newLayerId = orderedLayers[snapLayerIndex];

      const isLayerChanged = newLayerId !== oldLayerId;
      console.log({ deltaPositionX });

      const newStartFrame = Math.max(
        0,
        Math.round(deltaPositionX / pixelsPerFrame),
      );

      // don't update if the change is less than 1 frame and the layer is the same
      if (Math.abs(newStartFrame - item.startFrame) < 1 && !isLayerChanged) {
        console.log("no update on any axis");
        return;
      }

      const newEndFrame = newStartFrame + item.effectiveDuration;

      const newLayer = layers[newLayerId]; // if the layer is not changed, this will be the same as oldLayer

      /*       const hasCollision = newLayer.liteItems.some((liteItem) => {
        if (liteItem.id === itemId) return false;
        const otherEndFrame = liteItem.startFrame + liteItem.effectiveDuration;
        return (
          newStartFrame < otherEndFrame && newEndFrame > liteItem.startFrame
        );
      });
 */

      /*       if (hasCollision) {
        console.log("collision detected");
        return;
      }

      console.log("updating item position", {
        oldLayerId,
        newLayerId,
        itemId,
        newStartFrame,
        oldStartFrame: item.startFrame,
      });

      // Only update the store if it's significantly different from the last update
      updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
        startFrame: newStartFrame,
      }); */

      const { hasCollision, snapTo, collisionExtent } = checkCollisionAndSnap(
        newLayer.liteItems,
        itemId,
        newStartFrame,
        newEndFrame,
      );

      if (hasCollision) {
        if (snapTo !== null && collisionExtent <= SNAP_THRESHOLD) {
          // Snap the item
          // console.log("Snapping item", { itemId, snappedStartFrame: snapTo });
          updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
            startFrame: snapTo,
          });
        } else {
          // Collision detected and beyond threshold, prevent the move
          console.log("Collision detected beyond threshold, move prevented");
          return;
        }
      } else {
        // No collision, update normally
        console.log("Updating item position", {
          oldLayerId,
          newLayerId,
          itemId,
          newStartFrame,
          oldStartFrame: item.startFrame,
        });
        updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
          startFrame: newStartFrame,
        });
      }
    },
    [layers, pixelsPerFrame, updateSequenceItemPositionInLayer, orderedLayers],
  );

  // Use a more aggressive throttle for drag operations
  return useThrottle(handleItemDrag, 50);
};

export function useNewVideoTimeline(playerRef: React.RefObject<PlayerRef>) {
  const {
    props,
    updateSequenceItemPositionInLayer,
    updateSequenceItemDuration,
  } = useVideoStore();
  const {
    compositionMetaData: { duration: durationInFrames },
  } = props!;

  const { containerRef, containerWidth } = useContainerDimensions();

  const pixelsPerFrame = containerWidth / durationInFrames;
  const currentFrame = useCurrentPlayerFrame(playerRef);

  const { playheadPosition, setPlayheadPosition } = usePlayhead(
    currentFrame,
    pixelsPerFrame,
  );

  const { handlePlayheadDrag, handleTimeLayerClick } = useTimelineInteractions(
    containerWidth,
    pixelsPerFrame,
    playerRef,
    setPlayheadPosition,
  );

  const throttledItemDrag = useItemDrag(
    pixelsPerFrame,
    updateSequenceItemPositionInLayer,
  );

  const throttledItemResize = useItemResize(
    pixelsPerFrame,
    updateSequenceItemDuration,
  );

  return {
    playheadPosition,
    containerWidth,
    containerRef,
    pixelsPerFrame,
    throttledItemDrag,
    throttledItemResize,
    handlePlayheadDrag,
    handleTimeLayerClick,
    currentFrame,
    setPlayheadPosition,
  };
}

export interface HoverInfo {
  layerId: LayerId;
  startFrame: number;
  durationInFrames: number;
  offsetFrames: number;
  startX: number;
  width: number;
}

export function useSequenceAddition(layerId: LayerId, pixelsPerFrame: number) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const lastHoverInfoRef = useRef<HoverInfo | null>(null);

  const selectedNewItemType = useEditingStore((state) => state.newItemType);

  const { draggingLayerId, handleTimeLayerClick } = useTimeline();

  const liteItems = useVideoStore(
    (state) => state.props.layers[layerId]?.liteItems,
  );

  const duration = useVideoStore(
    (state) => state.props.compositionMetaData.duration,
  );
  const addSequenceItemToLayer = useVideoStore(
    (state) => state.addSequenceItemToLayer,
  );
  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);
  const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);

  const isPointWithinItem = useCallback(
    (x: number): boolean => {
      const frame = Math.floor(x / pixelsPerFrame);
      return liteItems.some(
        (item) =>
          frame >= item.startFrame &&
          frame < item.startFrame + item.effectiveDuration,
      );
    },
    [liteItems, pixelsPerFrame],
  );

  const handleBackgroundLayerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingLayerId !== null && draggingLayerId !== layerId) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (isPointWithinItem(x)) {
        setHoverInfo(null);
        return;
      }

      const startFrame = Math.floor(x / pixelsPerFrame);

      const placeholderInfo = calculatePlaceholderDuration(
        liteItems,
        startFrame,
        duration,
        MAX_PLACEHOLDER_DURATION_IN_FRAMES,
      );
      const newHoverInfo = {
        layerId,
        startFrame: placeholderInfo.adjustedStartFrame,
        durationInFrames: placeholderInfo.duration,
        offsetFrames: placeholderInfo.offsetFrames,
        startX: placeholderInfo.adjustedStartFrame * pixelsPerFrame,
        width: placeholderInfo.duration * pixelsPerFrame,
      };
      setHoverInfo(newHoverInfo);
      lastHoverInfoRef.current = newHoverInfo;
    },
    [
      liteItems,
      layerId,
      duration,
      pixelsPerFrame,
      isPointWithinItem,
      draggingLayerId,
    ],
  );

  const throttledMouseMove = useThrottle(handleBackgroundLayerMouseMove, 20);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const handleAddNewItem = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      newItemType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetName: PresetName;
          },
    ) => {
      console.log("adding new item", newItemType);

      if (!lastHoverInfoRef.current) {
        console.error("hoverInfo is null, cannot add new item");
        return;
      }

      const {
        startFrame: adjustedStartFrame,
        durationInFrames: placeholderDuration,
        offsetFrames,
      } = lastHoverInfoRef.current;

      if (newItemType.sequenceType === "standalone") {
        const contentType = newItemType.contentType || selectedNewItemType;
        const newItemId = genId("s", contentType);
        addSequenceItemToLayer(layerId, {
          id: newItemId,
          sequenceType: "standalone",
          contentType,
          startFrame: adjustedStartFrame,
          effectiveDuration: placeholderDuration,
          sequenceDuration: placeholderDuration, // Assuming no transitions initially
          offset: offsetFrames ?? 0,
        });
        setActiveSeqItem(layerId, newItemId, contentType);
      } else {
        const newItemId = genId("p", "preset");
        const presetDetail = PRESET_COLLECTION["preset-1"];
        addPresetToLayer(
          layerId,
          {
            id: newItemId,
            startFrame: adjustedStartFrame,
            // sequenceDuration: placeholderDuration,
            // effectiveDuration: placeholderDuration,
            offset: offsetFrames ?? 0,
            // name: "BRUT_END_SCREEN_PRESET",
            // sequenceType: "preset",
          },
          presetDetail,
        );
      }
      handleTimeLayerClick(e);
    },
    [
      layerId,
      addSequenceItemToLayer,
      setActiveSeqItem,
      addPresetToLayer,
      selectedNewItemType,
      handleTimeLayerClick,
    ],
  );

  const mouseEventHandlers = useMemo(
    () => ({
      onMouseMove: throttledMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleAddNewItem,
    }),
    [throttledMouseMove, handleMouseLeave, handleAddNewItem],
  );

  return {
    hoverInfo,
    isPointWithinItem,
    mouseEventHandlers,
    handleAddNewItem,
  };
}

//TODO:  not using this hook, the code of the hooks can be better
const useItemResize = (
  pixelsPerFrame: number,
  updateSequenceItemDuration: StoreType["updateSequenceItemDuration"],
) => {
  const {
    props: { layers },
  } = useVideoStore();

  const handleItemResize = useCallback(
    (
      layerId: LayerId,
      itemId: string,

      frameDelta: number,
      direction: "left" | "right",
    ) => {
      const layer = layers[layerId];
      if (!layer) return;

      const item = layer.liteItems.find((liteItem) => liteItem.id === itemId);
      if (!item) return;
      /*
   put the conditions here
   */
      updateSequenceItemDuration(
        layerId,
        item.id,
        frameDelta,
        direction as "left" | "right",
      );
    },
    [layers, updateSequenceItemDuration],
  );

  // Use a more aggressive throttle for drag operations
  return useThrottle(handleItemResize, 50);
};
