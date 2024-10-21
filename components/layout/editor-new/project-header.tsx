"use client";
import { ArrowUpFromDot, PencilIcon } from "lucide-react";
import { DownloadButton } from "~/components/DownloadButton";
import { ProgressBar } from "~/components/ProgressBar";
import { Button } from "~/components/ui/button";
import { useRendering } from "~/helpers/use-rendering";
import { LAYOUT } from "~/lib/constants/layout.constants";
import useVideoStore from "~/store/video.store";
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
        {state.status !== "done" && (
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
        )}
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
