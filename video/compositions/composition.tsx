import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";

import { slide } from "@remotion/transitions/slide";

import React from "react";
import type {
  LiteSequenceItemType,
  NestedCompositionProjectType,
  StyledSequenceItem,
} from "~/types/timeline.types";

// TODO : use this
export const SafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ["div", "p", "span", "strong", "s", "u", "mark"],
    ALLOWED_ATTR: ["style"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

type NestedCompositionProjectProps = NestedCompositionProjectType["props"];

const SequenceItemRenderer: React.FC<{ item: StyledSequenceItem }> = ({
  item,
}) => {
  if (item.type === "preset") {
    // This case should not occur here as it's handled in RenderSequence
    return null;
  }

  switch (item.type) {
    case "div":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <div style={item.editableProps?.styles?.element}></div>
        </AbsoluteFill>
      );
    case "text":
      return (
        <AbsoluteFill
          style={item.editableProps?.styles?.container}
          className="dark"
        >
          <div style={item.editableProps?.styles?.element}>
            <div
              dangerouslySetInnerHTML={{ __html: item.editableProps.text }}
              className="prose prose-2xl space-y-0 whitespace-pre-wrap dark:prose-invert [&>*]:my-0"
            />
          </div>
        </AbsoluteFill>
      );
    case "image":
      // return <AnimatedImage item={item as ImageSequenceItemType} />;
      return (
        <AbsoluteFill
          className=""
          style={{
            ...item.editableProps?.styles?.container,
          }}
        >
          <AbsoluteFill
            className=""
            style={{
              ...item.editableProps?.styles?.overlay,
            }}
          />
          <Img
            src={item.editableProps.imageUrl}
            style={{
              objectFit: "cover",
              ...item.editableProps?.styles?.element,
            }}
            className="box-content"
          />
        </AbsoluteFill>
      );

    case "video":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <AbsoluteFill className="bg-black/30" />
          <OffthreadVideo
            src={item.editableProps.videoUrl}
            style={item.editableProps?.styles?.element}
            className="object-cover"
            startFrom={item.editableProps.videoStartsFromInFrames}
            endAt={item.editableProps.videoEndsAtInFrames}
          />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: Record<string, StyledSequenceItem>;
}> = ({ item, sequenceItems }) => {
  if (item.sequenceType === "standalone") {
    const sequenceItem = sequenceItems[item.id];
    return sequenceItem ? <SequenceItemRenderer item={sequenceItem} /> : null;
  }

  if (item.sequenceType === "preset") {
    const presetSequenceItem = sequenceItems[item.id] as StyledSequenceItem & {
      type: "preset";
    };
    if (!presetSequenceItem || presetSequenceItem.type !== "preset") {
      return null;
    }

    return (
      <NestedSequenceComposition
        //@ts-ignore,the props are not needed.Visible prop later.
        layers={item.layers}
        layerOrder={item.layerOrder}
        sequenceItems={presetSequenceItem.sequenceItems}
        compositionMetaData={{
          width: 0, // You might want to pass these values from parent
          height: 0,
          fps: 0,
          duration: item.sequenceDuration,
          compositionId: item.id,
        }}
      />
    );
  }

  return null;
};

const NestedSequenceComposition: React.FC<NestedCompositionProjectProps> = (
  props,
) => {
  const { layers, layerOrder, sequenceItems } = props;
  // console.log("props", props);

  return (
    <AbsoluteFill className="font-serif">
      {[...layerOrder].reverse().map((layerId) => (
        <TransitionSeries key={layerId} name={layerId}>
          {layers[layerId].liteItems.map((item) => (
            <React.Fragment key={item.id}>
              <TransitionSeries.Sequence
                durationInFrames={item.sequenceDuration}
                name={item.id}
                offset={item.offset}
              >
                <RenderSequence item={item} sequenceItems={sequenceItems} />
              </TransitionSeries.Sequence>
              {item.transition?.outgoing && (
                <TransitionSeries.Transition
                  presentation={slide()}
                  timing={linearTiming({
                    durationInFrames: item.transition.outgoing.duration * 2,
                  })}
                />
              )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      ))}
    </AbsoluteFill>
  );
};

export default NestedSequenceComposition;
