import { create, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import {
  StoreType,
  LiteSequenceItemType,
  LayerId,
  TransitionItemType,
  FullSequenceItemType,
} from "../types/timeline.types";
import { binarySearch, calculateOffset } from "../utils/timeline.utils";
import { DUMMY_NESTED_PROJECT } from "~/data/mockdata.nested-composition";
import { END_SCREEN_PRESET } from "~/video/preset";

/**
 * Custom hook for managing video store state.
 * @returns {StoreType} The video store state and actions.
 */

const useVideoStore = create<StoreType, [["zustand/devtools", never], ["zustand/immer", never]]>(
  devtools(
    immer((set) => ({
      ...DUMMY_NESTED_PROJECT,

      /* ------------------------------ Project level operations  ----------------------------- */
      loadProject: (project) => {
        set(project);
      },

      updateProject: (updates) => {
        set((state: StoreType) => {
          Object.assign(state, updates);
        });
      },

      /* ------------------------------ CRUD operation of Timeline  ----------------------------- */
      addSequenceItemToLayer: (layerId, newItem) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const liteItem: LiteSequenceItemType = {
            id: newItem.id,
            startFrame: newItem.startFrame,
            effectiveDuration: newItem.effectiveDuration,
            sequenceDuration: newItem.sequenceDuration,
            offset: newItem.offset,
            contentType: "text", // TODO : hardcoded for now
            sequenceType: "standalone",
          };

          // Use the binary search utility function
          const insertIndex = binarySearch(
            layer.liteItems,
            liteItem.startFrame,
            (item) => item.startFrame
          );

          // Insert the new item
          layer.liteItems.splice(insertIndex, 0, liteItem);

          // Update only the offset of the next lite item
          const nextItem = layer.liteItems[insertIndex + 1];
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame - (liteItem.startFrame + liteItem.effectiveDuration);
          }

          // Add to detailed items
          if (!state.props.sequenceItems[layerId]) {
            state.props.sequenceItems[layerId] = {};
          }

          state.props.sequenceItems[layerId][newItem.id] = {
            id: newItem.id,
            layerId: layerId,
            editableProps: {
              styles: {
                container: {
                  // random bg color
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                  justifyContent: "center",
                  alignItems: "center",
                },
                element: {
                  color: "white",
                  fontSize: "80px",
                  fontFamily: "serif",
                },
              },
              text: "Hello",
            },

            type: "text",
          };

          console.log(`Added sequence item ${newItem.id} to layer ${layerId}`);
        });
      },

      removeSequenceItemFromLayer: (layerId, itemId) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex((item) => item.id === itemId);

          if (itemIndex === -1) {
            console.warn(`Sequence item ${itemId} not found in layer ${layerId}`);
            return;
          }

          // Remove the item
          layer.liteItems.splice(itemIndex, 1);

          // Adjust the offset of the next item if it exists
          if (itemIndex < layer.liteItems.length) {
            const nextItem = layer.liteItems[itemIndex];
            const prevItem = itemIndex > 0 ? layer.liteItems[itemIndex - 1] : null;

            nextItem.offset = prevItem
              ? nextItem.startFrame - (prevItem.startFrame + prevItem.effectiveDuration)
              : nextItem.startFrame;
          }

          // Remove from detailed items
          if (state.props.sequenceItems[layerId]) {
            delete state.props.sequenceItems[layerId][itemId];
          }

          console.info(`Removed sequence item ${itemId} from layer ${layerId}`);
        });
      },

      updateSequenceItemInLayer: (layerId, itemId, updates) => {
        console.log({ updates });

        set((state: StoreType) => {
          // Step 1: Locate the layer and item
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const liteItemIndex = layer.liteItems.findIndex((item) => item.id === itemId);

          if (liteItemIndex === -1) {
            console.warn(`Item ${itemId} not found in layer ${layerId}`);
            return;
          }

          // Step 2: Get references to the current, previous, and next items
          const currentItem = layer.liteItems[liteItemIndex];
          const prevItem = liteItemIndex > 0 ? layer.liteItems[liteItemIndex - 1] : null;
          const nextItem =
            liteItemIndex < layer.liteItems.length - 1 ? layer.liteItems[liteItemIndex + 1] : null;

          // Step 3: Create the updated item
          const updatedItem = {
            ...currentItem,
            ...updates,
            startFrame: updates.startFrame + (currentItem.transition?.incoming?.duration || 0),
          };
          console.log({ updatedItem });

          // Step 4: Handle transition removal if the item has moved
          if (updatedItem.startFrame !== currentItem.startFrame) {
            // Remove incoming transition if it exists
            if (currentItem.transition?.incoming) {
              if (prevItem) {
                delete prevItem?.transition?.outgoing;
                prevItem.sequenceDuration = prevItem.effectiveDuration;
              }
              delete currentItem.transition?.incoming;
            }

            // Remove outgoing transition if it exists
            if (currentItem.transition?.outgoing && nextItem) {
              // Update the next item

              delete nextItem.transition?.incoming;
              delete updatedItem.transition?.outgoing;
              updatedItem.sequenceDuration = updatedItem.effectiveDuration;
            }
          }

          // Step 5: Remove the item from its current position
          layer.liteItems.splice(liteItemIndex, 1);

          // Step 6: Find the new position for the item
          const newIndex = binarySearch(
            layer.liteItems,
            updatedItem.startFrame,
            (item) => item.startFrame
          );

          // Step 7: Insert the item at its new position
          layer.liteItems.splice(newIndex, 0, updatedItem);

          // Step 8: Update offsets
          const newPrevItem = newIndex > 0 ? layer.liteItems[newIndex - 1] : null;
          const newNextItem =
            newIndex < layer.liteItems.length - 1 ? layer.liteItems[newIndex + 1] : null;

          // Update the offset of the current item
          updatedItem.offset = calculateOffset(newPrevItem, updatedItem);
          console.log("updatedItem.offset", updatedItem.offset);

          // Update next item's offset if it exists
          if (newNextItem) {
            newNextItem.offset = calculateOffset(updatedItem, newNextItem);
          }
          console.log("newNextItem.offset", newNextItem?.offset);

          console.log(`Updated sequence item ${itemId} in layer ${layerId}`);
        });
      },

      /* ------------------------------ Update operation of Transitions  ----------------------------- */
      updateTextEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[layerId]?.[itemId];
          if (!item || item.type !== "text") {
            console.warn(`Text item ${itemId} not found in layer ${layerId}`);
            return;
          }

          item.editableProps = {
            ...item.editableProps,
            ...updates,
          };
        });
      },

      updateImageEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[layerId]?.[itemId];
          if (!item || item.type !== "image") {
            console.warn(`Image item ${itemId} not found in layer ${layerId}`);
            return;
          }

          item.editableProps = {
            ...item.editableProps,
            ...updates,
          };
        });
      },

      updateAudioEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[layerId]?.[itemId];
          if (!item) {
            console.warn(`Audio item ${itemId} not found in layer ${layerId}`);
            return;
          }

          item.editableProps = {
            ...item.editableProps,
            ...updates,
          };
        });
      },

      updateVideoEditableProps: (layerId, itemId, updates) => {},

      // frameDelta can be positive or negative, positive means increase the duration, negative means decrease the duration
      updateSequenceItemDuration: (layerId, itemId, frameDelta, direction) => {
        set((state: StoreType) => {
          console.log("in updateSequenceItemDuration", frameDelta, direction);

          const layer = state.props.layers[layerId]!;

          const itemIndex = layer.liteItems.findIndex((item) => item.id === itemId)!;

          const item = layer.liteItems[itemIndex];
          const nextItem = layer.liteItems[itemIndex + 1];

          // Update sequenceDuration and startFrame
          item.effectiveDuration += frameDelta;
          item.sequenceDuration += frameDelta;
          if (frameDelta > 0) {
            if (direction === "left") {
              item.startFrame -= frameDelta;
            } else if (direction === "right") {
            }
          } else {
            if (direction === "left") {
              item.startFrame -= frameDelta;
            } else if (direction === "right") {
            }
          }
          if (direction === "left") {
            item.offset -= frameDelta;
          }

          // Update the next item's offset if it exists
          if (nextItem) {
            // TODO : might need to handle the transition case
            nextItem.offset = nextItem.startFrame - (item.startFrame + item.effectiveDuration);
          }

          console.log(`Updated item ${itemId} in layer ${layerId}:`);
        });
      },

      /* ------------------------------ CRUD operation of Transitions  ----------------------------- */
      updateTransitionInLayer: (layerId, transition, updates) => {},

      removeTransitionFromLayer: (layerId, transitionId) => {},

      addTransitionToLayer: (
        layerId: LayerId,
        itemId: string,
        position: "incoming" | "outgoing"
      ) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex((item) => item.id === itemId);

          if (itemIndex === -1) {
            console.warn(`Item ${itemId} not found in layer ${layerId}`);
            return;
          }

          const newTransitionId = `t-${Date.now()}`;
          const transitionDuration = 30; // Total transition duration
          const defaultTransition: Omit<TransitionItemType, "fromSequenceIndex"> = {
            id: newTransitionId,
            type: "wipe",
            duration: transitionDuration,
            properties: {
              easing: "linear",
            },
            fromSequenceId: "",
            toSequenceId: "",
          };

          // TODO : This if else block can be removed, we can use the upcoming loop for that.
          if (position === "incoming") {
            if (itemIndex > 0) {
              const prevItem = layer.liteItems[itemIndex - 1];
              const currentItem = layer.liteItems[itemIndex];
              if (!prevItem.transition) {
                prevItem.transition = {};
              }
              if (!currentItem.transition) {
                currentItem.transition = {};
              }
              prevItem.transition.outgoing = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              currentItem.transition.incoming = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              // Adjust startFrame of the current item by full transition duration
              currentItem.startFrame -= transitionDuration;

              defaultTransition.fromSequenceId = prevItem.id;
              defaultTransition.toSequenceId = itemId;

              // Update effective duration of previous item
              prevItem.effectiveDuration = prevItem.sequenceDuration - transitionDuration;
            }
          } else if (position === "outgoing") {
            if (itemIndex < layer.liteItems.length - 1) {
              const currentItem = layer.liteItems[itemIndex];
              const nextItem = layer.liteItems[itemIndex + 1];

              if (!currentItem.transition) {
                currentItem.transition = {};
              }
              if (!nextItem.transition) {
                nextItem.transition = {};
              }
              currentItem.transition.outgoing = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              nextItem.transition.incoming = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              // Adjust startFrame of the next item by full transition duration
              nextItem.startFrame -= transitionDuration;

              defaultTransition.fromSequenceId = itemId;
              defaultTransition.toSequenceId = nextItem.id;

              // Update effective duration of current item
              currentItem.effectiveDuration = currentItem.sequenceDuration - transitionDuration;
            }
          }

          // Propagate startFrame changes to all subsequent items
          if (transitionDuration > 0) {
            const startIndex = position === "incoming" ? itemIndex + 1 : itemIndex + 2; // from the next element, TODO : I think this step can be improved , as we are already upadting one adjacent element in the prev step, and that step can be removed.
            for (let i = startIndex; i < layer.liteItems.length; i++) {
              layer.liteItems[i].startFrame -= transitionDuration;
            }
          }

          // TODO : check if we need to fix it
          // if (!state.props.transitions[layerId]) {
          //   state.props.transitions[layerId] = {};
          // }

          // TODO : uncomment and fix the error
          /*      state.props.transitions[layerId][newTransitionId] = {
            ...defaultTransition,
            fromSequenceIndex:
              position === "outgoing" ? itemIndex : itemIndex - 1,
          }; */

          console.log(
            `Added ${position} transition ${newTransitionId} to item ${itemId} in layer ${layerId}`
          );
        });
      },

      addPresetToLayer: (layerId, presetDetails) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }
          let preset = { ...END_SCREEN_PRESET };
          const { offset, startFrame } = presetDetails;
          console.log({ offset });

          // Generate a random suffix for the key
          const randomSuffix = Math.random().toString(36).substring(2, 8);

          // Update the key in liteLevel with the random suffix
          preset.liteLevel.id = `${preset.liteLevel.id}-${randomSuffix}`;

          const liteSequenceItem: LiteSequenceItemType = {
            ...preset.liteLevel,
            startFrame,
            offset,
          };
          // Add the preset's liteLevel to the layer
          layer.liteItems.push(liteSequenceItem);

          // Merge the preset's sequenceItems into the store
          if (!state.props.sequenceItems[layerId]) {
            state.props.sequenceItems[layerId] = {};
          }

          Object.entries(preset.sequenceItems).forEach(([itemId, item]) => {
            state.props.sequenceItems[layerId][itemId] = {
              ...item,
              layerId,
            };
          });

          console.log(`Added ${presetDetails} preset to layer ${layerId}`);
        });
      },
    })),
    {
      name: "VideoStore",
    }
  )
);

export default useVideoStore;
