import { act, renderHook } from "@testing-library/react-hooks";
import { TEST_CASE_PROJECT } from "~/data/nested-composition.data";
import {
  useSeqItemResizeHandler,
  useSeqItemResizeValidation,
} from "~/hooks/timeline/dom-layer/use-sequence-resize";
import useVideoStore from "~/store/video.store";
import type { LayerId } from "~/types/timeline.types";

const pixelsPerFrame = 2.08; // full screen , mac-book 14 inch, no devtools open
describe("timeline-ops", () => {
  // Helper function to initialize the store with test data
  const initializeStore = () => {
    const { result } = renderHook(() => useVideoStore());
    act(() => {
      result.current.loadProject(TEST_CASE_PROJECT);
    });
    return result;
  };

  describe("Project Management", () => {
    it("should load a project", () => {
      const result = initializeStore();
      expect(result.current.id).toBe("id-dummy");
      expect(result.current.title).toBe("Dummy Project");
      expect(result.current.props.compositionMetaData.width).toBe(720);
      expect(result.current.props.compositionMetaData.height).toBe(1080);
      expect(Object.keys(result.current.props.layers)).toHaveLength(4);
    });

    // Add more project management related tests here
  });

  describe("Sequence Item Operations", () => {
    /*  it("should not add a sequence item to a layer when there isn't enough space", () => {
      const result = initializeStore();
      const newItem: Extract<
        LiteSequenceItemType,
        { sequenceType: "standalone" }
      > = {
        id: `s-text-${uuid()}`,
        sequenceType: "standalone",
        contentType: "text",
        effectiveDuration: 100,
        sequenceDuration: 100,
        startFrame: 0,
        offset: 0,
      };
      const layerId: LayerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";
      const initialItemCount =
        result.current.props.layers[layerId].liteItems.length;

      act(() => {
        result.current.addSequenceItemToLayer(layerId, newItem);
      });

      const layer = result.current.props.layers[layerId];
      expect(layer.liteItems).toHaveLength(initialItemCount);
      expect(layer.liteItems.some((item) => item.id === newItem.id)).toBe(
        false,
      );
      expect(layer.liteItems[0].startFrame).toBe(90);
      expect(layer.liteItems[1].startFrame).toBe(256);
    });
 */
    it("should remove a sequence item from a layer", () => {
      const result = initializeStore();
      const layerId: LayerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";
      const itemIdToRemove = "s-text-07de0601-6438-4720-bc03-01f9678fdcfa";

      act(() => {
        result.current.removeSequenceItemFromLayer(layerId, itemIdToRemove);
      });

      const layer = result.current.props.layers[layerId];
      expect(layer.liteItems).toHaveLength(1);
      expect(layer.liteItems[0].id).not.toBe(itemIdToRemove);
    });

    it("should update sequence item position in the same layer", () => {
      const result = initializeStore();
      const layerId: LayerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";
      const itemId = "s-text-07de0601-6438-4720-bc03-01f9678fdcfa";

      act(() => {
        result.current.updateSequenceItemPositionInLayer(
          layerId,
          layerId,
          itemId,
          { startFrame: 150 },
        );
      });

      const layer = result.current.props.layers[layerId];
      const updatedItem = layer.liteItems.find((item) => item.id === itemId);
      expect(updatedItem?.startFrame).toBe(150);
    });

    // Add more sequence item operation tests here
  });

  describe("Transition Operations", () => {
    it("should add a transition to a layer", () => {
      const result = initializeStore();
      const layerId: LayerId = "l-c8319623-268e-41be-a608-5f32142c90b0";
      const itemId = "s-image-2680e159-921a-4fc0-a3d4-a3140f6a4880";

      act(() => {
        result.current.addTransitionToLayer(layerId, itemId, "outgoing");
      });

      const layer = result.current.props.layers[layerId];
      const item = layer.liteItems.find((item) => item.id === itemId);
      expect(item?.transition?.outgoing).toBeDefined();
      expect(item?.transition?.outgoing?.duration).toBe(15);
      expect(item?.transition?.outgoing?.id).toMatch(/^t-/);
    });

    // Add more transition operation tests here
  });

  describe("Layer Operations", () => {
    it("should update layer metadata", () => {
      const result = initializeStore();
      const layerId: LayerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";

      act(() => {
        result.current.updateLayerMetadata(layerId, {
          name: "Updated Layer Name",
        });
      });

      const layer = result.current.props.layers[layerId];
      expect(layer.name).toBe("Updated Layer Name");
    });

    // Add more layer operation tests here
  });

  // TODO : need to write better test cases,as of now updateSequenceItemDuration is not called. I have no energy.
  describe("Resize Operations", () => {
    const initializeStore = () => {
      const { result } = renderHook(() => useVideoStore());
      act(() => {
        result.current.loadProject(TEST_CASE_PROJECT);
      });
      return result;
    };

    const setupResizeHooks = () => {
      const storeResult = initializeStore();
      const { result: handlerResult } = renderHook(() =>
        useSeqItemResizeHandler(pixelsPerFrame),
      );

      const { result: validationResult } = renderHook(() =>
        useSeqItemResizeValidation(),
      );

      return { storeResult, handlerResult, validationResult };
    };

    it("should resize a standalone image item from the right through all layers", () => {
      const { storeResult, handlerResult, validationResult } =
        setupResizeHooks();
      const layerId = "l-c8319623-268e-41be-a608-5f32142c90bx";
      const item = storeResult.current.props.layers[layerId].liteItems[0];

      // DOM Layer
      act(() => {
        handlerResult.current({
          layerId,
          deltaPixels: 50,
          direction: "right",
          item,
        });
      });

      // Validation-Cleanup Layer
      // This layer is typically called internally by the handler,
      // but we can test it separately if needed
      act(() => {
        validationResult.current({
          layerId,
          frameDelta: 50,
          direction: "right",
          item,
        });
      });

      // Check Store Layer
      const updatedItem =
        storeResult.current.props.layers[layerId].liteItems[0];
      expect(updatedItem.effectiveDuration).toBe(650); // 600 + 50
    });

    it("should not resize beyond the next item", () => {
      const { storeResult, handlerResult } = setupResizeHooks();
      const layerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";
      const item = storeResult.current.props.layers[layerId].liteItems[0];
      const nextItem = storeResult.current.props.layers[layerId].liteItems[1];

      // DOM Layer
      act(() => {
        handlerResult.current({
          layerId,
          deltaPixels: 200, // Exceeds next item's start
          direction: "right",
          item,
          nextItemStartFrame: nextItem.startFrame,
        });
      });

      // Check Store Layer
      const updatedItem =
        storeResult.current.props.layers[layerId].liteItems[0];
      expect(updatedItem.effectiveDuration).toBe(150); // Unchanged
    });

    it("should snap to the next item when resizing right close to the threshold", () => {
      const { storeResult, handlerResult } = setupResizeHooks();
      const layerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";
      const item = storeResult.current.props.layers[layerId].liteItems[0];
      const nextItem = storeResult.current.props.layers[layerId].liteItems[1];

      // DOM Layer
      act(() => {
        handlerResult.current({
          layerId,
          deltaPixels: 12, // Just within snap threshold
          direction: "right",
          item,
          nextItemStartFrame: nextItem.startFrame,
        });
      });

      // Check Store Layer
      const updatedItem =
        storeResult.current.props.layers[layerId].liteItems[0];
      expect(updatedItem.effectiveDuration).toBe(166); // Snapped to next item's start (256 - 90)
    });
  });
});
