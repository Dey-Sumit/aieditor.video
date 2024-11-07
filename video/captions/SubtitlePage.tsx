import { type TikTokPage } from "@remotion/captions";
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionPage } from "./CaptionPage";
import { loadFont } from "./load-font";
loadFont();
const SubtitlePage: React.FC<{ page: TikTokPage; captionWidth: number }> = ({
  captionWidth,
  page,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  return (
    <CaptionPage
      captionWidth={captionWidth}
      enterProgress={enter}
      page={page}
    />
  );
};

export default SubtitlePage;
