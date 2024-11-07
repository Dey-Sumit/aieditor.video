import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
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

export const processCaptionsLite = ({
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
export const processCaptions = ({
  captions,
  fps,
  layerId,
}: ProcessCaptionsParams): ProcessCaptionsResult => {
  const liteItems: LiteSequenceItemType[] = [];
  const sequenceItems: Record<string, FullSequenceContentType> = {};

  // First create TikTok style pages
  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 200,
  });

  // Now process pages instead of raw captions
  pages.forEach((page, index) => {
    const id = `s-caption-${genId("s", "text")}`;
    const startFrame = msToFrames(page.startMs, fps);

    // Get end time from last token
    const lastToken = page.tokens[page.tokens.length - 1];
    const endFrame = msToFrames(lastToken.toMs, fps);
    const duration = endFrame - startFrame;

    // Rest of the liteItem creation remains similar...
    const prevItem = liteItems[index - 1];
    const offset = prevItem
      ? startFrame - (prevItem.startFrame + prevItem.effectiveDuration)
      : startFrame;

    const liteItem: LiteSequenceItemType = {
      id,
      sequenceType: "standalone",
      contentType: "caption-page",
      sequenceDuration: duration,
      effectiveDuration: duration,
      startFrame,
      offset,
    };

    liteItems.push(liteItem);

    // Add token info to sequenceItems
    sequenceItems[id] = {
      id,
      type: "caption-page",
      layerId,
      editableProps: {
        text: page.text,
        // Store timing info for highlighting
        startMs: page.startMs,
        tokens: page.tokens,
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            color: "white",
            fontSize: "64px",
          },
        },
        positionAndDimensions: {
          top: 0,
          left: 0,
          width: 720,
          height: 1080,
        },
      },
    };
  });

  return { liteItems, sequenceItems };
};
