/* eslint-disable react/display-name */
import React from "react";
import { useSequenceAddition } from "~/hooks/use-video-timeline";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { selectliteItems } from "~/store/reselector/video-store.reselector";
import useVideoStore from "~/store/video.store";
import { LayerId } from "~/types/timeline.types";
import SequenceItem from "./sequence-item";
import AddItemPlaceholder from "./add-item-placeholder";

const { LAYER_HEIGHT_IN_PX } = TIMELINE;
interface LayerProps {
  layerId: LayerId;
  pixelsPerFrame: number;
}

const Layer: React.FC<LayerProps> = React.memo(({ layerId, pixelsPerFrame }) => {
  const liteItems = useVideoStore((state) => selectliteItems(state, layerId));

  return (
    <div className="group relative" style={{ height: LAYER_HEIGHT_IN_PX }}>
      <HoverLayer layerId={layerId} pixelsPerFrame={pixelsPerFrame} />

      {/* Sequence Items */}
      {liteItems.map((item) => {
        const nextItemStartFrame = liteItems[liteItems.indexOf(item) + 1]?.startFrame; // TODO : can be optimized
        return (
          <SequenceItem
            key={item.id}
            item={item}
            layerId={layerId}
            nextItemStartFrame={nextItemStartFrame}
          />
        );
      })}
    </div>
  );
});

export default Layer;

interface HoverLayerProps {
  layerId: LayerId;
  pixelsPerFrame: number;
}

const HoverLayer: React.FC<HoverLayerProps> = React.memo(({ layerId, pixelsPerFrame }) => {
  const { hoverInfo, mouseEventHandlers, isPointWithinItem } = useSequenceAddition(
    layerId,
    pixelsPerFrame
  );

  return (
    <>
      {/* -------------------------- Background Layer for handing clicks and hover -------------------------- */}

      <div className="absolute inset-0" {...mouseEventHandlers} />
      {/* -------------------------- Item adding placeholder for handing clicks and hover -------------------------- */}

      {hoverInfo && !isPointWithinItem(hoverInfo.startX) && (
        <AddItemPlaceholder startX={hoverInfo.startX} width={hoverInfo.width} />
      )}
    </>
  );
});

HoverLayer.displayName = "HoverLayer";
