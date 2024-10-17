import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";

import { slide } from "@remotion/transitions/slide";

import React from "react";
import type {
  FullSequenceItemType,
  LiteSequenceItemType,
  NestedCompositionProjectType,
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

// Individual item renderer
const SequenceItemRenderer: React.FC<{ item: FullSequenceItemType }> = ({
  item,
}) => {
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
            {/* TODO : FIX THIS */}
            {/* {item.editableProps.text.startsWith("<") ? (
              <SafeHTMLRenderer html={item.editableProps.text} />
            ) : (
              <SafeHTMLRenderer html={item.editableProps.text} />
              // item.editableProps.text
            )} */}
            <div
              dangerouslySetInnerHTML={{ __html: item.editableProps.text }}
              className="prose prose-2xl space-y-0 whitespace-pre-wrap dark:prose-invert [&>*]:my-0"
            />
          </div>
        </AbsoluteFill>
      );
    case "image": {
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
    }
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
    // case "audio":
    //   return <audio src={item.editableProps.audioUrl} />;
    default:
      return null;
  }
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: Record<string, FullSequenceItemType>;
}> = ({ item, sequenceItems }) => {
  if (item.sequenceType === "standalone") {
    return <SequenceItemRenderer item={sequenceItems[item.id]} />;
  }

  if (item.sequenceType === "preset") {
    return (
      <>
        {item.layerOrder.map((layerId) => (
          <TransitionSeries key={layerId} name={layerId}>
            {item.layers[layerId].liteItems.map((subItem) => (
              <React.Fragment key={subItem.id}>
                <TransitionSeries.Sequence
                  key={subItem.id}
                  durationInFrames={subItem.sequenceDuration}
                  name={subItem.id}
                  offset={subItem.offset}
                >
                  {subItem.sequenceType === "standalone" ? (
                    <SequenceItemRenderer item={sequenceItems[subItem.id]} />
                  ) : (
                    <RenderSequence
                      item={subItem}
                      sequenceItems={sequenceItems}
                    />
                  )}
                </TransitionSeries.Sequence>
                {subItem.transition?.outgoing && (
                  <TransitionSeries.Transition
                    presentation={slide()}
                    timing={linearTiming({
                      durationInFrames:
                        subItem.transition?.outgoing.duration * 2,
                    })}
                  />
                )}
              </React.Fragment>
            ))}
          </TransitionSeries>
        ))}
      </>
    );
  }

  return null; // Handle unexpected sequenceType
};

const NestedSequenceComposition = (
  props: NestedCompositionProjectType["props"],
) => {
  const { layers, layerOrder, sequenceItems } = props;

  return (
    <AbsoluteFill className="font-serif">
      {[...layerOrder].reverse().map((layerId) => (
        <TransitionSeries key={layerId} name={layerId}>
          {layers[layerId].liteItems.map((item) => (
            <React.Fragment key={item.id}>
              <TransitionSeries.Sequence
                key={item.id}
                durationInFrames={item.sequenceDuration}
                name={item.id}
                offset={item.offset}
              >
                <RenderSequence
                  key={item.id}
                  item={item}
                  sequenceItems={sequenceItems}
                />
              </TransitionSeries.Sequence>
              {item.transition?.outgoing && (
                <TransitionSeries.Transition
                  presentation={slide()}
                  timing={linearTiming({
                    durationInFrames: item.transition?.outgoing.duration * 2,
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
