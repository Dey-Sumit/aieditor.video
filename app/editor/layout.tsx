"use client";
import { ErrorFallback, Player, PlayerRef } from "@remotion/player";
import { useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Aside } from "~/components/layout/editor/aside";
import { Header } from "~/components/layout/editor/header";
import SequenceItemEditor from "~/components/layout/editor/sequence-item-editor";
import VideoTimeline from "~/components/video-timeline/VideoTImeline";
import { VideoTimelineProvider } from "~/context/useTimeline";
import useVideoStore from "~/store/video.store";
import { NestedCompositionPropsSchema } from "~/types/timeline.types";
import NestedSequenceComposition from "~/video/compositions/composition";

const EditorLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full pl-[56px]">
      <Aside />
      <div className="flex-1">
        <Header />

        <div className="relative grid h-full w-full grid-cols-7 gap-4 ">
          <div className="col-span-2 h-screen">{children}</div>
          <div className="col-span-3 flex flex-col gap-y-6">
            <VideoAndTimeline />
          </div>
          <div className="col-span-2 h-screen">
            <SequenceItemEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayoutPage;

const VideoAndTimeline = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { props } = useVideoStore();

  return (
    <>
      <VideoPreview playerRef={playerRef} />

      <div className="fixed bottom-2 left-[56px] right-0">
        {props && (
          <VideoTimelineProvider playerRef={playerRef}>
            <VideoTimeline />
          </VideoTimelineProvider>
        )}
      </div>
    </>
  );
};

const VideoPreview = ({ playerRef }: { playerRef: React.RefObject<PlayerRef> }) => {
  const { props } = useVideoStore();
  // const { props } = DUMMY_NESTED_PROJECT;

  // const layers: z.infer<typeof DynamicCompositionSchema>["layers"] =
  //   useMemo(() => {
  //     return currentProject?.layers;
  //   }, [currentProject]);

  if (!props) {
    return <div>Loading project...</div>;
  }
  return (
    <div className="relative flex h-full max-h-[65vh] flex-col rounded-xl bg-muted/50 lg:col-span-2">
      <Player
        component={NestedSequenceComposition}
        durationInFrames={props.compositionMetaData.duration}
        fps={props.compositionMetaData.fps}
        compositionHeight={props.compositionMetaData.height}
        compositionWidth={props.compositionMetaData.width}
        style={{
          width: "100%",
        }}
        controls
        autoPlay={false}
        loop
        initiallyMuted
        errorFallback={errorFallback}
        ref={playerRef}
        schema={NestedCompositionPropsSchema}
        inputProps={props}
      />
    </div>
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
