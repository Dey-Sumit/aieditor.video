import React, { useMemo } from "react";
import { Sequence } from "remotion";
import type {
  LiteSequenceItemType,
  StyledSequenceItem,
} from "~/types/timeline.types";
import { SelectionOutline } from "./selection-outline";

// Helper function to sort items, placing the selected item on top
const displaySelectedItemOnTop = (
  items: LiteSequenceItemType[],
  selectedItem: string | null,
  sequenceItems: Record<string, StyledSequenceItem>,
): LiteSequenceItemType[] => {
  const selectedItems = items.filter((item) => item.id === selectedItem);
  const unselectedItems = items.filter((item) => item.id !== selectedItem);

  return [...unselectedItems, ...selectedItems];
};

type SortedOutlinesProps = {
  liteItems: LiteSequenceItemType[];
  sequenceItems: Record<string, StyledSequenceItem>;
  selectedItem: string | null;
  changeItem: (
    layerId: string,
    itemId: string,
    updater: (item: StyledSequenceItem) => StyledSequenceItem,
  ) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  layerId: string;
};

export const SortedOutlines: React.FC<SortedOutlinesProps> = ({
  liteItems,
  sequenceItems,
  selectedItem,
  changeItem,
  setSelectedItem,
  layerId,
}) => {
  // Sort items to display the selected item on top
  const itemsToDisplay = useMemo(
    () => displaySelectedItemOnTop(liteItems, selectedItem, sequenceItems),
    [liteItems, selectedItem, sequenceItems],
  );

  // Check if any item is currently being dragged
  const isDragging = useMemo(
    () => liteItems.some((item) => sequenceItems[item.id]?.isDragging),
    [liteItems, sequenceItems],
  );

  return (
    <>
      {itemsToDisplay.map((liteItem) => {
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
              isDragging={isDragging}
            />
          </Sequence>
        );
      })}
    </>
  );
};
