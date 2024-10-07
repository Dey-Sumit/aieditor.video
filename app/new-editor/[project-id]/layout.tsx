"use client";
import React from "react";
import AsideNew from "~/components/layout/editor-new/aside";
import ProjectHeader from "~/components/layout/editor-new/project-header";
import VideoAndTimeline from "~/components/layout/editor-new/video-and-timeline";
import SequenceItemEditorContainerNew from "~/components/layout/editor/sequence-item-editor-new";
import { LAYOUT } from "~/lib/constants/layout.constants";

const { SIDE_NAVBAR_WIDTH, NAVBAR_ITEM_CONTENT_WIDTH, TIMELINE_HEIGHT } =
  LAYOUT;

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

// "Error loading image with src: https://remotionlambda-useast1-q7hsmsvlrt.s3.us-east-1.amazonaws.com/sample-images/cave.jpg"
