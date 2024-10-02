import React from "react";

const SIDE_NAVBAR_WIDTH = "4rem";
const NAVBAR_ITEM_CONTENT_WIDTH = "20rem";
const TIMELINE_HEIGHT = "12rem";
const PROJECT_HEADER_HEIGHT = "52px";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* -------------------- side navbar -------------------- */}
      <div
        className="overflow-y-scroll overscroll-contain bg-green-500 pb-10"
        style={{ width: SIDE_NAVBAR_WIDTH }}
      >
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </div>

      {/* -------------------- navbar item content -------------------- */}
      <div
        className="overflow-y-scroll overscroll-contain bg-red-600"
        style={{
          width: NAVBAR_ITEM_CONTENT_WIDTH,
          paddingBottom: TIMELINE_HEIGHT,
        }}
      >
        <div className="h-[52px] bg-red-800"></div>
        <div className="h-screen"></div>
      </div>

      {/* -------------------- timeline -------------------- */}
      <div
        className="fixed bottom-0 right-0 bg-yellow-700"
        style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_HEIGHT }}
      ></div>

      {/* -------------------- video player and edit sequence container -------------------- */}

      <div
        className="flex flex-1 flex-col bg-purple-600"
        style={{
          height: `calc(100vh - ${TIMELINE_HEIGHT})`,
        }}
      >
        {/* -------------------- project header -------------------- */}

        <div
          className="bg-purple-300"
          style={{ height: PROJECT_HEADER_HEIGHT }}
        ></div>

        <div className="flex flex-1">
          <section className="flex-1 bg-gray-700"></section>

          <section
            className="relative w-96 overflow-y-scroll overscroll-contain"
            style={{
              height: `calc(100vh - ${TIMELINE_HEIGHT} - ${PROJECT_HEADER_HEIGHT})`,
            }}
          >
            <div className="sticky inset-x-0 top-0 h-12 bg-blue-900"></div>
            <div className="h-screen bg-blue-400"></div>
            <div className="h-screen bg-blue-500"></div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Layout;
