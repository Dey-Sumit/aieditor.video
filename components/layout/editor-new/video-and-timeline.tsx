"use client";

import { type ErrorFallback, Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";
import { AbsoluteFill } from "remotion";
import VideoTimeline from "~/components/video-timeline/VideoTImeline";
import { VideoTimelineProvider } from "~/context/useTimeline";
import useVideoStore from "~/store/video.store";
import { NestedCompositionPropsSchema } from "~/types/timeline.types";
import NestedSequenceComposition from "~/video/compositions/composition";

const SIDE_NAVBAR_WIDTH = "4rem";
const TIMELINE_HEIGHT = "14rem";

const VideoAndTimeline = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { props } = useVideoStore();

  return (
    <>
      <div className="h-full">
        <VideoPreview playerRef={playerRef} />
      </div>
      {/* -------------------- timeline -------------------- */}

      <div
        className="pattern-bg-black-orchid fixed bottom-0 right-0 border-t"
        style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_HEIGHT }}
      >
        {props && (
          <VideoTimelineProvider playerRef={playerRef}>
            <VideoTimeline />
          </VideoTimelineProvider>
        )}
      </div>
    </>
  );
};

const VideoPreview = ({
  playerRef,
}: {
  playerRef: React.RefObject<PlayerRef>;
}) => {
  const { props } = useVideoStore();

  if (!props) {
    return <div>Loading project...</div>;
  }
  return (
    <>
      <Player
        component={NestedSequenceComposition}
        durationInFrames={props.compositionMetaData.duration}
        fps={props.compositionMetaData.fps}
        compositionHeight={props.compositionMetaData.height}
        compositionWidth={props.compositionMetaData.width}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
        className=""
        controls
        autoPlay={false}
        loop
        initiallyMuted
        errorFallback={errorFallback}
        ref={playerRef}
        schema={NestedCompositionPropsSchema}
        inputProps={props}
      />
    </>
  );
};

const errorFallback: ErrorFallback = ({ error }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "yellow",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Sorry about this! An error occurred: {error.message}
    </AbsoluteFill>
  );
};

export default VideoAndTimeline;
