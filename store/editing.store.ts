import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { LayerId } from "~/types/timeline.types";

type NewItemType = "text" | "image" | "video" | "audio";

interface EditingState {
  activeSeqItem: {
    layerId: LayerId;
    itemId: string;
    itemType: NewItemType;
  } | null;
  newItemType: NewItemType;
  // aboutToUse: {};
}

interface EditingActions {
  setActiveSeqItem: (
    layerId: LayerId,
    itemId: string,
    itemType: string,
  ) => void;
  clearActiveSeqItem: () => void;
  setNewItemType: (type: NewItemType) => void;
}

type EditingStore = EditingState & EditingActions;

export const useEditingStore = create<
  EditingStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
>(
  devtools(
    immer((set) => ({
      activeSeqItem: null,
      newItemType: "text",

      setActiveSeqItem: (layerId, itemId, itemType) => {
        set((state) => {
          // @ts-ignore : // TODO fix this
          state.activeSeqItem = { layerId, itemId, itemType };
        });
      },

      clearActiveSeqItem: () => {
        set((state) => {
          state.activeSeqItem = null;
        });
      },

      setNewItemType: (type) => {
        set((state) => {
          state.newItemType = type;
        });
      },
    })),
    { name: "EditingStore", enabled: false },
  ),
);

/* Usage example:
const {
  activeSeqItemId,
  activeLayerId,
  newItemType,
  setActiveSeqItem,
  clearActiveSeqItem,
  setNewItemType
} = useEditingStore(); */

//! Future implementation ideas
/* type EditingStore = {
  
  activeLayerId: LayerId | null;
  editingMode: "select" | "move" | "resize" | "text" | "draw";
  clipboard: {
    operation: "copy" | "cut" | null;
    items: Array<{ id: string; layerId: LayerId }>;
  };
  history: {
    undoStack: Array<EditAction>;
    redoStack: Array<EditAction>;
  };
  -- Actions

  setEditingMode: (
    mode: "select" | "move" | "resize" | "text" | "draw",
  ) => void;
 ... other actions
}; */
