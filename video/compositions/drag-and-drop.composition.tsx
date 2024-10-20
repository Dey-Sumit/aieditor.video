import React, { useCallback, useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SortedOutlines } from "~/components/player/sorted-outlines";
import type { Item } from "~/types/drag-and-drop-player-poc.type";

export const Layer: React.FC<{
  item: Item;
}> = ({ item }) => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: item.color,
      position: "absolute",
      left: item.left,
      top: item.top,
      width: item.width,
      height: item.height,
    };
  }, [item.color, item.height, item.left, item.top, item.width]);

  return (
    <Sequence
      key={item.id}
      from={item.from}
      durationInFrames={item.durationInFrames}
    >
      <div style={style} />
    </Sequence>
  );
};

export type MainProps = {
  readonly items: Item[];
  readonly setSelectedItem: React.Dispatch<React.SetStateAction<number | null>>;
  readonly selectedItem: number | null;
  readonly changeItem: (itemId: number, updater: (item: Item) => Item) => void;
};

const outer: React.CSSProperties = {
  backgroundColor: "#eee",
};

const layerContainer: React.CSSProperties = {
  overflow: "hidden",
};

export const Main: React.FC<MainProps> = ({
  items,
  setSelectedItem,
  selectedItem,
  changeItem,
}) => {
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) {
        return;
      }

      setSelectedItem(null);
    },
    [setSelectedItem],
  );

  return (
    <AbsoluteFill style={outer} onPointerDown={onPointerDown}>
      <AbsoluteFill style={layerContainer}>
        {items.map((item) => {
          return <Layer key={item.id} item={item} />;
        })}
      </AbsoluteFill>
      <SortedOutlines
        selectedItem={selectedItem}
        items={items}
        setSelectedItem={setSelectedItem}
        changeItem={changeItem}
      />
    </AbsoluteFill>
  );
};
