"use client";

import { Player } from "@remotion/player";
import { errorFallbackVideoPlayer } from "~/components/layout/editor-new/video-and-timeline";
import { Card } from "~/components/ui/card";
import { useMdxProcessor } from "~/hooks/use-mdx-processor";
import { useEditorStore } from "~/store/code-transition-editor.store";
import CodeTransitionComposition from "~/video/compositions/code-transition.composition";

const compositionMetaData = {
  fps: 30,
  height: 1080,
  width: 1920,
  duration: 1000,
};
const Editor = () => {
  const { content, setContent, loading, error, steps } = useEditorStore();
  useMdxProcessor();
  console.log({ steps });

  return (
    <div className="flex h-screen gap-4 p-4">
      <Card className="h-full w-1/2 overflow-hidden">
        <textarea
          className="h-full w-full resize-none bg-black p-4 font-mono text-sm focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your MDX here..."
        />
      </Card>

      <Card className="h-full w-1/2 overflow-auto">
        <div className="h-full w-full p-4">
          {/* {loading && <div className="text-gray-500">Processing...</div>}
          {error && (
            <div className="whitespace-pre-wrap font-mono text-red-500">
              {error}
            </div>
          )} */}

          <Player
            component={CodeTransitionComposition}
            durationInFrames={compositionMetaData.duration}
            fps={compositionMetaData.fps}
            compositionHeight={compositionMetaData.height}
            compositionWidth={compositionMetaData.width}
            style={{
              width: "100%",
              height: "100%",
              // background: "red",
              // backgroundColor: "rgba(0,0,0,1)",
            }}
            controls
            className=""
            // controls={false}
            // autoPlay={false}
            loop
            initiallyMuted
            overflowVisible
            inputProps={{
              steps,
            }}
            // browserMediaControlsBehavior={{
            //   mode: "register-media-session",
            // }}
            errorFallback={errorFallbackVideoPlayer}
          />

          {/* {steps.length > 0 && (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(steps, null, 2)}
            </pre>
          )} */}
        </div>
      </Card>
    </div>
  );
};

export default Editor;
