import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";

import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import React from "react";
import type {
  ContentType,
  FullSequenceItemType,
  LayerId,
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
              offset={nestedItem.offset}
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

const _NestedSequenceComposition = (
  props: NestedCompositionProjectType["props"],
) => {
  const { layers, layerOrder } = props;

  return (
    <AbsoluteFill className="">
      {[...layerOrder].reverse().map((layerId) => {
        /*         const layer = layers[layerId];
        if (!layer || !layer.isVisible) return null; */
        return (
          <TransitionSeries key={layerId} name={layerId}>
            {layers[layerId].liteItems.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  <TransitionSeries.Sequence
                    key={item.id}
                    durationInFrames={item.sequenceDuration}
                    name={item.id}
                    offset={item.offset}
                  >
                    <SequenceRenderer
                      liteItem={item}
                      layerId={layerId as LayerId}
                      sequenceItems={props.sequenceItems} // TODO : do we need send the entire sequenceItems ? or maybe we can use context or composition
                    />
                  </TransitionSeries.Sequence>
                  {item.transition?.outgoing && (
                    <TransitionSeries.Transition
                      presentation={slide()}
                      timing={linearTiming({ durationInFrames: 15 * 2 })} // duration of transition , as of now it is 30 frames hardcoded
                    />
                  )}
                </React.Fragment>
              );
            })}
          </TransitionSeries>
        );
      })}
    </AbsoluteFill>
  );
};

const NestedSequenceCompositionExp1 = () => {
  return (
    <AbsoluteFill className="font-serif">
      <TransitionSeries name={"Layer B"}>
        <TransitionSeries.Sequence
          name={"Sequence 1"}
          durationInFrames={600}
          offset={0}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
            className="grid place-items-center p-10 text-5xl text-white"
          >
            Background Layer
          </div>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <TransitionSeries name={"Layer F"}>
        <TransitionSeries.Sequence
          name={"Sequence 3"}
          durationInFrames={300}
          offset={0}
          className="bg-red-950"
        >
          {/* -------------------------------- Preset Bg starts -------------------------------- */}
          <TransitionSeries name="Preset Bg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={150}
              offset={0}
              className="bg-green-900"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Preset bg 1
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={150}
              offset={0}
              className="bg-green-900"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Preset bg 2
              </div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Bg ends -------------------------------- */}

          {/* -------------------------------- Preset Fg starts -------------------------------- */}
          <TransitionSeries name="Preset Fg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={90}
              offset={100}
              className="bg-yellow-900"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Preset F 1
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={90}
              offset={0}
              className="bg-yellow-900"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Preset F 2
              </div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Fg ends -------------------------------- */}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide()}
          timing={linearTiming({ durationInFrames: 15 * 2 })} // duration of transition , as of now it is 30 frames hardcoded
        />
        {/* <TransitionSeries.Sequence
          name={"Sequence 1"}
          durationInFrames={210}
          offset={300}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "darkgray",
            }}
            className="grid place-items-center p-10 text-5xl text-white"
          >
            Hello
          </div>
        </TransitionSeries.Sequence> */}
      </TransitionSeries>

      {/*     <TransitionSeries name={"Layer MF"}>
        <TransitionSeries.Sequence
          name={"Sequence 1"}
          durationInFrames={210}
          offset={300}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "darkgray",
            }}
            className="grid place-items-center p-10 text-5xl text-white"
          >
            Top Layer
          </div>
        </TransitionSeries.Sequence>
      </TransitionSeries>
 */}
    </AbsoluteFill>
  );
};

const NestedSequenceCompositionWithHardcoded = () => {
  return (
    <AbsoluteFill className="font-serif">
      <TransitionSeries name={"Layer F"}>
        <TransitionSeries.Sequence
          name={"Sequence 3"}
          durationInFrames={270}
          offset={90}
        >
          {/* -------------------------------- Preset Bg starts -------------------------------- */}
          <TransitionSeries name="Preset Bg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={270}
              offset={0}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div></div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Bg ends -------------------------------- */}

          {/* -------------------------------- Preset Fg starts -------------------------------- */}
          <TransitionSeries name="Preset Fg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Like.
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Share.
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Subscribe.
              </div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Fg ends -------------------------------- */}
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

type LiteSequenceItemTypeNew = {
  id: string;
  sequenceDuration: number;
  effectiveDuration: number;
  offset: number;
  transition?: {
    incoming?: {
      id: string;
      duration: number;
    };
    outgoing?: {
      id: string;
      duration: number;
    };
  };
  startFrame: number;
} & (
  | {
      sequenceType: "standalone";
      contentType: ContentType;
    }
  | {
      sequenceType: "preset";
      layers: {
        [layerId: string]: {
          liteItems: LiteSequenceItemTypeNew[];
        };
      };
      layerOrder: string[];
    }
);

export type FullSequenceItemTypeNew = {
  id: string;
  layerId: string;
  type: ContentType;
  editableProps: {
    text?: string;
    imageUrl?: string;
    styles: {
      container?: React.CSSProperties;
      element?: React.CSSProperties;
      overlay?: React.CSSProperties;
    };
  };
};

export type NewPropsType = {
  id: string;
  title: string;
  props: {
    compositionMetaData: {
      width: number;
      height: number;
      fps: number;
      duration: number;
      compositionId: string;
    };
    layers: {
      [layerId: string]: {
        id: string;
        name: string;
        isVisible: boolean;
        liteItems: LiteSequenceItemTypeNew[];
      };
    };
    layerOrder: string[]; // Array of layer IDs to maintain order
    sequenceItems: {
      [key: string]: FullSequenceItemTypeNew;
    };
  };
};

const SequenceContent: React.FC<{ item: FullSequenceItemType }> = ({
  item,
}) => {
  const { type, editableProps } = item;
  const { styles, text, imageUrl } = editableProps;

  switch (type) {
    case "text":
      return (
        <div
          style={styles.container}
          className="grid place-items-center p-10 text-5xl text-white"
        >
          <div style={styles.element}>{text}</div>
        </div>
      );
    case "image":
      return (
        <div style={styles.container}>
          <img src={imageUrl} alt="" style={styles.element} />
          {styles.overlay && <div style={styles.overlay}></div>}
        </div>
      );
    case "div":
      return <div style={{ ...styles.container, ...styles.element }}></div>;
    default:
      return null;
  }
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: NewPropsType["props"]["sequenceItems"];
}> = ({ item, sequenceItems }) => {
  if (item.sequenceType === "standalone") {
    const sequenceItem = sequenceItems[item.id];
    return (
      <TransitionSeries.Sequence
        name={`Sequence ${item.id}`}
        durationInFrames={item.effectiveDuration}
        offset={item.offset}
      >
        <SequenceContent item={sequenceItem} />
      </TransitionSeries.Sequence>
    );
  } else if (item.sequenceType === "preset") {
    return (
      <TransitionSeries.Sequence
        name={`Preset ${item.id}`}
        durationInFrames={item.effectiveDuration}
        offset={item.offset}
      >
        {item.layerOrder.map((layerId) => (
          <TransitionSeries key={layerId} name={`Layer ${layerId}`}>
            {item.layers[layerId].liteItems.map((nestedItem) => (
              <RenderSequence
                key={nestedItem.id}
                item={nestedItem}
                sequenceItems={sequenceItems}
              />
            ))}
          </TransitionSeries>
        ))}
      </TransitionSeries.Sequence>
    );
  }
  return null;
};

export const PROPS: NewPropsType["props"] = {
  layers: {
    layerMiddle: {
      liteItems: [
        {
          id: "preset-c2e1d7931a93",
          sequenceType: "preset",
          effectiveDuration: 270,
          offset: 90,
          sequenceDuration: 270,
          startFrame: 90,
          layers: {
            layerBg: {
              liteItems: [
                {
                  id: "p-div-bg",
                  sequenceType: "standalone",
                  contentType: "div",
                  startFrame: 61,
                  effectiveDuration: 60,
                  sequenceDuration: 60,
                  offset: 61,
                },
              ],
            },
            layerMiddle: {
              liteItems: [
                {
                  id: "s-fg-0",
                  sequenceType: "standalone",
                  contentType: "text",
                  startFrame: 61,
                  effectiveDuration: 60,
                  sequenceDuration: 60,
                  offset: 61,
                },
                {
                  id: "s-fg-1",
                  sequenceType: "standalone",
                  contentType: "text",
                  startFrame: 121, // start frame wrong
                  effectiveDuration: 60,
                  sequenceDuration: 60,
                  offset: 0,
                },
                {
                  id: "s-fg-2",
                  sequenceType: "standalone",
                  contentType: "text",
                  startFrame: 181,
                  effectiveDuration: 60,
                  sequenceDuration: 60,
                  offset: 0,
                },
              ],
            },
          },
          layerOrder: ["layerBg", "layerMiddle"],
        },
      ],
      id: "layerMiddle",
      isVisible: true,
      name: "Layer Middle",
    },
    layerBg: {
      liteItems: [
        {
          id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
          sequenceType: "standalone",
          contentType: "image",
          startFrame: 0,
          effectiveDuration: 150,
          sequenceDuration: 150,
          offset: 0,
        },
      ],
      id: "layerBg",
      isVisible: true,
      name: "Layer Bg",
    },
  },
  layerOrder: ["layerBg", "layerMiddle"],
  sequenceItems: {
    "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
      id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
      layerId: "layerBg",
      type: "image",
      editableProps: {
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        },
        imageUrl: "https://picsum.photos/600/1000",
      },
    },
    "p-div-bg": {
      id: "s-div-bg",
      layerId: "layerBg",
      type: "div",
      editableProps: {
        styles: {
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
          },
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
        },
      },
    },
    "s-fg-0": {
      id: "s-fg-0",
      layerId: "layerMiddle",
      type: "text",
      editableProps: {
        text: "Like.",
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
          },
        },
      },
    },
    "s-fg-1": {
      id: "s-fg-1",
      layerId: "layerMiddle",
      type: "text",
      editableProps: {
        text: "Share.",
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
          },
        },
      },
    },
    "s-fg-2": {
      id: "s-fg-2",
      layerId: "layerMiddle",
      type: "text",
      editableProps: {
        text: "Subscribe.",
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
          },
        },
      },
    },
  },
  compositionMetaData: {
    width: 600,
    height: 1000,
    fps: 30,
    duration: 600,
    compositionId: "new-dynamic-composition",
  },
};

const NestedSequenceComposition: React.FC<{ props: NewPropsType["props"] }> = ({
  props,
}) => {
  const { layers, layerOrder, sequenceItems } = props;

  return (
    <AbsoluteFill className="font-serif">
      {layerOrder.map((layerId) => (
        <TransitionSeries key={layerId} name={`Layer ${layers[layerId].name}`}>
          {layers[layerId].liteItems.map((item) => (
            <RenderSequence
              key={item.id}
              item={item}
              sequenceItems={sequenceItems}
            />
          ))}
        </TransitionSeries>
      ))}
    </AbsoluteFill>
  );
};

export default NestedSequenceComposition;
