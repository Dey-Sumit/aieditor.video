import type { PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useState } from "react";

interface TimelineSyncProps {
  playerRef: React.RefObject<PlayerRef>;
  currentFrame: number;
  frameToPixels: (frame: number) => number;
  pixelsToFrame: (pixels: number) => number;
  containerWidth: number;
}

export const useTimelineSynchronization = ({
  playerRef,
  currentFrame,
  frameToPixels,
  pixelsToFrame,
  containerWidth,
}: TimelineSyncProps) => {
  const [playheadPosition, setPlayheadPosition] = useState({ x: 0, y: 0 });

  // Update playhead position based on current frame
  useEffect(() => {
    const newX = frameToPixels(currentFrame);
    setPlayheadPosition({ x: newX, y: 0 });
  }, [currentFrame, frameToPixels]);

  // Seek to frame based on timeline position
  const seekToFrame = useCallback(
    (frame: number) => {
      if (playerRef.current) {
        playerRef.current.seekTo(frame);
      }
    },
    [playerRef],
  );

  // Handle playhead drag
  const handlePlayheadDrag = useCallback(
    (_e: any, d: { x: number; y: number }) => {
      const newX = Math.max(0, Math.min(d.x, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });
      seekToFrame(pixelsToFrame(newX));
    },
    [containerWidth, pixelsToFrame, seekToFrame],
  );

  // Handle timeline click
  const handleTimeLayerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // TODO : Fix the optional chaining
      const containerRect = e.currentTarget?.getBoundingClientRect();
      const clickX = e.clientX - containerRect.left;
      const newX = Math.max(0, Math.min(clickX, containerWidth));
      setPlayheadPosition({ x: newX, y: 0 });
      seekToFrame(pixelsToFrame(newX));
    },
    [containerWidth, pixelsToFrame, seekToFrame],
  );

  return {
    playheadPosition,
    handlePlayheadDrag,
    handleTimeLayerClick,
    seekToFrame,
  };
};
