"use client";
import {
  HeadphonesIcon,
  LifeBuoyIcon,
  Settings2Icon,
  ShuffleIcon,
  SquareUserIcon,
  VideoIcon,
  WandIcon,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { TooltipButton } from "~/components/ui/custom/tool-tip-button";
import { LAYOUT } from "~/lib/constants/layout.constants";
import { cn } from "~/lib/utils";

const { PROJECT_HEADER_HEIGHT } = LAYOUT;

const AsideNew = () => {
  const router = useRouter();
  const params = useParams<{ "project-id": string }>();
  const handleNavigation = (path: string) => {
    router.push(`/new-editor/${params["project-id"]}/${path}`);
  };
  const pathname = usePathname();
  console.log({ params, pathname });

  // Determine the active tab from the last segment of the pathname
  // This allows for flexibility if the URL structure changes in the future
  const activeTab = pathname.split("/").slice(-1)[0];
  console.log({ activeTab });

  return (
    <div className="flex h-full flex-col">
      <div
        className="border-b p-2"
        style={{
          height: PROJECT_HEADER_HEIGHT,
        }}
      >
        {/* <TooltipButton
          icon={<TriangleIcon className="size-5 fill-foreground" />}
          toolTipContent="Home"
          buttonProps={{
            size: "icon",
            variant: "outline",
            onClick: () => {
              handleNavigation("home");
            },
          }}
        /> */}
      </div>
      <nav className="grid gap-4 p-2">
        <TooltipButton
          icon={<VideoIcon className="size-5" />}
          toolTipContent="Media"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: cn("rounded-lg", activeTab === "media" && "bg-muted"),
            onClick: () => {
              handleNavigation("media");
            },
          }}
        />

        <TooltipButton
          icon={<ShuffleIcon className="size-5" />}
          toolTipContent="Transitions"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: cn(
              "rounded-lg",
              activeTab === "transitions" && "bg-muted",
            ),
            onClick: () => {
              handleNavigation("transitions");
            },
          }}
        />
        <TooltipButton
          icon={<WandIcon className="size-5" />}
          toolTipContent="Effects"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: cn("rounded-lg", activeTab === "effects" && "bg-muted"),
            onClick: () => {
              handleNavigation("effects");
            },
          }}
        />
        <TooltipButton
          icon={<HeadphonesIcon className="size-5" />}
          toolTipContent="Audio"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: cn("rounded-lg", activeTab === "audio" && "bg-muted"),
            onClick: () => {
              handleNavigation("audio");
            },
          }}
        />
        <TooltipButton
          icon={<Settings2Icon className="size-5" />}
          toolTipContent="Settings"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: cn("rounded-lg", activeTab === "settings" && "bg-muted"),
            onClick: () => {
              handleNavigation("settings");
            },
          }}
        />
      </nav>
      <nav className="mt-auto grid gap-2 p-2">
        <TooltipButton
          icon={<LifeBuoyIcon className="size-5" />}
          toolTipContent="Help"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "mt-auto rounded-lg",
            onClick: () => console.log("Help clicked"),
          }}
        />
        <TooltipButton
          icon={<SquareUserIcon className="size-5" />}
          toolTipContent="Account"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "mt-auto rounded-lg",
            onClick: () => console.log("Account clicked"),
          }}
        />
      </nav>
    </div>
  );
};

export default AsideNew;
