import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Img } from "remotion";

export const DEFAULT_PRESET_COMP_PROPS: CompositionType["props"] = {
  layers: {
    layerMiddle: {
      liteItems: [
        {
          id: "preset-c2e1d7931a93",
          sequenceType: "preset",
          effectiveDuration: 600,
          offset: 90,
          sequenceDuration: 600,

          // while creating a preset ,I just need layers,layerOrder and the sequence items
          layers: {
            layerBg: {
              liteItems: [
                {
                  id: "p-div-bg",
                  sequenceType: "standalone",
                  contentType: "div",
                  effectiveDuration: 270,
                  sequenceDuration: 270,
                  offset: 0,
                },
              ],
            },
            layerMiddle: {
              liteItems: [
                {
                  id: "s-fg-0",
                  sequenceType: "standalone",
                  contentType: "text",

                  effectiveDuration: 90,
                  sequenceDuration: 90,
                  offset: 0,
                },
                {
                  id: "s-fg-1",
                  sequenceType: "standalone",
                  contentType: "text",

                  effectiveDuration: 90,
                  sequenceDuration: 90,
                  offset: 90,
                },
                {
                  id: "s-fg-2",
                  sequenceType: "standalone",
                  contentType: "text",

                  effectiveDuration: 90,
                  sequenceDuration: 90,
                  offset: 180,
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

          effectiveDuration: 600,
          sequenceDuration: 600,
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
      id: "p-div-bg",
      layerId: "layerBg",
      type: "div",
      editableProps: {
        styles: {
          element: {
            objectFit: "contain",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,0,0,0.6)",
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
        text: "<h1>Like.</h1>",
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
        text: "<h1>Share.</h1>",
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
        text: "<h1>Subscribe.</h1>",

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

type LiteSequenceItemType = {
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
} & (
  | {
      sequenceType: "standalone";
      contentType: ContentType;
    }
  | {
      sequenceType: "preset";
      layers: {
        [layerId: string]: {
          liteItems: LiteSequenceItemType[];
        };
      };
      layerOrder: string[];
    }
);

type ContentType = "text" | "image" | "div";

export type FullSequenceItemType = {
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

export type CompositionType = {
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
        liteItems: LiteSequenceItemType[];
      };
    };
    layerOrder: string[]; // Array of layer IDs to maintain order
    sequenceItems: {
      [key: string]: FullSequenceItemType;
    };
  };
};

/* const SequenceContent: React.FC<{ item: FullSequenceItemType }> = ({
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
          <Img src={imageUrl!} alt="" style={styles.element} />
          {styles.overlay && <div style={styles.overlay}></div>}
        </div>
      );
    case "div":
      return <div style={{ ...styles.container, ...styles.element }}></div>;
    default:
      return null;
  }
}; */

// Individual item renderer
const SequenceContent: React.FC<{ item: FullSequenceItemType }> = ({
  item,
}) => {
  console.log("item.type", item.type);

  switch (item.type) {
    case "div":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <div style={item.editableProps?.styles?.element}></div>
        </AbsoluteFill>
      );
    case "text":
      return (
        <AbsoluteFill style={item.editableProps?.styles?.container}>
          <div
            style={item.editableProps?.styles?.element}
            className="flex items-center justify-center font-serif text-7xl text-white"
          >
            <div
              dangerouslySetInnerHTML={{ __html: item.editableProps.text }}
              className="prose prose-2xl space-y-0 whitespace-pre-wrap text-white [&>*]:my-0"
            />
          </div>
        </AbsoluteFill>
      );
    case "image": {
      console.log("item.editableProps.imageUrl", item.editableProps.imageUrl);

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
            src={item.editableProps.imageUrl!}
            style={{
              objectFit: "cover",
              ...item.editableProps?.styles?.element,
            }}
            className="box-content"
          />
        </AbsoluteFill>
      );
    }

    default:
      return null;
  }
};

const RenderNestedSequences: React.FC<{
  items: LiteSequenceItemType[];
  sequenceItems: Record<string, FullSequenceItemType>;
}> = ({ items, sequenceItems }) => {
  return (
    <>
      {items.map((item) => (
        <RenderSequence
          key={item.id}
          item={item}
          sequenceItems={sequenceItems}
        />
      ))}
    </>
  );
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: Record<string, FullSequenceItemType>;
}> = ({ item, sequenceItems }) => {
  if (item.sequenceType === "standalone")
    return <SequenceContent item={sequenceItems[item.id]} />;
  if (item.sequenceType === "preset") {
    return item.layerOrder.map((layerId) => {
      const items = item.layers[layerId].liteItems;
      return items.map((item) => {
        return (
          <TransitionSeries key={layerId} name={layerId}>
            <TransitionSeries.Sequence
              durationInFrames={item.sequenceDuration}
              name={layerId}
              offset={item.offset}
            >
              {item.sequenceType === "standalone" ? (
                <SequenceContent item={sequenceItems[item.id]} />
              ) : (
                <RenderSequence item={item} sequenceItems={sequenceItems} />
              )}
              {/* <RenderNestedSequences
                item={item}
                sequenceItems={sequenceItems}
              /> */}
            </TransitionSeries.Sequence>
          </TransitionSeries>
        );
      });
    });
  }
};

const NestedSequenceComposition: React.FC<{
  props: CompositionType["props"];
}> = ({ props }) => {
  const { layers, layerOrder, sequenceItems } = props;

  return (
    <AbsoluteFill className="font-serif">
      {layerOrder.map((layerId) => (
        <TransitionSeries key={layerId} name={layerId}>
          {layers[layerId].liteItems.map((item) => (
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
          ))}
        </TransitionSeries>
      ))}
    </AbsoluteFill>
  );
};

export default NestedSequenceComposition;

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
