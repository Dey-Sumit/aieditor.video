import { CSSProperties } from "react";
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
export type ContentType = "dummy" | "text" | "image" | "video" | "audio";

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
      contentType: ContentType;
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
    layerId: LayerId,
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
    updates: any,
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
