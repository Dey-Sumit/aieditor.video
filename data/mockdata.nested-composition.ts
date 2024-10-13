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
      duration: 300,
      compositionId: "new-dynamic-composition",
    },
    layers: {
      layerBackground: {
        id: "layerBackground",
        name: "Layer Background",
        isVisible: true,
        liteItems: [
          {
            id: "s-text-66056c6c-002d-4fc9-8152-9075771d6a8f",
            sequenceType: "standalone",
            contentType: "text",
            startFrame: 623,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 623,
          },
        ],
      },
      layerMiddle: {
        id: "layerMiddle",
        name: "Layer Middle",
        isVisible: true,
        liteItems: [
          {
            id: "s-image-8d408a25-954b-4da0-a74a-c3c125377804",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 358,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 358,
          },
          {
            id: "s-text-fc5bc0e0-342c-4e3b-85f5-3001a85d6126",
            sequenceType: "standalone",
            contentType: "text",
            startFrame: 508,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 0,
          },
        ],
      },
      layerForeground: {
        id: "layerForeground",
        name: "Layer Foreground",
        isVisible: true,
        liteItems: [
          {
            id: "s-text-eaadc973-1830-4c46-a012-ccc3e48774c6",
            sequenceType: "standalone",
            contentType: "text",
            startFrame: 85,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 85,
          },
        ],
      },
    },
    sequenceItems: {
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
      "s-text-eaadc973-1830-4c46-a012-ccc3e48774c6": {
        id: "s-text-eaadc973-1830-4c46-a012-ccc3e48774c6",
        layerId: "layerForeground",
        type: "text",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {},
          },
          text: "<h1>Your text</h1>",
        },
      },
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
      "s-image-8d408a25-954b-4da0-a74a-c3c125377804": {
        id: "s-image-8d408a25-954b-4da0-a74a-c3c125377804",
        layerId: "layerMiddle",
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
          },
          imageUrl:
            "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        },
      },
      "s-text-fc5bc0e0-342c-4e3b-85f5-3001a85d6126": {
        id: "s-text-fc5bc0e0-342c-4e3b-85f5-3001a85d6126",
        layerId: "layerMiddle",
        type: "text",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {},
          },
          text: "<h1>Your text</h1>",
        },
      },
      "s-text-66056c6c-002d-4fc9-8152-9075771d6a8f": {
        id: "s-text-66056c6c-002d-4fc9-8152-9075771d6a8f",
        layerId: "layerBackground",
        type: "text",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {},
          },
          text: "<h1>Your text</h1>",
        },
      },
    },
    transitions: {},
    layerOrder: ["layerForeground", "layerMiddle", "layerBackground"],
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
