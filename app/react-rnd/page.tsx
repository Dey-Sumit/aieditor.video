"use client";

import React, { useState, useRef } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";

const LAYER_HEIGHT = 50;

interface Layer {
  id: string;
  content: string;
  color: string;
}

interface ItemProps {
  layer: Layer;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

const Item: React.FC<ItemProps> = ({ layer, constraintsRef }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={layer}
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
      style={{
        height: `${LAYER_HEIGHT}px`,
        width: "100%",
        backgroundColor: layer.color,
      }}
      className="flex items-center justify-between text-white px-4"
      whileDrag={{
        opacity: 0.7,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <span>{layer.content}</span>
      <div
        className="reorder-handle cursor-move"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={20} />
      </div>
    </Reorder.Item>
  );
};

const ReorderPOC: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", content: "Layer 1", color: "#FF6B6B" },
    { id: "2", content: "Layer 2", color: "#4ECDC4" },
    { id: "3", content: "Layer 3", color: "#45B7D1" },
    { id: "4", content: "Layer 4", color: "#FAD02E" },
    { id: "5", content: "Layer 5", color: "#A06CD5" },
  ]);

  const constraintsRef = useRef(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Framer Motion Reorder POC</h1>
      <div ref={constraintsRef} className="relative">
        <Reorder.Group
          axis="y"
          values={layers}
          onReorder={setLayers}
          className="relative border border-gray-300 rounded"
          style={{ height: `${layers.length * LAYER_HEIGHT}px` }}
        >
          {layers.map((layer) => (
            <Item
              key={layer.id}
              layer={layer}
              constraintsRef={constraintsRef}
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default ReorderPOC;
