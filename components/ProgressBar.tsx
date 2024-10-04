import React, { useMemo } from "react";

export const ProgressBar: React.FC<{
  progress: number;
}> = ({ progress }) => {
  const fill: React.CSSProperties = useMemo(() => {
    return {
      width: `${progress * 100}%`,
    };
  }, [progress]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-unfocused-border-color h-2.5 w-full appearance-none rounded-md">
        <div
          className="h-2.5 rounded-md bg-foreground transition-all duration-100 ease-in-out"
          style={fill}
        ></div>
      </div>
    </div>
  );
};
