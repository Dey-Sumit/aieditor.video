"use client";

import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Plus,
  Trash,
  Eye,
  EyeOff,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  Circle,
  Delete,
} from "lucide-react";

export default function Component({
  layerId,
  children,
}: {
  layerId: string;
  children: React.ReactNode;
}) {
  const [layerName, setLayerName] = useState("Layer 1");
  const [tempLayerName, setTempLayerName] = useState(layerName);
  const [isVisible, setIsVisible] = useState(true);

  const handleRename = () => {
    setTempLayerName(layerName);
  };

  const handleSaveRename = () => {
    setLayerName(tempLayerName);
  };

  const handleCancelRename = () => {
    setTempLayerName(layerName);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="text-red-700">
            <Trash className="mr-2 size-4 " />
            Delete Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56 ">
            <ContextMenuItem
              onClick={() => console.log("Delete layer")}
              className="text-red-700 cursor-pointer focus:bg-red-900 focus:text-white"
            >
              <Trash className="mr-2 size-4" />
              Yes, Delete it! 😡
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Plus className="mr-2 size-4" />
            Add Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={() => console.log("Add layer at the top")}
            >
              <ArrowUp className="mr-2 size-4" />
              Insert at the Top
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => console.log("Add layer above this")}
            >
              <ArrowUp className="mr-2 size-4" />
              Insert Above Current
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => console.log("Add layer below this")}
            >
              <ArrowDown className="mr-2 size-4" />
              Insert Below Current
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => console.log("Add layer at the bottom")}
            >
              <ArrowDown className="mr-2 size-4" />
              Insert at the Bottom
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Edit className="mr-2 size-4" />
            Rename Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-64 p-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRename();
              }}
              className="flex items-center space-x-2"
            >
              <Input
                value={tempLayerName}
                onChange={(e) => setTempLayerName(e.target.value)}
                className="h-8 flex-grow"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="h-8 px-2"
              >
                <Save className="size-4" />
              </Button>
            </form>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          {isVisible ? (
            <Eye className="size-4 mr-2" />
          ) : (
            <EyeOff className="size-4 mr-2" />
          )}
          <span className="flex-grow">{isVisible ? "Visible" : "Hidden"}</span>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
