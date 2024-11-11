"use client";

import { LAYOUT } from "~/lib/constants/layout.constants";
import type { LayerType } from "~/types/timeline.types";

import { MoveLeft } from "lucide-react";
import { useCallback } from "react";
import { useTimeline } from "~/context/useTimeline";
import CaptionEditView from "../layout/editor-new/caption-editor-view";
import TimeLayer from "../time-layer";
import Layer, { HoverLayer } from "./layer";
import LayerNamesStack from "./layer-names-stack";
import LayerToolbar from "./layer-toolbar";
const {
  TIMELINE: { PLAY_HEAD_WIDTH_IN_PX },
} = LAYOUT;
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
      <div className="relative flex flex-1 flex-col">
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
        {view === "caption-edit" ? (
          <CaptionEditView containerRef={containerRef} />
        ) : (
          <TimelineLayers containerRef={containerRef} />
        )}
      </div>
    </section>
  );
};

const _VideoTimeline = ({ children }: { children: React.ReactNode }) => {
  const { containerRef, view, setView, totalTimelineWidth } = useTimeline();

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // handleWheelZoom(e);
    }
  }, []);

  return (
    <section
      className="pattern-bg-black-orchid fixed bottom-0 right-0 border-t"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      <div className="flex h-full flex-col">
        {/* ------------------------- Sticky(absolute) section starts ------------------------  */}
        <div className="w-full border-b">
          {/* -------------------------TOOL BAR------------------------  */}
          {children}

          {/* ------------------------- TIME LAYER ------------------------  */}
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

            {/* Scrollable right section */}
            <div
              ref={containerRef}
              className="flex-1 -overflow-x-auto -overscroll-contain bg-red-500 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
              onWheel={handleWheel}
            >
              <TimeLayer />
            </div>
          </div>
        </div>

        {/* ------------------------- Sticky(absolute) section ends ------------------------  */}

        {/* ------------------------- Layers section starts ------------------------  */}
        {view === "caption-edit" ? (
          <CaptionEditView containerRef={containerRef} />
        ) : (
          <TimelineLayers containerRef={containerRef} />
        )}
      </div>
    </section>
  );
};

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
