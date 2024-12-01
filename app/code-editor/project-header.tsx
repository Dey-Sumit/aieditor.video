"use client";
import { ArrowUpFromDot, PencilIcon } from "lucide-react";
import { DownloadButton } from "~/components/DownloadButton";
import { Button } from "~/components/ui/button";
import { useRendering } from "~/helpers/use-rendering";
import { LAYOUT } from "~/lib/constants/layout.constants";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useCTEditorStore } from "~/store/code-transition-editor.store";

const { PROJECT_HEADER_HEIGHT } = LAYOUT;

const ProjectHeader = () => {
  const { steps } = useCTEditorStore();

  const { renderMedia, state, undo } = useRendering(
    "code-transition-composition",
    { steps },
  );

  // Helper function to get button text based on state
  const getButtonText = () => {
    if (state.status === "rendering") {
      const progress = Math.round(state.progress * 100);
      return `Processing ${progress}%`;
    }
    return "Prepare Export";
  };

  return (
    <div
      className="pattern-bg-asfalt relative flex flex-col justify-center p-2 text-sm"
      style={{ height: PROJECT_HEADER_HEIGHT }}
    >
      <div className="flex items-center justify-between">
        {/* project name and edit button */}
        <div className="flex items-center">
          <span className=" ">My Project Name</span>
          <Button size="icon" variant="ghost" className="">
            <PencilIcon className="size-3" />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            {state.status !== "done" && (
              <Button
                size="sm"
                variant="default"
                className="min-w-[140px] gap-2"
                disabled={
                  state.status === "invoking" || state.status === "rendering"
                }
              >
                {getButtonText()}
                <ArrowUpFromDot className="size-4" />
              </Button>
            )}
          </SheetTrigger>
          <SheetContent className="p-4">
            <SheetHeader>
              <SheetTitle>Export Video</SheetTitle>
              <SheetDescription>
                Adjust the settings and export your video.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-4 py-2">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="name" className="text-right">
                  File Name
                </Label>
                <Input
                  id="name"
                  placeholder="eg. top-3-horror-movies"
                  className=""
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  size="sm"
                  variant="default"
                  className="min-w-[140px] gap-2"
                  disabled={
                    state.status === "invoking" || state.status === "rendering"
                  }
                  onClick={renderMedia}
                >
                  {getButtonText()}
                  <ArrowUpFromDot className="size-4" />
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {state.status === "done" && (
        <div className="absolute inset-0 bg-black/90">
          <div className="flex w-full flex-col items-end gap-1 px-2 py-1">
            <DownloadButton undo={undo} state={state} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
