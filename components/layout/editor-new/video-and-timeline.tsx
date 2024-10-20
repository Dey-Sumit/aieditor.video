"use client";

import { type ErrorFallback, Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Separator } from "~/components/ui/separator";
import { PlayerFullscreen } from "~/components/video-timeline/player-controls/full-screen";
import { MuteButton } from "~/components/video-timeline/player-controls/mute";
import { PlayPauseButton } from "~/components/video-timeline/player-controls/play-pause-button";
import TimeDisplay from "~/components/video-timeline/player-controls/time-display";
import { VolumeSlider } from "~/components/video-timeline/player-controls/volume-slider";
import Toolbar from "~/components/video-timeline/toolbar";
import VideoTimeline from "~/components/video-timeline/VideoTImeline";
import { VideoTimelineProvider } from "~/context/useTimeline";
import useVideoStore from "~/store/video.store";
import NestedSequenceComposition from "~/video/compositions/composition";

const VideoAndTimeline = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { props } = useVideoStore();

  return (
    <>
      <div className="relative h-full">
        {/* <DragAndDropDemo /> */}
        <VideoPreview playerRef={playerRef} />
        {/* 
        <div className="absolute left-96 top-96 h-96 w-96 border-2">
          <Button onClick={() => playerRef.current?.play()}>Play</Button>
        </div> */}
      </div>
      {/* -------------------- timeline -------------------- */}

      {props && (
        <VideoTimelineProvider playerRef={playerRef}>
          <VideoTimeline>
            <Toolbar>
              <div className="flex items-center space-x-3">
                <PlayPauseButton playerRef={playerRef} />
                <TimeDisplay
                  playerRef={playerRef}
                  fps={props.compositionMetaData.fps}
                  durationInFrames={props.compositionMetaData.duration}
                />
                <MuteButton playerRef={playerRef} />
                <VolumeSlider playerRef={playerRef} />
                <PlayerFullscreen playerRef={playerRef} />
                <Separator orientation="vertical" className="h-8" />
              </div>
            </Toolbar>
          </VideoTimeline>
        </VideoTimelineProvider>
      )}
    </>
  );
};

const VideoPreview = ({
  playerRef,
}: {
  playerRef: React.RefObject<PlayerRef>;
}) => {
  const { props, updatePositionAndDimensions } = useVideoStore();

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
          // backgroundColor: "rgba(0,0,0,1)",
        }}
        className=""
        controls={false}
        autoPlay={false}
        loop
        initiallyMuted
        errorFallback={errorFallback}
        ref={playerRef}
        // schema={NestedCompositionPropsSchema}
        inputProps={{
          props,
          updatePositionAndDimensions: updatePositionAndDimensions,
        }}
        browserMediaControlsBehavior={{
          mode: "register-media-session",
        }}
      />
    </>
  );
};

const errorFallback: ErrorFallback = ({ error }) => {
  return (
    <AbsoluteFill className="flex items-center justify-center bg-yellow-700">
      Sorry about this! An error occurred: {error.message}
    </AbsoluteFill>
  );
};

export default VideoAndTimeline;
