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
    "https://video-editor-user-upload-assets.s3.ap-south-1.amazonaws.com/saul%20cropped.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaCmFwLXNvdXRoLTEiSDBGAiEA39lgWJtrHzQx4xqj5oQ486RRFANGU5yc3OirJ7UJKOACIQCe05z5DMqQfdaTDJOwRCebiSSl5Cjsjck1Mf6qgVQn0irUAwjB%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA1ODI2NDI1MjM3MSIMdpNdsuTYBn1tU0%2BdKqgDi%2FzKNQtC7iHxWxPS9TXDNqEG9WCiFaFiWl12p94AnFknexOcgn2%2BQqFNiZtdy%2BO4e0JVDMKEaGa4s9DDcFspMLl9Dxzgz%2FJeqRWN%2B1wmwoDpV6aXuC3fkiOtFEMnAviLgFj0vE8KJcnU7DTWItrqjWhMDIJ%2BXKrzGDEco72xc%2B%2Fj16wJK5M3hAjQATuQUwGL1CLSS%2FNV%2BsAiSTJAXzJYSdUSvNqQM1AZ%2BUV1HtYqRDE3XHeI7CZH39u6aB%2FKVdAuw2Xl8idA1TWdELp1aFGnCfrWIWTfTGD50BaLla%2FDRzSB2yvlYjN4r2qFC1JQF0AX2oCGCsaSTMj7shIhQiGp9aDtXYMyq59Tw4nKsGidxJ2C7OFGcHimCXKNqXRQbRWbspd%2Bfv167M4gAE9zKoNXiwlImoAgJQWo8keySlTLwEqUoWcJRTiO%2FeHG0mXaqPgmdCYJ6g%2FqxsZT5KRi7TeeKwDiVRob5BAc6w1dk75ZVjPllp8dS0y8odyqfoJhQsyqNvzwajTpu4tToK71rs7P9QtC%2B2qRzhbYHAT3wYJFEbAMQ42uN%2F9fWTCF5s25BjrjAoHXtTQlG6LaDnxv8CybNr9ApEq%2B%2FdcUOISRyNALhQQVc%2Ba8P4z7G9X71l%2FDej27lyA1bm69CMXZ4uiHsAk%2BnfrIMnYnjd2y05TBXSASSF2uhsrC%2BXeHY6KkNNHjSyQzDlkEi0w5OOhuAgs7%2BEVNKW4iib0sgucD5FftAUpNQgVnUaqtYMD%2FyFAhoHZ%2BbA0CvoKPpnNfFT%2FR6HlEIj04G6hxVWj1Da0pBcOBZRejYrip%2BLIH8mfLWED9aRKRGswhsvCqR5Av42fMcCLnE%2BHefNFHS6Ym5B9F4E%2Fbd5jvu4Qn1AOhTsQHKkIAs4qH%2FdAP13O8GGhxTVpslaOe0NvTx5JyLc2R0Vc1MRbpqg5o3YZ8Tx%2F5HpKhRzrFnV0mduJrxJNv21p5kFMJMpQDTI22vZt2rQqgsxCh62ib6AdXr%2BhBz9NN4E2aYnbb99bfynkmNC6P36PnpC9F7ErMMkUuoiT0la4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JRVSALDM7%2F20241112%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20241112T152426Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=cf6f0b318e22c224b5c73a92abaef3d43b81e6f7a56f3d8616017e809cf571f4";

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
              linkedCaptionId: null,
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
