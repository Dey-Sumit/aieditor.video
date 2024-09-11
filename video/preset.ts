/* ------------------------ Brut End Screen Preset ----------------------- */
export const END_SCREEN_PRESET = {
  liteLevel: {
    sequenceType: "preset",
    effectiveDuration: 60,
    sequenceDuration: 60,
    id: "id-preset-end-screen",
    offset: "VAR_OFFSET", //  0 as this is a variable while adding to the timeline
    startFrame: "VAR_START_FRAME", // 0 as this is a variable while adding to the timeline
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

  sequenceItems: {
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
  },
};
