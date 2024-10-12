"use client";

import { useTimeline } from "~/context/useTimeline";
import { LAYOUT } from "~/lib/constants/layout.constants";
import useVideoStore from "~/store/video.store";
import TimeLayer from "../time-layer";
import Layer, { HoverLayer } from "./layer";
import LayerNamesStack from "./layer-names-stack";
import LayerToolbar from "./layer-toolbar";
import Toolbar from "./toolbar";

const {
  SIDE_NAVBAR_WIDTH,
  TIMELINE: {
    TRACK_LAYER_HEIGHT,
    TIMELINE_CONTAINER_HEIGHT,

    LAYER_NAME_STACK_WIDTH,
  },
} = LAYOUT;

const VideoTimeline = () => {
  const { containerRef, pixelsPerFrame } = useTimeline();
  const orderedLayers = useVideoStore((state) => state.props.layerOrder);

  return (
    <section
      className="pattern-bg-black-orchid fixed bottom-0 right-0 border-t"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      <div className="flex h-full flex-col">
        {/* ------------------------- Sticky(absolute) section starts ------------------------  */}
        <div className="w-full border-b">
          <Toolbar />
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
              <LayerToolbar />
            </div>

            <TimeLayer />
          </div>
        </div>

        {/* ------------------------- Sticky(absolute) section ends ------------------------  */}

        {/* ------------------------- Layers section starts ------------------------  */}

        <div className="flex overflow-y-auto overscroll-contain">
          {/* ----- left section of the timeline: includes name,helper buttons, etc ----*/}
          <div
            className="h-fit divide-y divide-gray-800 border-r"
            style={{
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            {/* -------------------------- Stack of Main Layers Names -------------------------- */}
            <LayerNamesStack />
          </div>

          {/* ----- right section of the timeline: includes sequences, play-head, etc ----*/}
          <div className="relative flex flex-1" ref={containerRef}>
            {/* -------------------------- Background Layer for handing clicks and hover -------------------------- */}
            <div className="absolute inset-0">
              {orderedLayers.map((layerId) => (
                <div key={layerId} className="relative h-8 border">
                  <HoverLayer
                    key={layerId}
                    layerId={layerId}
                    pixelsPerFrame={pixelsPerFrame}
                  />
                </div>
              ))}
            </div>

            <>
              {/* -------------------------- Stack of Main Layers -------------------------- */}
              {orderedLayers.map((layerId) => (
                <Layer
                  key={layerId}
                  layerId={layerId}
                  pixelsPerFrame={pixelsPerFrame}
                />
              ))}
            </>
          </div>
        </div>
        {/* ------------------------- Layers section ends ------------------------  */}
      </div>
    </section>
  );
};

export default VideoTimeline;
