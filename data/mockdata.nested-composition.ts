import { staticFile } from "remotion";
import { NestedCompositionProjectType } from "~/types/timeline.types";
const htmlString = `<div aria-expanded="false"><div contenteditable="true" translate="no" class="tiptap ProseMirror prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full" tabindex="0"><p>This is great...</p><p><strong><s><u>hello</u></s></strong></p><p>hi</p><p>this is great, <strong><mark data-color="purple" style="background-color: purple; color: inherit">seriously</mark></strong></p></div><div draggable="true" data-drag-handle="" class="drag-handle" style="left: 13px; top: 105px;"></div></div><div></div>`;

export const DUMMY_NESTED_PROJECT_WITH_END_SCREEN_PRESET_ADDED: NestedCompositionProjectType =
  {
    id: "id-dummy",
    title: "Dummy Project",
    props: {
      compositionMetaData: {
        width: 720,
        height: 1080,
        fps: 30,
        duration: 420, // 14 * 30
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
        },
        layerMiddle: {
          liteItems: [],
        },
        layerForeground: {
          liteItems: [
            /* ------------------------ Brut Foreground Preset ----------------------- */
            {
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
            },

            /* ------------------------ Brut End Screen Preset ----------------------- */

            {
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
            },

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
        layerForeground: {
          "id-brand": {
            id: "id-brand",
            layerId: "layerForeground",
            type: "text",
            editableProps: {
              text: "Brut.",
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
              text: "2021",
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
        },
        layerBackground: {
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

export const DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 10 * 30,
      compositionId: "new-dynamic-composition",
    },
    layers: {
      layerBackground: {
        liteItems: [
          // {
          //   id: "id-train-window-smash",
          //   sequenceType: "standalone",
          //   contentType: "video",
          //   sequenceDuration: 600,
          //   offset: 0,
          //   startFrame: 0,
          //   effectiveDuration: 600,
          // },
        ],
      },
      layerMiddle: {
        liteItems: [],
      },
      layerForeground: {
        liteItems: [
          // {
          //   sequenceType: "preset",
          //   effectiveDuration: 60,
          //   sequenceDuration: 60,
          //   id: "id-preset-end-screen-8jekku",
          //   offset: 83,
          //   startFrame: 83,
          //   liteItems: [
          //     {
          //       sequenceType: "standalone",
          //       id: "id-like",
          //       sequenceDuration: 20,
          //       effectiveDuration: 20,
          //       startFrame: 83, // This does not really matter . as when it's under a preset, it's start frame is adjusted as per the width
          //       offset: 0,
          //       contentType: "text",
          //     },
          //     {
          //       sequenceType: "standalone",
          //       id: "id-share",
          //       offset: 0,
          //       startFrame: 93,
          //       sequenceDuration: 30,
          //       effectiveDuration: 30,
          //       contentType: "text",
          //     },
          //     {
          //       sequenceType: "standalone",
          //       id: "id-subscribe",
          //       offset: 0,
          //       startFrame: 123,
          //       sequenceDuration: 20,
          //       effectiveDuration: 20,
          //       contentType: "text",
          //     },
          //   ],
          // },
        ],
      },
    },
    sequenceItems: {
      layerForeground: {
        "id-brand": {
          id: "id-brand",
          layerId: "layerForeground",
          type: "text",
          editableProps: {
            text: "Brut.",
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
            text: "2021",
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
              },
              element: {
                fontSize: "70px",
                fontWeight: "bold",
                color: "white",
              },
            },
          },
        },
      },
      layerBackground: {
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
// export const DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
//   id: "id-dummy",
//   title: "Dummy Project",
//   props: {
//     compositionMetaData: {
//       width: 720,
//       height: 1080,
//       fps: 30,
//       duration: 900,
//       compositionId: "new-dynamic-composition",
//     },
//     layers: {
//       layerBackground: {
//         liteItems: [
//           {
//             id: "id-real-madrid",
//             sequenceType: "standalone",
//             contentType: "image",
//             sequenceDuration: 800,
//             offset: 0,
//             startFrame: 0,
//             effectiveDuration: 800,
//           },
//         ],
//       },
//       layerMiddle: {
//         liteItems: [],
//       },
//       layerForeground: {
//         liteItems: [
//           {
//             sequenceType: "preset",
//             id: "id-preset",
//             offset: 0,
//             sequenceDuration: 600,
//             effectiveDuration: 570,
//             startFrame: 0,
//             liteItems: [
//               {
//                 id: "id-like",
//                 sequenceType: "standalone",
//                 contentType: "text",
//                 sequenceDuration: 200,
//                 effectiveDuration: 170,
//                 offset: 0,
//                 transition: {
//                   outgoing: {
//                     id: "transition-0",
//                     duration: 15,
//                   },
//                 },
//                 startFrame: 0,
//               },
//               {
//                 id: "id-share",
//                 sequenceType: "standalone",
//                 contentType: "text",
//                 sequenceDuration: 200,
//                 offset: 0,
//                 transition: {
//                   incoming: {
//                     id: "transition-0",
//                     duration: 15,
//                   },
//                 },
//                 startFrame: 170,
//                 effectiveDuration: 200,
//               },
//               {
//                 id: "id-subscribe",
//                 sequenceType: "standalone",
//                 contentType: "text",
//                 sequenceDuration: 200,
//                 offset: 0,
//                 startFrame: 370,
//                 effectiveDuration: 200,
//               },
//             ],
//             transition: {
//               outgoing: {
//                 id: "transition-1",
//                 duration: 15,
//               },
//             },
//           },
//           {
//             id: "id-info",
//             sequenceType: "standalone",
//             contentType: "text",
//             sequenceDuration: 200,
//             effectiveDuration: 200,
//             offset: 600,
//             transition: {
//               incoming: {
//                 id: "transition-2",
//                 duration: 15,
//               },
//             },
//             startFrame: 570, // adjusted the startFrame as per transition
//           },
//         ],
//       },
//     },
//     sequenceItems: {
//       layerForeground: {
//         "id-like": {
//           id: "id-like",
//           type: "text",
//           layerId: "layerForeground",
//           editableProps: {
//             styles: {
//               container: {
//                 flex: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "rgba(255, 0, 0, 0.3)",
//               },
//               element: {
//                 fontSize: "70px",
//                 fontWeight: "bold",
//                 color: "white",
//               },
//             },
//             text: "Like.",
//           },
//         },
//         "id-share": {
//           id: "id-share",
//           type: "text",
//           layerId: "layerForeground",
//           editableProps: {
//             text: "Share.",
//             styles: {
//               container: {
//                 flex: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "rgba(0, 255, 0, 0.3)",
//               },
//               element: {
//                 fontSize: "70px",
//                 fontWeight: "bold",
//                 color: "white",
//               },
//             },
//           },
//         },
//         "id-subscribe": {
//           id: "id-subscribe",
//           type: "text",
//           layerId: "layerForeground",
//           editableProps: {
//             text: "Subscribe.",
//             styles: {
//               container: {
//                 flex: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//               },
//               element: {
//                 fontSize: "70px",
//                 fontWeight: "bold",
//                 color: "white",
//               },
//             },
//           },
//         },
//         "id-info": {
//           id: "id-info",
//           type: "text",
//           layerId: "layerForeground",
//           editableProps: {
//             text: htmlString,
//             styles: {
//               container: {
//                 flex: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               },
//               element: {
//                 backgroundColor: "white",
//                 padding: "12px",
//                 fontSize: "50px",
//                 borderRadius: 10,
//               },
//             },
//           },
//         },
//       },
//       layerBackground: {
//         "id-real-madrid": {
//           id: "id-real-madrid",
//           type: "image",
//           layerId: "layerBackground",
//           editableProps: {
//             imageUrl: staticFile("/sample-images/real-madrid.jpg"),
//             styles: {
//               container: {},
//               element: {
//                 objectFit: "cover",
//               },
//               overlay: {
//                 backgroundColor: "black",
//                 opacity: 0.5,
//               },
//             },
//           },
//         },
//       },
//       layerMiddle: {},
//     },
//     transitions: {
//       "transition-0": {
//         id: "transition-0",
//         type: "fade",
//         duration: 60,
//         properties: {
//           easing: "linear",
//         },
//         fromSequenceId: "id-like",
//         toSequenceId: "id-share",
//         fromSequenceIndex: 0,
//       },
//     },
//   },
// };
