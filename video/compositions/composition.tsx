import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Img } from "remotion";
import DOMPurify from "dompurify";

import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import React from "react";
import {
  FullSequenceItemType,
  LayerId,
  LiteSequenceItemType,
  NestedCompositionProjectType,
} from "~/types/timeline.types";

const SafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ["div", "p", "span", "strong", "s", "u", "mark"],
    ALLOWED_ATTR: ["style"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

// Individual item renderer
const SequenceItemRenderer: React.FC<{ item: FullSequenceItemType }> = ({ item }) => {
  switch (item.type) {
    case "text":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <div style={item.editableProps?.styles?.element}>
            {item.editableProps.text.startsWith("<") ? (
              <SafeHTMLRenderer html={item.editableProps.text} />
            ) : (
              item.editableProps.text
            )}
          </div>
        </AbsoluteFill>
      );
    case "image":
      return (
        <AbsoluteFill>
          <AbsoluteFill className="bg-black/70" />
          <Img
            src={item.editableProps.imageUrl}
            style={{
              ...item.editableProps?.styles?.element,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      );
    case "video":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <video src={item.editableProps.videoUrl} style={item.editableProps?.styles?.element} />
        </AbsoluteFill>
      );
    // case "audio":
    //   return <audio src={item.editableProps.audioUrl} />;
    default:
      return null;
  }
};

// Sequence renderer (handles both standalone and preset sequences)
const SequenceRenderer: React.FC<{
  liteItem: LiteSequenceItemType;
  layerId: LayerId;
  sequenceItems: Record<string, FullSequenceItemType>;
}> = ({ liteItem, layerId, sequenceItems }) => {
  if (liteItem.sequenceType === "preset" && liteItem.liteItems) {
    return (
      <TransitionSeries name={liteItem.id}>
        {liteItem.liteItems.map((nestedItem) => (
          <React.Fragment key={nestedItem.id}>
            <TransitionSeries.Sequence
              name={nestedItem.id}
              key={nestedItem.id}
              durationInFrames={nestedItem.sequenceDuration}
            >
              <SequenceRenderer
                liteItem={nestedItem}
                layerId={layerId}
                sequenceItems={sequenceItems}
              />
            </TransitionSeries.Sequence>
            {nestedItem.transition?.outgoing && (
              <TransitionSeries.Transition
                presentation={wipe()}
                timing={linearTiming({ durationInFrames: 15 * 2 })} // duration of transition , as of now it is 30 frames hardcoded
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    );
  } else {
    const fullItem = sequenceItems[liteItem.id];
    return fullItem ? <SequenceItemRenderer item={fullItem} /> : null;
  }
};

const NestedSequenceComposition = (props: NestedCompositionProjectType["props"]) => {
  return (
    <AbsoluteFill>
      {Object.entries(props.layers).map(([layerId, layer]) => (
        <TransitionSeries key={layerId} name={layerId}>
          {layer.liteItems.map((item) => (
            <React.Fragment key={item.id}>
              <TransitionSeries.Sequence
                key={item.id}
                durationInFrames={item.sequenceDuration}
                name={item.id}
              >
                <SequenceRenderer
                  liteItem={item}
                  layerId={layerId as LayerId}
                  sequenceItems={props.sequenceItems[layerId as LayerId]}
                />
              </TransitionSeries.Sequence>
              {item.transition?.outgoing && (
                <TransitionSeries.Transition
                  presentation={slide()}
                  timing={linearTiming({ durationInFrames: 15 * 2 })} // duration of transition , as of now it is 30 frames hardcoded
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
