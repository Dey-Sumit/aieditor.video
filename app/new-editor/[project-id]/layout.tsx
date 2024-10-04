"use client";
import { DownloadIcon, PencilIcon } from "lucide-react";
import React from "react";
import { DownloadButton } from "~/components/DownloadButton";
import AsideNew from "~/components/layout/editor-new/aside";
import VideoAndTimeline from "~/components/layout/editor-new/video-and-timeline";
import SequenceItemEditorContainerNew from "~/components/layout/editor/sequence-item-editor-new";
import { ProgressBar } from "~/components/ProgressBar";
import { Button } from "~/components/ui/button";
import { useRendering } from "~/helpers/use-rendering";
import useVideoStore from "~/store/video.store";

// TODO : move these to constants file , and wrap it in a object or a hook maybe
const SIDE_NAVBAR_WIDTH = "4rem";
const NAVBAR_ITEM_CONTENT_WIDTH = "20rem";
const TIMELINE_HEIGHT = "17rem";
const PROJECT_HEADER_HEIGHT = "56px";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* -------------------- side navbar -------------------- */}
      <aside
        className="overflow-y-scroll overscroll-contain border-r bg-black pb-10"
        style={{ width: SIDE_NAVBAR_WIDTH }}
      >
        <AsideNew />
      </aside>

      {/* -------------------- navbar item content -------------------- */}
      <div
        className="gradient-bg overflow-y-scroll overscroll-contain border-r"
        style={{
          width: NAVBAR_ITEM_CONTENT_WIDTH,
          paddingBottom: TIMELINE_HEIGHT,
        }}
      >
        {children}
      </div>

      {/* -------------------- timeline -------------------- */}
      {/* <div
        className="fixed bottom-0 right-0 bg-yellow-700"
        style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_HEIGHT }}
      ></div> */}

      {/* -------------------- video player and edit sequence container -------------------- */}

      <div
        className="flex flex-1 flex-col"
        style={{
          height: `calc(100vh - ${TIMELINE_HEIGHT})`,
        }}
      >
        <div className="flex flex-1">
          {/* -------------------- video player and timeline -------------------- */}

          <section className="flex-1 bg-gray-900">
            <VideoAndTimeline />
          </section>
          <div className="border-l">
            {/* -------------------- project header container starts -------------------- */}

            <ProjectHeader />

            {/* -------------------- project header ends -------------------- */}

            {/* --------------------  sequence item editor container starts -------------------- */}
            <SequenceItemEditorContainerNew />
            {/* -------------------- sequence item editor container ends -------------------- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
const ProjectHeader = () => {
  const { props } = useVideoStore();

  const { renderMedia, state, undo } = useRendering(
    "new-dynamic-composition",
    props,
  );

  return (
    <div
      className="pattern-bg-asfalt relative flex flex-col p-2 text-sm"
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

            <DownloadIcon className="size-4" />
          </Button>
        )}
      </div>
      <div className="absolute inset-0 bg-black/90">
        {state.status === "rendering" || state.status === "done" ? (
          <div className="flex w-full flex-col items-end gap-1.5 p-2">
            <ProgressBar
              progress={state.status === "rendering" ? state.progress : 1}
            />

            <DownloadButton undo={undo} state={state}></DownloadButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};
