import { makeTransform, translateY } from "@remotion/animation-utils";
import { type TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TheBoldFont } from "./load-font";

const fontFamily = TheBoldFont;

const DESIRED_FONT_SIZE = 60;
const HIGHLIGHT_COLOR = "orange";
// const HIGHLIGHT_COLOR = "#39E508";

export const CaptionPage: React.FC<{
  enterProgress: number;
  page: TikTokPage;
  captionWidth: number;
}> = ({ enterProgress, page, captionWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  if (typeof window === "undefined") {
    return null;
  }

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: captionWidth,
    textTransform: "uppercase",
    validateFontIsLoaded: true,
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <div
      style={{
        fontSize,
        color: "white",
        WebkitTextStroke: "20px black",
        paintOrder: "stroke",
        // transform: makeTransform([
        //   scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
        //   translateY(interpolate(enterProgress, [0, 1], [50, 0])),
        // ]),
        fontFamily,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {page.tokens.map((t) => {
        const startRelativeToSequence = t.fromMs - page.startMs;
        const endRelativeToSequence = t.toMs - page.startMs;

        const active =
          startRelativeToSequence <= timeInMs &&
          endRelativeToSequence > timeInMs;

        const wordEnterProgress = Math.min(
          Math.max((timeInMs - startRelativeToSequence) / 100, 0),
          1,
        );

        const transform = makeTransform([
          translateY(interpolate(wordEnterProgress, [0, 1], [30, 0])),
        ]);

        const opacity = interpolate(wordEnterProgress, [0, 1], [0, 1]);

        return (
          <span
            key={t.fromMs + t.text}
            style={{
              display: "inline",
              whiteSpace: "pre",
              color: active ? HIGHLIGHT_COLOR : "white",
              opacity,
              transform,
              // transform: `translateY(${translateOffset}px)`,
              // transition: "transform 0.3s ease-out",
            }}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
};
