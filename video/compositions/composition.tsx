import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";

import { slide } from "@remotion/transitions/slide";

import React from "react";
import DragResizeComponent from "~/components/new-player/drag-and-resize";
import type {
  FullSequenceContentType,
  LiteSequenceItemType,
  NestedCompositionProjectType,
  StoreActions,
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

const SequenceItemRenderer: React.FC<{
  item: StyledSequenceItem;
  onChange: (updates: Partial<FullSequenceContentType>) => void;
}> = ({ item, onChange }) => {
  if (item.type === "preset") {
    return null;
  }

  const renderContent = () => {
    switch (item.type) {
      case "div":
        return <div style={item.editableProps?.styles?.element}></div>;
      case "text":
        return (
          <div
            style={item.editableProps?.styles?.element}
            dangerouslySetInnerHTML={{ __html: item.editableProps.text }}
            className="prose prose-2xl space-y-0 whitespace-pre-wrap dark:prose-invert [&>*]:my-0"
          />
        );
      case "image":
        return (
          <>
            <AbsoluteFill
              style={item.editableProps?.styles?.overlay}
              className=""
            />
            <Img
              src={item.editableProps.imageUrl}
              style={{
                objectFit: "cover",
                ...item.editableProps?.styles?.element,
              }}
              className="box-content"
            />
          </>
        );
      case "video":
        return (
          <OffthreadVideo
            src={item.editableProps.videoUrl}
            style={item.editableProps?.styles?.element}
            className="object-cover"
            startFrom={item.editableProps.videoStartsFromInFrames}
            endAt={item.editableProps.videoEndsAtInFrames}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DragResizeComponent item={item} onChange={onChange}>
      <AbsoluteFill
        style={item.editableProps?.styles?.container}
        className="bg-green-800"
      >
        {renderContent()}
      </AbsoluteFill>
    </DragResizeComponent>
  );
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: Record<string, StyledSequenceItem>;
  onChangeSequenceItem: (
    itemId: string,
    updates: Partial<FullSequenceContentType>,
  ) => void;
}> = ({ item, sequenceItems, onChangeSequenceItem }) => {
  if (item.sequenceType === "standalone") {
    const sequenceItem = sequenceItems[item.id];
    return sequenceItem ? (
      <SequenceItemRenderer
        onChange={(updates) => onChangeSequenceItem(item.id, updates)}
        item={sequenceItem}
        
      />
    ) : null;
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

const NestedSequenceComposition = ({
  props,
  updatePositionAndDimensions,
}: {
  props: NestedCompositionProjectType["props"];
  updatePositionAndDimensions: StoreActions["updatePositionAndDimensions"];
}) => {
  const { layers, layerOrder, sequenceItems } = props;
  // console.log("props", props);

  return (
    <AbsoluteFill className="bg-black font-serif">
      {[...layerOrder].reverse().map((layerId) => (
        <TransitionSeries key={layerId} name={layerId} layout="none">
          {layers[layerId].liteItems.map((item) => (
            <React.Fragment key={item.id}>
              <TransitionSeries.Sequence
                durationInFrames={item.sequenceDuration}
                name={item.id}
                offset={item.offset}
                layout="none"
              >
                {/* <div
                  style={{
                    position: "relative",
                    zIndex: activeItemId === item.id ? 1 : "auto",
                  }}
                > */}
                <RenderSequence
                  item={item}
                  sequenceItems={sequenceItems}
                  onChangeSequenceItem={
                    (itemId, updates) => {
                      console.log("onChangeSequenceItem", {
                        layerId,
                        itemId,
                        updates,
                      });
                      updatePositionAndDimensions(layerId, itemId, {
                        height:
                          updates.editableProps?.positionAndDimensions?.height,
                        width:
                          updates.editableProps?.positionAndDimensions?.width,
                        left: updates.editableProps?.positionAndDimensions
                          ?.left,
                        top: updates.editableProps?.positionAndDimensions?.top,
                      });
                    }
                    // onChangeSequenceItem(layerId, itemId, updates)
                  }
                />
                {/* </div> */}
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
