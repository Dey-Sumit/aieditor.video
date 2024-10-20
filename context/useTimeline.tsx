import type { PlayerRef } from "@remotion/player";
import React, { createContext, useContext, useState } from "react";
import { useVideoTimeline } from "~/hooks/use-video-timeline";
import type { LayerId } from "~/types/timeline.types";

const VideoTimelineContext = createContext<
  ReturnType<typeof useVideoTimeline> & {
    draggingLayerId: LayerId | null;
    setDraggingLayerId: (layerId: LayerId | null) => void;
  }
>(null as any);

export const useTimeline = () => useContext(VideoTimelineContext);

export const VideoTimelineProvider = ({
  children,
  playerRef,
}: {
  children: React.ReactNode;
  playerRef: React.RefObject<PlayerRef>;
}) => {
  const [draggingLayerId, setDraggingLayerId] = useState<LayerId | null>(null);

  const timelineValue = useVideoTimeline(playerRef);
  const value = {
    ...timelineValue,
    draggingLayerId,
    setDraggingLayerId,
  };

  return (
    <VideoTimelineContext.Provider value={value}>
      {children}
    </VideoTimelineContext.Provider>
  );
};
