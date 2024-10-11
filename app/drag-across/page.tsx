"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

const LAYER_HEIGHT = 50;
const ITEM_HEIGHT = 50;
const TIMELINE_WIDTH = 2000; // Adjust based on your needs

interface SequenceItem {
  id: string;
  color: string;
  startFrame: number;
  duration: number;
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
  layerIndex: number;
  itemIndex: number; // Add this new prop
  onDragStop: (itemId: string, newLayerId: string, newStart: number) => void;
  layerOrder: string[]; // Add this prop
}

const FRAMES_PER_PIXEL = 1; // Adjust this value to change the zoom level
const SNAP_THRESHOLD = LAYER_HEIGHT * 0.3; // 30% of layer height as snap zone

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  layerIndex,
  itemIndex, // Use this new prop
  onDragStop,
  layerOrder, // Add this prop to get the list of layer IDs
}) => {
  return (
    <Rnd
      default={{
        x: Math.floor(item.startFrame / FRAMES_PER_PIXEL),
        y: layerIndex * LAYER_HEIGHT + (LAYER_HEIGHT - ITEM_HEIGHT) / 2,
        width: 100, // Fixed width for now
        height: ITEM_HEIGHT,
      }}
      bounds="parent"
      onDragStop={(e, d) => {
        const centerY = d.y + ITEM_HEIGHT / 2;
        const rawLayerIndex = centerY / LAYER_HEIGHT;
        const snapLayerIndex = Math.round(rawLayerIndex);

        // Check if we're within the snap threshold
        if (
          Math.abs(rawLayerIndex - snapLayerIndex) * LAYER_HEIGHT <=
          SNAP_THRESHOLD
        ) {
          const newLayerId = layerOrder[snapLayerIndex];
          if (newLayerId) {
            const newStartFrame = Math.round(d.x * FRAMES_PER_PIXEL);
            onDragStop(item.id, newLayerId, newStartFrame);
          }
        } else {
          // If not within snap threshold, don't change the layer
          const newStartFrame = Math.round(d.x * FRAMES_PER_PIXEL);
          onDragStop(item.id, layerOrder[layerIndex], newStartFrame);
        }
      }}
      /*      onDragStop={(e, d) => {
        const layerIndex = Math.floor(d.y / LAYER_HEIGHT);
        const newLayerId = `layer${layerIndex}`; // BAD CODE: Don't hardcode layer names
        console.log("New layer id", d, {
          layerIndex,
          newLayerId,
          LAYER_HEIGHT,
        });

        onDragStop(item.id, newLayerId, d.x);
      }} */
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
      layer0: {
        id: "layer0",
        items: [],
      },
      layer1: {
        id: "layer1",
        items: ["item1"],
      },

      layer2: {
        id: "layer2",
        items: ["item2"],
      },
    },
    sequenceItems: {
      item1: {
        id: "item1",
        color: "bg-blue-500",
        startFrame: 0,
        duration: 200,
      },

      item2: {
        id: "item2",
        color: "bg-red-500",
        startFrame: 50,
        duration: 250,
      },
    },
  });
  const layerOrder = Object.keys(projectState.layers);
  const handleDragStop = (
    itemId: string,
    newLayerId: string,
    newStartFrame: number,
  ) => {
    // console.log("Drag stopped", itemId, newLayerId, newStartFrame);

    setProjectState((prevState) => {
      const newState = { ...prevState };
      const oldLayerId = Object.keys(newState.layers).find((layerId) =>
        newState.layers[layerId].items.includes(itemId),
      );

      if (oldLayerId) {
        // Remove from old layer
        newState.layers[oldLayerId].items = newState.layers[
          oldLayerId
        ].items.filter((id) => id !== itemId);

        // Add to new layer
        if (!newState.layers[newLayerId]) {
          newState.layers[newLayerId] = { id: newLayerId, items: [] };
        }
        newState.layers[newLayerId].items.push(itemId);

        // Update item's start frame
        newState.sequenceItems[itemId].startFrame = newStartFrame;
      }

      return newState;
    });
  };

  return (
    <div className="mt-96 w-full overflow-x-auto bg-gray-100 p-4">
      <div className="flex h-[150px] w-full border border-gray-300">
        <div className="w-[200px] border-r">
          {[0, 1, 2].map((layer) => (
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
                Layer {layer}
              </span>
            </div>
          ))}
        </div>

        <div className="relative w-full">
          {Object.entries(projectState.layers).map(
            ([layerId, layer], layerIndex) => (
              <React.Fragment key={layerId}>
                {layer.items.map((itemId, itemIndex) => (
                  <TimelineItem
                    key={itemId}
                    itemIndex={itemIndex}
                    item={projectState.sequenceItems[itemId]}
                    layerId={layerId}
                    onDragStop={handleDragStop}
                    layerIndex={layerIndex}
                    layerOrder={layerOrder}
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
