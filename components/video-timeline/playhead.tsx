import { Rnd } from "react-rnd";
import { useTimeline } from "~/context/useTimeline";
import { LAYOUT } from "~/lib/constants/layout.constants";
const {
  TIMELINE: { PLAY_HEAD_WIDTH_IN_PX },
} = LAYOUT;

const PlayHead = () => {
  const {
    handlePlayheadDrag,
    playheadPosition,
    containerRef,
    zoom,
    containerWidth,
  } = useTimeline(); // Remove scrollPosition

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: PLAY_HEAD_WIDTH_IN_PX,
        height: 100,
      }}
      position={playheadPosition}
      dragAxis="x"
      bounds="parent"
      enableResizing={false}
      onDrag={(e, data) => {
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const rightEdge = data.x + PLAY_HEAD_WIDTH_IN_PX;
          const leftEdge = data.x;

          // Bound check against total width
          const maxX = containerWidth * zoom - PLAY_HEAD_WIDTH_IN_PX;
          const boundedX = Math.max(0, Math.min(data.x, maxX));

          // Scroll logic
          const scrollSpeed = Math.ceil(zoom * 5);
          const scrollTriggerMargin = 100;

          if (rightEdge > containerRect.width - scrollTriggerMargin) {
            container.scrollLeft += scrollSpeed;
          }
          if (leftEdge < scrollTriggerMargin) {
            container.scrollLeft -= scrollSpeed;
          }

          // Pass the actual position for frame calculation
          handlePlayheadDrag?.(e, { ...data, x: boundedX });
        }
      }}
      dragHandleClassName="playhead-handle"
    >
      <div className="absolute left-0 top-4 flex h-full w-full flex-col items-center rounded-xl">
        <div className="playhead-handle -mb-px size-4 cursor-grab rounded-full border border-indigo-500 bg-indigo-600 transition-all hover:size-5" />
        <div className="h-full w-full border border-indigo-500 bg-indigo-600" />
      </div>
    </Rnd>
  );
};

export default PlayHead;
