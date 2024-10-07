import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "~/components/ui/context-menu";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import { LayerId, LiteSequenceItemType } from "~/types/timeline.types";

function SequenceContextMenuWrapper({
  children,
  layerId,
  itemId,
  transition,
}: {
  children: React.ReactNode;
  layerId: LayerId;
  itemId: string;
  transition: LiteSequenceItemType["transition"];
}) {
  const {
    removeSequenceItemFromLayer,
    addTransitionToLayer,
    removeTransitionFromLayer,
  } = useVideoStore();

  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);
  const clearActiveSeqItem = useEditingStore(
    (store) => store.clearActiveSeqItem,
  );

  const handleDeleteSeqItem = () => {
    removeSequenceItemFromLayer(layerId, itemId);
    if (activeSeqItem && activeSeqItem.itemId === itemId) {
      clearActiveSeqItem();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="mb-4 w-64">
        <ContextMenuItem inset onClick={handleDeleteSeqItem}>
          Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
        {/*        <ContextMenuItem inset>
          Duplicate
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Mute/Unmute
          <ContextMenuShortcut>M</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Hide/Show
          <ContextMenuShortcut>H</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Split
          <ContextMenuShortcut>Ctrl+S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Lock/Unlock
          <ContextMenuShortcut>L</ContextMenuShortcut>
        </ContextMenuItem> */}
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger inset> Transitions</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              disabled={!transition?.incoming}
              onClick={() =>
                removeTransitionFromLayer(layerId, transition?.incoming?.id!)
              }
            >
              Delete Start Transition
            </ContextMenuItem>
            <ContextMenuItem
              disabled={!transition?.outgoing}
              onClick={() =>
                removeTransitionFromLayer(layerId, transition?.outgoing?.id!)
              }
            >
              Delete End Transition
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => addTransitionToLayer(layerId, itemId, "incoming")}
            >
              Add Incoming/Start
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => addTransitionToLayer(layerId, itemId, "outgoing")}
            >
              Add Outgoing/End
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default SequenceContextMenuWrapper;
