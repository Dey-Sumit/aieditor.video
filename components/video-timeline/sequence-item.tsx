import React, { ComponentProps } from "react";
import { Rnd } from "react-rnd";
import { useTimeline } from "~/context/useTimeline";
import { cn } from "~/lib/utils";

import SequenceContextMenuWrapper from "../sequence-context-menu";
import { ArrowRightLeft } from "lucide-react";
import { LayerId, LiteSequenceItemType } from "~/types/timeline.types";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
export const getItemStyle = (type: string) => {
  switch (type) {
    case "audio":
      return "bg-blue-500 border-blue-600 ";
    case "caption":
      return "bg-green-600 border-green-600";
    case "text":
      return "bg-yellow-600/60 border-yellow-600";
    case "video":
      return "bg-pink-600/60 border-pink-600 ";
    case "image":
      return "bg-purple-600 border-purple-600/70 ";
    case "preset":
      return "bg-gray-200 border-indigo-500 border-dashed pr-[2px] border  ";
    default:
      return "bg-gray-600 border-gray-600";
  }
};

const SequenceItem = ({
  item,
  layerId,
  nextItemStartFrame,
}: {
  item: LiteSequenceItemType;
  layerId: LayerId;
  nextItemStartFrame: number | undefined;
}) => {
  const { throttledItemDrag, pixelsPerFrame, setDraggingLayerId } = useTimeline();
  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);
  const activeSeqItem = useEditingStore((state) => state.activeSeqItem);
  const updateSequenceItemDuration = useVideoStore((state) => state.updateSequenceItemDuration);

  /* The adjustment of the x position is to account for the transition duration.
   -  without transition : seq1 0 to 120: duration 120 frames, seq2 120 to 210 : duration 90 frames
   - with transition of 30 frames : seq1 0 to (120+15 outgoing) 135: duration 135 frames, seq2 135(120+15 incoming) to 210 : duration 75 frames
  */

  const x = (item.startFrame + (item.transition?.incoming?.duration || 0)) * pixelsPerFrame;

  const width =
    (item.sequenceDuration -
      (item.transition?.incoming?.duration || 0) -
      (item.transition?.outgoing?.duration || 0)) *
    pixelsPerFrame;

  const onDragStart = () => {
    
    setDraggingLayerId(layerId);
  };

  const onDragStop: ComponentProps<typeof Rnd>["onDragStop"] = (e, d) => {

    if (d.x !== x) throttledItemDrag(layerId, item.id, d.x);
    setDraggingLayerId(null);
  };

  const onResizeStop: ComponentProps<typeof Rnd>["onResizeStop"] = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    
    const frameDelta = Math.floor(delta.width / pixelsPerFrame);

    if (direction === "left" && frameDelta > item.offset) {
      return;
    } else if (
      direction === "right" &&
      nextItemStartFrame &&
      frameDelta + item.startFrame + item.effectiveDuration > nextItemStartFrame
    ) {
      return;
    }

    updateSequenceItemDuration(
      layerId,
      item.id,
      // item.offset,
      frameDelta,
      direction as "left" | "right"
    );
  };
  return (
    <Rnd
      key={item.id}
      bounds="parent"
      position={{
        x,
        y: 2,
      }}
      size={{
        width,
        height: "96%",
      }}
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: true,
        right: true,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      dragAxis="x"
      onDragStop={onDragStop}
      onDragStart={onDragStart}
      onResizeStop={onResizeStop}
      className={cn(
        "box-border cursor-pointer rounded-md border-2 pl-px hover:opacity-90 focus:bg-yellow-800",
        getItemStyle(item.sequenceType === "standalone" ? item.contentType : item.sequenceType),
        activeSeqItem?.itemId === item.id && "border-blue-400"
      )}
      dragGrid={[pixelsPerFrame, 0]}
    >
      <SequenceContextMenuWrapper
        key={item.id}
        layerId={layerId}
        itemId={item.id}
        transition={item.transition}
      >
        <button
          className="relative flex h-full w-full items-center justify-center truncate px-2 text-sm font-medium text-white"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSeqItem(layerId, item.id, "text"); // TODO : Fix this
          }}
        >
          {item.sequenceType === "preset" ? (
            <PresetItem
              liteItems={item.liteItems}
              layerId={layerId}
              pixelsPerFrame={pixelsPerFrame}
            />
          ) : (
            item.id.slice(0, 6)
          )}
        </button>

        {/* --------------------------- Transition Element --------------------------- */}
        {item.transition?.incoming && (
          <button
            className="absolute left-0 top-0 z-10 flex h-full items-center justify-center rounded-[4px] border border-green-200 bg-gradient-to-r from-green-500/80 to-green-500/80"
            style={{
              width: item.transition?.incoming.duration * 2 * pixelsPerFrame,
              left: -(item.transition?.incoming.duration * pixelsPerFrame),
            }}
          >
            <ArrowRightLeft size={16} className="-ml-1 text-white" />
          </button>
        )}
      </SequenceContextMenuWrapper>
    </Rnd>
  );
};

export default SequenceItem;

const PresetItem = ({
  liteItems,
  layerId,
  pixelsPerFrame,
}: {
  liteItems: LiteSequenceItemType[];
  layerId: LayerId;
  pixelsPerFrame: number;
}) => {
  return (
    <>
      {liteItems.map((item) => {
        const x = (item.startFrame + (item.transition?.incoming?.duration || 0)) * pixelsPerFrame;

        const width =
          (item.sequenceDuration -
            (item.transition?.incoming?.duration || 0) -
            (item.transition?.outgoing?.duration || 0)) *
          pixelsPerFrame;

        return (
          <Rnd
            key={item.id}
            bounds="parent"
            position={{
              x,
              y: 1,
            }}
            size={{
              width,
              height: "96%",
            }}
            enableResizing={false}
            dragAxis="x"
            className={cn(
              "box-border cursor-pointer select-none  rounded-sm border-2 hover:opacity-90 focus:bg-yellow-800",
              getItemStyle(
                item.sequenceType === "standalone" ? item.contentType : item.sequenceType
              )
            )}
            dragGrid={[1, 0]}
          >
            {item.id}
            {/* --------------------------- Transition Element --------------------------- */}
            {item.transition?.incoming && (
              <button
                className="absolute left-0 top-0 z-10 flex h-full select-none items-center justify-center rounded-[4px] border border-green-200 bg-gradient-to-r from-green-500/80 to-green-500/80"
                style={{
                  width: item.transition?.incoming.duration * 2 * pixelsPerFrame,
                  left: -(item.transition?.incoming.duration * pixelsPerFrame),
                }}
              >
                <ArrowRightLeft size={16} className="-ml-1 text-white" />
              </button>
            )}
          </Rnd>
        );
      })}
    </>
  );
};
