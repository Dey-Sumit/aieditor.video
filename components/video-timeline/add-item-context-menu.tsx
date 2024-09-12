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
import useVideoStore from "~/store/video.store";
import { LayerId, LiteSequenceItemType } from "~/types/timeline.types";
import { END_SCREEN_PRESET } from "~/video/preset";

function AddItemContextMenu({
  children,
  layerId,
}: {
  children: React.ReactNode;
  layerId: LayerId;
}) {
  const { addSequenceItemToLayer, addPresetToLayer } = useVideoStore();

  const addPreset = (presetName: "BRUT_END_SCREEN_PRESET" | "BRUT_FOREGROUND") => {
    // END_SCREEN_PRESET
    console.log(presetName);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="mb-4 w-64 ">
        <ContextMenuItem className="text-xs" onClick={() => console.log("add text")}>
          Add Text
          <ContextMenuShortcut>T</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-xs" onClick={() => console.log("add text")}>
          Add Image
          <ContextMenuShortcut>I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-xs" onClick={() => console.log("add text")}>
          Add Video
          <ContextMenuShortcut>V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-xs" onClick={() => console.log("add text")}>
          Add Dummy
          <ContextMenuShortcut>D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-xs" onClick={() => console.log("add text")}>
          Add Audio
          <ContextMenuShortcut>A</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>Presets</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onClick={() => addPresetToLayer("layerForeground", "BRUT_END_SCREEN_PRESET")}
            >
              Brut End Screen
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addPreset("BRUT_FOREGROUND")}>
              Brut Foreground
            </ContextMenuItem>
            <ContextMenuItem>Some other popular preset</ContextMenuItem>
            <ContextMenuItem>A custom preset as well</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>Last Added Presets</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {/* <ContextMenuItem onClick={() => addPreset("END_SCREEN_PRESET")}>
              Brut End Screen
            </ContextMenuItem> */}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default AddItemContextMenu;
