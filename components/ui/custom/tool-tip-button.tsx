import type { ComponentProps, FC, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface TooltipButtonProps {
  icon: ReactNode;
  toolTipContent: string;
  buttonProps?: ComponentProps<typeof Button>;
}

export const TooltipButton: FC<TooltipButtonProps> = ({
  icon,
  toolTipContent,
  buttonProps,
}) => (
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

// // Updated interface for TooltipButton2Props
// interface TooltipButton2Props {
//   children: React.ReactElement<ButtonProps, typeof Button>;
//   toolTipContent: string;
// }

// // Proper comment for the function
// /**
//  * TooltipButton2 component that wraps a Button with a tooltip.
//  * @param {Object} props - The component props.
//  * @param {ReactElement<ComponentProps<typeof Button>>} props.children - The Button component to be wrapped.
//  * @param {string} props.toolTipContent - The content to be displayed in the tooltip.
//  * @returns {JSX.Element} A Button wrapped with a tooltip.
//  */

// export const TooltipButton2 = ({
//   children,
//   toolTipContent,
// }: TooltipButton2Props) => (
//   <TooltipProvider>
//     <Tooltip>
//       <TooltipTrigger asChild>{children}</TooltipTrigger>
//       <TooltipContent side="right" sideOffset={5}>
//         {toolTipContent}
//       </TooltipContent>
//     </Tooltip>
//   </TooltipProvider>
// );
