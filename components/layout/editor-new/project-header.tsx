"use client";
import { ArrowUpFromDot, PencilIcon } from "lucide-react";
import { DownloadButton } from "~/components/DownloadButton";
import { ProgressBar } from "~/components/ProgressBar";
import { Button } from "~/components/ui/button";
import { useRendering } from "~/helpers/use-rendering";
import { LAYOUT } from "~/lib/constants/layout.constants";
import useVideoStore from "~/store/video.store";

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

const { PROJECT_HEADER_HEIGHT } = LAYOUT;
const ProjectHeader = () => {
  const { props } = useVideoStore();

  const { renderMedia, state, undo } = useRendering(
    "new-dynamic-composition",
    props,
  );

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
        {/* export button */}
        {/* {state.status !== "done" && (
          <Button
            size="sm"
            variant="default"
            className="gap-2"
            disabled={state.status === "invoking"}
            onClick={renderMedia}
          >
            {state.status === "rendering" ? "Cooking..." : "Export"}

            <ArrowUpFromDot className="size-4" />
          </Button>
        )} */}

        <Sheet>
          <SheetTrigger asChild>
            {state.status !== "done" && (
              <Button
                size="sm"
                variant="default"
                className="gap-2"
                disabled={
                  state.status === "invoking" || state.status === "rendering"
                } 
              >
                {state.status === "rendering" ? "Cooking..." : "Prepare Export"}

                <ArrowUpFromDot className="size-4" />
              </Button>
            )}
          </SheetTrigger>
          <SheetContent className="p-4">
            <SheetHeader>
              <SheetTitle>Export Video</SheetTitle>
              <SheetDescription>
                {/* Your video is being rendered. You can close this window and
                continue working on your project. */}
                Adjust the settings and export your video.
              </SheetDescription>
            </SheetHeader>
            {/* <Separator orientation="horizontal" className="my-4" /> */}
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
                  className="gap-2"
                  disabled={
                    state.status === "invoking" || state.status === "rendering"
                  }
                  onClick={renderMedia}
                >
                  {state.status === "rendering" ? "Cooking..." : "Export"}

                  <ArrowUpFromDot className="size-4" />
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      {(state.status === "rendering" || state.status === "done") && (
        <div className="absolute inset-0 bg-black/90">
          {state.status === "rendering" || state.status === "done" ? (
            <div className="flex w-full flex-col items-end gap-1 px-2 py-1">
              <ProgressBar
                progress={state.status === "rendering" ? state.progress : 1}
              />

              <DownloadButton undo={undo} state={state}></DownloadButton>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
