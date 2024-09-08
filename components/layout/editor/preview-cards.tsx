import { VideoIcon } from "lucide-react";

export const PreviewVideoCard = ({
  name,
  description,
  url,
  onClick,
}: {
  name: string;
  description: string;
  url: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="group rounded-md bg-gray-100 shadow-md"
      onClick={onClick}
    >
      <div className="flex aspect-video items-center justify-center bg-gray-200">
        <VideoIcon className="h-8 w-8 text-gray-500 transition-transform group-hover:scale-90" />
      </div>
      <div className="flex flex-col items-start p-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500">
          {url} | {description}
        </p>
      </div>
    </button>
  );
};
