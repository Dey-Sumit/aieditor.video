import { Composition, type CalculateMetadataFunction } from "remotion";
import { DEFAULT_PRESET_COMP_PROPS } from "~/data/mockdata.nested-composition";
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
  const { props } = DEFAULT_PRESET_COMP_PROPS;
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
