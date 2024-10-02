import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Video,
  Music,
  Scissors,
  Copy,
  ClipboardPaste,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { useTimeline } from "~/context/useTimeline";
import { useEditingStore } from "~/store/editing.store";

interface ToolbarItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ToolbarCategory {
  name: string;
  items: ToolbarItem[];
}

export const Toolbar: React.FC = () => {
  const setNewItemType = useEditingStore((state) => state.setNewItemType);
  const newItemType = useEditingStore((state) => state.newItemType);
  const { currentFrame } = useTimeline();
  // TODO : use memoization
  const toolbarCategories: ToolbarCategory[] = [
    {
      name: "Selection",
      items: [
        {
          icon: <MousePointer2 size={16} />,
          label: "Select",
          onClick: () => console.log("Select clicked"),
        },
      ],
    },
    {
      name: "Insert",
      items: [
        {
          icon: <Type size={16} />,
          label: "Text",
          onClick: () => setNewItemType("text"),
        },
        {
          icon: <ImageIcon size={16} />,
          label: "Image",
          onClick: () => setNewItemType("image"),
        },
        {
          icon: <Video size={16} />,
          label: "Video",
          onClick: () => setNewItemType("video"),
        },
        {
          icon: <Music size={16} />,
          label: "Audio",
          onClick: () => setNewItemType("audio"),
        },
      ],
    },
    {
      name: "Edit",
      items: [
        {
          icon: <Scissors size={16} />,
          label: "Cut",
          onClick: () => console.log("Cut clicked"),
        },
        {
          icon: <Copy size={16} />,
          label: "Copy",
          onClick: () => console.log("Copy clicked"),
        },
        {
          icon: <ClipboardPaste size={16} />,
          label: "Paste",
          onClick: () => console.log("Paste clicked"),
        },
      ],
    },
    {
      name: "History",
      items: [
        {
          icon: <Undo size={16} />,
          label: "Undo",
          onClick: () => console.log("Undo clicked"),
        },
        {
          icon: <Redo size={16} />,
          label: "Redo",
          onClick: () => console.log("Redo clicked"),
        },
      ],
    },
    {
      name: "View",
      items: [
        {
          icon: <ZoomIn size={16} />,
          label: "Zoom In",
          onClick: () => console.log("Zoom In clicked"),
        },
        {
          icon: <ZoomOut size={16} />,
          label: "Zoom Out",
          onClick: () => console.log("Zoom Out clicked"),
        },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end space-x-1 bg-background p-1 shadow-sm">
        <div>
          <p>{currentFrame}</p>
        </div>
        {toolbarCategories.map((category, categoryIndex) => (
          <React.Fragment key={category.name}>
            {categoryIndex > 0 && (
              <Separator orientation="vertical" className="h-8" />
            )}
            <div className="flex items-center space-x-1">
              {category.items.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={item.onClick}
                      className={cn(
                        "h-8 w-8",
                        newItemType === item.label.toLowerCase() && "bg-muted",
                      )}
                    >
                      {item.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
