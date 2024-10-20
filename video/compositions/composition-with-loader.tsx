import { Composition, type CalculateMetadataFunction } from "remotion";
import useVideoStore from "~/store/video.store";
import { type NestedCompositionProjectType } from "~/types/timeline.types";
import NestedSequenceComposition from "./composition";

const calculateMetadata: CalculateMetadataFunction<
  NestedCompositionProjectType["props"]
> = async ({ props, defaultProps, abortSignal }) => {
  return {
    // Change the metadata
    // durationInFrames: props.compositionMetaData.duration,
    // durationInFrames: props.compositionMetaData.duration,
    durationInFrames: 20 * 30,
  };
};

const NewDynamicCompositionWithLoader = () => {
  const props = useVideoStore((store) => store.props);
  const updatePositionAndDimensions = useVideoStore(
    (store) => store.updatePositionAndDimensions,
  );
  if (!props) {
    return <div>Loading project...</div>;
  }
  console.log("NewDynamicCompositionWithLoader props", props);

  return (
    <>
      <Composition
        id="new-dynamic-composition"
        component={NestedSequenceComposition}
        durationInFrames={60 * 30}
        fps={props.compositionMetaData.fps}
        width={props.compositionMetaData.width}
        height={props.compositionMetaData.height}
        // defaultProps={{ props, updatePositionAndDimensions }}
        defaultProps={{
          props,
          updatePositionAndDimensions,
        }}
        // schema={NestedCompositionPropsSchema}
        // calculateMetadata={calculateMetadata}
      />
      {/* <Composition
        id="MyComp"
        component={AnimatedImageComposition}
        durationInFrames={600}
        fps={30}
        width={720}
        height={1080}
        defaultProps={{
          item: testSequenceItems[
            "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93"
          ],
        }}
      /> */}
    </>
  );
};

export default NewDynamicCompositionWithLoader;
