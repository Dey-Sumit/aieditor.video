import { PlayerRef } from "@remotion/player";
import React, { createContext, useContext, useState } from "react";
import { useNewVideoTimeline } from "~/hooks/use-video-timeline";
import { LayerId } from "~/types/timeline.types";


const VideoTimelineContext = createContext<
  ReturnType<typeof useNewVideoTimeline> & {
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

  const timelineValue = useNewVideoTimeline(playerRef);
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
