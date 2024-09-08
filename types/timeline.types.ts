import { staticFile } from "remotion";
import { CSSProperties } from "react";
import { z } from "zod";
const htmlString = `<div aria-expanded="false"><div contenteditable="true" translate="no" class="tiptap ProseMirror prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full" tabindex="0"><p>This is great...</p><p><strong><s><u>hello</u></s></strong></p><p>hi</p><p>this is great, <strong><mark data-color="purple" style="background-color: purple; color: inherit">seriously</mark></strong></p></div><div draggable="true" data-drag-handle="" class="drag-handle" style="left: 13px; top: 105px;"></div></div><div></div>`;

const TransitionSchema = z.object({
  id: z.string().regex(/^t-/),
  type: z.enum(["fade", "wipe", "dissolve", "slide", "flip"]),
  duration: z.number(),
  properties: z.object({
    direction: z.enum(["left", "right", "up", "down"]).optional(),
    easing: z.enum(["linear", "easeIn", "easeOut", "easeInOut"]),
  }),
  fromSequenceId: z.string().regex(/^s-/),
  toSequenceId: z.string().regex(/^s-/),
  fromSequenceIndex: z.number(),
});

export type TransitionItemType = z.infer<typeof TransitionSchema>;

export type FullSequenceItemType = {
  id: string;
  layerId: string;
  editableProps: {
    styles: {
      container: CSSProperties;
      element: CSSProperties;
      overlay?: CSSProperties;
    };
  };
} & (
  | {
      type: "text";
      editableProps: {
        text: string;
      };
    }
  | {
      type: "image";
      editableProps: {
        imageUrl: string;
      };
    }
  | {
      type: "video";
      editableProps: {
        videoUrl: string;
      };
    }
);

export type ImageEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "image" }
>["editableProps"];

export type TextEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "text" }
>["editableProps"];

export type LiteSequenceItemType = {
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
      contentType: "dummy" | "text" | "image" | "video" | "audio";
    }
  | {
      sequenceType: "preset";
      liteItems: LiteSequenceItemType[];
    }
);

export type NestedCompositionProjectType = {
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
      layerBackground: {
        liteItems: LiteSequenceItemType[];
      };
      layerMiddle: {
        liteItems: LiteSequenceItemType[];
      };
      layerForeground: {
        liteItems: LiteSequenceItemType[];
      };
    };
    sequenceItems: {
      layerBackground: {
        [key: string]: FullSequenceItemType;
      };
      layerMiddle: {
        [key: string]: FullSequenceItemType;
      };
      layerForeground: {
        [key: string]: FullSequenceItemType;
      };
    };
    transitions: {
      [key: string]: TransitionItemType;
    };
  };
};

export type LayerId = "layerBackground" | "layerMiddle" | "layerForeground";

export const DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 900,
      compositionId: "new-dynamic-composition",
    },
    layers: {
      layerBackground: {
        liteItems: [
          {
            id: "id-real-madrid",
            sequenceType: "standalone",
            contentType: "image",
            sequenceDuration: 800,
            offset: 0,
            startFrame: 0,
            effectiveDuration: 800,
          },
        ],
      },
      layerMiddle: {
        liteItems: [],
      },
      layerForeground: {
        liteItems: [
          {
            sequenceType: "preset",
            id: "id-preset",
            offset: 0,
            sequenceDuration: 600,
            effectiveDuration: 570,
            startFrame: 0,
            liteItems: [
              {
                id: "id-like",
                sequenceType: "standalone",
                contentType: "text",
                sequenceDuration: 200,
                effectiveDuration: 170,
                offset: 0,
                transition: {
                  outgoing: {
                    id: "transition-0",
                    duration: 15,
                  },
                },
                startFrame: 0,
              },
              {
                id: "id-share",
                sequenceType: "standalone",
                contentType: "text",
                sequenceDuration: 200,
                offset: 0,
                transition: {
                  incoming: {
                    id: "transition-0",
                    duration: 15,
                  },
                },
                startFrame: 170,
                effectiveDuration: 200,
              },
              {
                id: "id-subscribe",
                sequenceType: "standalone",
                contentType: "text",
                sequenceDuration: 200,
                offset: 0,
                startFrame: 370,
                effectiveDuration: 200,
              },
            ],
            transition: {
              outgoing: {
                id: "transition-1",
                duration: 15,
              },
            },
          },
          {
            id: "id-info",
            sequenceType: "standalone",
            contentType: "text",
            sequenceDuration: 200,
            effectiveDuration: 200,
            offset: 600,
            transition: {
              incoming: {
                id: "transition-2",
                duration: 15,
              },
            },
            startFrame: 570, // adjusted the startFrame as per transition
          },
        ],
      },
    },
    sequenceItems: {
      layerForeground: {
        "id-like": {
          id: "id-like",
          type: "text",
          layerId: "layerForeground",
          editableProps: {
            styles: {
              container: {
                flex: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 0, 0, 0.3)",
              },
              element: {
                fontSize: "70px",
                fontWeight: "bold",
                color: "white",
              },
            },
            text: "Like.",
          },
        },
        "id-share": {
          id: "id-share",
          type: "text",
          layerId: "layerForeground",
          editableProps: {
            text: "Share.",
            styles: {
              container: {
                flex: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 255, 0, 0.3)",
              },
              element: {
                fontSize: "70px",
                fontWeight: "bold",
                color: "white",
              },
            },
          },
        },
        "id-subscribe": {
          id: "id-subscribe",
          type: "text",
          layerId: "layerForeground",
          editableProps: {
            text: "Subscribe.",
            styles: {
              container: {
                flex: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              element: {
                fontSize: "70px",
                fontWeight: "bold",
                color: "white",
              },
            },
          },
        },
        "id-info": {
          id: "id-info",
          type: "text",
          layerId: "layerForeground",
          editableProps: {
            text: htmlString,
            styles: {
              container: {
                flex: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              element: {
                backgroundColor: "white",
                padding: "12px",
                fontSize: "50px",
                borderRadius: 10,
              },
            },
          },
        },
      },
      layerBackground: {
        "id-real-madrid": {
          id: "id-real-madrid",
          type: "image",
          layerId: "layerBackground",
          editableProps: {
            imageUrl: staticFile("/sample-images/real-madrid.jpg"),
            styles: {
              container: {},
              element: {
                objectFit: "cover",
              },
              overlay: {
                backgroundColor: "black",
                opacity: 0.5,
              },
            },
          },
        },
      },
      layerMiddle: {},
    },
    transitions: {
      "transition-0": {
        id: "transition-0",
        type: "fade",
        duration: 60,
        properties: {
          easing: "linear",
        },
        fromSequenceId: "id-like",
        toSequenceId: "id-share",
        fromSequenceIndex: 0,
      },
    },
  },
};

type StoreActions = {
  loadProject: (project: NestedCompositionProjectType) => void;
  updateProject: (updates: Partial<NestedCompositionProjectType>) => void;
  addSequenceItemToLayer: (layerId: LayerId, item: LiteSequenceItemType) => void;
  removeSequenceItemFromLayer: (layerId: LayerId, itemId: string) => void;
  updateSequenceItemInLayer: (
    layerId: LayerId,
    itemId: string,
    updates: Pick<LiteSequenceItemType, "startFrame">
  ) => void;

  addTransitionToLayer: (
    layerId: LayerId,
    itemId: string,
    position: "incoming" | "outgoing"
  ) => void;
  removeTransitionFromLayer: (layerId: LayerId, transitionId: string) => void;
  updateTransitionInLayer: (
    layerId: LayerId,
    transitionId: string,
    updates: Partial<TransitionItemType>
  ) => void;

  updateTextEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: any // TODO : Fix the anys
  ) => void;
  updateImageEditableProps: (layerId: LayerId, itemId: string, updates: any) => void;
  updateAudioEditableProps: (layerId: LayerId, itemId: string, updates: any) => void;
  updateVideoEditableProps: (layerId: LayerId, itemId: string, updates: any) => void;
  updateSequenceItemDuration: (
    layerId: LayerId,
    itemId: string,
    frameDelta: number,
    direction: "left" | "right"
  ) => void;
};

export type StoreType = NestedCompositionProjectType & StoreActions;

export const NestedCompositionPropsSchema = z.object({
  compositionMetaData: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    duration: z.number(),
    compositionId: z.string(),
  }),
  layers: z.object({
    layerBackground: z.object({
      liteItems: z.array(z.any()),
    }),
    layerMiddle: z.object({
      liteItems: z.array(z.any()),
    }),
    layerForeground: z.object({
      liteItems: z.array(z.any()),
    }),
  }),
  sequenceItems: z.object({
    layerBackground: z.record(z.any()),
    layerMiddle: z.record(z.any()),
    layerForeground: z.record(z.any()),
  }),
  transitions: z.record(z.any()),
});

export type NestedCompositionType = NestedCompositionProjectType["props"];
export type LayerType = NestedCompositionType["layers"][LayerId];
