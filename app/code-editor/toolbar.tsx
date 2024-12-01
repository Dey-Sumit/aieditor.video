import React from "react";
import { TooltipProvider } from "~/components/ui/tooltip";

const Toolbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between  shadow-sm">
        <React.Fragment>{children}</React.Fragment>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
