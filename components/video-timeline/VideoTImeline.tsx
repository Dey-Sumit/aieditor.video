"use client";
import React from "react";

import { useTimeline } from "~/context/useTimeline";
import TimeLayer from "../time-layer";
import LayerNamesStack from "./layer-names-stack";
import PlayHead from "./playhead";
import Toolbar from "./toolbar";
import Layer from "./layer";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { LAYERS_IN_ORDER } from "~/utils/timeline.utils";
import useVideoStore from "~/store/video.store";

const { LAYER_HEIGHT_IN_PX } = TIMELINE;

const VideoTimeline = () => {
  const { containerRef, handleTimelineClick, pixelsPerFrame } = useTimeline();
  const orderedLayers = useVideoStore((state) => state.props.layerOrder);
  return (
    <div className="flex h-full flex-col justify-end">
      <Toolbar />
      {/* <Toolbar />
      <Toolbar /> */}
      <div className="relative flex">
        {/* ----- left section of the timeline: includes name,helper buttons, etc ----*/}
        <div className="w-32 flex-shrink-0 divide-y divide-gray-800 border-r">
          {/* ------------------------- FAKE DIV FOR TIME LAYER ------------------------  */}
          <div style={{ height: `${LAYER_HEIGHT_IN_PX}px` }} />

          {/* -------------------------- Stack of Main Layers Names -------------------------- */}
          <LayerNamesStack />
        </div>

        {/* ----- right section of the timeline: includes sequences, play-head, etc ----*/}
        <div
          ref={containerRef}
          className="relative flex-grow divide-y"
          onClick={handleTimelineClick}
        >
          {/* ------------------------- TIME LAYER ------------------------  */}
          <TimeLayer />

          {/* -------------------------- Stack of Main Layers -------------------------- */}
          {orderedLayers.map((layerId) => (
            <Layer
              key={layerId}
              layerId={layerId}
              pixelsPerFrame={pixelsPerFrame}
            />
          ))}

          {/* -------------------------- Playhead -------------------------- */}
          <PlayHead />
        </div>
      </div>
    </div>
  );
};

export default VideoTimeline;
