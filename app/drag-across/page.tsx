"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

const LAYER_HEIGHT = 50;
const ITEM_HEIGHT = 50;
const TIMELINE_WIDTH = 2000; // Adjust based on your needs

interface SequenceItem {
  id: string;
  color: string;
}

interface Layer {
  id: string;
  items: string[];
}

interface ProjectState {
  layers: {
    [key: string]: Layer;
  };
  sequenceItems: {
    [key: string]: SequenceItem;
  };
}
interface TimelineItemProps {
  item: SequenceItem;
  layerId: string;
  onDragStop: (itemId: string, newLayerId: string, newStart: number) => void;
  layerIndex: number;
}
const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  onDragStop,
  layerIndex,
}) => {
  return (
    <Rnd
      default={{
        x: 0, // We'll need to calculate this based on item index
        y: layerIndex * LAYER_HEIGHT + (LAYER_HEIGHT - ITEM_HEIGHT) / 2,
        width: 100, // Fixed width for now
        height: ITEM_HEIGHT,
      }}
      bounds="parent"
      onDragStop={(e, d) => {
        const newLayerId = `layer${Math.floor(d.y / LAYER_HEIGHT) + 1}`;
        onDragStop(item.id, newLayerId, d.x);
      }}
      // onResizeStop={(e, direction, ref, delta, position) => {
      //   onResize(item.id, parseInt(ref.style.width));
      // }}
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
  const [projectState, setProjectState] = useState<ProjectState>({
    layers: {
      layer1: {
        id: "layer1",
        items: ["item1"],
      },
      layer2: {
        id: "layer2",
        items: ["item2"],
      },
      layer3: {
        id: "layer3",
        items: ["item3"],
      },
    },
    sequenceItems: {
      item1: { id: "item1", color: "bg-blue-500" },
      item2: { id: "item2", color: "bg-green-500" },
      item3: { id: "item3", color: "bg-red-500" },
    },
  });
  console.log({ projectState });

  const handleDragStop = (
    itemId: string,
    newLayerId: string,
    newStart: number,
  ) => {
    // This function needs to be implemented
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
          {Object.entries(projectState.layers).map(
            ([layerId, layer], layerIndex) => (
              <React.Fragment key={layerId}>
                {layer.items.map((itemId) => (
                  <TimelineItem
                    key={itemId}
                    item={projectState.sequenceItems[itemId]}
                    layerId={layerId}
                    onDragStop={handleDragStop}
                    layerIndex={layerIndex}
                  />
                ))}
              </React.Fragment>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoEditorTimelinePOC;

/*  const [projectState, setProjectState] = useState({
    layers: {
      layer1: {
        id: "layer1",
       
        items: ["item1"],
      },
      layer2: {
        id: "layer2",
      
        items: ["item2"],
      },
      layer3: {
        id: "layer3",
      
        items: ["item3"],
      },
    },
    
    sequenceItems: {
      item1: { id: "item1", color: "bg-blue-500" },
      item2: { id: "item2", color: "bg-green-500" },
      item3: { id: "item3", color: "bg-red-500" },
    },
  }); */
