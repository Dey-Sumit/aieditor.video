import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { Sequence, useVideoConfig } from "remotion";
import SubtitlePage from "./SubtitlePage";
import { loadFont } from "./load-font";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

loadFont();

export const CaptionsItem = ({
  item,
}: {
  item: {
    captions: Caption[];
    type: "captions";
    top: number;
    left: number;
    width: number;
    height: number;
  };
}) => {
  if (item.type !== "captions") {
    throw new Error("Item is not captions");
  }

  const { fps } = useVideoConfig();

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      left: item.left,
      top: item.top,
      width: item.width,
      height: item.height,
    };
  }, [item.height, item.left, item.top, item.width]);

  const { pages } = createTikTokStyleCaptions({
    captions: item.captions,
    combineTokensWithinMilliseconds: 200,
  });

  return (
    <div style={style} className="text-white">
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage captionWidth={item.width} key={index} page={page} />
          </Sequence>
        );
      })}
    </div>
  );
};
