import React, { useCallback, useMemo, useState } from "react";
import { useCurrentScale } from "remotion";
import type { FullSequenceContentType } from "~/types/timeline.types";

type DragResizeProps = {
  item: FullSequenceContentType;
  onChange: (updates: Partial<FullSequenceContentType>) => void;
  children: React.ReactNode;
};

const HANDLE_SIZE = 10;

type ResizeHandleProps = {
  type: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onResize: (dx: number, dy: number) => void;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ type, onResize }) => {
  const scale = useCurrentScale();
  const size = Math.round(HANDLE_SIZE / scale);

  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      width: size,
      height: size,
      background: "white",
      border: "1px solid #0B84F3",
    };

    switch (type) {
      case "top-left":
        return { ...baseStyle, top: 0, left: 0, cursor: "nwse-resize" };
      case "top-right":
        return { ...baseStyle, top: 0, right: 0, cursor: "nesw-resize" };
      case "bottom-left":
        return { ...baseStyle, bottom: 0, left: 0, cursor: "nesw-resize" };
      case "bottom-right":
        return { ...baseStyle, bottom: 0, right: 0, cursor: "nwse-resize" };
    }
  }, [type, size]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      const initialX = e.clientX;
      const initialY = e.clientY;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - initialX) / scale;
        const dy = (moveEvent.clientY - initialY) / scale;
        onResize(dx, dy);
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { once: true });
    },
    [onResize, scale],
  );

  return <div style={style} onPointerDown={handlePointerDown} />;
};

const DragResizeComponent: React.FC<DragResizeProps> = ({
  item,
  onChange,
  children,
}) => {
  const scale = useCurrentScale();
  const [isDragging, setIsDragging] = useState(false);

  const style: React.CSSProperties = useMemo(() => {
    const { positionAndDimensions } = item.editableProps;
    return {
      position: "absolute",
      left: positionAndDimensions?.left,
      top: positionAndDimensions?.top,
      width: positionAndDimensions?.width,
      height: positionAndDimensions?.height,
      cursor: isDragging ? "grabbing" : "grab",
      userSelect: "none",
      touchAction: "none",
    };
  }, [item.editableProps, isDragging]);

  const startDragging = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      const initialX = e.clientX;
      const initialY = e.clientY;

      setIsDragging(true);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - initialX) / scale;
        const dy = (moveEvent.clientY - initialY) / scale;

        onChange({
          editableProps: {
            ...item.editableProps,
            positionAndDimensions: {
              ...item.editableProps.positionAndDimensions!,
              left: (item.editableProps.positionAndDimensions?.left || 0) + dx,
              top: (item.editableProps.positionAndDimensions?.top || 0) + dy,
            },
          },
        });
      };

      const onPointerUp = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", onPointerMove);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { once: true });
    },
    [item.editableProps, onChange, scale],
  );

  const handleResize = useCallback(
    (dx: number, dy: number, type: ResizeHandleProps["type"]) => {
      const { positionAndDimensions } = item.editableProps;
      if (!positionAndDimensions) return;

      let newLeft = positionAndDimensions.left;
      let newTop = positionAndDimensions.top;
      let newWidth = positionAndDimensions.width;
      let newHeight = positionAndDimensions.height;

      switch (type) {
        case "top-left":
          newLeft += dx;
          newTop += dy;
          newWidth -= dx;
          newHeight -= dy;
          break;
        case "top-right":
          newTop += dy;
          newWidth += dx;
          newHeight -= dy;
          break;
        case "bottom-left":
          newLeft += dx;
          newWidth -= dx;
          newHeight += dy;
          break;
        case "bottom-right":
          newWidth += dx;
          newHeight += dy;
          break;
      }

      onChange({
        editableProps: {
          ...item.editableProps,
          positionAndDimensions: {
            left: newLeft,
            top: newTop,
            width: Math.max(10, newWidth),
            height: Math.max(10, newHeight),
          },
        },
      });
    },
    [item.editableProps, onChange],
  );

  return (
    <div style={style} onPointerDown={startDragging} className="bg-red-500">
      {children}
      <ResizeHandle
        type="top-left"
        onResize={(dx, dy) => handleResize(dx, dy, "top-left")}
      />
      <ResizeHandle
        type="top-right"
        onResize={(dx, dy) => handleResize(dx, dy, "top-right")}
      />
      <ResizeHandle
        type="bottom-left"
        onResize={(dx, dy) => handleResize(dx, dy, "bottom-left")}
      />
      <ResizeHandle
        type="bottom-right"
        onResize={(dx, dy) => handleResize(dx, dy, "bottom-right")}
      />
    </div>
  );
};

export default DragResizeComponent;
