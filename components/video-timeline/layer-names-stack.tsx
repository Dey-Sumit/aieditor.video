"use client";

import { TIMELINE } from "~/lib/constants/timeline.constants";
import useVideoStore from "~/store/video.store";

const { LAYER_HEIGHT_IN_PX } = TIMELINE;

import { Reorder, useDragControls } from "framer-motion";
import { EyeOff, GripVertical } from "lucide-react";
import React, { useRef } from "react";
import type { LayerType } from "~/types/timeline.types";
import LayerContentMenuWrapper from "../layer-context-menu-wrapper";

interface LayerItemProps {
  layer: LayerType;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

const LayerItem: React.FC<LayerItemProps> = ({ layer, constraintsRef }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={layer.id}
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
      style={{
        height: `${LAYER_HEIGHT_IN_PX}px`,
        width: "100%",
      }}
      className="border-b"
      transition={{
        duration: 0.3,
      }}
    >
      <LayerContentMenuWrapper layerId={layer.id}>
        <div className="relative flex h-full w-full items-center px-1">
          <div
            className="reorder-handle mr-2 cursor-move"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical size={16} className="text-white/30" />
          </div>
          <span className="line-clamp-1 select-none text-xs capitalize">
            {layer.name}
          </span>
          {!layer.isVisible && (
            <EyeOff className="absolute right-0 mr-2 size-3" />
          )}
        </div>
      </LayerContentMenuWrapper>
    </Reorder.Item>
  );
};

const LayerStack: React.FC = () => {
  const layers = useVideoStore((state) => state.props.layers);
  const orderedLayers = useVideoStore((state) => state.props.layerOrder);
  const reorderLayers = useVideoStore((state) => state.reorderLayers);

  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="relative">
      <Reorder.Group
        axis="y"
        values={orderedLayers}
        onReorder={(newLayerOrder) => {
          reorderLayers(newLayerOrder);
        }}
        className="relative"
        style={{ height: `${orderedLayers.length * LAYER_HEIGHT_IN_PX}px` }}
      >
        {orderedLayers.map((layerId) => (
          <LayerItem
            key={layerId}
            layer={layers[layerId]}
            constraintsRef={constraintsRef}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};

export default LayerStack;
