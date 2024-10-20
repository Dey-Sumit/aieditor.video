"use client";
import axios from "axios";
import {
  AudioLinesIcon,
  ImageIcon,
  Music,
  PlusIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { LAYOUT } from "~/lib/constants/layout.constants";

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
// 563492ad6f91700001000001e2a0f1b1 // copilot suggestion, not sure if it's correct xD

const { PROJECT_HEADER_HEIGHT } = LAYOUT;

interface PexelsMedia {
  id: number;
  src: {
    medium: string;
    landscape: string;
    portrait: string;
  };
  video_files?: Array<{
    link: string;
    quality: string;
  }>;
}

interface PexelsResponse {
  photos?: PexelsMedia[];
  videos?: PexelsMedia[];
}

const MediaItem: React.FC<{
  item: PexelsMedia;
  type: "image" | "video" | "audio" | "sound";
}> = ({ item, type }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleUse = () => {
    console.log(
      `Using ${type} with id: ${item.id}. src : `,
      item,
      item.src?.portrait,
    );
  };

  return (
    <div
      className="relative h-[80px] w-[130px] overflow-hidden rounded-md border border-gray-700 transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* {type === "image" && (
        <Image
          src={item?.src?.medium}
          alt={`Image ${item.id}`}
          width={150}
          height={150}
          className="h-full w-full object-cover"
        />
      )} */}
      {type === "video" && (
        <video
          src={
            item.video_files?.find((file) => file.quality === "sd")?.link || ""
          }
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
      )}
      {(type === "audio" || type === "sound") && (
        <div className="flex h-full w-full items-center justify-center bg-gray-800">
          {type === "audio" ? (
            <AudioLinesIcon size={24} />
          ) : (
            <Music size={24} />
          )}
        </div>
      )}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Button
            onClick={handleUse}
            variant="secondary"
            size="sm"
            className="flex items-center gap-x-1 text-xs"
          >
            Use <PlusIcon size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

const MediaSection: React.FC<{
  title: string;
  items: PexelsMedia[];
  type: "image" | "video" | "audio" | "sound";
  icon: React.ReactNode;
}> = ({ title, items, type, icon }) => (
  <div className="flex flex-col gap-y-2 border-b px-2 pb-2">
    <h3 className="mb-1 flex items-center text-sm font-semibold">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2">
        {items.map((item) => (
          <MediaItem key={item.id} item={item} type={type} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
);

const MediaLibrary: React.FC = () => {
  const [myAssets, setMyAssets] = useState<PexelsMedia[]>([]);
  const [cloudImages, setCloudImages] = useState<PexelsMedia[]>([]);
  const [cloudVideos, setCloudVideos] = useState<PexelsMedia[]>([]);
  // const [cloudAudios, setCloudAudios] = useState<PexelsMedia[]>([]);
  // const [soundEffects, setSoundEffects] = useState<PexelsMedia[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [imagesResponse, videosResponse] = await Promise.all([
          axios.get<PexelsResponse>(
            "https://api.pexels.com/v1/curated?per_page=5&orientation=portrait",
            {
              headers: { Authorization: PEXELS_API_KEY },
            },
          ),

          axios.get<PexelsResponse>(
            "https://api.pexels.com/videos/popular?per_page=5&orientation=portrait",
            {
              headers: { Authorization: PEXELS_API_KEY },
            },
          ),
        ]);

        setCloudImages(imagesResponse.data.photos || []);
        setCloudVideos(videosResponse.data.videos || []);

        // Simulating audio data and sound effects (Pexels doesn't provide audio API)
        /*     const simulatedAudios = Array(15)
          .fill(null)
          .map((_, index) => ({
            id: index,
            src: { medium: "" },
          })); */
        // setCloudAudios(simulatedAudios);
        // setSoundEffects(simulatedAudios);

        // Simulating my assets (mix of all types)
        setMyAssets([
          ...(imagesResponse.data.photos?.slice(0, 4) || []),
          ...(videosResponse.data.videos?.slice(0, 4) || []),
          // ...simulatedAudios.slice(0, 4),
          // ...simulatedAudios.slice(0, 3),
        ]);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    // fetchMedia();
  }, []);

  if (1 === 1) return null;

  return (
    <div className="w-full">
      <div
        className="mb-4 flex items-center justify-between border-b bg-black p-2"
        style={{ height: PROJECT_HEADER_HEIGHT }}
      >
        <h2 className="text-lg font-semibold">Media Library</h2>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-x-2"
        >
          Upload
          <UploadIcon size={16} />
        </Button>
      </div>
      <div className="flex flex-col gap-y-2">
        <MediaSection
          title="Uploaded Assets"
          items={myAssets}
          type="image"
          icon={<ImageIcon size={16} />}
        />
        <MediaSection
          title="Cloud Images"
          items={cloudImages}
          type="image"
          icon={<ImageIcon size={16} />}
        />
        <MediaSection
          title="Cloud Videos"
          items={cloudVideos}
          type="video"
          icon={<VideoIcon size={16} />}
        />
        {/* <MediaSection
          title="Cloud Audios"
          items={cloudAudios}
          type="audio"
          icon={<AudioLinesIcon size={16} />}
        />

        <MediaSection
          title="Sound Effects"
          items={soundEffects}
          type="sound"
          icon={<Music size={16} />}
        /> */}
      </div>
    </div>
  );
};

export default MediaLibrary;
