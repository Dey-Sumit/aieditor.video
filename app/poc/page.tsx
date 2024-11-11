"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { RefObject } from "react";
import { PlayHead2 } from "~/components/video-timeline/playhead";
import useThrottle from "~/hooks/use-throttle";

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
          <PlayHead2 scrollContainerRef={scrollContainerRef} />
        </div>
      </div>
    </section>
  );
};

const _Page = () => {
  return (
    <section
      className="pattern-bg-black-orchid text-sm"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      {/* TIMELINE BODY STARTS */}
      <div className="relative">
        {/* Wrapper div for scroll container */}
        <div className="scrollbar-thumb-rounded-full relative flex h-52 overflow-x-auto overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/30 hover:scrollbar-thumb-gray-900/80">
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
          </div>
        </div>

        {/* ------------------------- PlayHead --------------------------  */}
        {/* Moved outside the scroll container but inside a relative parent */}
        <div
          className="pointer-events-none absolute bottom-0 left-96 top-0 w-2 bg-red-500"
          style={{
            height: TIMELINE_CONTAINER_HEIGHT,
          }}
        ></div>
      </div>
    </section>
  );
};

export default Page;

interface PlayHeadProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  leftPosition?: string;
  initialTop?: number;
  height?: string;
}

interface PlayHeadProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  leftPosition?: string;
  initialTop?: number;
  height?: string;
  layers?: number;
  trackHeight?: string;
}

const PlayHead1: React.FC<PlayHeadProps> = ({
  scrollContainerRef,
  leftPosition = "96",
  initialTop = 0,
  height = "15rem",
  layers = 10,
  trackHeight = "2.1rem",
}) => {
  // Constants
  // 16 is used to convert rem to pixels (1rem = 16px in standard browser settings)
  const REM_TO_PX_RATIO = 16;
  // Target 60fps for smooth animation (1000ms / 60 ≈ 16.67ms)
  const THROTTLE_MS = 16;

  const [scrollTop, setScrollTop] = useState<number>(initialTop);

  /**
   * Calculate maximum scrollable height based on content
   * @returns Maximum scroll value in pixels
   */
  const maxScroll = useCallback(() => {
    if (!scrollContainerRef.current) return 0;

    // Get the visible height of the scroll container
    const containerHeight = scrollContainerRef.current.clientHeight;

    // Calculate total content height:
    // - Convert trackHeight from rem to px
    // - Multiply by total number of rows (layers + 1 for header)
    const contentHeight =
      parseFloat(trackHeight) * REM_TO_PX_RATIO * (layers + 1);

    // Maximum scroll is the difference between content and container height
    // (or 0 if content is shorter than container)
    return Math.max(0, contentHeight - containerHeight);
  }, [layers, trackHeight]);

  /**
   * Update playhead position based on current scroll position
   * Ensures scroll position stays within bounds
   */
  const updateScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Limit scroll to maximum scrollable height
    const currentScroll = Math.min(container.scrollTop, maxScroll());

    // Update playhead position:
    // - Start from initialTop position
    // - Add current scroll amount to move with content
    setScrollTop(initialTop + currentScroll);
  }, [initialTop, maxScroll]);

  // Throttle scroll updates for performance while maintaining smooth animation
  const throttledScrollHandler = useThrottle(updateScrollPosition, THROTTLE_MS);

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", throttledScrollHandler);

    // Clean up event listener on unmount
    return () =>
      container.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  return (
    <div
      className={`absolute left-${leftPosition} z-20 w-2 bg-red-500`}
      style={{
        height,
        top: `${scrollTop}px`,
      }}
    />
  );
};
