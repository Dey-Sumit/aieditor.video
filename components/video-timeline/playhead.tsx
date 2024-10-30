import { Rnd } from "react-rnd";
import { useTimeline } from "~/context/useTimeline";
import { LAYOUT } from "~/lib/constants/layout.constants";
const {
  TIMELINE: { PLAY_HEAD_WIDTH_IN_PX },
} = LAYOUT;

const PlayHead = () => {
  const { handlePlayheadDrag, playheadPosition } = useTimeline();
  return (
    <Rnd
      default={{
        x: 10,
        y: 0,
        width: PLAY_HEAD_WIDTH_IN_PX,
        height: 400,
      }}
      dragAxis="x"
      bounds="parent"
      enableResizing={false}
      position={playheadPosition}
      onDrag={handlePlayheadDrag}
      dragHandleClassName="playhead-handle"
    >
      <div className="absolute -top-4 left-0 flex h-full w-full flex-col items-center rounded-xl">
        <div className="playhead-handle -mb-px size-4 cursor-grab rounded-full border border-indigo-500 bg-indigo-600 transition-all hover:size-5" />
        <div className="h-full w-full border border-indigo-500 bg-indigo-600" />
      </div>
    </Rnd>
  );
};

export default PlayHead;
