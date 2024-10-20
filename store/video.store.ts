import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {
  LayerId,
  LayerType,
  LiteSequenceItemType,
  LiteSequencePresetItemType,
  StoreType,
  TransitionItemType,
  VideoSequenceItemType,
} from "../types/timeline.types";

import {
  binarySearch,
  calculateItemIndices,
  calculateOffset,
  DEFAULT_CONTENT_PROPS,
} from "../utils/timeline.utils";

import { TEST_CASE_PROJECT } from "~/data/nested-composition.data";
import { genId } from "~/utils/misc.utils";

/**
 * Custom hook for managing video store state.
 * @returns {StoreType} The video store state and actions.
 */

const useVideoStore = create<
  StoreType,
  [["zustand/devtools", never], ["zustand/immer", never]]
>(
  devtools(
    immer((set) => ({
      ...TEST_CASE_PROJECT,

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
      addSequenceItemToLayer: (layerId, newSeqLiteItem) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Use the binary search utility function
          const insertIndex = binarySearch(
            layer.liteItems,
            newSeqLiteItem.startFrame,
            (item) => item.startFrame,
          );

          // Insert the new item
          layer.liteItems.splice(insertIndex, 0, newSeqLiteItem);

          // Update only the offset of the next lite item
          const nextItem = layer.liteItems[insertIndex + 1];
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame -
              (newSeqLiteItem.startFrame + newSeqLiteItem.effectiveDuration);
          }

          // Get default props based on content type
          const defaultProps =
            DEFAULT_CONTENT_PROPS[newSeqLiteItem.contentType];

          //@ts-ignore
          state.props.sequenceItems[newSeqLiteItem.id] = {
            id: newSeqLiteItem.id,
            layerId: layerId,
            ...defaultProps,
          };

          console.log(
            `Added sequence item ${newSeqLiteItem.id} to layer ${layerId}`,
          );
        });
      },

      removeSequenceItemFromLayer: (layerId, itemId) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          if (itemIndex === -1) {
            console.warn(
              `Sequence item ${itemId} not found in layer ${layerId}`,
            );
            return;
          }

          // Remove the item
          layer.liteItems.splice(itemIndex, 1);

          // Adjust the offset of the next item if it exists
          if (itemIndex < layer.liteItems.length) {
            const nextItem = layer.liteItems[itemIndex];
            const prevItem =
              itemIndex > 0 ? layer.liteItems[itemIndex - 1] : null;

            nextItem.offset = prevItem
              ? nextItem.startFrame -
                (prevItem.startFrame + prevItem.effectiveDuration)
              : nextItem.startFrame;
          }

          // Remove from detailed items
          if (state.props.sequenceItems[layerId]) {
            delete state.props.sequenceItems[itemId];
          }

          console.info(`Removed sequence item ${itemId} from layer ${layerId}`);
        });
      },

      /*
        case 1 : change position on x axis
        case 2 : change position on y axis
        case 3 : change position on x and y axis
      */
      updateSequenceItemPositionInLayer: (
        oldLayerId,
        newLayerId,
        itemId,
        updates,
      ) => {
        set((state: StoreType) => {
          // CASE 1 : Change position on x axis
          if (oldLayerId === newLayerId) {
            const layer = state.props.layers[oldLayerId];

            const { oldIndex, futureNewIndex } = calculateItemIndices(
              layer.liteItems,
              itemId,
              updates.startFrame,
            );

            const movedItem = layer.liteItems[oldIndex];

            // Create the updated item
            const updatedItem = {
              ...movedItem,
              startFrame: updates.startFrame,
            };
            console.log("updateSequenceItemPositionInLayer", updatedItem);

            // Remove the item from its current position
            layer.liteItems.splice(oldIndex, 1);

            // Insert the item at its new position
            layer.liteItems.splice(futureNewIndex, 0, updatedItem);

            // Determine the range of items that need updating
            const startUpdateIndex = Math.min(oldIndex, futureNewIndex);
            const endUpdateIndex = Math.max(oldIndex, futureNewIndex);
            console.log("startUpdateIndex", startUpdateIndex);
            console.log("endUpdateIndex", endUpdateIndex);

            if (updatedItem.transition?.incoming) {
              const prevItemBeforeChange =
                layer.liteItems[startUpdateIndex - 1];
              if (prevItemBeforeChange) {
                delete prevItemBeforeChange?.transition?.outgoing;
                prevItemBeforeChange.effectiveDuration =
                  prevItemBeforeChange.sequenceDuration;
              }
              delete updatedItem.transition?.incoming;
            }

            // Remove outgoing transition if it exists
            if (updatedItem.transition?.outgoing) {
              const nextItem = layer.liteItems[endUpdateIndex + 1];
              // Update the next item
              if (nextItem) {
                delete nextItem.transition?.incoming;
                delete updatedItem.transition?.outgoing;
                updatedItem.effectiveDuration = updatedItem.sequenceDuration;
              }
            }

            // TODO : i don't think we need to update the offsets for all affected items, we can just update the offsets for the items that are affected by the transition eg. the next item
            // Update offsets for all affected items
            console.log("layer.liteItems", layer.liteItems, {
              startUpdateIndex,
              endUpdateIndex,
            });

            for (let i = startUpdateIndex; i <= endUpdateIndex; i++) {
              const currentItem = layer.liteItems[i];
              const prevItem = i > 0 ? layer.liteItems[i - 1] : null;
              console.log("in the loop");

              currentItem.offset = calculateOffset(prevItem, currentItem);
              console.log("currentItem", currentItem);
            }

            // If the last affected item isn't the last in the layer, update the next item's offset
            if (endUpdateIndex < layer.liteItems.length - 1) {
              const nextItem = layer.liteItems[endUpdateIndex + 1];
              const lastAffectedItem = layer.liteItems[endUpdateIndex];
              nextItem.offset = calculateOffset(lastAffectedItem, nextItem);
            }

            console.log(
              `Updated sequence item ${itemId} in layer ${oldLayerId}`,
            );
          } else {
            // CASE 2 : Change position on y axis
            // NEED TO REFACTOR this. we need to make functions more modular, as changing layer means, insert in new layer and remove from old layer
            // Get references to the old and new layers
            const oldLayer = state.props.layers[oldLayerId];
            const newLayer = state.props.layers[newLayerId];

            // Find the item's current index in the old layer
            const itemIndexInOldLayer = oldLayer.liteItems.findIndex(
              (item) => item.id === itemId,
            );

            // Get the item that's being moved
            const movedItem = oldLayer.liteItems[itemIndexInOldLayer];
            console.log("movedItem", movedItem);

            // If the item hasn't moved and the layer hasn't changed, do nothing
            if (
              updates.startFrame === movedItem.startFrame &&
              oldLayerId === newLayerId
            ) {
              return;
            }

            // Create the updated item with the new start frame
            const updatedItem = {
              ...movedItem,
              startFrame: updates.startFrame,
            };

            console.log("updatedItem", updatedItem);

            // Find the new index for the item in the new layer

            const insertIndex = binarySearch(
              newLayer.liteItems,
              updatedItem.startFrame,
              (item) => item.startFrame,
            );

            const newOffset = calculateOffset(
              newLayer.liteItems[insertIndex - 1],
              updatedItem,
            );

            updatedItem.offset = newOffset;

            console.log("futureNewIndex", insertIndex);

            // Insert the item at its new position in the new layer
            newLayer.liteItems.splice(insertIndex, 0, updatedItem);
            // Update only the offset of the next lite item
            const nextItem = newLayer.liteItems[insertIndex + 1];
            if (nextItem) {
              nextItem.offset =
                nextItem.startFrame -
                (updatedItem.startFrame + updatedItem.effectiveDuration);
            }

            // HANDLE OPERATIONS OF OLD LAYER

            // Remove the item from the old layer
            oldLayer.liteItems.splice(itemIndexInOldLayer, 1);

            // Adjust the offset of the next item if it exists
            if (itemIndexInOldLayer < oldLayer.liteItems.length) {
              const nextItem = oldLayer.liteItems[itemIndexInOldLayer];
              const prevItem =
                itemIndexInOldLayer > 0
                  ? oldLayer.liteItems[itemIndexInOldLayer - 1]
                  : null;

              nextItem.offset = prevItem
                ? nextItem.startFrame -
                  (prevItem.startFrame + prevItem.effectiveDuration)
                : nextItem.startFrame;
            }

            // TODO : Handle transitions, there are bugs I noticed xD
            if (updatedItem.transition?.incoming) {
              const prevItem = oldLayer.liteItems[insertIndex - 1];
              if (prevItem) {
                delete prevItem.transition?.outgoing;
                prevItem.effectiveDuration = prevItem.sequenceDuration;
              }
              delete updatedItem.transition?.incoming;
            }

            if (updatedItem.transition?.outgoing) {
              const nextItem = oldLayer.liteItems[insertIndex + 1];
              if (nextItem) {
                delete nextItem.transition?.incoming;
                delete updatedItem.transition?.outgoing;
                updatedItem.effectiveDuration = updatedItem.sequenceDuration;
              }
            }

            console.log(
              `Updated sequence item ${itemId} from layer ${oldLayerId} to ${newLayerId}`,
            );
          }
        });
      },

      /* ------------------------------ Update operation of Transitions  ----------------------------- */
      updateTextEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[itemId];
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
          const item = state.props.sequenceItems[itemId];
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
          const item = state.props.sequenceItems[itemId];
          if (!item) {
            console.warn(`Audio item ${itemId} not found in layer ${layerId}`);
            return;
          }
          // TODO : handle this later
        });
      },

      updateVideoEditableProps: (layerId, itemId, updates) => {},

      // frameDelta can be positive or negative, positive means increase the duration, negative means decrease the duration
      // updateSequenceItemDuration: (layerId, itemId, frameDelta, direction) => {
      //   set((state: StoreType) => {
      //     const layer = state.props.layers[layerId]!;

      //     const itemIndex = layer.liteItems.findIndex(
      //       (item) => item.id === itemId,
      //     )!;

      //     const item = layer.liteItems[itemIndex];
      //     const nextItem = layer.liteItems[itemIndex + 1];

      //     // Update sequenceDuration and startFrame
      //     // TODO : simplify this logic xD
      //     if (frameDelta > 0) {
      //       if (direction === "left") {
      //         item.startFrame -= frameDelta;
      //       }
      //     } else {
      //       if (direction === "left") {
      //         item.startFrame -= frameDelta;
      //       }
      //     }
      //     if (direction === "left") {
      //       item.offset -= frameDelta;
      //     }

      //     item.effectiveDuration += frameDelta;
      //     item.sequenceDuration += frameDelta;

      //     if (
      //       item.sequenceType === "standalone" &&
      //       item.contentType === "video"
      //     ) {
      //       if (direction === "right") {
      //         if (frameDelta > 0) {
      //           // expanding from right
      //           (
      //             state.props.sequenceItems[itemId] as VideoSequenceItemType
      //           ).editableProps.videoEndsAtInFrames += frameDelta;
      //         } else {
      //           // shrinking from right
      //           /*  (
      //             state.props.sequenceItems[itemId]
      //               .editableProps as VideoEditablePropsType
      //           ).videoEndsAtInFrames += Math.abs(frameDelta); */
      //         }
      //       } else {
      //         if (frameDelta < 0) {
      //           // shrinking from left
      //           (
      //             state.props.sequenceItems[itemId] as VideoSequenceItemType
      //           ).editableProps.videoStartsFromInFrames += Math.abs(frameDelta);
      //         } else {
      //           // expanding from left
      //           // TODO : wtf!!!, Ideally I should not let the user expand from left if the videoStartsFromInFrames<0.
      //           (
      //             state.props.sequenceItems[itemId] as VideoSequenceItemType
      //           ).editableProps.videoStartsFromInFrames =
      //             (state.props.sequenceItems[itemId] as VideoSequenceItemType)
      //               .editableProps.videoStartsFromInFrames -
      //               Math.abs(frameDelta) <
      //             0
      //               ? 0
      //               : (
      //                   state.props.sequenceItems[
      //                     itemId
      //                   ] as VideoSequenceItemType
      //                 ).editableProps.videoStartsFromInFrames -
      //                 Math.abs(frameDelta);
      //         }
      //       }
      //     }

      //     // Update the next item's offset if it exists
      //     if (nextItem) {
      //       // TODO : might need to handle the transition case
      //       nextItem.offset =
      //         nextItem.startFrame - (item.startFrame + item.effectiveDuration);
      //     }

      //     console.log(`Updated item ${itemId} in layer ${layerId}:`);
      //   });
      // },

      /**
       * Frame Delta Scenarios:
       *
       * Left Resize (direction === "left"):
       * - Positive frameDelta: Expanding to the left
       *   The item's left edge moves earlier in time (to the left).
       *   Example: frameDelta = 10, item starts 10 frames earlier, duration increases by 10.
       *
       * - Negative frameDelta: Shrinking from the left
       *   The item's left edge moves later in time (to the right).
       *   Example: frameDelta = -10, item starts 10 frames later, duration decreases by 10.
       *
       * Right Resize (direction === "right"):
       * - Positive frameDelta: Expanding to the right
       *   The item's right edge moves later in time (to the right).
       *   Example: frameDelta = 10, duration increases by 10, end frame is 10 frames later.
       *
       * - Negative frameDelta: Shrinking from the right
       *   The item's right edge moves earlier in time (to the left).
       *   Example: frameDelta = -10, duration decreases by 10, end frame is 10 frames earlier.
       *
       * Note: The frameDelta value has already been validated and adjusted for snapping
       * in the useSeqItemResizeValidation hook before reaching this function.
       */
      updateSequenceItemDuration: (layerId, itemId, frameDelta, direction) => {
        set((state) => {
          console.log("updateSequenceItemDuration", { frameDelta, direction });

          const layer = state.props.layers[layerId];
          if (!layer) return; // Exit if layer not found

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );
          if (itemIndex === -1) return; // Exit if item not found

          const item = layer.liteItems[itemIndex];
          const nextItem = layer.liteItems[itemIndex + 1];

          // Update startFrame and duration
          if (direction === "left") {
            item.startFrame -= frameDelta;
            item.offset -= frameDelta;
            item.effectiveDuration += frameDelta;
            item.sequenceDuration += frameDelta;
          } else {
            // direction === "right"
            item.effectiveDuration += frameDelta;
            item.sequenceDuration += frameDelta;
          }

          console.log("Updated item", item);

          // Handle video specific updates
          if (
            item.sequenceType === "standalone" &&
            item.contentType === "video"
          ) {
            const videoItem = state.props.sequenceItems[
              itemId
            ] as VideoSequenceItemType;
            if (videoItem && "editableProps" in videoItem) {
              if (direction === "left") {
                videoItem.editableProps.videoStartsFromInFrames -= frameDelta;
              } else {
                // direction === "right"
                videoItem.editableProps.videoEndsAtInFrames += frameDelta;
              }
            }
          }

          // Update the next item's offset if it exists
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame - (item.startFrame + item.effectiveDuration);
          }

          console.log(`Updated item ${itemId} in layer ${layerId}:`, item);
        });
      },
      /* ------------------------------ CRUD operation of Transitions  ----------------------------- */
      updateTransitionInLayer: (layerId, transition, updates) => {},

      removeTransitionFromLayer: (layerId, transitionId) => {},

      addTransitionToLayer: (
        layerId: LayerId,
        itemId: string,
        position: "incoming" | "outgoing",
      ) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          if (itemIndex === -1) {
            console.warn(`Item ${itemId} not found in layer ${layerId}`);
            return;
          }

          const newTransitionId = `t-${Date.now()}`;
          const transitionDuration = 30; // Total transition duration
          const defaultTransition: Omit<
            TransitionItemType,
            "fromSequenceIndex"
          > = {
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
              prevItem.effectiveDuration =
                prevItem.sequenceDuration - transitionDuration;
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
              currentItem.effectiveDuration =
                currentItem.sequenceDuration - transitionDuration;
            }
          }

          // Propagate startFrame changes to all subsequent items
          if (transitionDuration > 0) {
            const startIndex =
              position === "incoming" ? itemIndex + 1 : itemIndex + 2; // from the next element, TODO : I think this step can be improved , as we are already upadting one adjacent element in the prev step, and that step can be removed.
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
            `Added ${position} transition ${newTransitionId} to item ${itemId} in layer ${layerId}`,
          );
        });
      },

      // addPresetToLayer: (layerId, presetDetails) => {
      //   set((state: StoreType) => {
      //     const layer = state.props.layers[layerId];
      //     if (!layer) {
      //       console.warn(`Layer ${layerId} not found`);
      //       return;
      //     }
      //     let preset = { ...END_SCREEN_PRESET };
      //     const { offset, startFrame } = presetDetails;

      //     // Generate a random suffix for the key
      //     const randomSuffix = Math.random().toString(36).substring(2, 8);

      //     // Update the key in liteLevel with the random suffix
      //     preset.liteLevel.id = `${preset.liteLevel.id}-${randomSuffix}`;

      //     const liteSequenceItem: LiteSequenceItemType = {
      //       ...preset.liteLevel,
      //       startFrame,
      //       offset,
      //     };
      //     // Add the preset's liteLevel to the layer
      //     layer.liteItems.push(liteSequenceItem);

      //     Object.entries(preset.sequenceItems).forEach(([itemId, item]) => {
      //       state.props.sequenceItems[itemId] = {
      //         ...item,
      //         layerId,
      //       };
      //     });

      //     console.log(`Added ${presetDetails} preset to layer ${layerId}`);
      //   });
      // },
      addPresetToLayer: (layerId, itemPosition, presetDetails) => {
        set((state: StoreType) => {
          console.log("addPresetToLayer", {
            layerId,
            itemPosition,
            // presetDetails,
          });

          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Use the binary search utility function
          const insertIndex = binarySearch(
            layer.liteItems,
            itemPosition.startFrame,
            (item) => item.startFrame,
          );

          const {
            sequenceItems: presetSequenceItems,
            name,
            ...liteItemDetails
          } = presetDetails;
          const presetItem: LiteSequencePresetItemType = {
            ...liteItemDetails,
            startFrame: itemPosition.startFrame,
            offset: itemPosition.offset,
            id: itemPosition.id,
            sequenceType: "preset",
          };

          // Insert the new item
          layer.liteItems.splice(insertIndex, 0, presetItem);

          // Update only the offset of the next lite item
          const nextItem = layer.liteItems[insertIndex + 1];
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame -
              (presetItem.startFrame + presetItem.effectiveDuration);
          }

          // Get default props based on content type

          // spread the presetItem.sequenceItems to the sequenceItems
          Object.entries(presetSequenceItems).forEach(([itemId, item]) => {
            state.props.sequenceItems[itemId] = {
              ...item,
              layerId,
            };
          });

          console.log(`Added ${presetDetails} preset to layer ${layerId}`);
        });
      },

      addLayer: (data) => {
        const newLayerId = genId("l");
        set((state) => {
          const newLayer: LayerType = {
            id: newLayerId,
            name: `Layer ${state.props.layerOrder.length + 1}`,
            liteItems: [],
            isVisible: true,
          };

          let newLayerOrder = [...state.props.layerOrder];

          switch (data.position) {
            case "AT_TOP":
              newLayerOrder.unshift(newLayerId);
              break;
            case "ABOVE_CURRENT":
              const aboveIndex = newLayerOrder.indexOf(data.currentLayerId);
              if (aboveIndex !== -1) {
                newLayerOrder.splice(aboveIndex, 0, newLayerId);
              } else {
                newLayerOrder.unshift(newLayerId);
              }
              break;
            case "BELOW_CURRENT":
              const belowIndex = newLayerOrder.indexOf(data.currentLayerId);
              if (belowIndex !== -1) {
                newLayerOrder.splice(belowIndex + 1, 0, newLayerId);
              } else {
                newLayerOrder.push(newLayerId);
              }
              break;
            case "AT_BOTTOM":
            default:
              newLayerOrder.push(newLayerId);
              break;
          }

          return {
            props: {
              ...state.props,
              layers: {
                ...state.props.layers,
                [newLayerId]: newLayer,
              },
              layerOrder: newLayerOrder,
            },
          };
        });
      },

      removeLayer: (layerId: string) => {
        set((state) => {
          const { [layerId]: removedLayer, ...remainingLayers } =
            state.props.layers;
          const { [layerId]: removedSequenceItems, ...remainingSequenceItems } =
            state.props.sequenceItems;
          console.log(
            { removedLayer },
            state.props.layerOrder.filter((id) => id !== layerId),
          );

          return {
            props: {
              ...state.props,
              layers: remainingLayers,
              layerOrder: state.props.layerOrder.filter((id) => id !== layerId),
              sequenceItems: remainingSequenceItems,
            },
          };
        });
      },

      reorderLayers: (newOrder: string[]) => {
        set((state) => ({
          props: {
            ...state.props,
            layerOrder: newOrder,
          },
        }));
      },

      // updateLayerMetaData(layerId, updates) {
      //   set((state) => {
      //     const layer = state.props.layers[layerId];
      //     if (!layer) {
      //       console.warn(`Layer ${layerId} not found`);
      //       return;
      //     }

      //     layer.name = updates.name;
      //   });
      // },

      updateLayerMetadata: (layerId, updates) => {
        set((state) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return state; // Return the unchanged state if the layer is not found
          }

          // Create a new layers object with the updated layer
          const updatedLayers = {
            ...state.props.layers,
            [layerId]: {
              ...layer,
              ...updates,
            },
          };

          // Return the new state with the updated layers
          return {
            props: {
              ...state.props,
              layers: updatedLayers,
            },
          };
        });
      },
      // TODO : there is a a bug: split on item into two, delete the prev one, then resize from left and expand it. you will notice the video gets shifted.
      splitSequenceItem: (layerId, itemId, splitAtInFramesTimeline) => {
        set((state) => {
          // console.log("splitSequenceItem: Splitting sequence item", {
          //   splitAtInFramesTimeline,
          // });

          const layer = state.props.layers[layerId];

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          const originalLiteItem = layer.liteItems[itemIndex];

          const splitAtInLiteItem =
            splitAtInFramesTimeline - originalLiteItem.startFrame;
          console.log({
            splitAtInFramesTimeline,
            splitAtInLiteItem,
          });

          const originalItemDuration = originalLiteItem.sequenceDuration; // TODO : need to check if it's effective or sequence duration

          originalLiteItem.effectiveDuration = splitAtInLiteItem;
          originalLiteItem.sequenceDuration = splitAtInLiteItem;

          // -------- new lite item ops -------

          // @ts-ignore
          const newItemId = genId("s", originalLiteItem.contentType);

          const newItem: LiteSequenceItemType = {
            ...originalLiteItem,
            id: newItemId,
            startFrame: splitAtInFramesTimeline,
            offset: 0,
            sequenceDuration: originalItemDuration - splitAtInLiteItem,
            effectiveDuration: originalItemDuration - splitAtInLiteItem,
          };

          layer.liteItems.splice(itemIndex + 1, 0, newItem);

          const originalSequenceItem = state.props.sequenceItems[itemId];

          // duplicate the item in sequenceItems
          state.props.sequenceItems[newItemId] = {
            ...originalSequenceItem,
            id: newItemId,
          };

          if (
            originalLiteItem.sequenceType === "standalone" &&
            originalLiteItem.contentType === "video"
          ) {
            const tempOriginalVideoEndsAt = (
              originalSequenceItem as VideoSequenceItemType
            ).editableProps.videoEndsAtInFrames;
            const tempOriginalStartsAt = (
              originalSequenceItem as VideoSequenceItemType
            ).editableProps.videoStartsFromInFrames;

            console.log("tempOriginalVideoEndsAt : ", tempOriginalVideoEndsAt);

            (
              state.props.sequenceItems[itemId] as VideoSequenceItemType
            ).editableProps.videoEndsAtInFrames =
              tempOriginalStartsAt + splitAtInLiteItem;

            console.log(
              "UPDATED : original starts at ",
              (state.props.sequenceItems[itemId] as VideoSequenceItemType)
                .editableProps.videoStartsFromInFrames,
            );

            console.log(
              "UPDATED : original ends at ",
              (state.props.sequenceItems[itemId] as VideoSequenceItemType)
                .editableProps.videoEndsAtInFrames,
            );

            state.props.sequenceItems[newItemId] = {
              ...originalSequenceItem,
              id: newItemId,
              editableProps: {
                ...(state.props.sequenceItems[itemId] as VideoSequenceItemType)
                  .editableProps,
                videoStartsFromInFrames:
                  tempOriginalStartsAt + splitAtInLiteItem,
                videoEndsAtInFrames: tempOriginalVideoEndsAt,
              },
            } as VideoSequenceItemType;
            console.log("UPDATED : new Item starts at ", splitAtInLiteItem);
            console.log("UPDATED : new Item ends at ", tempOriginalVideoEndsAt);
          }

          console.log(`Split sequence item ${itemId} in layer ${layerId}`, {
            newItem,
          });
        });
      },
    })),
    {
      name: "VideoStore",
    },
  ),
);

export default useVideoStore;
