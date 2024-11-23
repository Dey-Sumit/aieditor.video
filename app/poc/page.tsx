"use client";
import { useRef } from "react";

import { PlayHead2 } from "~/components/video-timeline/playhead";

const LAYOUT = {
  SIDE_NAVBAR_WIDTH: "4rem",
  NAVBAR_ITEM_CONTENT_WIDTH: "20rem",
  TIMELINE: {
    TIMELINE_CONTAINER_HEIGHT: "15rem",
    TRACK_LAYER_HEIGHT: "2.1rem",
    TRACK_LAYER_HEIGHT_IN_PX: Math.ceil(2.1 * 16),
    UTILS_LAYER_HEIGHT: "1.8rem",
    LAYER_NAME_STACK_WIDTH: "8rem",
    PLAY_HEAD_WIDTH_IN_PX: 4,
  },
  PROJECT_HEADER_HEIGHT: "3.5rem",
} as const;
const {
  SIDE_NAVBAR_WIDTH,
  TIMELINE: {
    TRACK_LAYER_HEIGHT,
    TIMELINE_CONTAINER_HEIGHT,
    LAYER_NAME_STACK_WIDTH,
  },
} = LAYOUT;

const Page = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <section
      className="pattern-bg-black-orchid text-sm"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      {/* TIMELINE BODY STARTS */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-thumb-rounded-full relative flex h-52 overflow-x-auto overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/30 hover:scrollbar-thumb-gray-900/80"
      >
        {/* ------------------------- Layers section starts ------------------------  */}

        {/* ------------------------------ Left Section -----------------------------  */}
        <div className="sticky left-0 z-30">
          <div
            className="sticky left-0 top-0 border-b border-r bg-red-600"
            style={{
              height: TRACK_LAYER_HEIGHT,
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            Layer Tools
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-r bg-black p-1"
              style={{
                height: TRACK_LAYER_HEIGHT,
                width: LAYER_NAME_STACK_WIDTH,
              }}
            >
              Layer Name {i}
            </div>
          ))}
        </div>

        {/* ------------------------------ Right Section -----------------------------  */}
        <div className="w-full min-w-[1920px] bg-green-950">
          <div
            className="sticky top-0 z-10 flex-1 border-b bg-yellow-500"
            style={{
              height: TRACK_LAYER_HEIGHT,
            }}
          >
            Time Layer
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-b bg-purple-600 p-1"
              style={{
                height: TRACK_LAYER_HEIGHT,
              }}
            >
              Sequence Layer {i}
            </div>
          ))}

          {/* ------------------------- PlayHead --------------------------  */}
          {/* <div
            className="absolute left-96 z-30 w-2 bg-red-500"
            style={{
              height: "12rem",
              top: "16px",
            }}
          ></div> */}
          {/* <PlayHead2 scrollContainerRef={scrollContainerRef} /> */}
        </div>
      </div>
    </section>
  );
};

export default Page;
