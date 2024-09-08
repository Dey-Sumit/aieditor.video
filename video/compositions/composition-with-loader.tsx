import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import NestedSequenceComposition from "./composition";
import { NestedCompositionProjectType } from "~/types/timeline.types";
import { DUMMY_NESTED_PROJECT } from "~/data/mockdata.nested-composition";
// const VIDEO_SRC =
//   "https://video.twimg.com/ext_tw_video/1827606980677996544/pu/vid/avc1/320x568/ju53EmmBp9D5aOJA.mp4?tag=12";

const calculateMetadata: CalculateMetadataFunction<NestedCompositionProjectType["props"]> = async ({
  props,
  defaultProps,
  abortSignal,
}) => {
  // const data = await getVideoMetadata(VIDEO_SRC);

  return {
    // Change the metadata
    // durationInFrames: props.compositionMetaData.duration,
    durationInFrames: props.compositionMetaData.duration,
  };
};

const NewDynamicCompositionWithLoader = () => {
  // const { props } = useVideoStore();
  const { props } = DUMMY_NESTED_PROJECT;
  return (
    <>
      <Composition
        id="new-dynamic-composition"
        component={NestedSequenceComposition}
        durationInFrames={60 * 30}
        fps={props.compositionMetaData.fps}
        width={props.compositionMetaData.width}
        height={props.compositionMetaData.height}
        defaultProps={props}
        // schema={DynamicPropsSchema}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};

export default NewDynamicCompositionWithLoader;
