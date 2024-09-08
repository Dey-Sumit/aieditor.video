"use client";
import { FC } from "react";
import {
  HeadphonesIcon,
  LifeBuoyIcon,
  Settings2Icon,
  ShuffleIcon,
  SquareUserIcon,
  TriangleIcon,
  VideoIcon,
  WandIcon,
} from "~/components/Icons";
import { TooltipButton } from "~/components/ui/custom/tool-tip-button";
import { useParams, useRouter } from "next/navigation";

// import { genId } from "~/lib/utils";
// import { getVideoMetadata } from "@remotion/media-utils";
// import { ProjectType } from "~/types/store.types";

import RenderFromTweet from "./aside-poc-use-cases/render-from-tweet";
// const prepareProject = async (videoSrc: string) => {
//   const { durationInSeconds } = await getVideoMetadata(videoSrc);
//   // const durationInSeconds = 40.5;
//   const roundedDuration = Math.round(durationInSeconds);
//   const project: ProjectType = {
//     id: genId("p"),
//     props: {
//       compositionMetaData: {
//         fps: 30,
//         width: 720,
//         height: 1280,
//         duration: roundedDuration * 30,
//         compositionId: "comp-1",
//       },
//       layers: {
//         "content-layer-1": {
//           id: "content-layer-1",
//           visible: true,
//           locked: false,
//           liteItems: [],
//         },
//         "content-layer-2": {
//           id: "content-layer-2",
//           visible: true,
//           locked: false,
//           liteItems: [
//             {
//               id: "s-1",
//               type: "video",
//               startFrame: 0,
//               effectiveDuration: roundedDuration * 30,
//               sequenceDuration: roundedDuration * 30,
//               offset: 0,
//               transition: {
//                 incoming: null,
//                 outgoing: null,
//               },
//             },
//           ],
//         },
//         "audio-layer": {
//           id: "audio-layer",
//           visible: true,
//           locked: false,
//           liteItems: [],
//         },
//         "caption-layer": {
//           id: "caption-layer",
//           visible: true,
//           locked: false,
//           liteItems: [],
//         },
//       },
//       sequenceItems: {
//         "content-layer-2": {
//           "s-1": {
//             id: "s-1",
//             type: "video",
//             layerId: "content-layer-1",
//             editableProps: {
//               mediaUrl: videoSrc,
//               videoVolume: 1,
//             },
//             animation: {
//               in: undefined,
//               out: undefined,
//             },
//           },
//         },
//       },
//       transitions: {},
//     },
//   };
//   return project;
// };

export const Aside: FC = () => {
  const router = useRouter();

  const params = useParams<{ "project-id": string }>();

  const handleNavigation = (path: string) => {
    router.push(`/editor/${params["project-id"]}/${path}`);
  };

  // const loadProject = useVideoStore((state) => state.loadProject);

  // const updateProjectForTweet = async () => {
  //   console.log("update project for tweet");

  //   const project = await prepareProject(
  //     DUMMY_ASSETS.SAMPLES.VIDEOS.REMOTE_TWITTER_VIDEO,
  //   );
  //   loadProject(project);
  // };

  return (
    <aside className="inset-y fixed left-0 z-20 flex h-full max-w-max flex-col border-r">
      <div className="border-b p-2">
        <TooltipButton
          icon={<TriangleIcon className="size-5 fill-foreground" />}
          toolTipContent="Home"
          buttonProps={{
            size: "icon",
            variant: "outline",
            onClick: () => {
              handleNavigation("home");
            },
          }}
        />
      </div>
      <nav className="grid gap-4 p-2">
        <TooltipButton
          icon={<VideoIcon className="size-5" />}
          toolTipContent="Media"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "rounded-lg bg-muted",
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
            className: "rounded-lg",
            onClick: () => console.log("Transitions clicked"),
          }}
        />
        <TooltipButton
          icon={<WandIcon className="size-5" />}
          toolTipContent="Effects"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "rounded-lg",
            onClick: () => console.log("Effects clicked"),
          }}
        />
        <TooltipButton
          icon={<HeadphonesIcon className="size-5" />}
          toolTipContent="Audio"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "rounded-lg",
            onClick: () => console.log("Audio clicked"),
          }}
        />
        <TooltipButton
          icon={<Settings2Icon className="size-5" />}
          toolTipContent="Settings"
          buttonProps={{
            size: "icon",
            variant: "ghost",
            className: "rounded-lg",
            onClick: () => console.log("Settings clicked"),
          }}
        />
        <RenderFromTweet />
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
    </aside>
  );
};
