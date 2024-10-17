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

export const DUMMY_NESTED_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",

  props: {
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 600,
      compositionId: "new-dynamic-composition",
    },
    layers: {
      layerMiddle: {
        id: "layerMiddle",
        name: "Layer Middle",
        isVisible: true,
        liteItems: [],
      },
      layerBg: {
        id: "layerBg",
        name: "Layer Bg",
        isVisible: true,
        liteItems: [],
      },
    },
    sequenceItems: {},
    transitions: {},
    layerOrder: ["layerMiddle", "layerBg"],
  },
};

export const DEFAULT_PRESET_COMP_PROPS: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",

  props: {
    layers: {
      layerMiddle: {
        liteItems: [
          {
            id: "preset-c2e1d7931a93",
            sequenceType: "preset",
            offset: 0,
            startFrame: 0,
            // while creating a preset ,I just need layers,layerOrder and the sequence items
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
            // transition: {
            //   outgoing: {
            //     id: "transition-1",
            //     duration: 15,
            //   },
            // },
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
