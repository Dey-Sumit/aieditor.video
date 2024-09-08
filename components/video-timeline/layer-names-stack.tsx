import { TIMELINE } from "~/lib/constants/timeline.constants";
import { LAYERS_IN_ORDER } from "~/utils/timeline.utils";

const { LAYER_HEIGHT_IN_PX } = TIMELINE;

const LayerNamesStack = () => {
  return LAYERS_IN_ORDER.map((layer) => (
    <div
      key={layer.id}
      className="flex items-center justify-start px-2 text-xs capitalize"
      style={{ height: `${LAYER_HEIGHT_IN_PX}px` }}
    >
      {layer.label}
    </div>
  ));
};

export default LayerNamesStack;
