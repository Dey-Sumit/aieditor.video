import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { Composition } from "remotion";
import { z } from "zod";
import Content from "../code-transition/contents/promise-all-polyfill.md";
import CodeTransitionComposition from "./code-transition.composition";

const TransitionType = z.enum(["magic", "fade", "wipe", "slide", "none"]);

const { steps } = parseRoot(
  Content,
  Block.extend({
    steps: z.array(
      Block.extend({
        code: HighlightedCodeBlock,
        duration: z.string().transform((v) => parseInt(v, 10)),
        transition: TransitionType,
        fontUtils: z.string().optional(),
        // test: Block.optional(),
      }),
    ),
  }),
);

export type Steps = typeof steps;

export const transitionDurations: Record<
  z.infer<typeof TransitionType>,
  number
> = {
  magic: 0, // example duration, adjust as needed
  wipe: 30, // example duration, adjust as needed
  slide: 30, // example duration, adjust as needed
  none: 0, // assuming 'none' means no transition
  fade: 30,
  // add other transitions if needed
};

export default function CodeTransitionCompositionLoader() {
  const duration = steps.reduce((acc, step) => acc + step.duration, 0);
  return (
    <Composition
      id="FinalCodeTransition"
      component={CodeTransitionComposition}
      defaultProps={{ steps }}
      durationInFrames={duration}
      fps={60}
      width={1920}
      height={1080}
      calculateMetadata={({ props }) => {
        // const duration = props.steps.reduce((acc, step) => {
        //   return acc + step.duration - transitionDurations[step.transition];
        // }, 0);

        return {
          durationInFrames: 1000,
          width: 1920,
          height: 1080,
          fps: 60,
        };
      }}
    />
  );
}
