import type { Caption } from "@remotion/captions";
import type {
  FullSequenceContentType,
  LiteSequenceItemType,
} from "~/types/timeline.types";
import { genId } from "./misc.utils";

// utils/caption.utils.ts
type ProcessCaptionsParams = {
  captions: Caption[];
  fps: number;
  layerId: string;
};

type ProcessCaptionsResult = {
  liteItems: LiteSequenceItemType[];
  sequenceItems: Record<string, FullSequenceContentType>;
};

const msToFrames = (ms: number, fps: number): number => {
  return Math.round((ms / 1000) * fps);
};

export const processCaptions = ({
  captions,
  fps,
  layerId,
}: ProcessCaptionsParams): ProcessCaptionsResult => {
  const liteItems: LiteSequenceItemType[] = [];
  const sequenceItems: Record<string, FullSequenceContentType> = {};

  captions.forEach((caption, index) => {
    const id = `s-caption-${genId("s", "text")}`;
    const startFrame = msToFrames(caption.startMs, fps);
    const endFrame = msToFrames(caption.endMs, fps);
    const duration = endFrame - startFrame;

    // Calculate offset from previous item if exists
    const prevItem = liteItems[index - 1];
    const offset = prevItem
      ? startFrame - (prevItem.startFrame + prevItem.effectiveDuration)
      : startFrame;

    const liteItem: LiteSequenceItemType = {
      id,
      sequenceType: "standalone",
      contentType: "text",
      sequenceDuration: duration,
      effectiveDuration: duration,
      startFrame,
      offset,
    };

    liteItems.push(liteItem);
    sequenceItems[id] = {
      id,
      type: "text",
      layerId,
      editableProps: {
        text: caption.text,
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            color: "white",
            fontSize: "64px",
            // Add more default styles as needed
          },
        },
        positionAndDimensions: {
          top: 0,
          left: 0,
          width: 720, // These should probably come from params
          height: 1080,
        },
      },
    };
  });

  return { liteItems, sequenceItems };
};
