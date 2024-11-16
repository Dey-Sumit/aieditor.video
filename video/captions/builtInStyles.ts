// builtInStyles.ts
import { makeTransform, translateY } from "@remotion/animation-utils";
import type { TikTokPage, TikTokToken } from "@remotion/captions";
import { interpolate } from "remotion";
// captionStyles.ts
export type CaptionStyle = {
  id: string;
  name: string;
  applySentenceStyle?: (enterProgress: number) => React.CSSProperties;
  applyWordStyle?: (
    token: TikTokToken,
    timeInMs: number,
    page: TikTokPage,
  ) => React.CSSProperties;
};

const slideUpStyle: CaptionStyle = {
  id: "slide-up",
  name: "Slide Up",
  applySentenceStyle: (enterProgress) => ({
    transform: makeTransform([
      translateY(interpolate(enterProgress, [0, 1], [50, 0])),
    ]),
    opacity: enterProgress,
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
  }),
  applyWordStyle: (token, timeInMs, page) => {
    const startRelativeToSequence = token.fromMs - page.startMs;
    const wordEnterProgress = Math.min(
      Math.max((timeInMs - startRelativeToSequence) / 150, 0),
      1,
    );

    return {
      transform: makeTransform([
        translateY(interpolate(wordEnterProgress, [0, 1], [30, 0])),
      ]),
      opacity: wordEnterProgress,
      transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
    };
  },
};

const highlightStyle: CaptionStyle = {
  id: "highlight",
  name: "Highlight Only",
  applyWordStyle: (token: TikTokToken, timeInMs: number, page: TikTokPage) => {
    const startRelativeToSequence = token.fromMs - page.startMs;
    const endRelativeToSequence = token.toMs - page.startMs;
    const active =
      startRelativeToSequence <= timeInMs && endRelativeToSequence > timeInMs;

    return {
      color: active ? "orange" : "white",
    };
  },
};

export const builtInStyles = [slideUpStyle, highlightStyle];
