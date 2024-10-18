import { act, renderHook } from "@testing-library/react-hooks";
import useVideoStore from "~/store/video.store";
import type { NestedCompositionProjectType } from "~/types/timeline.types";

// Mock project data
const mockProject: NestedCompositionProjectType = {
  id: "test-project-1",
  title: "Test Project",
  props: {
    compositionMetaData: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 300,
      compositionId: "comp-1",
    },
    layers: {
      "layer-1": {
        id: "layer-1",
        name: "Layer 1",
        isVisible: true,
        liteItems: [],
      },
    },
    layerOrder: ["layer-1"],
    sequenceItems: {},
    transitions: {},
  },
};

describe("useVideoStore", () => {
  it("should load a project", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(mockProject);
    });

    expect(result.current.id).toBe("test-project-1");
    expect(result.current.title).toBe("Test Project");
    expect(result.current.props.compositionMetaData.width).toBe(1920);
    expect(result.current.props.layers["layer-1"].name).toBe("Layer 1");
  });

  it("should add a sequence item to a layer", () => {
    const { result } = renderHook(() => useVideoStore());

    // First, load the project
    act(() => {
      result.current.loadProject(mockProject);
    });

    // Now add a sequence item
    act(() => {
      result.current.addSequenceItemToLayer("layer-1", {
        id: "item-1",
        sequenceType: "standalone",
        contentType: "video",
        sequenceDuration: 100,
        effectiveDuration: 100,
        startFrame: 0,
        offset: 0,
      });
    });

    expect(result.current.props.layers["layer-1"].liteItems).toHaveLength(1);
    expect(result.current.props.layers["layer-1"].liteItems[0].id).toBe(
      "item-1",
    );
  });
});
