import React, { useCallback, useMemo } from "react";
import { useCurrentScale } from "remotion";
import type { StyledSequenceItem } from "~/types/timeline.types";
import { ResizeHandle } from "./resize-handle";

export const SelectionOutline: React.FC<{
  item: StyledSequenceItem;
  changeItem: (
    layerId: string,
    itemId: string,
    updater: (item: StyledSequenceItem) => StyledSequenceItem,
  ) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  selectedItem: string | null;
  isDragging: boolean;
}> = ({ item, changeItem, setSelectedItem, selectedItem, isDragging }) => {
  // Get the current scale of the player
  const scale = useCurrentScale();
  // Calculate the border size based on the current scale
  const scaledBorder = Math.ceil(2 / scale);

  // State to track if the item is being hovered over
  const [hovered, setHovered] = React.useState(false);

  // Callbacks for mouse enter and leave events
  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Check if this item is currently selected
  const isSelected = item.id === selectedItem;

  // Memoized style for the selection outline
  const style: React.CSSProperties = useMemo(() => {
    const { positionAndDimensions } = item.editableProps;
    return {
      width: positionAndDimensions?.width,
      height: positionAndDimensions?.height,
      left: positionAndDimensions?.left,
      top: positionAndDimensions?.top,
      position: "absolute",
      // Show outline when hovered (and not dragging) or selected
      outline:
        (hovered && !isDragging) || isSelected
          ? `${scaledBorder}px solid #0B84F3`
          : undefined,
      userSelect: "none",
      touchAction: "none",
    };
  }, [item.editableProps, hovered, isDragging, isSelected, scaledBorder]);

  // Function to handle the start of dragging
  const startDragging = useCallback(
    (e: PointerEvent | React.MouseEvent) => {
      const initialX = e.clientX;
      const initialY = e.clientY;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        console.log("SelectionOutline -> onPointerMove");

        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;
        changeItem(item.layerId, item.id, (item) => {
          console.log("SelectionOutline -> onPointerMove -> changeItem", item);

          const newPositionAndDimensions = {
            ...item.editableProps.positionAndDimensions!,
            left: Math.round(
              (item.editableProps.positionAndDimensions?.left || 0) + offsetX,
            ),
            top: Math.round(
              (item.editableProps.positionAndDimensions?.top || 0) + offsetY,
            ),
          };
          console.log(
            "SelectionOutline -> onPointerMove -> newPositionAndDimensions",
            newPositionAndDimensions,
          );

          return {
            ...item,
            editableProps: {
              ...item.editableProps,
              positionAndDimensions: newPositionAndDimensions,
            },
            isDragging: true,
          };
        });
      };

      const onPointerUp = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;
        changeItem(item.layerId, item.id, (item) => {
          console.log("SelectionOutline -> onPointerUp -> changeItem", item);

          const newPositionAndDimensions = {
            ...item.editableProps.positionAndDimensions!,
            left: Math.round(
              (item.editableProps.positionAndDimensions?.left || 0) + offsetX,
            ),
            top: Math.round(
              (item.editableProps.positionAndDimensions?.top || 0) + offsetY,
            ),
          };
          console.log(
            "SelectionOutline -> onPointerMove -> newPositionAndDimensions",
            newPositionAndDimensions,
          );

          return {
            ...item,
            editableProps: {
              ...item.editableProps,
              positionAndDimensions: newPositionAndDimensions,
            },
            isDragging: true,
          };
        });
        window.removeEventListener("pointermove", onPointerMove);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { once: true });
    },
    [item, scale, changeItem],
  );

  // Handle pointer down event
  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) {
        return;
      }

      // Set this item as the selected item
      setSelectedItem(item.id);
      // Start dragging
      startDragging(e);
    },
    [item.id, setSelectedItem, startDragging],
  );

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      style={style}
    >
      {/* Render resize handles only when the item is selected */}
      {isSelected ? (
        <>
          <ResizeHandle item={item} setItem={changeItem} type="top-left" />
          <ResizeHandle item={item} setItem={changeItem} type="top-right" />
          <ResizeHandle item={item} setItem={changeItem} type="bottom-left" />
          <ResizeHandle item={item} setItem={changeItem} type="bottom-right" />
        </>
      ) : null}
    </div>
  );
};
