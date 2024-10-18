import { Composition, type CalculateMetadataFunction } from "remotion";
import { FINAL_DUMMY_NESTED_PROJECT } from "~/data/nested-composition.data";
import {
  NestedCompositionPropsSchema,
  type NestedCompositionProjectType,
} from "~/types/timeline.types";
import NestedSequenceComposition from "./composition";

const calculateMetadata: CalculateMetadataFunction<
  NestedCompositionProjectType["props"]
> = async ({ props, defaultProps, abortSignal }) => {
  return {
    // Change the metadata
    // durationInFrames: props.compositionMetaData.duration,
    durationInFrames: props.compositionMetaData.duration,
  };
};

const NewDynamicCompositionWithLoader = () => {
  const { props } = FINAL_DUMMY_NESTED_PROJECT;
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
        schema={NestedCompositionPropsSchema}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};

export default NewDynamicCompositionWithLoader;
