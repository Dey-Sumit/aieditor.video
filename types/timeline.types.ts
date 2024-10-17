import type { CSSProperties } from "react";
import { z } from "zod";

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
        videoStartsFromInFrames: number;
        videoEndsAtInFrames: number;
      };
    }
  | {
      type: "audio";
      editableProps: {
        audioUrl: string;
        audioStartsFromInFrames: number;
        audioEndsAtInFrames: number;
      };
    }
  | {
      type: "div";
    }
);

export type TextSequenceItemType = Extract<
  FullSequenceItemType,
  { type: "text" }
>;

export type ImageSequenceItemType = Extract<
  FullSequenceItemType,
  { type: "image" }
>;

export type AudioSequenceItemType = Extract<
  FullSequenceItemType,
  { type: "audio" }
>;

export type VideoSequenceItemType = Extract<
  FullSequenceItemType,
  { type: "video" }
>;

export type ImageEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "image" }
>["editableProps"];

export type TextEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "text" }
>["editableProps"];

export type VideoEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "video" }
>["editableProps"];

export type AudioEditablePropsType = Extract<
  FullSequenceItemType,
  { type: "audio" }
>["editableProps"];

export type ContentType =
  | "dummy"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "div";

export type LiteSequenceItemType = {
  id: string;
  sequenceDuration: number;
  effectiveDuration: number;
  startFrame: number;
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

export type LayerType = {
  id: string;
  name: string;
  isVisible: boolean;
  liteItems: LiteSequenceItemType[];
};

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
    transitions: {
      [key: string]: TransitionItemType;
    };
  };
};

export const LayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  liteItems: z.array(z.any()),
});

// TODO : create a type from this schema and use it in the above NestedCompositionProjectType
export const NestedCompositionPropsSchema = z.object({
  compositionMetaData: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    duration: z.number(),
    compositionId: z.string(),
  }),
  layers: z.record(LayerSchema),
  layerOrder: z.array(z.string()),
  sequenceItems: z.record(z.string(), z.any()),
  transitions: z.record(z.string(), TransitionSchema),
});

export type LayerId = string;

export type PresetName = "BRUT_END_SCREEN_PRESET" | "BRUT_FOREGROUND";
export type newPresetDetails = Omit<
  Extract<LiteSequenceItemType, { sequenceType: "preset" }>,
  "liteItems"
> & {
  name: PresetName;
};

type StoreActions = {
  loadProject: (project: NestedCompositionProjectType) => void;
  updateProject: (updates: Partial<NestedCompositionProjectType>) => void;
  addSequenceItemToLayer: (
    layerId: LayerId,
    item: Extract<LiteSequenceItemType, { sequenceType: "standalone" }>,
  ) => void;
  removeSequenceItemFromLayer: (layerId: LayerId, itemId: string) => void;
  updateSequenceItemPositionInLayer: (
    oldLayerId: LayerId,
    newLayerId: LayerId,
    itemId: string,
    updates: Pick<LiteSequenceItemType, "startFrame">,
  ) => void;

  addTransitionToLayer: (
    layerId: LayerId,
    itemId: string,
    position: "incoming" | "outgoing",
  ) => void;
  removeTransitionFromLayer: (layerId: LayerId, transitionId: string) => void;
  updateTransitionInLayer: (
    layerId: LayerId,
    transitionId: string,
    updates: Partial<TransitionItemType>,
  ) => void;

  updateTextEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: Partial<TextEditablePropsType>,
  ) => void;
  updateImageEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: Partial<ImageEditablePropsType>,
  ) => void;
  updateAudioEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: any,
  ) => void;
  updateVideoEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: any,
  ) => void;
  updateSequenceItemDuration: (
    layerId: LayerId,
    itemId: string,
    frameDelta: number,
    direction: "left" | "right",
  ) => void;
  addPresetToLayer: (layerId: LayerId, newPreset: newPresetDetails) => void;
  addLayer: (
    data:
      | {
          position: "AT_TOP" | "AT_BOTTOM";
        }
      | {
          position: "ABOVE_CURRENT" | "BELOW_CURRENT";
          currentLayerId: LayerId;
        },
  ) => void;
  removeLayer: (layerId: LayerId) => void;
  reorderLayers: (newOrder: string[]) => void;
  updateLayerMetadata: (
    layerId: LayerId,
    updates: Partial<Pick<LayerType, "name" | "isVisible">>,
  ) => void;
  splitSequenceItem: (
    layerId: LayerId,
    itemId: string,
    splitAtInFrames: number,
  ) => void;
};

export type NestedCompositionPropsType = NestedCompositionProjectType["props"];

export type StoreType = NestedCompositionProjectType & StoreActions;
