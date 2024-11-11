"use client";

import { LAYOUT } from "~/lib/constants/layout.constants";
import type { LayerType } from "~/types/timeline.types";

import { MoveLeft } from "lucide-react";
import { useRef } from "react";
import { useTimeline } from "~/context/useTimeline";
import TimeLayer from "../time-layer";
import Layer, { HoverLayer } from "./layer";
import LayerNamesStack from "./layer-names-stack";
import LayerToolbar from "./layer-toolbar";
import { PlayHead2 } from "./playhead";

const {
  SIDE_NAVBAR_WIDTH,
  TIMELINE: {
    TRACK_LAYER_HEIGHT,
    TIMELINE_CONTAINER_HEIGHT,
    TRACK_LAYER_HEIGHT_IN_PX,
    LAYER_NAME_STACK_WIDTH,
  },
} = LAYOUT;

export const filterCaptionLayers = (
  orderedLayers: string[],
  layers: Record<string, LayerType>,
) => {
  return orderedLayers.filter(
    (layerId) => layers[layerId].layerType !== "caption",
  );
};

const VideoTimeline = ({ children }: { children: React.ReactNode }) => {
  const { containerRef, visibleLayerOrder, pixelsPerFrame, view, setView } =
    useTimeline();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="pattern-bg-black-orchid fixed bottom-0 right-0 border-t"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      {/* -------------------------TOOL BAR------------------------  */}
      {children}

      {/* TIMELINE BODY STARTS */}
      <div
        className="scrollbar-thumb-rounded-full relative flex overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/30 hover:scrollbar-thumb-gray-900/80"
        style={{
          height: "12rem",
        }}
        ref={scrollContainerRef}
      >
        {/* ------------------------- Layers section starts ------------------------  */}

        {/* ------------------------------ Left Section -----------------------------  */}
        <div className="sticky left-0 z-50">
          <div
            className="sticky left-0 top-0 z-30 border-b border-r border-t bg-black"
            style={{
              height: TRACK_LAYER_HEIGHT,
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            {view === "entire-timeline" ? (
              <LayerToolbar />
            ) : (
              <button
                onClick={() => {
                  setView("entire-timeline");
                }}
                className="flex h-full w-full items-center justify-center space-x-1 p-2 text-sm text-orange-500"
              >
                <MoveLeft size={14} className="" />
                <span className="">Timeline</span>
              </button>
            )}
          </div>

          <div
            className="h-fit divide-y divide-gray-800 border-r bg-black"
            style={{
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            <LayerNamesStack />
          </div>
        </div>

        {/* ------------------------------ Right Section -----------------------------  */}
        <div
          className="w-max flex-1"
          ref={containerRef}
          style={{
            height: (visibleLayerOrder.length + 1) * TRACK_LAYER_HEIGHT_IN_PX,
          }}
        >
          <div
            className="sticky top-0 z-10 flex-1 border-b"
            style={{
              height: TRACK_LAYER_HEIGHT,
            }}
          >
            <TimeLayer />
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0">
              {visibleLayerOrder.map((layerId) => (
                <div
                  key={layerId}
                  className="relative border-b"
                  style={{
                    height: TRACK_LAYER_HEIGHT_IN_PX,
                  }}
                >
                  <HoverLayer
                    key={layerId}
                    layerId={layerId}
                    pixelsPerFrame={pixelsPerFrame}
                  />
                </div>
              ))}
            </div>

            {visibleLayerOrder.map((layerId) => (
              <Layer key={layerId} layerId={layerId} />
            ))}
          </div>

          {/* ------------------------- PlayHead --------------------------  */}

          <PlayHead2
            scrollContainerRef={scrollContainerRef}
            trackLayerCount={visibleLayerOrder.length}
          />
        </div>
      </div>
    </section>
  );
};

const VideoTimeline1 = ({ children }: { children: React.ReactNode }) => {
  const { containerRef, view, setView, totalTimelineWidth } = useTimeline();
  return (
    <section
      className="pattern-bg-black-orchid fixed bottom-0 right-0 flex flex-col border-t"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      <div className="w-full border-b">
        {/* -------------------------TOOL BAR------------------------  */}
        {children}
      </div>

      {/* TIMELINE BODY STARTS */}
      <div className="flex flex-col">
        <div
          className="flex"
          style={{
            height: TRACK_LAYER_HEIGHT,
          }}
        >
          {/* Fixed left sidebar */}
          <div
            className="flex-shrink-0 divide-y divide-gray-800 border-r border-t"
            style={{
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            {view === "entire-timeline" ? (
              <LayerToolbar />
            ) : (
              <button
                onClick={() => {
                  setView("entire-timeline");
                }}
                className="flex h-full w-full items-center justify-center space-x-1 p-2 text-sm text-orange-500"
              >
                <MoveLeft size={14} className="" />
                <span className="">Timeline</span>
              </button>
            )}
          </div>
          <div
            className="relative flex flex-1 flex-col overflow-x-auto"
            ref={containerRef}
          >
            <div
              className="relative min-w-full"
              style={{
                width: totalTimelineWidth, // This should match TimeLayer's total width
              }}
            >
              <div
                className="sticky top-0 w-max"
                style={{
                  height: TRACK_LAYER_HEIGHT,
                }}
              >
                <TimeLayer />
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------- Layers section starts ------------------------  */}
      </div>
    </section>
  );
};

// const _VideoTimeline = ({ children }: { children: React.ReactNode }) => {
//   const { containerRef, view, setView, totalTimelineWidth } = useTimeline();

//   const handleWheel = useCallback((e: React.WheelEvent) => {
//     if (e.ctrlKey || e.metaKey) {
//       e.preventDefault();
//       // handleWheelZoom(e);
//     }
//   }, []);

//   return (
//     <section
//       className="pattern-bg-black-orchid fixed bottom-0 right-0 border-t"
//       style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
//     >
//       <div className="flex h-full flex-col">
//         {/* ------------------------- Sticky(absolute) section starts ------------------------  */}
//         <div className="w-full border-b">
//           {/* -------------------------TOOL BAR------------------------  */}
//           {children}

//           {/* ------------------------- TIME LAYER ------------------------  */}
//           <div
//             className="flex"
//             style={{
//               height: TRACK_LAYER_HEIGHT,
//             }}
//           >
//             {/* Fixed left sidebar */}
//             <div
//               className="flex-shrink-0 divide-y divide-gray-800 border-r border-t"
//               style={{
//                 width: LAYER_NAME_STACK_WIDTH,
//               }}
//             >
//               {view === "entire-timeline" ? (
//                 <LayerToolbar />
//               ) : (
//                 <button
//                   onClick={() => {
//                     setView("entire-timeline");
//                   }}
//                   className="flex h-full w-full items-center justify-center space-x-1 p-2 text-sm text-orange-500"
//                 >
//                   <MoveLeft size={14} className="" />
//                   <span className="">Timeline</span>
//                 </button>
//               )}
//             </div>

//             {/* Scrollable right section */}
//             <div
//               ref={containerRef}
//               className="flex-1 bg-red-500 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
//               onWheel={handleWheel}
//             >
//               <TimeLayer />
//             </div>
//           </div>
//         </div>

//         {/* ------------------------- Sticky(absolute) section ends ------------------------  */}

//         {/* ------------------------- Layers section starts ------------------------  */}
//         {view === "caption-edit" ? (
//           <CaptionEditView containerRef={containerRef} />
//         ) : (
//           <TimelineLayers containerRef={containerRef} />
//         )}
//       </div>
//     </section>
//   );
// };

export default VideoTimeline;

// components/timeline-layers-view.tsx
const TimelineLayers = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { pixelsPerFrame, visibleLayerOrder } = useTimeline();

  return (
    <div className="flex overflow-y-auto" id="layerContainer">
      {/* Left section */}
      <div
        className="h-fit divide-y divide-gray-800 border-r"
        style={{
          width: LAYER_NAME_STACK_WIDTH,
        }}
      >
        <LayerNamesStack />
      </div>

      {/* Right section */}
      <div
        className="relative flex-1"
        ref={containerRef}
        style={{
          height: visibleLayerOrder.length * TRACK_LAYER_HEIGHT_IN_PX,
        }}
      >
        <div className="absolute inset-0">
          {visibleLayerOrder.map((layerId) => (
            <div
              key={layerId}
              className="relative border-b"
              style={{
                height: TRACK_LAYER_HEIGHT_IN_PX,
              }}
            >
              <HoverLayer
                key={layerId}
                layerId={layerId}
                pixelsPerFrame={pixelsPerFrame}
              />
            </div>
          ))}
        </div>

        {visibleLayerOrder.map((layerId) => (
          <Layer key={layerId} layerId={layerId} />
        ))}
      </div>
    </div>
  );
};
