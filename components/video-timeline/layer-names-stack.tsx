"use client";

import { TIMELINE } from "~/lib/constants/timeline.constants";
import useVideoStore from "~/store/video.store";

const { LAYER_HEIGHT_IN_PX } = TIMELINE;

import React, { useRef } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import LayerContentMenuWrapper from "../layer-context-menu-wrapper";

interface Layer {
  id: string;
  name: string;
}

interface LayerItemProps {
  layer: Layer;
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
      className=" border-b "
      transition={{
        duration: 0.3,
      }}
    >
      <LayerContentMenuWrapper layerId={layer.id}>
        <div className="flex items-center w-full h-full px-1">
          <div
            className="reorder-handle cursor-move mr-2"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical size={16} className="text-white/30" />
          </div>
          <span className="text-xs capitalize select-none line-clamp-1 ">
            {layer.name}
          </span>
        </div>
      </LayerContentMenuWrapper>
    </Reorder.Item>
  );
};

const LayerStack: React.FC = () => {
  const layers = useVideoStore((state) => state.props.layers);
  const orderedLayers = useVideoStore((state) => state.props.layerOrder);
  const reorderLayers = useVideoStore((state) => state.reorderLayers);
  console.log({ orderedLayers });

  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="relative">
      <Reorder.Group
        axis="y"
        values={orderedLayers}
        onReorder={(newLayerOrder) => {
          reorderLayers(newLayerOrder);
          console.log({ newLayerOrder });
        }}
        className="relative "
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
