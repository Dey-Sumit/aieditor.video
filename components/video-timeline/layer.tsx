/* eslint-disable react/display-name */
import React from "react";
import { useSequenceAddition } from "~/hooks/use-video-timeline";
import { LAYOUT } from "~/lib/constants/layout.constants";
import { selectLiteItems } from "~/store/reselector/video-store.reselector";
import useVideoStore from "~/store/video.store";
import type { LayerId } from "~/types/timeline.types";
import AddItemContextMenu from "./add-item-context-menu";
import AddItemPlaceholder from "./add-item-placeholder";
import SequenceItem from "./sequence-item";

interface LayerProps {
  layerId: LayerId;
  pixelsPerFrame: number;
}
const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;
const Layer: React.FC<LayerProps> = React.memo(
  ({ layerId, pixelsPerFrame }) => {
    const liteItems = useVideoStore((state) => selectLiteItems(state, layerId));

    return (
      <>
        {/* ----------------------------- Sequence Items ----------------------------- */}
        {liteItems.map((item) => {
          const nextItemStartFrame =
            liteItems[liteItems.indexOf(item) + 1]?.startFrame; // TODO : can be optimized
          return (
            <SequenceItem
              key={item.id}
              item={item}
              layerId={layerId}
              nextItemStartFrame={nextItemStartFrame}
            />
          );
        })}
      </>
    );
  },
);

export default Layer;

interface HoverLayerProps {
  layerId: LayerId;
  pixelsPerFrame: number;
}

export const HoverLayer: React.FC<HoverLayerProps> = React.memo(
  ({ layerId, pixelsPerFrame }) => {
    const {
      hoverInfo,
      mouseEventHandlers: { onMouseMove, onMouseLeave, onClick },
      isPointWithinItem,
    } = useSequenceAddition(layerId, pixelsPerFrame);

    return (
      <>
        <AddItemContextMenu layerId={layerId} onPresetAdd={onClick}>
          {/* -------------------------- Background Layer for handing clicks and hover -------------------------- */}

          <div
            className="absolute inset-0"
            style={{ height: TRACK_LAYER_HEIGHT_IN_PX }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
              onClick(e, {
                sequenceType: "standalone",
              });
            }}
          />
          {/* -------------------------- Item adding placeholder for handing clicks and hover -------------------------- */}

          {hoverInfo && !isPointWithinItem(hoverInfo.startX) && (
            <AddItemPlaceholder
              startX={hoverInfo.startX}
              width={hoverInfo.width}
            />
          )}
        </AddItemContextMenu>
      </>
    );
  },
);

HoverLayer.displayName = "HoverLayer";
