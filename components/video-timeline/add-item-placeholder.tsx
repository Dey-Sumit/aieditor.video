import { Plus } from "lucide-react";

interface AddItemPlaceholderProps {
  startX: number;
  width: number;
}

const AddItemPlaceholder: React.FC<AddItemPlaceholderProps> = ({
  startX,
  width,
}) => (
  <div
    className="pointer-events-none absolute left-0 top-0 flex h-full items-center justify-center rounded-[2px] border-[1.5px] border-dashed border-blue-500 bg-blue-700/40"
    style={{
      left: `${startX}px`,
      width: `${width}px`,
    }}
  >
    <Plus className="stroke-2 text-blue-500" size={18} />
  </div>
);

export default AddItemPlaceholder;
