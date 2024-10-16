const SIMPLE_IMAGE_OVERLAP = {
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
        liteItems: [
          {
            id: "s-image-9c4128a5-9d75-441a-bdb0-ff059bd3c8a3",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 61,
            effectiveDuration: 60,
            sequenceDuration: 60,
            offset: 61,
          },
        ],
      },
      layerBg: {
        id: "layerBg",
        name: "Layer Bg",
        isVisible: true,
        liteItems: [
          {
            id: "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93",
            sequenceType: "standalone",
            contentType: "image",
            startFrame: 0,
            effectiveDuration: 150,
            sequenceDuration: 150,
            offset: 0,
          },
        ],
      },
    },
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
              "background-color": "rgba(0,0,0,0.6)",
            },
          },
          imageUrl:
            "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        },
      },
      "s-image-9c4128a5-9d75-441a-bdb0-ff059bd3c8a3": {
        id: "s-image-9c4128a5-9d75-441a-bdb0-ff059bd3c8a3",
        layerId: "layerMiddle",
        type: "image",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {
              "object-fit": "contain",
              width: "50%",
              height: "50%",
              border: "4px solid white",
              "border-radius": "10px",
              "box-sizing": "content-box",
            },
            overlay: {},
          },
          imageUrl:
            "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        },
      },
    },
    transitions: {},
    layerOrder: ["layerMiddle", "layerBg"],
  },
};
