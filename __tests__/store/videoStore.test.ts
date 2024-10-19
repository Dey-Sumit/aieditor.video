import { act, renderHook } from "@testing-library/react-hooks";
import { v4 as uuid } from "uuid";
import { TEST_PROJECT } from "~/data/nested-composition.data";
import useVideoStore from "~/store/video.store";
import type { LayerId, LiteSequenceItemType } from "~/types/timeline.types"; // Adjust the import path as necessary

describe("useVideoStore", () => {
  it("should load a project", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

    expect(result.current.id).toBe("id-dummy");
    expect(result.current.title).toBe("Dummy Project");
    expect(result.current.props.compositionMetaData.width).toBe(720);
    expect(result.current.props.compositionMetaData.height).toBe(1080);
    expect(Object.keys(result.current.props.layers)).toHaveLength(4);
  });

  it("should not add a sequence item to a layer when there isn't enough space", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

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

    // Check that the number of items hasn't changed
    expect(layer.liteItems).toHaveLength(initialItemCount);

    // Check that the new item wasn't added
    expect(layer.liteItems.some((item) => item.id === newItem.id)).toBe(false);

    // Optionally, check that the existing items weren't modified
    expect(layer.liteItems[0].startFrame).toBe(90);
    expect(layer.liteItems[1].startFrame).toBe(256);
  });

  it("should remove a sequence item from a layer", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

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
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

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

  it("should add a transition to a layer", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

    const layerId: LayerId = "l-c8319623-268e-41be-a608-5f32142c90b0";
    const itemId = "s-image-2680e159-921a-4fc0-a3d4-a3140f6a4880";

    act(() => {
      result.current.addTransitionToLayer(layerId, itemId, "outgoing");
    });

    const layer = result.current.props.layers[layerId];
    const item = layer.liteItems.find((item) => item.id === itemId);
    expect(item?.transition?.outgoing).toBeDefined();
    expect(item?.transition?.outgoing?.duration).toBe(15); // Assuming default duration is 15
    expect(item?.transition?.outgoing?.id).toMatch(/^t-/); // Assuming transition IDs start with 't-'
  });

  it("should update layer metadata", () => {
    const { result } = renderHook(() => useVideoStore());

    act(() => {
      result.current.loadProject(TEST_PROJECT);
    });

    const layerId: LayerId = "l-ac121030-0325-4cbd-b334-c4d91400fa5c";

    act(() => {
      result.current.updateLayerMetadata(layerId, {
        name: "Updated Layer Name",
      });
    });

    const layer = result.current.props.layers[layerId];
    expect(layer.name).toBe("Updated Layer Name");
  });

  // Add more tests for other functionalities...
});
