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
    className="absolute top-0 left-0 flex items-center justify-center h-full border border-blue-900 border-dashed rounded-md pointer-events-none bg-blue-500/40"
    style={{
      left: `${startX}px`,
      width: `${width}px`,
    }}
  >
    <Plus className="text-blue-700 stroke-2" size={18} />
  </div>
);

export default AddItemPlaceholder;
