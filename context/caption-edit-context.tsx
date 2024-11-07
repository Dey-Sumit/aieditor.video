// context/CaptionEditContext.tsx

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import useVideoStore from "~/store/video.store";

type CaptionEditContextType = {
  view: "caption-edit" | "entire-timeline";
  setView: (view: "caption-edit" | "entire-timeline") => void;
  activeCaptionData: {
    videoLayerId: string;
    videoItemId: string;
    captionLayerId: string;
    durationInFrames: number;
  } | null;
  setActiveCaptionData: (
    data: {
      videoLayerId: string;
      videoItemId: string;
      captionLayerId: string;
      durationInFrames: number;
    } | null,
  ) => void;
  visibleLayerOrder: string[];
};

const CaptionEditContext = createContext<CaptionEditContextType | null>(null);

export const CaptionEditProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<"caption-edit" | "entire-timeline">(
    "entire-timeline",
  );
  const [activeCaptionData, setActiveCaptionData] = useState<{
    videoLayerId: string;
    videoItemId: string;
    captionLayerId: string;
    durationInFrames: number;
  } | null>(null);

  const orderedLayers = useVideoStore((state) => state.props.layerOrder);

  const layers = useVideoStore((state) => state.props.layers);

  // Calculate visible layers based on view
  const visibleLayerOrder = useMemo(() => {
    if (view === "caption-edit" && activeCaptionData) {
      return [activeCaptionData.captionLayerId, activeCaptionData.videoLayerId];
    }

    // Filter out caption layers for timeline view
    return orderedLayers.filter(
      (layerId) => layers[layerId].layerType !== "caption",
    );
  }, [view, activeCaptionData, orderedLayers, layers]);

  return (
    <CaptionEditContext.Provider
      value={{
        view,
        setView,
        activeCaptionData,
        setActiveCaptionData,
        visibleLayerOrder,
      }}
    >
      {children}
    </CaptionEditContext.Provider>
  );
};

export const useCaptionEdit = () => {
  const context = useContext(CaptionEditContext);
  if (!context) {
    throw new Error("useCaptionEdit must be used within CaptionEditProvider");
  }
  return context;
};
