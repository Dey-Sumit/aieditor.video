import { GripVertical } from "lucide-react";
import Layer, { HoverLayer } from "~/components/video-timeline/layer";
import { useTimeline } from "~/context/useTimeline";
import { LAYOUT } from "~/lib/constants/layout.constants";
import useVideoStore from "~/store/video.store";
import type { LayerType } from "~/types/timeline.types";

const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX, LAYER_NAME_STACK_WIDTH },
} = LAYOUT;

const CaptionEditView = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { pixelsPerFrame, visibleLayerOrder, activeCaptionData } =
    useTimeline();

  // Get just the specific video item and its layer
  const videoLayer = useVideoStore(
    (state) => state.props.layers[activeCaptionData?.videoLayerId ?? ""],
  );
  const captionLayer = useVideoStore(
    (state) => state.props.layers[activeCaptionData?.captionLayerId ?? ""],
  );

  if (!activeCaptionData || !videoLayer || !captionLayer) return null;

  // Get only the specific video item
  const videoItem = videoLayer.liteItems.find(
    (item) => item.id === activeCaptionData.videoItemId,
  );

  if (!videoItem) return null;

  return (
    <div className="flex overflow-y-auto" id="captionContainer">
      {/* Left section */}
      <div
        className="h-fit divide-y divide-gray-800 border-r"
        style={{
          width: LAYER_NAME_STACK_WIDTH,
        }}
      >
        {/* We can create a simpler name stack for just 2 layers */}
        <CaptionLayerStack
          videoLayerId={activeCaptionData.videoLayerId}
          captionLayerId={activeCaptionData.captionLayerId}
        />
      </div>

      {/* Right section */}
      <div
        className="relative flex-1"
        ref={containerRef}
        style={{
          height: 2 * TRACK_LAYER_HEIGHT_IN_PX, // Only 2 layers
        }}
      >
        <div className="absolute inset-0">
          {visibleLayerOrder.map((layerId) => (
            <div
              key={layerId}
              className="relative border-b"
              style={{
                height: TRACK_LAYER_HEIGHT_IN_PX,
              }}
            >
              <HoverLayer layerId={layerId} pixelsPerFrame={pixelsPerFrame} />
            </div>
          ))}
        </div>

        {visibleLayerOrder.map((layerId) => (
          <Layer key={layerId} layerId={layerId} />
        ))}
      </div>
    </div>
  );
};
export default CaptionEditView;

const CaptionLayerStack: React.FC<{
  videoLayerId: string;
  captionLayerId: string;
}> = ({ videoLayerId, captionLayerId }) => {
  const layers = useVideoStore((state) => state.props.layers);

  // Just the two layers we need
  const visibleLayers = [captionLayerId, videoLayerId];

  return (
    <div className="relative">
      {visibleLayers.map((layerId) => (
        <LayerItem
          key={layerId}
          layer={layers[layerId]}

          // Not passing constraintsRef since we don't need drag
        />
      ))}
    </div>
  );
};

const LayerItem = ({ layer }: { layer: LayerType }) => {
  return (
    <div
      style={{
        height: `${TRACK_LAYER_HEIGHT_IN_PX}px`,
        width: "100%",
      }}
      className="border-b"
    >
      <div className="relative flex h-full w-full items-center px-1">
        <div className="reorder-handle mr-2 cursor-move">
          <GripVertical size={16} className="text-white/30" />
        </div>
        <span className="line-clamp-1 select-none text-xs capitalize">
          {layer.name}
        </span>
      </div>
    </div>
  );
};
