import { useMemo } from "react";
import { useTimeline } from "~/context/useTimeline";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import useVideoStore from "~/store/video.store";
import PlayHead from "./video-timeline/playhead";

const { TIME_LAYER_RIGHT_OFFSET } = TIMELINE;

const TimeLayer = () => {
  const { containerWidth, handleTimeLayerClick, view, activeCaptionData } =
    useTimeline();

  const width = containerWidth - TIME_LAYER_RIGHT_OFFSET;

  const compositionDurationInFrames = useVideoStore(
    (state) => state.props.compositionMetaData.duration,
  );

  const timelineDurationInFrames =
    view === "caption-edit" && activeCaptionData?.videoItemId
      ? activeCaptionData.durationInFrames
      : compositionDurationInFrames;
  const fps = useVideoStore((state) => state.props.compositionMetaData.fps);

  const timeMarkers = useMemo(() => {
    const durationInSeconds = Math.ceil(timelineDurationInFrames / fps);
    const minDesiredMarkers = 5;
    const maxDesiredMarkers = 20;

    // Calculate the ideal interval
    let interval = 1;
    while (durationInSeconds / interval > maxDesiredMarkers) {
      interval *= 2;
    }
    while (durationInSeconds / interval < minDesiredMarkers) {
      interval /= 2;
    }

    // Round the interval to a nice number
    interval = Math.max(1, Math.round(interval));

    const markers = [];
    for (let i = 0; i <= durationInSeconds; i += interval) {
      markers.push({
        time: i,
        position: (i * fps * width) / timelineDurationInFrames,
      });
    }

    return markers;
  }, [timelineDurationInFrames, fps, width]);

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div
      onClick={handleTimeLayerClick}
      className="relative z-10 w-full border-t bg-black text-[8px] text-gray-500"
    >
      {timeMarkers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex select-none flex-col items-center pl-2"
          style={{
            left: `${marker.position}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="h-2 w-px bg-gray-400" />
          <span>{formatTime(marker.time)}</span>
        </div>
      ))}
      {/* -------------------------- Playhead -------------------------- */}
      <PlayHead />
    </div>
  );
};

export default TimeLayer;
