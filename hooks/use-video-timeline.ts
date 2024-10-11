import { type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentPlayerFrame } from "./use-current-player-frame";
import useThrottle from "./use-throttle";

import { useTimeline } from "~/context/useTimeline";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type {
  ContentType,
  LayerId,
  PresetName,
  StoreType,
} from "~/types/timeline.types";
import { genId } from "~/utils/misc.utils";
import { calculatePlaceholderDuration } from "~/utils/timeline.utils";

const { MAX_PLACEHOLDER_FRAMES: MAX_PLACEHOLDER_DURATION_IN_FRAMES } = TIMELINE;

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

const useItemDrag = (
  pixelsPerFrame: number,
  updateSequenceItemPositionInLayer: StoreType["updateSequenceItemPositionInLayer"],
) => {
  const {
    props: { layers },
  } = useVideoStore();

  const handleItemDrag = useCallback(
    (layerId: LayerId, itemId: string, deltaPositionX: number) => {
      const layer = layers[layerId];
      if (!layer) return;

      const item = layer.liteItems.find((liteItem) => liteItem.id === itemId);
      if (!item) return;

      const newStartFrame = Math.max(
        0,
        Math.round(deltaPositionX / pixelsPerFrame),
      );
      const newEndFrame = newStartFrame + item.effectiveDuration;

      // Efficient collision detection using liteItems
      const hasCollision = layer.liteItems.some((liteItem) => {
        if (liteItem.id === itemId) return false;
        const otherEndFrame = liteItem.startFrame + liteItem.effectiveDuration;
        return (
          newStartFrame < otherEndFrame && newEndFrame > liteItem.startFrame
        );
      });

      if (!hasCollision) {
        // Only update the store if it's significantly different from the last update
        if (Math.abs(newStartFrame - item.startFrame) >= 1) {
          updateSequenceItemPositionInLayer(layerId, itemId, {
            startFrame: newStartFrame,
          });
        }
      }
    },
    [layers, pixelsPerFrame, updateSequenceItemPositionInLayer],
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
  };
}

interface HoverInfo {
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

  const { draggingLayerId } = useTimeline();

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
        addPresetToLayer(layerId, {
          id: newItemId,
          startFrame: adjustedStartFrame,
          sequenceDuration: placeholderDuration,
          effectiveDuration: placeholderDuration,
          offset: offsetFrames ?? 0,
          name: "BRUT_END_SCREEN_PRESET",
          sequenceType: "preset",
        });
      }
    },
    [
      layerId,
      addSequenceItemToLayer,
      setActiveSeqItem,
      addPresetToLayer,
      selectedNewItemType,
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
