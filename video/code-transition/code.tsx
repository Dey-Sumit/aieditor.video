import { Pre, type HighlightedCode } from "codehike/code";
import { callout } from "./annotations/callout";
import { mark } from "./annotations/mark";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";

import { loadFont } from "@remotion/google-fonts/RobotoMono";
import type { Step } from "~/types/code-transition-editor.store.types";

const { fontFamily } = loadFont();
console.log({ fontFamily });

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
  step: Step;
}) {
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    durationInFrames,
  );

  const fontData = getFontData(step.fontUtils || ""); // Output: { size: 26, fontFamily: 'Inter', fontWeight: 700 }
  // console.log({ fontData });

  return (
    <div
      className="h-full w-full"
      style={{
        // backgroundColor: 'red',
        lineHeight: 1.7,
        // fontFamily: "Roboto Mono",
        fontSize: "40px",
        fontWeight: 400,
        width: "100%",
        padding: "16px 42px",
        //  fontFamily,
        // fontFamily: "'Fira Code', monospace",
        // fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
        // fontVariantLigatures: "common-ligatures",
        // fontLigatures
        ...fontData,
      }}
      // className="p-10 text-3xl border border-gray-500"
      // style={{
      //   fontFamily,
      // }}
    >
      <div
        className=""
        style={{
          textAlign: "center",

          color: "#f1f1f1",
          fontSize: "1.7rem",
          fontFamily,
          marginBottom: "1rem",
        }}
      >
        {newCode.meta}
      </div>
      <Pre
        ref={ref}
        code={code}
        handlers={[tokenTransitions, mark, callout]}
        // style={{
        //   fontFamily,
        // }}
        style={{
          fontFamily,
          //fontFamily: "'Fira Code', monospace",
          fontFeatureSettings: '"liga" 1, "calt" 1',
          WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
          fontVariantLigatures: "contextual",
        }}
        // className="subpixel-antialiased"
      />
    </div>
  );
}

// export async function MyCode({ codeblock }: { codeblock: RawCode }) {
//   const highlighted = await highlight(codeblock, "github-dark");
//   return <Pre code={highlighted} />;
// }
