import { Pre, type HighlightedCode } from "codehike/code";

import { loadFont } from "@remotion/google-fonts/RobotoMono";
import { AbsoluteFill } from "remotion";
import type { Steps } from "../Root";
import { mark } from "./annotations/mark";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";

const { fontFamily } = loadFont();

type FontData = Pick<
  React.CSSProperties,
  "fontSize" | "fontFamily" | "fontWeight"
>;

// TODO : why is this not working?
const defaultFontProps: FontData = {
  fontSize: "32px",
  fontFamily: fontFamily,
  fontWeight: 400,
};

const getFontData = (input: string) => {
  const inputValues = input.split(" ").reduce((acc, pair) => {
    const [key, value] = pair.split(":");
    if (key && value) {
      acc[key as keyof FontData] = value;
    }
    return acc;
  }, {} as FontData);

  return inputValues;
};

export function CodeTransition({
  oldCode,
  newCode,
  durationInFrames = 30,
  disableTransition,
  step,
}: {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  durationInFrames?: number;
  disableTransition?: boolean;
  step: Steps[number];
}) {
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    durationInFrames,
  );

  const fontData = getFontData(step.fontUtils || ""); // Output: { size: 26, fontFamily: 'Inter', fontWeight: 700 }
  console.log({ fontData });

  return (
    <AbsoluteFill
      style={{
        // backgroundColor: 'red',
        lineHeight: 1.6,
        fontFamily: "Roboto Mono",
        fontSize: "32px",
        fontWeight: 400,
        width: "100%",
        padding: "16px 42px",
        ...fontData,
      }}
      // className="p-10 text-3xl border border-gray-500"
      // style={{
      //   fontFamily,
      // }}
    >
      <div
        style={{
          textAlign: "center",
          height: "1.5rem",
          marginBottom: "60px",
          color: "#f1f1f1",
        }}
      >
        {newCode.meta}
      </div>
      <Pre ref={ref} code={code} handlers={[tokenTransitions, mark]} />
    </AbsoluteFill>
  );
}
