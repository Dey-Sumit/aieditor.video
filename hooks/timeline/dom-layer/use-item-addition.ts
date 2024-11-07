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
    "https://video-editor-user-upload-assets.s3.ap-south-1.amazonaws.com/better-call-saul-360p-with-audio.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCmFwLXNvdXRoLTEiSDBGAiEAsFUEpVdT0meu%2Bdu%2Fglwf7jVT7RdPZEwZeaWpIYhJGZYCIQDx7flC8JbjduvFpWMvbi0t3xpBq1G1MAkdnjjLOjEyASrtAgjA%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA1ODI2NDI1MjM3MSIMTjK1NTk%2FEjc7vbSbKsECYCClfeXH35nKX6kZAngXIK9TGZ%2B2OVEiAFdIXJNtWZrrENoBfjPs2sTIf69cs5SFf3w6i7Klu1ms3CowpEzJVU9dqSUzaJJc%2BQ6TTIS0YvSbgQXzB1Du05rY5jKB5VrjyfxguVOUMiskYI6Ey5nDHfwL1LTRBuFZER6bcT2lbCKgNZw%2BKogcW00vwqVLELA3dhTfbEYHASJPfzvXhX0eRcvX%2FaCCogV3WJE6KYMNBCLgTANpJefVlKFYOGgqzVvO7vmR%2Fk%2BLnkL3WMhlneLDLn8GI8muQBCIy1fiEpq0JDWGFZmISXAcgr6BEecKbw5FYED7wP1rybD7iyUZ8DmEtLc%2Bt%2BXU9rkkuo5WqAW5as%2BXQ9VKT0rFzJSHA5n3i37vu%2F750qFoj7pa7iRy9SoJhOcVRlxtW%2FRxbuQneuTZ2MtqMI6T5LgGOrICjxcngERxWe9uwrA0IDVbW9zKLrGlffyEK09pqrkrXkakecjO3KohEJVwup6NlA5sepsVyitw0DcE5ravJQW2VSZbrHUW33qahNU%2FfWgSt1dQZAnYDoFnbb8JDJBFnYLg7FBq1c%2BsQjXlXD3Fw%2B59aTdb6Xe1kcVg7wEi1Ylmtb2m9AKLXOC0ouN02CL22Ma9UMJJFbxDZy5f9xduJmIIOH5yNS39Qdh%2BHxlkiVbFmCHkngerjt3bxgIvfPCDw8y9P4ViDhkGiArpE%2BmSSHq%2F0uAi4Za7kxXrDqA8Q9ezby5SMkJW%2FP8hs3tsddcyGLGly6KvHPsF1CD5VHiw0iKLwF29XTTF9akvLVP2NQjfAGpwPvyZyBxQMgOnoZUmoepfGsaZ%2FQLZkw7xopHYv4b4AhoO&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241023T144607Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAQ3EGR57J6USMW655%2F20241023%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=9f8621b40d90257bdf308cf9d8258059870593553d1fce2dd85d309e1cc0a779";

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
              sequenceDuration: duration,
              effectiveDuration: duration,
              sequenceType: "standalone",
              startFrame,
              linkedCaptionLayerId: null,
            },
            {
              type: "video",
              editableProps: {
                videoEndsAtInFrames: duration,
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
