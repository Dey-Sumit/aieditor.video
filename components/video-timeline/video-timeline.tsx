"use client";

import { ArrowLeft } from "lucide-react";
import { useCaptionEdit } from "~/context/caption-edit-context";
import { LAYOUT } from "~/lib/constants/layout.constants";
import type { LayerType } from "~/types/timeline.types";

import { useTimeline } from "~/context/useTimeline";
import CaptionEditView from "../layout/editor-new/captione-editor-view";
import TimeLayer from "../time-layer";
import { Button } from "../ui/button";
import Layer, { HoverLayer } from "./layer";
import LayerNamesStack from "./layer-names-stack";
import LayerToolbar from "./layer-toolbar";

const {
  SIDE_NAVBAR_WIDTH,
  TIMELINE: {
    TRACK_LAYER_HEIGHT,
    TIMELINE_CONTAINER_HEIGHT,
    TRACK_LAYER_HEIGHT_IN_PX,
    LAYER_NAME_STACK_WIDTH,
  },
} = LAYOUT;

// utils/layer.utils.ts
export const filterCaptionLayers = (
  orderedLayers: string[],
  layers: Record<string, LayerType>,
) => {
  return orderedLayers.filter(
    (layerId) => layers[layerId].layerType !== "caption",
  );
};

const VideoTimeline = ({ children }: { children: React.ReactNode }) => {
  const { containerRef } = useTimeline();
  const { view, setView } = useCaptionEdit();
  // Filter out caption layers

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
            <div
              className="flex-shrink-0 divide-y divide-gray-800 border-r border-t"
              style={{
                width: LAYER_NAME_STACK_WIDTH,
              }}
            >
              {view === "entire-timeline" ? (
                <LayerToolbar />
              ) : (
                <div>
                  <Button
                    onClick={() => {
                      setView("entire-timeline");
                    }}
                    size="sm"
                    variant="ghost"
                    className="flex items-center space-x-1 rounded-none p-1"
                  >
                    <ArrowLeft size={16} />
                    <span className="text-xs">Back To Timeline</span>
                  </Button>
                </div>
              )}
            </div>

            <TimeLayer />
          </div>
        </div>

        {/* ------------------------- Sticky(absolute) section ends ------------------------  */}

        {/* ------------------------- Layers section starts ------------------------  */}
        {view === "caption-edit" ? (
          <CaptionEditView containerRef={containerRef} />
        ) : (
          <TimelineLayers containerRef={containerRef} />
        )}

        {/* ------------------------- Layers section ends ------------------------  */}
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
  const { pixelsPerFrame } = useTimeline();

  const { visibleLayerOrder } = useCaptionEdit();

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
