"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

const LAYER_HEIGHT = 50;
const ITEM_HEIGHT = 50;
const TIMELINE_WIDTH = 2000; // Adjust based on your needs

interface Item {
  id: number;
  layer: number;
  start: number;
  duration: number;
  color: string;
}

interface TimelineItemProps {
  item: Item;
  onDragStop: (id: number, newLayer: number, newStart: number) => void;
  onResize: (id: number, newDuration: number) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  onDragStop,
  onResize,
}) => {
  return (
    <Rnd
      default={{
        x: item.start,
        y: item.layer * LAYER_HEIGHT + (LAYER_HEIGHT - ITEM_HEIGHT) / 2,
        width: item.duration,
        height: ITEM_HEIGHT,
      }}
      bounds="parent"
      onDragStop={(e, d) => {
        const newLayer = Math.floor((d.y + ITEM_HEIGHT / 2) / LAYER_HEIGHT);
        onDragStop(item.id, newLayer, d.x);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onResize(item.id, parseInt(ref.style.width));
      }}
      minWidth={50}
      dragGrid={[1, LAYER_HEIGHT]}
    >
      <div
        className={`h-full overflow-hidden p-2 text-xs text-white ${item.color}`}
      >
        Item {item.id}
      </div>
    </Rnd>
  );
};

const VideoEditorTimelinePOC: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, layer: 0, start: 0, duration: 200, color: "bg-blue-500" },
    { id: 2, layer: 1, start: 100, duration: 150, color: "bg-green-500" },
    { id: 3, layer: 2, start: 50, duration: 250, color: "bg-red-500" },
  ]);

  const handleDragStop = (id: number, newLayer: number, newStart: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, layer: newLayer, start: newStart } : item,
      ),
    );
  };

  const handleResize = (id: number, newDuration: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, duration: newDuration } : item,
      ),
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-gray-100 p-4">
      <div className="flex h-[200px] w-full border border-gray-300">
        <div className="w-[200px] border-r">
          {[0, 1, 2, 3].map((layer) => (
            <div
              key={layer}
              className="w-full border-b border-red-800"
              style={{
                top: layer * LAYER_HEIGHT,
                height: LAYER_HEIGHT,
                width: TIMELINE_WIDTH,
              }}
            >
              <span className="left-1 top-1 text-xs text-gray-500">
                Layer {layer + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="relative w-full">
          {items.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
              onDragStop={handleDragStop}
              onResize={handleResize}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoEditorTimelinePOC;
