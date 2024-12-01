import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";

import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import type { EditorState } from "~/types/code-transition-editor.store.types";
import { CodeTransition } from "../code-transition/code";

function CodeTransitionComposition({ steps }: { steps: EditorState["steps"] }) {
  return (
    <AbsoluteFill className="border bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
      {/* <ProgressBar steps={steps} /> */}

      <TransitionSeries className="!inset-10 !h-auto !w-auto overflow-hidden rounded-xl border-2 border-gray-600 bg-gray-950 shadow-2xl">
        {steps.map((currentStep, index) => {
          const nextStep = steps[index + 1];
          const nextSceneTransition = nextStep?.transition;

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence
                key={index}
                durationInFrames={currentStep.duration}
              >
                <CodeTransition
                  step={currentStep}
                  //@ts-ignore
                  oldCode={steps[index - 1]?.code}
                  //@ts-ignore
                  newCode={currentStep.code}
                  durationInFrames={45}
                  disableTransition={currentStep.transition !== "magic"}
                />
              </TransitionSeries.Sequence>

              {nextSceneTransition === "slide" && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: 45,
                  })}
                  presentation={slide({
                    direction: "from-bottom",
                  })}
                />
              )}

              {nextSceneTransition === "wipe" && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: 45,
                  })}
                  presentation={wipe()}
                />
              )}
              {nextSceneTransition === "fade" && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: 45,
                  })}
                  presentation={fade()}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
}

export default CodeTransitionComposition;
