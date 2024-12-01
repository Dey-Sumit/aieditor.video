import { Composition } from "remotion";
// import Content from "../code-transition/contents/promise-all-polyfill.md";
import type { EditorState } from "~/types/code-transition-editor.store.types";
import CodeTransitionComposition from "./code-transition.composition";

const HARDCODED_STEPS: EditorState["steps"] = [
  {
    code: {
      meta: "Example 1: All promises resolve",
      value:
        '\nconst user = {\n  name: "Lorem",\n  age: 26,\n}\n\nconsole.log(user)\n//           ^?\n',
      lang: "typescript",
      code: '\nconst user = {\n  name: "Lorem",\n  age: 26,\n}\n\nconsole.log(user)\n//           ^?\n',
      tokens: [
        "\n",
        ["const", "#FF7B72"],
        " ",
        ["user", "#79C0FF"],
        " ",
        ["=", "#FF7B72"],
        " ",
        ["{", "#C9D1D9"],
        "\n  ",
        ["name:", "#C9D1D9"],
        " ",
        ['"Lorem"', "#A5D6FF"],
        [",", "#C9D1D9"],
        "\n  ",
        ["age:", "#C9D1D9"],
        " ",
        ["26", "#79C0FF"],
        [",", "#C9D1D9"],
        "\n",
        ["}", "#C9D1D9"],
        "\n\n",
        ["console.", "#C9D1D9"],
        ["log", "#D2A8FF"],
        ["(user)", "#C9D1D9"],
        "\n",
        ["//           ^?", "#8B949E"],
        "\n",
      ],
      annotations: [],
      themeName: "github-dark",
      style: {
        color: "#c9d1d9",
        background: "#0d1117",
        colorScheme: "dark",
      },
    },
    duration: 180,
    fontUtils: "",
    transition: "magic",
  },
];

export default function CodeTransitionCompositionLoader() {
  return (
    <Composition
      id="code-transition-composition"
      component={CodeTransitionComposition}
      defaultProps={{ steps: HARDCODED_STEPS }}
      fps={60}
      width={1920}
      height={1080}
      calculateMetadata={({ props }) => {
        const duration = props.steps.reduce((acc, step) => {
          return acc + step.duration; // subtract the duration of the transition/2
        }, 0);

        return {
          durationInFrames: duration,
          width: 1920,
          height: 1080,
          fps: 60,
        };
      }}
    />
  );
}
