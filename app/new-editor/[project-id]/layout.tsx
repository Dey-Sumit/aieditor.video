import React from "react";
import AsideNew from "~/components/layout/editor-new/aside";
import VideoAndTimeline from "~/components/layout/editor-new/video-and-timeline";

const SIDE_NAVBAR_WIDTH = "4rem";
const NAVBAR_ITEM_CONTENT_WIDTH = "20rem";
const TIMELINE_HEIGHT = "12rem";
const PROJECT_HEADER_HEIGHT = "52px";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* -------------------- side navbar -------------------- */}
      <aside
        className="overflow-y-scroll overscroll-contain border-r pb-10"
        style={{ width: SIDE_NAVBAR_WIDTH }}
      >
        <AsideNew />
      </aside>

      {/* -------------------- navbar item content -------------------- */}
      <div
        className="overflow-y-scroll overscroll-contain border-r"
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

          <section className="flex-1 bg-gray-700">
            <VideoAndTimeline />
          </section>
          <div className="border-l">
            {/* -------------------- project header starts -------------------- */}
            <div
              className="border-b border-gray-900 bg-gray-950 shadow-xl"
              style={{ height: PROJECT_HEADER_HEIGHT }}
            ></div>
            {/* -------------------- project header ends -------------------- */}

            {/* -------------------- edit sequence starts -------------------- */}
            <section
              className="w-96 overflow-y-scroll overscroll-contain"
              style={{
                height: `calc(100vh - ${TIMELINE_HEIGHT} - ${PROJECT_HEADER_HEIGHT})`,
              }}
            >
              <div className="sticky inset-x-0 top-0 h-12 border-b"></div>
              <div className="h-screen"></div>
              <div className="h-screen border"></div>
            </section>
            {/* -------------------- edit sequence ends -------------------- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
