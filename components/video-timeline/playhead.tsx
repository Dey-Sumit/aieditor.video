import { Rnd } from "react-rnd";
import { useTimeline } from "~/context/useTimeline";
import { TIMELINE } from "~/lib/constants/timeline.constants";
const { PLAY_HEAD_WIDTH, LAYER_HEIGHT_IN_PX } = TIMELINE;

const PlayHead = () => {
  const { handlePlayheadDrag, playheadPosition } = useTimeline();
  return (
    <Rnd
      default={{
        x: 10,
        y: 0,
        width: PLAY_HEAD_WIDTH,
        height: `${LAYER_HEIGHT_IN_PX * 7 + 16}px`, // 5 layers + TOP_OFFSET (-top-4) for the time layer
      }}
      dragAxis="x"
      bounds="parent"
      enableResizing={false}
      position={playheadPosition}
      onDrag={handlePlayheadDrag}
      dragHandleClassName="playhead-handle"
    >
      <div className="absolute -top-4 left-0 flex h-full w-full flex-col items-center rounded-xl ">
        <div className="playhead-handle cursor-grab size-4  rounded-full border border-indigo-500 bg-indigo-700" />
        <div className="h-full w-full border border-indigo-700 bg-indigo-600" />
      </div>
    </Rnd>
  );
};

export default PlayHead;
