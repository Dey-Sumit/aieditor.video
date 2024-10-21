import React, { useMemo } from "react";
import { Sequence } from "remotion";
import type {
  LayerType,
  LiteSequenceItemType,
  StyledSequenceItem,
} from "~/types/timeline.types";
import { SelectionOutline } from "./selection-outline";

// Helper function to sort items, placing the selected item on top
const displaySelectedItemOnTop = (
  items: (LiteSequenceItemType & { layerId: string })[],
  selectedItem: string | null,
): (LiteSequenceItemType & { layerId: string })[] => {
  const selectedItems = items.filter((item) => item.id === selectedItem);
  const unselectedItems = items.filter((item) => item.id !== selectedItem);

  return [...unselectedItems, ...selectedItems];
};

type SortedOutlinesProps = {
  layers: Record<string, LayerType>;
  layerOrder: string[];
  sequenceItems: Record<string, StyledSequenceItem>;
  selectedItem: string | null;
  changeItem: (
    layerId: string,
    itemId: string,
    updater: (item: StyledSequenceItem) => StyledSequenceItem,
  ) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
};

export const SortedOutlines: React.FC<SortedOutlinesProps> = ({
  layers,
  layerOrder,
  sequenceItems,
  selectedItem,
  changeItem,
  setSelectedItem,
}) => {
  // Flatten all liteItems from all layers into a single array
  const allLiteItems = useMemo(() => {
    return layerOrder.flatMap((layerId) =>
      layers[layerId].liteItems.map((item) => ({
        ...item,
        layerId, // Add layerId to each item for reference
      })),
    );
  }, [layers, layerOrder]);

  // Sort items to display the selected item on top
  const itemsToDisplay = useMemo(
    () => displaySelectedItemOnTop(allLiteItems, selectedItem),
    [allLiteItems, selectedItem],
  );

  return (
    <>
      {(selectedItem ? itemsToDisplay : [...itemsToDisplay].reverse()).map(
        (liteItem) => {
          const fullItem = sequenceItems[liteItem.id];
          if (!fullItem) return null;

          return (
            <Sequence
              key={liteItem.id}
              from={liteItem.startFrame}
              durationInFrames={liteItem.sequenceDuration}
              layout="none"
            >
              <SelectionOutline
                item={fullItem}
                changeItem={changeItem}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
              />
            </Sequence>
          );
        },
      )}
    </>
  );
};
