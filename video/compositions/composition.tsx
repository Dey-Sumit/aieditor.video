import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";

import { slide } from "@remotion/transitions/slide";

import React, { useCallback, useState } from "react";
import { SortedOutlines } from "~/components/new-player/sorted-outlines";
import useThrottle from "~/hooks/use-throttle";
import type {
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
}> = ({ item }) => {
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
    // <DragResizeComponent item={item} onChange={onChange}>
    <AbsoluteFill
      style={{
        ...item.editableProps?.styles?.container,
        ...item.editableProps?.positionAndDimensions,
      }}
      className=""
    >
      {renderContent()}
    </AbsoluteFill>
    // </DragResizeComponent>
  );
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

const layerContainer: React.CSSProperties = {
  overflow: "hidden",
};

const NestedSequenceComposition = ({
  props,
  updatePositionAndDimensions,
}: {
  props: NestedCompositionProjectType["props"];
  updatePositionAndDimensions: StoreActions["updatePositionAndDimensions"];
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const throttledUpdatePositionAndDimensions = useThrottle(
    updatePositionAndDimensions,
    0,
  );

  const { layers, layerOrder, sequenceItems } = props;
  const changeItem = useCallback(
    (
      layerId: string,
      itemId: string,
      updater: (item: StyledSequenceItem) => StyledSequenceItem,
    ) => {
      const item = sequenceItems[itemId];
      if (!item) return;
      // console.log("changeItem called", { layerId, itemId, updater });

      const updatedItem = updater(item);
      const positionUpdates = updatedItem.editableProps.positionAndDimensions;

      if (positionUpdates) {
        // console.log("positionUpdates", {
        //   layerId,
        //   itemId,
        //   positionUpdates,
        //   isDragging: updatedItem.isDragging,
        // });

        updatePositionAndDimensions(
          layerId,
          itemId,
          positionUpdates,
          updatedItem.isDragging,
        );
      }
    },
    [sequenceItems, updatePositionAndDimensions],
  );
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) {
        return;
      }

      setSelectedItem(null);
    },
    [setSelectedItem],
  );

  return (
    <AbsoluteFill className="bg-green-800" onPointerDown={onPointerDown}>
      <AbsoluteFill className="font-serif" style={layerContainer}>
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

      {layerOrder.map((layerId) => (
        <SortedOutlines
          key={layerId}
          liteItems={layers[layerId].liteItems}
          sequenceItems={sequenceItems}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          changeItem={changeItem}
          layerId={layerId}
        />
      ))}
    </AbsoluteFill>
  );
};

export default NestedSequenceComposition;
