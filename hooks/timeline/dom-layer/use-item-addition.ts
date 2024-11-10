import { getVideoMetadata } from "@remotion/media-utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTimeline } from "~/context/useTimeline";
import { PRESET_COLLECTION } from "~/data/preset.book";
import useThrottle from "~/hooks/use-throttle";
import { TIMELINE } from "~/lib/constants/timeline.constants";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { ContentType, LayerId } from "~/types/timeline.types";
import { genId } from "~/utils/misc.utils";
import { calculatePlaceholderDuration } from "~/utils/timeline.utils";
const { MAX_PLACEHOLDER_FRAMES: MAX_PLACEHOLDER_DURATION_IN_FRAMES } = TIMELINE;

export interface HoverInfo {
  layerId: LayerId;
  startFrame: number;
  durationInFrames: number;
  offsetFrames: number;
  startX: number;
  width: number;
}

export function useSequenceAddition(layerId: LayerId, pixelsPerFrame: number) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const lastHoverInfoRef = useRef<HoverInfo | null>(null); // since , onclick or other events, hoverInfo may be reset to null, so we need to store the last hoverInfo

  const selectedNewItemType = useEditingStore(
    (state) => state.selectedContentType,
  );

  const { draggingLayerId, handleTimeLayerClick } = useTimeline();

  const validateAndAddItem = useNewItemValidation();

  const liteItems = useVideoStore(
    (state) => state.props.layers[layerId]?.liteItems,
  );

  const duration = useVideoStore(
    (state) => state.props.compositionMetaData.duration,
  );

  const handleBgLayerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingLayerId !== null && draggingLayerId !== layerId) return;

      const rect = e.currentTarget?.getBoundingClientRect();
      if (!rect) {
        console.error("Bounding rect not found");
        return;
      }
      const x = e.clientX - rect.left;

      const startFrame = Math.floor(x / pixelsPerFrame);

      const placeholderInfo = calculatePlaceholderDuration(
        liteItems,
        startFrame,
        duration,
        MAX_PLACEHOLDER_DURATION_IN_FRAMES,
      );

      const newHoverInfo = {
        layerId,
        startFrame: placeholderInfo.adjustedStartFrame,
        durationInFrames: placeholderInfo.duration,
        offsetFrames: placeholderInfo.offsetFrames,
        startX: placeholderInfo.adjustedStartFrame * pixelsPerFrame,
        width: placeholderInfo.duration * pixelsPerFrame,
      };
      setHoverInfo(newHoverInfo);
      lastHoverInfoRef.current = newHoverInfo;
    },
    [liteItems, layerId, duration, pixelsPerFrame, draggingLayerId],
  );

  const throttledHandleBgLayerMouseMove = useThrottle(
    handleBgLayerMouseMove,
    20,
  );

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const handleAddNewItem = useCallback(
    async (
      e: React.MouseEvent<HTMLDivElement>,
      selectedContentType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetId: string;
          },
    ) => {
      if (!lastHoverInfoRef.current) {
        console.error("hoverInfo is null, cannot add new item");
        return;
      }

      const {
        startFrame: adjustedStartFrame,
        durationInFrames: placeholderDuration,
        offsetFrames,
      } = lastHoverInfoRef.current;

      if (selectedContentType.sequenceType === "standalone") {
        const contentType =
          selectedContentType.contentType || selectedNewItemType; //selectedContentType.contentType may come from context menu
        validateAndAddItem({
          layerId,
          duration: placeholderDuration,
          startFrame: adjustedStartFrame,
          offset: offsetFrames,
          selectedContentType: {
            sequenceType: "standalone",
            contentType,
          },
        });
      } else {
        validateAndAddItem({
          layerId,
          duration: placeholderDuration,
          startFrame: adjustedStartFrame,
          offset: offsetFrames,
          selectedContentType: {
            sequenceType: "preset",
            presetId: selectedContentType.presetId,
          },
        });
      }
      handleTimeLayerClick(e); // so that the playhead moves to the newly added item
    },
    [layerId, selectedNewItemType, handleTimeLayerClick, validateAndAddItem],
  );

  const mouseEventHandlers = useMemo(
    () => ({
      onMouseMove: throttledHandleBgLayerMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleAddNewItem,
    }),
    [throttledHandleBgLayerMouseMove, handleMouseLeave, handleAddNewItem],
  );

  return {
    hoverInfo,
    mouseEventHandlers,
    handleAddNewItem,
  };
}

export const useNewItemValidation = () => {
  const addSequenceItemToLayer = useVideoStore(
    (state) => state.addSequenceItemToLayer,
  );
  const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);
  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);

  // const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);
  const VIDEO_URL =
    "https://no-protection-bucket.s3.us-east-1.amazonaws.com/saul%20cropped.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQCtrRnOuNxfuVcZ8p0puOvHIT2k74xPdWQxfcaPH5FW1gIhANMWewvmme6uRFITOM5G3w8QVoi1HsTXTewJPwZP3jElKssDCHYQABoMMDU4MjY0MjUyMzcxIgwheqq8q6DA3XCP5XkqqAPnQDgd9EJjVXIXytHtRbP%2BYWoqCdKAAxZfz97Slumy0kRgxu8mzGTqF8WGOZNYjVopq3yY0%2B1DkeK3SuVW0RXLmeLDKc%2B6whNtC9AybjUbsOmSfdAoveMrjO0Lo2t4ZLNU6J8Ahe2%2BqTgJxZZCRblCswlOicuajGOkr%2Fi931Ig6N%2Fgt4YUaBIs%2FCdATxcAlipFPHNHgG4kMhFxSmq1L63QrJqsjwO3IMx%2FMOpuXeVIy5DCHWYnvbaxj2M6YR1IWpfvEPI7A%2F4ZQnB6Wmgb%2F4YNOYmrzwN8Tvl%2Bx%2Bc1jby79jyEhZ8JYwM%2FefXqk7N9YahEeb431p3%2FgdrLGzGfWGy3FulLl%2BNNZYRvw6LDXgkFlPWwnLhzD8jg9auQhYdY4fO3%2BgD4zFKSKbnhdcLxNP6qbmG9OxMFU4B3bUfUpT%2BfAM6aG%2F06%2BV8BfKhMY%2FUUPO5fS9xBEaB7oGTeqqNy3oUJ5josNGlIhhwlChOpyQIQWoWAYoNh6rCHbIgVno3Hs5%2Bq4nnDFv8njBJ%2F7u7%2FSfkrrdI%2B0fyraJRVSqvtiCJphCBnlLwChl6IMMS8vbkGOuMCZM0tAJl5DePvXxK02s2AKN3EGPfBSbMz%2BHnADV29RkyrJ37KOKL%2Fzq%2F53jFU6KmBWtjbDogS1CMtm%2FlOTqlmLTzLeBtsnD5x%2BP40PDuAXV9%2F4Fza4NAgcSzM00xWULYLkeBCWNBNkBvJQe05B5B5Ou13UBCEY59oY3AJltg42XnRlyKCRG4IROEUn45LIk1Jy0FEAu0TwURWbK%2BJyngDFcrmd51gv6SN4NQ0S1HCvfzOYbFraruzlXqNyHrUvyI8Qwz2T%2FUq9eV%2BTPV5yPZH9%2BYK5yxC3Dk4dEutZn2m8p2QwI1V3tFpXF5XcnTpexq2ett9UxvQjRF8TlUW61U2w1S%2FFSVGcYMKD%2BBR4AI%2B%2FEbgFHXsuHUyjK9UacT5PuANmQ82AsTjFlmanTdqQb6qXu5NNTpoqZ38LvjMQIsOR0fcDuui97Ca1H%2Bb3Tx95MwK99z7k%2FIJUmC2rpEt5tSFhOWs7Q%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JW26NVJNZ%2F20241109%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241109T131318Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=59e9e04025106558bee24eaeb19b9a98c8318691628490fdf311647fc8f0c956";

  return useCallback(
    async (newItemData: {
      layerId: LayerId;
      startFrame: number;
      duration: number;
      offset: number;
      selectedContentType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetId: string;
          };
    }) => {
      const { layerId, startFrame, duration, offset, selectedContentType } =
        newItemData;

      // Perform validations
      if (startFrame < 0 || duration <= 0) {
        console.error("Invalid start frame or duration");
        return false;
      }

      if (selectedContentType.sequenceType === "standalone") {
        const contentType = selectedContentType.contentType || "dummy"; // Default to "dummy" if not specified
        const newItemId = genId("s", contentType);
        if (contentType !== "video" && contentType !== "audio") {
          // call the store action with the validated data
          addSequenceItemToLayer(
            layerId,
            {
              contentType,
              id: newItemId,
              offset,
              sequenceDuration: duration,
              effectiveDuration: duration,
              sequenceType: "standalone",
              startFrame,
            },
            contentType === "text"
              ? {
                  type: "text",
                  editableProps: {
                    styles: {
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.2)",
                      },
                      element: {},
                    },
                    text: "<h1>Your text</h1>",
                    positionAndDimensions: {
                      top: 0,
                      left: 0,
                      width: 720,
                      height: 1080,
                    },
                  },
                  id: newItemId,
                  layerId,
                }
              : {
                  type: "image",
                  editableProps: {
                    styles: {
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                      },
                      element: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                    positionAndDimensions: {
                      top: 0,
                      left: 0,
                      width: 720,
                      height: 1080,
                    },
                    imageUrl:
                      "https://i.cdn.newsbytesapp.com/images/l5720240602024051.jpeg",
                    // "https ://images.pexels.com/photos/20787/pexels-photo.jpg",
                  },
                  animations: [
                    {
                      type: "scale",
                      from: 1,
                      to: 0.7,
                      duration: 240,
                      startAt: 120, // Starts immediately at frame 0
                    },
                  ],

                  id: newItemId,
                  layerId,
                },
          );
        } else {
          // TODO : THIS IS ASYNC, we need it only for the total duration, so we should not wait for this
          // instead we can use a loader / or disable resizing until this is done, but we will add it immediately

          const data = await getVideoMetadata(VIDEO_URL);

          addSequenceItemToLayer(
            layerId,
            {
              contentType,
              id: newItemId,
              offset,
              sequenceDuration: data.durationInSeconds * 30,
              effectiveDuration: data.durationInSeconds * 30,
              sequenceType: "standalone",
              startFrame,
              linkedCaptionLayerId: null,
            },
            {
              type: "video",
              editableProps: {
                videoEndsAtInFrames: data.durationInSeconds * 30,
                videoStartsFromInFrames: 0,
                styles: {
                  container: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  element: {
                    width: "100%",
                    height: "100%",
                  },
                  overlay: {},
                },
                positionAndDimensions: {
                  top: 0,
                  left: 0,
                  width: 720,
                  height: 1080,
                },
                videoUrl: VIDEO_URL,
              },
              totalVideoDurationInFrames: data.durationInSeconds * 30,
              id: newItemId,
              layerId,
              animations: [],
            },
          );
        }

        setActiveSeqItem(layerId, newItemId, contentType);
      } else {
        addPresetToLayer(
          layerId,
          {
            startFrame,
            offset,
          },
          PRESET_COLLECTION[selectedContentType.presetId],
        );
        // contentType = "preset";
        // presetId = selectedContentType.presetId;
      }
    },
    [addSequenceItemToLayer, addPresetToLayer, setActiveSeqItem],
  );
};
