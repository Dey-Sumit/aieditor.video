import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";

import React from "react";
import { CodeTransition } from "../code-transition/code";

function CodeTransitionComposition({ steps }: { steps: Steps }) {
  console.log({ steps });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      {/* <ProgressBar steps={steps} /> */}

      <TransitionSeries>
        {steps.map((currentStep, index) => {
          const nextStep = steps[index + 1];
          const nextSceneTransition = nextStep?.transition;

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence
                key={index}
                durationInFrames={currentStep.duration}
                name={currentStep.title}
              >
                <CodeTransition
                  step={currentStep}
                  //@ts-ignore
                  oldCode={steps[index - 1]?.code}
                  //@ts-ignore
                  newCode={currentStep.code}
                  durationInFrames={90}
                  disableTransition={currentStep.transition !== "magic"}
                />
              </TransitionSeries.Sequence>

              {/* {nextSceneTransition === "slide" && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: transitionDurations[nextSceneTransition],
                  })}
                  presentation={slide({
                    direction: "from-bottom",
                  })}
                />
              )} */}
              {/* {nextSceneTransition === "wipe" && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: transitionDurations[nextSceneTransition],
                  })}
                  presentation={wipe()}
                />
              )} */}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
}

export default CodeTransitionComposition;
