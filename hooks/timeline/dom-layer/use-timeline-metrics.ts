import { useCallback, useEffect, useRef, useState } from "react";

interface TimelineMetricsOptions {
  durationInFrames: number;
  initialZoom?: number;
}

export const useTimelineMetrics = ({
  durationInFrames,
  initialZoom = 1,
}: TimelineMetricsOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  const pixelsPerFrame = (containerWidth / durationInFrames) * zoom;

  const frameToPixels = useCallback(
    (frame: number) => {
      return frame * pixelsPerFrame;
    },
    [pixelsPerFrame],
  );

  const pixelsToFrame = useCallback(
    (pixels: number) => {
      return Math.round(pixels / pixelsPerFrame);
    },
    [pixelsPerFrame],
  );

  const setTimelineZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  return {
    containerRef,
    containerWidth,
    pixelsPerFrame,
    frameToPixels,
    pixelsToFrame,
    setTimelineZoom,
    zoom,
  };
};
