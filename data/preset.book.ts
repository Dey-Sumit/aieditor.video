import type { PresetDetail } from "~/types/timeline.types";

export const PRESET_COLLECTION: Record<string, PresetDetail> = {
  "preset-1": {
    layers: {
      layerBg: {
        liteItems: [
          {
            startFrame: 0,
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
            startFrame: 0,
            id: "s-fg-0",
            sequenceType: "standalone",
            contentType: "text",
            effectiveDuration: 90,
            sequenceDuration: 90,
            offset: 0,
          },
          {
            startFrame: 90,
            id: "s-fg-1",
            sequenceType: "standalone",
            contentType: "text",
            effectiveDuration: 90,
            sequenceDuration: 90,
            offset: 0,
          },
          {
            startFrame: 180,
            id: "s-fg-2",
            sequenceType: "standalone",
            contentType: "text",
            effectiveDuration: 90,
            sequenceDuration: 90,
            offset: 0,
          },
        ],
      },
    },
    layerOrder: ["layerBg", "layerMiddle"],
    effectiveDuration: 270,
    sequenceDuration: 270,
    presetId: "preset-1",
    name: "BRUT_END_SCREEN_PRESET",
    sequenceItems: {
      "p-div-bg": {
        id: "p-div-bg",
        layerId: "layerBg",
        type: "div",
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
              backgroundColor: "rgba(0,0,0,0.2)",
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
              display: "flex",
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
  },
};
