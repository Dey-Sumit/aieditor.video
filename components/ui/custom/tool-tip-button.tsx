import { FC, ReactNode, ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "~/components/ui/tooltip";

interface TooltipButtonProps {
  icon: ReactNode;
  toolTipContent: string;
  buttonProps?: ComponentProps<typeof Button>;
}

export const TooltipButton: FC<TooltipButtonProps> = ({ icon, toolTipContent, buttonProps }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={toolTipContent} {...buttonProps}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {toolTipContent}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
