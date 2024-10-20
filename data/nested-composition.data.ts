import type { NestedCompositionProjectType } from "~/types/timeline.types";

export const TEST_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      "l-c8319623-268e-41be-a608-5f32142c90b1": {
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
        id: "l-c8319623-268e-41be-a608-5f32142c90b1",
        isVisible: true,
        name: "Layer 2",
      },
      "l-c8319623-268e-41be-a608-5f32142c90bx": {
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
        id: "l-c8319623-268e-41be-a608-5f32142c90bx",
        isVisible: true,
        name: "Layer 1",
      },
      "l-c8319623-268e-41be-a608-5f32142c90b0": {
        id: "l-c8319623-268e-41be-a608-5f32142c90b0",
        name: "Layer 3",
        liteItems: [
          {
            id: "s-text-726e00e6-3589-4b1a-908b-7d5e9b3b7496",
            sequenceType: "standalone",
            contentType: "text",
            startFrame: 11,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 11,
          },
          {
            id: "s-image-2680e159-921a-4fc0-a3d4-a3140f6a4880",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 193,
            effectiveDuration: 120,
            sequenceDuration: 150,
            offset: 32,
            transition: {
              outgoing: {
                id: "t-1729285181512",
                duration: 15,
              },
            },
          },
          {
            id: "s-image-b8387191-42c9-466e-a96a-9fd16532eb76",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 313,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 0,
            transition: {
              incoming: {
                id: "t-1729285181512",
                duration: 15,
              },
            },
          },
        ],
        isVisible: true,
      },
      "l-ac121030-0325-4cbd-b334-c4d91400fa5c": {
        id: "l-ac121030-0325-4cbd-b334-c4d91400fa5c",
        name: "Layer 4",
        liteItems: [
          {
            id: "s-text-07de0601-6438-4720-bc03-01f9678fdcfa",
            sequenceType: "standalone",
            contentType: "text",
            startFrame: 90,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 90,
          },
          {
            id: "s-image-635bc88f-90bf-491e-a414-83269b12cfca",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 256,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 16,
          },
        ],
        isVisible: true,
      },
    },
    layerOrder: [
      "l-ac121030-0325-4cbd-b334-c4d91400fa5c",
      "l-c8319623-268e-41be-a608-5f32142c90b1",
      "l-c8319623-268e-41be-a608-5f32142c90b0",
      "l-c8319623-268e-41be-a608-5f32142c90bx",
    ],
    sequenceItems: {
      "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
        id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
        layerId: "l-c8319623-268e-41be-a608-5f32142c90bx",
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
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b1",
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
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b1",
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

      "s-text-726e00e6-3589-4b1a-908b-7d5e9b3b7496": {
        id: "s-text-726e00e6-3589-4b1a-908b-7d5e9b3b7496",
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b0",
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
      "s-image-2680e159-921a-4fc0-a3d4-a3140f6a4880": {
        id: "s-image-2680e159-921a-4fc0-a3d4-a3140f6a4880",
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b0",
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
      "s-image-b8387191-42c9-466e-a96a-9fd16532eb76": {
        id: "s-image-b8387191-42c9-466e-a96a-9fd16532eb76",
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b0",
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

      "s-image-635bc88f-90bf-491e-a414-83269b12cfca": {
        id: "s-image-635bc88f-90bf-491e-a414-83269b12cfca",
        layerId: "l-ac121030-0325-4cbd-b334-c4d91400fa5c",
        type: "image",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {
              "object-fit": "cover",
              width: "60%",
              height: "60%",
              "border-radius": "10px",
              border: "2px solid white",
            },
            overlay: {},
          },
          imageUrl:
            "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        },
      },
      "s-text-07de0601-6438-4720-bc03-01f9678fdcfa": {
        id: "s-text-07de0601-6438-4720-bc03-01f9678fdcfa",
        layerId: "l-ac121030-0325-4cbd-b334-c4d91400fa5c",
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
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 600,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};

export const EMPTY_PROJECT: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      "l-c8319623-268e-41be-a608-5f32142c90b1": {
        liteItems: [
          {
            id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
            sequenceType: "standalone",
            contentType: "image",
            effectiveDuration: 300,
            sequenceDuration: 300,
            offset: 0,
            startFrame: 0,
          },
        ],
        id: "l-c8319623-268e-41be-a608-5f32142c90b1",
        isVisible: true,
        name: "Layer bg",
      },
    },
    layerOrder: ["l-c8319623-268e-41be-a608-5f32142c90b1"],
    sequenceItems: {
      "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
        id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
        layerId: "l-c8319623-268e-41be-a608-5f32142c90b1",
        type: "image",
        editableProps: {
          styles: {
            container: {},
            element: {
              "object-fit": "contain",
              width: "100%",
              height: "100%",
            },
            overlay: {},
          },
          imageUrl:
            "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        },
        animations: [
          {
            type: "fade",
            from: 0,
            to: 1,
            duration: 60,
            startAt: 0, // Starts at frame 40
          },
          {
            type: "fade",
            from: 1,
            to: 0,
            duration: 60,
            startAt: 240, // Starts at frame 40
          },
          {
            type: "scale",
            from: 1,
            to: 0.7,
            duration: 60,
            startAt: 30, // Starts immediately at frame 0
          },
        ],
      },
      // "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93": {
      //   id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
      //   layerId: "l-c8319623-268e-41be-a608-5f32142c90b1",
      //   type: "image",
      //   editableProps: {
      //     styles: {
      //       container: {},
      //       element: {
      //         "object-fit": "contain",
      //         width: "100%",
      //         height: "100%",
      //       },
      //       overlay: {},
      //     },
      //     imageUrl:
      //       "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      //   },
      //   animations: [
      //     {
      //       type: "fade",
      //       from: 0,
      //       to: 1,
      //       duration: 60,
      //       startAt: 0, // Starts at frame 40
      //     },
      //     {
      //       type: "fade",
      //       from: 1,
      //       to: 0,
      //       duration: 60,
      //       startAt: 240, // Starts at frame 40
      //     },
      //     {
      //       type: "scale",
      //       from: 1,
      //       to: 0.7,
      //       duration: 60,
      //       startAt: 30, // Starts immediately at frame 0
      //     },
      //   ],
      // },
    },
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 600,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};

/*


ADD ANIMATION :
 - ENTER ANIMATION 
  - 30s duration
    - 0s - 30s

 - EXIT ANIMATION (for this I need to know the duration of the sequence)
  - 30s duration
    - 270s - 300s

- what if the for the exit animation, we can a type based animation. then we are getting the duration in the component and subtract it. 
    
- FULL ANIMATION
  - 300s duration
    - 0s - 300s





*/
