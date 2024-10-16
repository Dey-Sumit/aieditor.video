import { Composition, type CalculateMetadataFunction } from "remotion";
import { type NestedCompositionProjectType } from "~/types/timeline.types";
import NestedSequenceCompositionPreset, {
  DEFAULT_PRESET_COMP_PROPS,
} from "./new-preset-compositio";
// import NestedSequenceComposition from "./composition";
// const VIDEO_SRC =
//   "https://video.twimg.com/ext_tw_video/1827606980677996544/pu/vid/avc1/320x568/ju53EmmBp9D5aOJA.mp4?tag=12";

const calculateMetadata: CalculateMetadataFunction<
  NestedCompositionProjectType["props"]
> = async ({ props, defaultProps, abortSignal }) => {
  // const data = await getVideoMetadata(VIDEO_SRC);

  return {
    // Change the metadata
    // durationInFrames: props.compositionMetaData.duration,
    durationInFrames: props.compositionMetaData.duration,
  };
};

const NewDynamicCompositionWithLoader = () => {
  // const { props } = useVideoStore();

  return (
    <>
      <Composition
        id="preset-composition"
        component={NestedSequenceCompositionPreset}
        durationInFrames={20 * 30}
        fps={DEFAULT_PRESET_COMP_PROPS.compositionMetaData.fps}
        width={DEFAULT_PRESET_COMP_PROPS.compositionMetaData.width}
        height={DEFAULT_PRESET_COMP_PROPS.compositionMetaData.height}
        defaultProps={{
          props: {
            compositionMetaData: DEFAULT_PRESET_COMP_PROPS.compositionMetaData,
            layerOrder: DEFAULT_PRESET_COMP_PROPS.layerOrder,
            layers: DEFAULT_PRESET_COMP_PROPS.layers,
            sequenceItems: DEFAULT_PRESET_COMP_PROPS.sequenceItems,
          },
        }}
        // schema={NestedCompositionPropsSchema}

        // calculateMetadata={calculateMetadata}
      />
    </>
  );
};

export default NewDynamicCompositionWithLoader;
