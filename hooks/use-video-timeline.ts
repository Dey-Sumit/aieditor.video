import { type PlayerRef } from "@remotion/player";
import { useCallback, useMemo, useRef, useState } from "react";
import { useCurrentPlayerFrame } from "./use-current-player-frame";
import useThrottle from "./use-throttle";

import { getVideoMetadata } from "@remotion/media-utils";
import { useTimeline } from "~/context/useTimeline";
import { PRESET_COLLECTION } from "~/data/preset.book";
import { LAYOUT } from "~/lib/constants/layout.constants";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type {
  ContentType,
  LayerId,
  LiteSequenceItemType,
  StoreType,
} from "~/types/timeline.types";
import { genId } from "~/utils/misc.utils";
import { calculatePlaceholderDuration } from "~/utils/timeline.utils";
import { useSeqItemResizeHandler } from "./timeline/dom-layer/use-sequence-resize";
import { useTimelineMetrics } from "./timeline/dom-layer/use-timeline-metrics";
import { useTimelineSynchronization } from "./timeline/dom-layer/use-timeline-sync";

const { MAX_PLACEHOLDER_FRAMES: MAX_PLACEHOLDER_DURATION_IN_FRAMES } = TIMELINE;
const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;

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
  const props = useVideoStore((store) => store.props);
  const updateSequenceItemPositionInLayer = useVideoStore(
    (store) => store.updateSequenceItemPositionInLayer,
  );

  const {
    compositionMetaData: { duration: durationInFrames },
  } = props!;
  const currentFrame = useCurrentPlayerFrame(playerRef);

  const {
    containerRef,
    containerWidth,
    frameToPixels,
    pixelsToFrame,
    pixelsPerFrame,
    // TODO :
    /* setTimelineZoom,
    zoom, */
  } = useTimelineMetrics({ durationInFrames });

  const { playheadPosition, handlePlayheadDrag, handleTimeLayerClick } =
    useTimelineSynchronization({
      containerWidth,
      frameToPixels,
      pixelsToFrame,
      playerRef,
      currentFrame,
    });

  const throttledItemDrag = useItemDrag(
    pixelsPerFrame,
    updateSequenceItemPositionInLayer,
  );

  const itemResizeHandler = useSeqItemResizeHandler(pixelsPerFrame);

  return {
    playheadPosition,
    containerWidth,
    containerRef,
    pixelsPerFrame,
    throttledItemDrag,
    itemResizeHandler,
    handlePlayheadDrag,
    handleTimeLayerClick,
    currentFrame,
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

  const selectedNewItemType = useEditingStore(
    (state) => state.selectedContentType,
  );

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
    async (
      e: React.MouseEvent<HTMLDivElement>,
      selectedContentType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetId: string;
          },
    ) => {
      console.log("adding new item", selectedContentType);

      if (!lastHoverInfoRef.current) {
        console.error("hoverInfo is null, cannot add new item");
        return;
      }
      const VIDEO_URL =
        "https://videos.pexels.com/video-files/4065220/4065220-sd_506_960_25fps.mp4";

      if (
        selectedContentType.sequenceType === "standalone"
        // &&
        // selectedContentType.contentType === "video"
      ) {
        console.log("adding video item");
        const data = await getVideoMetadata(VIDEO_URL);
        console.log({ data });
      }

      const {
        startFrame: adjustedStartFrame,
        durationInFrames: placeholderDuration,
        offsetFrames,
      } = lastHoverInfoRef.current;

      if (selectedContentType.sequenceType === "standalone") {
        const contentType =
          selectedContentType.contentType || selectedNewItemType;
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
        const presetId = selectedContentType.presetId;
        const newItemId = genId("p", "preset");
        const presetDetail = PRESET_COLLECTION[presetId];
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
