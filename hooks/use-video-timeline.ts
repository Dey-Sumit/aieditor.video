import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useCurrentPlayerFrame } from "./use-current-player-frame";
import { type PlayerRef } from "@remotion/player";
import useThrottle from "./use-throttle";

import { useTimeline } from "~/context/useTimeline";
import useVideoStore from "~/store/video.store";
import { LayerId, StoreType } from "~/types/timeline.types";
import { useEditingStore } from "~/store/editing.store";
import { calculatePlaceholderDuration } from "~/utils/timeline.utils";
import { genId } from "~/utils/misc.utils";
import { TIMELINE } from "~/lib/constants/timeline.constants";

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
  setPlayheadPosition: (position: { x: number; y: number }) => void
) => {
  const handlePlayheadDrag = useCallback(
    (e: any, d: { x: number; y: number }) => {
      const newX = Math.max(0, Math.min(d.x, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });
      if (playerRef.current) {
        playerRef.current.seekTo(Math.round(newX / pixelsPerFrame));
      }
    },
    [containerWidth, pixelsPerFrame, playerRef, setPlayheadPosition]
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!playerRef.current) return;

      const containerRect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - containerRect.left;

      const newX = Math.max(0, Math.min(clickX, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });

      playerRef.current.seekTo(Math.round(newX / pixelsPerFrame));
    },
    [containerWidth, pixelsPerFrame, playerRef, setPlayheadPosition]
  );

  return { handlePlayheadDrag, handleTimelineClick };
};

const useItemDrag = (
  pixelsPerFrame: number,
  updateSequenceItemInLayer: StoreType["updateSequenceItemInLayer"]
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

      const newStartFrame = Math.max(0, Math.round(deltaPositionX / pixelsPerFrame));
      const newEndFrame = newStartFrame + item.effectiveDuration;

      // Efficient collision detection using liteItems
      const hasCollision = layer.liteItems.some((liteItem) => {
        if (liteItem.id === itemId) return false;
        const otherEndFrame = liteItem.startFrame + liteItem.effectiveDuration;
        return newStartFrame < otherEndFrame && newEndFrame > liteItem.startFrame;
      });
      console.log({ hasCollision });

      if (!hasCollision) {
        // Only update the store if it's significantly different from the last update
        if (Math.abs(newStartFrame - item.startFrame) >= 1) {
          updateSequenceItemInLayer(layerId, itemId, {
            startFrame: newStartFrame,
          });
        }
      }
    },
    [layers, pixelsPerFrame, updateSequenceItemInLayer]
  );

  // Use a more aggressive throttle for drag operations
  return useThrottle(handleItemDrag, 50);
};

export function useNewVideoTimeline(playerRef: React.RefObject<PlayerRef>) {
  const { props, updateSequenceItemInLayer, updateSequenceItemDuration } = useVideoStore();
  const {
    compositionMetaData: { duration: durationInFrames },
  } = props!;

  const { containerRef, containerWidth } = useContainerDimensions();

  const pixelsPerFrame = containerWidth / durationInFrames;
  const currentFrame = useCurrentPlayerFrame(playerRef);

  const { playheadPosition, setPlayheadPosition } = usePlayhead(currentFrame, pixelsPerFrame);

  const { handlePlayheadDrag, handleTimelineClick } = useTimelineInteractions(
    containerWidth,
    pixelsPerFrame,
    playerRef,
    setPlayheadPosition
  );

  const throttledItemDrag = useItemDrag(pixelsPerFrame, updateSequenceItemInLayer);

  const throttledItemResize = useItemResize(pixelsPerFrame, updateSequenceItemDuration);

  return {
    playheadPosition,
    containerWidth,
    containerRef,
    pixelsPerFrame,
    throttledItemDrag,
    throttledItemResize,
    handlePlayheadDrag,
    handleTimelineClick,
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

  const newItemType = "text";
  // useEditingStore((state) =>
  //   layerId === "layerBackground" ? "audio" : state.newItemType,
  // ) || "text";

  const { draggingLayerId } = useTimeline();

  const liteItems = useVideoStore((state) => state.props.layers[layerId]!.liteItems);

  const duration = useVideoStore((state) => state.props.compositionMetaData.duration);
  const addSequenceItemToLayer = useVideoStore((state) => state.addSequenceItemToLayer);
  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);

  const isPointWithinItem = useCallback(
    (x: number): boolean => {
      const frame = Math.floor(x / pixelsPerFrame);
      return liteItems.some(
        (item) => frame >= item.startFrame && frame < item.startFrame + item.effectiveDuration
      );
    },
    [liteItems, pixelsPerFrame]
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
        MAX_PLACEHOLDER_DURATION_IN_FRAMES
      );

      setHoverInfo({
        layerId,
        startFrame: placeholderInfo.adjustedStartFrame,
        durationInFrames: placeholderInfo.duration,
        offsetFrames: placeholderInfo.offsetFrames,
        startX: placeholderInfo.adjustedStartFrame * pixelsPerFrame,
        width: placeholderInfo.duration * pixelsPerFrame,
      });
    },
    [liteItems, layerId, duration, pixelsPerFrame, isPointWithinItem, draggingLayerId]
  );

  const throttledMouseMove = useThrottle(handleBackgroundLayerMouseMove, 20);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const handleAddNewItem = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const startFrame = Math.floor(x / pixelsPerFrame);

      const { adjustedStartFrame, duration: placeholderDuration } = calculatePlaceholderDuration(
        liteItems,
        startFrame,
        duration,
        MAX_PLACEHOLDER_DURATION_IN_FRAMES
      );

      const newItemId = genId("s", newItemType);

      addSequenceItemToLayer(layerId, {
        id: newItemId,
        sequenceType: "standalone",
        contentType: "text", // TODO : hardcoded for now
        startFrame: adjustedStartFrame,
        effectiveDuration: placeholderDuration,
        sequenceDuration: placeholderDuration, // Assuming no transitions initially
        offset: hoverInfo?.offsetFrames ?? 0,
      });
      setActiveSeqItem(layerId, newItemId, newItemType);
    },
    [
      layerId,
      addSequenceItemToLayer,
      pixelsPerFrame,
      hoverInfo?.offsetFrames,
      duration,
      setActiveSeqItem,
      newItemType,
      liteItems,
    ]
  );

  const mouseEventHandlers = useMemo(
    () => ({
      onMouseMove: throttledMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleAddNewItem,
    }),
    [throttledMouseMove, handleMouseLeave, handleAddNewItem]
  );

  return {
    hoverInfo,
    isPointWithinItem,
    mouseEventHandlers,
  };
}
//TODO:  not using this hook, the code of the hooks can be better
const useItemResize = (
  pixelsPerFrame: number,
  updateSequenceItemDuration: StoreType["updateSequenceItemDuration"]
) => {
  const {
    props: { layers },
  } = useVideoStore();

  const handleItemResize = useCallback(
    (
      layerId: LayerId,
      itemId: string,

      frameDelta: number,
      direction: "left" | "right"
    ) => {
      const layer = layers[layerId];
      if (!layer) return;

      const item = layer.liteItems.find((liteItem) => liteItem.id === itemId);
      if (!item) return;
      /*
   put the conditions here
   */
      updateSequenceItemDuration(layerId, item.id, frameDelta, direction as "left" | "right");
    },
    [layers, updateSequenceItemDuration]
  );

  // Use a more aggressive throttle for drag operations
  return useThrottle(handleItemResize, 50);
};
