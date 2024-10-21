import React, { useCallback, useMemo } from "react";
import { useCurrentScale } from "remotion";
import type { StyledSequenceItem } from "~/types/timeline.types";

// Define the size of the resize handle
const HANDLE_SIZE = 8;

type ResizeHandleProps = {
  type: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  setItem: (
    layerId: string,
    itemId: string,
    updater: (item: StyledSequenceItem) => StyledSequenceItem,
  ) => void;
  item: StyledSequenceItem;
};

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  type,
  setItem,
  item,
}) => {
  // Get the current scale of the composition
  const scale = useCurrentScale();

  // Calculate the size of the handle, accounting for the current scale
  const size = Math.round(HANDLE_SIZE / scale);
  const borderSize = 1 / scale;

  // Define the base style for the resize handle
  const sizeStyle: React.CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      height: size,
      width: size,
      backgroundColor: "white",
      border: `${borderSize}px solid #0B84F3`,
    };
  }, [borderSize, size]);

  // Calculate the margin for positioning the handle
  const margin = -size / 2 - borderSize;

  // Define the specific style for each handle type
  const style: React.CSSProperties = useMemo(() => {
    switch (type) {
      case "top-left":
        return {
          ...sizeStyle,
          marginLeft: margin,
          marginTop: margin,
          cursor: "nwse-resize",
        };
      case "top-right":
        return {
          ...sizeStyle,
          marginTop: margin,
          marginRight: margin,
          right: 0,
          cursor: "nesw-resize",
        };
      case "bottom-left":
        return {
          ...sizeStyle,
          marginBottom: margin,
          marginLeft: margin,
          bottom: 0,
          cursor: "nesw-resize",
        };
      case "bottom-right":
        return {
          ...sizeStyle,
          marginBottom: margin,
          marginRight: margin,
          right: 0,
          bottom: 0,
          cursor: "nwse-resize",
        };
    }
  }, [margin, sizeStyle, type]);

  // Handle the pointer down event to start resizing
  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) {
        return;
      }

      const initialX = e.clientX;
      const initialY = e.clientY;

      // Handle pointer move for resizing
      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;

        const isLeft = type === "top-left" || type === "bottom-left";
        const isTop = type === "top-left" || type === "top-right";

        setItem(item.layerId, item.id, (i) => {
          const currentDimensions = i.editableProps.positionAndDimensions!;
          const newWidth =
            currentDimensions.width + (isLeft ? -offsetX : offsetX);
          const newHeight =
            currentDimensions.height + (isTop ? -offsetY : offsetY);
          const newLeft = currentDimensions.left + (isLeft ? offsetX : 0);
          const newTop = currentDimensions.top + (isTop ? offsetY : 0);

          return {
            ...i,
            editableProps: {
              ...i.editableProps,
              positionAndDimensions: {
                width: Math.max(1, Math.round(newWidth)),
                height: Math.max(1, Math.round(newHeight)),
                left: Math.min(
                  currentDimensions.left + currentDimensions.width - 1,
                  Math.round(newLeft),
                ),
                top: Math.min(
                  currentDimensions.top + currentDimensions.height - 1,
                  Math.round(newTop),
                ),
              },
            },
            isDragging: true,
          };
        });
      };

      // Handle pointer up to stop resizing
      const onPointerUp = () => {
        setItem(item.layerId, item.id, (i) => ({
          ...i,
          isDragging: false,
        }));
        window.removeEventListener("pointermove", onPointerMove);
      };

      // Add event listeners for move and up events
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { once: true });
    },
    [item, scale, setItem, type],
  );

  // Render the resize handle
  return <div onPointerDown={onPointerDown} style={style} />;
};
