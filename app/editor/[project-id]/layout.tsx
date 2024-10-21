"use client"; // TODO : remove this line, bad for performance
import dynamic from "next/dynamic";
import React from "react";
import Dropzone from "~/components/dropzone";
import AsideNew from "~/components/layout/editor-new/aside";
import ProjectHeader from "~/components/layout/editor-new/project-header";
import VideoAndTimeline from "~/components/layout/editor-new/video-and-timeline";
import { LAYOUT } from "~/lib/constants/layout.constants";

const DynamicSeqEditor = dynamic(
  () => import("~/components/layout/editor/sequence-item-editor"),
  {
    loading: () => <p>Loading...</p>,
  },
);

const {
  SIDE_NAVBAR_WIDTH,
  NAVBAR_ITEM_CONTENT_WIDTH,
  TIMELINE: { TIMELINE_CONTAINER_HEIGHT },
} = LAYOUT;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const handleFilesDrop = (files: File[]) => {
    // Handle the dropped files here
    console.log("Dropped files:", files);
    // You can now process these files, upload them, etc.
  };
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
          paddingBottom: TIMELINE_CONTAINER_HEIGHT,
        }}
      >
        {children}
      </div>

      {/* -------------------- video player and edit sequence container -------------------- */}

      <div
        className="flex flex-1 flex-col"
        style={{
          height: `calc(100vh - ${TIMELINE_CONTAINER_HEIGHT})`,
        }}
      >
        <div className="flex flex-1">
          {/* -------------------- video player and timeline starts -------------------- */}

          <section className="relative flex-1">
            <VideoAndTimeline />

            <Dropzone
              onFilesDrop={handleFilesDrop}
              multiple={true}
              accept="image/*"
              maxSize={10 * 1024 * 1024} // 10MB
            />

            {/* <div className="pointer-events-none absolute inset-0">
              <Dropzone
                onFilesDrop={handleFilesDrop}
                multiple={true}
                accept="image/*"
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div> */}
          </section>

          {/* -------------------- video player and timeline ends -------------------- */}

          <div className="border-l">
            {/* -------------------- project header container starts -------------------- */}

            <ProjectHeader />

            {/* -------------------- project header ends -------------------- */}

            {/* --------------------  sequence item editor container starts -------------------- */}
            <DynamicSeqEditor />
            {/* -------------------- sequence item editor container ends -------------------- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

// "Error loading image with src: https://remotionlambda-useast1-q7hsmsvlrt.s3.us-east-1.amazonaws.com/sample-images/cave.jpg"
