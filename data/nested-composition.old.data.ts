//@ts-nocheck
import type { NestedCompositionProjectType } from "~/types/timeline.types";

// export const DUMMY_NESTED_PROJECT_WITH_END_SCREEN_PRESET_ADDED: NestedCompositionProjectType =
//   {
//     id: "id-dummy",
//     title: "Dummy Project",
//     props: {
//       compositionMetaData: {
//         width: 720,
//         height: 1080,
//         fps: 30,
//         duration: 420, // 14 * 30
//         compositionId: "new-dynamic-composition",
//       },
//       layers: {
//         layerBackground: {
//           liteItems: [
//             {
//               id: "id-train-window-smash",
//               sequenceType: "standalone",
//               contentType: "video",
//               sequenceDuration: 420,
//               offset: 0,
//               startFrame: 0,
//               effectiveDuration: 420,
//             },
//           ],
//         },
//         layerMiddle: {
//           liteItems: [],
//         },
//         layerForeground: {
//           liteItems: [
//             /* ------------------------ Brut Foreground Preset ----------------------- */
//             {
//               sequenceType: "preset",
//               id: "id-preset-foreground",
//               effectiveDuration: 360,
//               sequenceDuration: 360,
//               offset: 0,
//               startFrame: 0,
//               liteItems: [
//                 {
//                   sequenceType: "standalone",
//                   id: "id-brand",
//                   offset: -360,
//                   sequenceDuration: 360,
//                   effectiveDuration: 360,
//                   startFrame: 0,
//                   contentType: "text",
//                 },
//                 {
//                   sequenceType: "standalone",
//                   id: "id-date",
//                   offset: -360,
//                   sequenceDuration: 120,
//                   effectiveDuration: 120,
//                   startFrame: 0,
//                   contentType: "text",
//                 },
//               ],
//             },

//             /* ------------------------ Brut End Screen Preset ----------------------- */

//             {
//               sequenceType: "preset",
//               effectiveDuration: 60,
//               sequenceDuration: 60,
//               id: "id-preset-end-screen",
//               offset: 0,
//               startFrame: 360,
//               liteItems: [
//                 {
//                   sequenceType: "standalone",
//                   id: "id-like",
//                   offset: 0,
//                   sequenceDuration: 20,
//                   effectiveDuration: 20,
//                   startFrame: 0,
//                   contentType: "text",
//                 },
//                 {
//                   sequenceType: "standalone",
//                   id: "id-share",
//                   offset: 0,
//                   sequenceDuration: 20,
//                   effectiveDuration: 20,
//                   startFrame: 0,
//                   contentType: "text",
//                 },
//                 {
//                   sequenceType: "standalone",
//                   id: "id-subscribe",
//                   offset: 0,
//                   sequenceDuration: 20,
//                   effectiveDuration: 20,
//                   startFrame: 0,
//                   contentType: "text",
//                 },
//               ],
//             },

//             /* {
//             sequenceType: "standalone",
//             id: "id-text-1",
//             offset: 0,
//             sequenceDuration: 600,
//             effectiveDuration: 570,
//             startFrame: 0,
//             transition: {
//               outgoing: {
//                 id: "transition-1",
//                 duration: 15,
//               },
//             },
//             contentType: "text",
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
//           }, */
//           ],
//         },
//       },
//       sequenceItems: {
//         layerForeground: {
//           "id-brand": {
//             id: "id-brand",
//             layerId: "layerForeground",
//             type: "text",
//             editableProps: {
//               text: "Brut.",
//               styles: {
//                 container: {
//                   top: 40,
//                   left: 520,
//                 },
//                 element: {
//                   fontSize: "70px",
//                   fontWeight: "bold",
//                   color: "white",
//                 },
//               },
//             },
//           },

//           "id-date": {
//             id: "id-date",
//             layerId: "layerForeground",
//             type: "text",
//             editableProps: {
//               text: "2021",
//               styles: {
//                 container: {
//                   top: 40,
//                   left: 40,
//                 },
//                 element: {
//                   fontSize: "70px",
//                   fontWeight: "bold",
//                   color: "white",
//                 },
//               },
//             },
//           },

//           "id-like": {
//             id: "id-like",
//             type: "text",
//             layerId: "layerForeground",
//             editableProps: {
//               styles: {
//                 container: {
//                   flex: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   // backgroundColor: "rgba(255, 0, 0, 0.1)",
//                 },
//                 element: {
//                   fontSize: "70px",
//                   fontWeight: "bold",
//                   color: "white",
//                 },
//               },
//               text: "Like.",
//             },
//           },

//           "id-share": {
//             id: "id-share",
//             type: "text",
//             layerId: "layerForeground",
//             editableProps: {
//               text: "Share.",
//               styles: {
//                 container: {
//                   flex: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   // backgroundColor: "rgba(0, 255, 0, 0.1)",
//                 },
//                 element: {
//                   fontSize: "70px",
//                   fontWeight: "bold",
//                   color: "white",
//                 },
//               },
//             },
//           },

//           "id-subscribe": {
//             id: "id-subscribe",
//             type: "text",
//             layerId: "layerForeground",
//             editableProps: {
//               text: "Subscribe.",
//               styles: {
//                 container: {
//                   flex: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   // backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 },
//                 element: {
//                   fontSize: "70px",
//                   fontWeight: "bold",
//                   color: "white",
//                 },
//               },
//             },
//           },

//           /*
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
//         }, */
//         },
//         layerBackground: {
//           "id-train-window-smash": {
//             id: "id-train-window-smash",
//             type: "video",
//             layerId: "layerBackground",
//             editableProps: {
//               videoUrl:
//                 "https://video.twimg.com/ext_tw_video/1833369095175077888/pu/vid/avc1/320x574/cHPzhvM1KC_pCRV2.mp4?tag=12",
//               styles: {
//                 container: {},
//                 element: {
//                   objectFit: "cover",
//                 },
//                 overlay: {
//                   backgroundColor: "black",
//                   opacity: 0.5,
//                 },
//               },
//             },
//           },
//         },
//         layerMiddle: {},
//       },
//       transitions: {
//         "transition-0": {
//           id: "transition-0",
//           type: "fade",
//           duration: 60,
//           properties: {
//             easing: "linear",
//           },
//           fromSequenceId: "id-like",
//           toSequenceId: "id-share",
//           fromSequenceIndex: 0,
//         },
//       },
//     },
//   };

export const FINAL_DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      layerMiddle: {
        liteItems: [
          {
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

            startFrame: 40,
            offset: 40,
            id: "p-preset-7b3e8bd4-e1c7-4583-8d80-8f22c03631f7",
            sequenceType: "preset",
          },
          {
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
            startFrame: 317,
            offset: 7,
            id: "p-preset-06bb934d-fdd0-4a29-8124-7a1ed74b5af0",
            sequenceType: "preset",
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
            startFrame: 0,
          },
        ],
        id: "layerBg",
        isVisible: true,
        name: "Layer Bg",
      },
    },
    layerOrder: ["layerMiddle", "layerBg"],
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
      "p-preset-7b3e8bd4-e1c7-4583-8d80-8f22c03631f7": {
        type: "preset",
        id: "p-preset-7b3e8bd4-e1c7-4583-8d80-8f22c03631f7",
        presetId: "preset-1",
        sequenceItems: {
          "p-div-bg": {
            id: "p-div-bg",
            layerId: "layerMiddle",
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
                  backgroundColor: "rgba(255,0,0,0.6)",
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
      },
      "p-preset-06bb934d-fdd0-4a29-8124-7a1ed74b5af0": {
        type: "preset",
        id: "p-preset-7b3e8bd4-e1c7-4583-8d80-8f22c03631f7",
        presetId: "preset-1",
        sequenceItems: {
          "p-div-bg": {
            id: "p-div-bg",
            layerId: "layerMiddle",
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
                  backgroundColor: "rgba(255,0,0,0.6)",
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
      },
    },
    compositionMetaData: {
      width: 600,
      height: 1000,
      fps: 30,
      duration: 600,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};

// export const _DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
//   id: "id-dummy",
//   title: "Dummy Project",

//   props: {
//     compositionMetaData: {
//       width: 720,
//       height: 1080,
//       fps: 30,
//       duration: 600,
//       compositionId: "new-dynamic-composition",
//     },
//     layers: {
//       layerMiddle: {
//         id: "layerMiddle",
//         name: "Layer Middle",
//         isVisible: true,
//         liteItems: [],
//       },
//       layerBg: {
//         id: "layerBg",
//         name: "Layer Bg",
//         isVisible: true,
//         liteItems: [],
//       },
//     },
//     sequenceItems: {},
//     transitions: {},
//     layerOrder: ["layerMiddle", "layerBg"],
//   },
// };

// export const DEFAULT_PRESET_COMP_PROPS: NestedCompositionProjectType = {
//   id: "id-dummy",
//   title: "Dummy Project",

//   props: {
//     layers: {
//       layerMiddle: {
//         liteItems: [],
//         id: "layerMiddle",
//         isVisible: true,
//         name: "Layer Middle",
//       },
//       layerBg: {
//         liteItems: [
//           {
//             id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
//             sequenceType: "standalone",
//             contentType: "image",
//             effectiveDuration: 600,
//             sequenceDuration: 600,
//             offset: 0,
//             startFrame: 0,
//           },
//         ],
//         id: "layerBg",
//         isVisible: true,
//         name: "Layer Bg",
//       },
//     },
//     layerOrder: ["layerMiddle", "layerBg"],
//     sequenceItems: {
//       "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
//         id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
//         layerId: "layerBg",
//         type: "image",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//             overlay: {
//               backgroundColor: "rgba(0,0,0,0.6)",
//             },
//           },
//           imageUrl: "https://picsum.photos/600/1000",
//         },
//       },
//     },
//     compositionMetaData: {
//       width: 600,
//       height: 1000,
//       fps: 30,
//       duration: 600,
//       compositionId: "new-dynamic-composition",
//     },
//     transitions: {},
//   },
// };

// export const TEST_PROJECT: NestedCompositionProjectType = {
//   id: "id-test-1",
//   title: "Test Project 1",
//   props: {
//     layers: {
//       layerMiddle: {
//         liteItems: [
//           {
//             id: "s-image-0f9747bb-4464-4419-b12b-cae9496ad350",
//             sequenceType: "standalone",
//             contentType: "image",
//             startFrame: 34,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 34,
//           },
//           {
//             id: "s-video-fd5a35b0-33bc-430a-b6f2-c335632c7278",
//             sequenceType: "standalone",
//             contentType: "video",
//             startFrame: 303,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 119,
//           },
//         ],
//         id: "layerMiddle",
//         isVisible: true,
//         name: "Layer Middle",
//       },
//       layerBg: {
//         liteItems: [
//           {
//             id: "s-video-3fe62077-68f6-4643-9562-6b8dbeb962c3",
//             sequenceType: "standalone",
//             contentType: "video",
//             startFrame: 0,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 0,
//           },
//         ],
//         id: "layerBg",
//         isVisible: true,
//         name: "Layer Bg",
//       },
//       "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a": {
//         id: "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a",
//         name: "Layer 3",
//         liteItems: [
//           {
//             id: "s-text-ce6bea24-def6-462b-88cc-1b8c6eea30fa",
//             sequenceType: "standalone",
//             contentType: "text",
//             startFrame: 62,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 62,
//           },
//           {
//             id: "s-image-e925115c-158f-4e29-aa73-d0162563663c",
//             sequenceType: "standalone",
//             contentType: "image",
//             startFrame: 320,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 108,
//           },
//         ],
//         isVisible: true,
//       },
//       "l-73f7e274-bb88-4f1b-9ec5-3c70b57b2a27": {
//         id: "l-73f7e274-bb88-4f1b-9ec5-3c70b57b2a27",
//         name: "Layer 4",
//         liteItems: [
//           {
//             id: "s-text-b0a80f5b-8014-4d32-9983-9e9c43bb76e8",
//             sequenceType: "standalone",
//             contentType: "text",
//             startFrame: 338,
//             effectiveDuration: 150,
//             sequenceDuration: 150,
//             offset: 338,
//           },
//         ],
//         isVisible: true,
//       },
//       "l-dda20e33-8de6-4bd6-8803-8e815b65a065": {
//         id: "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//         name: "Layer 5",
//         liteItems: [
//           {
//             layers: {
//               layerBg: {
//                 liteItems: [
//                   {
//                     startFrame: 0,
//                     id: "p-div-bg",
//                     sequenceType: "standalone",
//                     contentType: "div",
//                     effectiveDuration: 270,
//                     sequenceDuration: 270,
//                     offset: 0,
//                   },
//                 ],
//               },
//               layerMiddle: {
//                 liteItems: [
//                   {
//                     startFrame: 0,
//                     id: "s-fg-0",
//                     sequenceType: "standalone",
//                     contentType: "text",
//                     effectiveDuration: 90,
//                     sequenceDuration: 90,
//                     offset: 0,
//                   },
//                   {
//                     startFrame: 90,
//                     id: "s-fg-1",
//                     sequenceType: "standalone",
//                     contentType: "text",
//                     effectiveDuration: 90,
//                     sequenceDuration: 90,
//                     offset: 0,
//                   },
//                   {
//                     startFrame: 180,
//                     id: "s-fg-2",
//                     sequenceType: "standalone",
//                     contentType: "text",
//                     effectiveDuration: 90,
//                     sequenceDuration: 90,
//                     offset: 0,
//                   },
//                 ],
//               },
//             },
//             layerOrder: ["layerBg", "layerMiddle"],
//             effectiveDuration: 270,
//             sequenceDuration: 270,
//             presetId: "preset-1",
//             startFrame: 330,
//             offset: 330,
//             id: "p-preset-c122d0c3-e798-4b1a-ad2b-fbeb4d460d37",
//             sequenceType: "preset",
//           },
//         ],
//         isVisible: true,
//       },
//     },
//     layerOrder: [
//       "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//       "l-73f7e274-bb88-4f1b-9ec5-3c70b57b2a27",
//       "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a",
//       "layerMiddle",
//       "layerBg",
//     ],
//     sequenceItems: {
//       "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
//         id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
//         layerId: "layerBg",
//         type: "image",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//             overlay: {
//               backgroundColor: "rgba(0,0,0,0.6)",
//             },
//           },
//           imageUrl: "https://picsum.photos/600/1000",
//         },
//       },
//       "p-div-bg": {
//         id: "p-div-bg",
//         layerId: "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//         type: "div",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(255,0,0,0.6)",
//             },
//           },
//         },
//       },
//       "s-fg-0": {
//         id: "s-fg-0",
//         layerId: "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//         type: "text",
//         editableProps: {
//           text: "<h1>Like.</h1>",
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//           },
//         },
//       },
//       "s-fg-1": {
//         id: "s-fg-1",
//         layerId: "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//         type: "text",
//         editableProps: {
//           text: "<h1>Share.</h1>",
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//           },
//         },
//       },
//       "s-fg-2": {
//         id: "s-fg-2",
//         layerId: "l-dda20e33-8de6-4bd6-8803-8e815b65a065",
//         type: "text",
//         editableProps: {
//           text: "<h1>Subscribe.</h1>",
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//           },
//         },
//       },
//       "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a": {},
//       "l-73f7e274-bb88-4f1b-9ec5-3c70b57b2a27": {},
//       "s-text-ce6bea24-def6-462b-88cc-1b8c6eea30fa": {
//         id: "s-text-ce6bea24-def6-462b-88cc-1b8c6eea30fa",
//         layerId: "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a",
//         type: "text",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {},
//           },
//           text: "<h1>Your text</h1>",
//         },
//       },
//       "s-image-0f9747bb-4464-4419-b12b-cae9496ad350": {
//         id: "s-image-0f9747bb-4464-4419-b12b-cae9496ad350",
//         layerId: "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a",
//         type: "image",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//           },
//           imageUrl:
//             "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
//         },
//       },
//       "s-video-3fe62077-68f6-4643-9562-6b8dbeb962c3": {
//         id: "s-video-3fe62077-68f6-4643-9562-6b8dbeb962c3",
//         layerId: "layerBg",
//         type: "video",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "cover",
//               width: "100%",
//               height: "100%",
//             },
//           },
//           videoUrl:
//             "https://videos.pexels.com/video-files/6963395/6963395-hd_1080_1920_25fps.mp4",
//         },
//       },
//       "s-video-fd5a35b0-33bc-430a-b6f2-c335632c7278": {
//         id: "s-video-fd5a35b0-33bc-430a-b6f2-c335632c7278",
//         layerId: "layerMiddle",
//         type: "video",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "cover",
//               width: "100%",
//               height: "100%",
//             },
//           },
//           videoUrl:
//             "https://videos.pexels.com/video-files/6963395/6963395-hd_1080_1920_25fps.mp4",
//         },
//       },
//       "s-image-e925115c-158f-4e29-aa73-d0162563663c": {
//         id: "s-image-e925115c-158f-4e29-aa73-d0162563663c",
//         layerId: "l-0e6a65d1-d7f0-4d24-a6c0-0165388a170a",
//         type: "image",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "contain",
//               width: "100%",
//               height: "100%",
//             },
//           },
//           imageUrl:
//             "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
//         },
//       },
//       "s-text-b0a80f5b-8014-4d32-9983-9e9c43bb76e8": {
//         id: "s-text-b0a80f5b-8014-4d32-9983-9e9c43bb76e8",
//         layerId: "l-73f7e274-bb88-4f1b-9ec5-3c70b57b2a27",
//         type: "text",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {},
//           },
//           text: "<h1>Your text</h1>",
//         },
//       },
//       "l-dda20e33-8de6-4bd6-8803-8e815b65a065": {},
//     },
//     compositionMetaData: {
//       width: 600,
//       height: 1000,
//       fps: 30,
//       duration: 600,
//       compositionId: "new-dynamic-composition",
//     },
//     transitions: {},
//   },
// };

// export const DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
//   id: "id-dummy",
//   title: "Dummy Project",

//   props: {
//     compositionMetaData: {
//       width: 720,
//       height: 1080,
//       fps: 30,
//       duration: 600,
//       compositionId: "new-dynamic-composition",
//     },
//     layers: {
//       layerMiddle: {
//         id: "layerMiddle",
//         name: "Layer Middle",
//         isVisible: true,
//         liteItems: [
//           {
//             id: "s-video-e5742456-e47d-4181-9f15-482dcce816fd",
//             sequenceType: "standalone",
//             contentType: "video",
//             startFrame: 0,
//             effectiveDuration: 420,
//             sequenceDuration: 420,
//             offset: 0,
//           },
//         ],
//       },
//     },
//     sequenceItems: {
//       "s-video-e5742456-e47d-4181-9f15-482dcce816fd": {
//         id: "s-video-e5742456-e47d-4181-9f15-482dcce816fd",
//         layerId: "layerMiddle",
//         type: "video",
//         editableProps: {
//           styles: {
//             container: {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             element: {
//               objectFit: "cover",
//               width: "100%",
//               height: "100%",
//             },
//           },
//           videoStartsFromInFrames: 0,
//           videoEndsAtInFrames: 420,
//           videoUrl:
//             "https://video.twimg.com/ext_tw_video/1833369095175077888/pu/vid/avc1/320x574/cHPzhvM1KC_pCRV2.mp4?tag=12",
//         },
//       },
//     },
//     transitions: {},
//     layerOrder: ["layerMiddle"],
//   },
// };
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
