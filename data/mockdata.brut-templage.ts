import type { NestedCompositionProjectType } from "~/types/timeline.types";

export const DUMMY_PROJECT_BRUT_TEMPLATE: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 14 * 30, // 14  * 30
      compositionId: "new-dynamic-composition",
    },
    layers: {
      layerBackground: {
        liteItems: [
          {
            id: "id-train-window-smash",
            sequenceType: "standalone",
            contentType: "video",
            sequenceDuration: 420,
            offset: 0,
            startFrame: 0,
            effectiveDuration: 420,
          },
        ],
        id: "layerBackground",
        isVisible: true,
        name: "Background",
      },
      layerMiddle: {
        liteItems: [],
        id: "layerMiddle",
        isVisible: true,
        name: "Middle",
      },
      layerForeground: {
        isVisible: true,
        name: "Foreground",
        id: "layerForeground",
        liteItems: [
          /* ------------------------ Brut Foreground Preset ----------------------- */
          /*           {
            sequenceType: "preset",
            id: "id-preset-foreground",
            effectiveDuration: 360,
            sequenceDuration: 360,
            offset: 0,
            startFrame: 0,
            liteItems: [
              {
                sequenceType: "standalone",
                id: "id-brand",
                offset: -360,
                sequenceDuration: 360,
                effectiveDuration: 360,
                startFrame: 0,
                contentType: "text",
              },
              {
                sequenceType: "standalone",
                id: "id-date",
                offset: -360,
                sequenceDuration: 120,
                effectiveDuration: 120,
                startFrame: 0,
                contentType: "text",
              },
            ],
          }, */
          /* ------------------------ Brut End Screen Preset ----------------------- */
          /*   {
            sequenceType: "preset",
            effectiveDuration: 60,
            sequenceDuration: 60,
            id: "id-preset-end-screen",
            offset: 0,
            startFrame: 360,
            liteItems: [
              {
                sequenceType: "standalone",
                id: "id-like",
                offset: 0,
                sequenceDuration: 20,
                effectiveDuration: 20,
                startFrame: 0,
                contentType: "text",
              },
              {
                sequenceType: "standalone",
                id: "id-share",
                offset: 0,
                sequenceDuration: 20,
                effectiveDuration: 20,
                startFrame: 0,
                contentType: "text",
              },
              {
                sequenceType: "standalone",
                id: "id-subscribe",
                offset: 0,
                sequenceDuration: 20,
                effectiveDuration: 20,
                startFrame: 0,
                contentType: "text",
              },
            ],
          }, */
          /* {
            sequenceType: "standalone",
            id: "id-text-1",
            offset: 0,
            sequenceDuration: 600,
            effectiveDuration: 570,
            startFrame: 0,
            transition: {
              outgoing: {
                id: "transition-1",
                duration: 15,
              },
            },
            contentType: "text",
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
          }, */
        ],
      },
    },
    sequenceItems: {
      "id-brand": {
        id: "id-brand",
        layerId: "layerForeground",
        type: "text",
        editableProps: {
          text: "<h1>Brut.</h1>",
          styles: {
            container: {
              top: 40,
              left: 520,
            },
            element: {
              fontSize: "70px",
              fontWeight: "bold",
              color: "white",
            },
          },
        },
      },

      "id-date": {
        id: "id-date",
        layerId: "layerForeground",
        type: "text",
        editableProps: {
          text: "<h2>2024</h2><p>@sumit.exe</p>",
          styles: {
            container: {
              top: 40,
              left: 40,
            },
            element: {
              fontSize: "70px",
              fontWeight: "bold",
              color: "white",
            },
          },
        },
      },

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
              // backgroundColor: "rgba(255, 0, 0, 0.1)",
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
              // backgroundColor: "rgba(0, 255, 0, 0.1)",
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
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            element: {
              fontSize: "70px",
              fontWeight: "bold",
              color: "white",
            },
          },
        },
      },

      /* 
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
        }, */

      "id-train-window-smash": {
        id: "id-train-window-smash",
        type: "video",
        layerId: "layerBackground",
        editableProps: {
          videoUrl:
            "https://video.twimg.com/ext_tw_video/1833369095175077888/pu/vid/avc1/320x574/cHPzhvM1KC_pCRV2.mp4?tag=12",
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
    layerOrder: ["layerForeground", "layerMiddle", "layerBackground"],
    transitions: {
      /*  "transition-0": {
        id: "transition-0",
        type: "fade",
        duration: 60,
        properties: {
          easing: "linear",
        },
        fromSequenceId: "id-like",
        toSequenceId: "id-share",
        fromSequenceIndex: 0,
      }, */
    },
  },
};
