/* eslint-disable @next/next/no-img-element */
"use client";
import { PlusIcon, UploadIcon } from "lucide-react";
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

// First, create a type for S3 assets
type S3Asset = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: "image" | "video";
  lastModified: string;
  size: number;
};

// Modify the MediaItem component to handle our new type
const MediaItem: React.FC<{ item: S3Asset }> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  return (
    <div
      className="relative h-[80px] w-[130px] overflow-hidden rounded-md border border-gray-700 transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.type === "video" ? (
        <>
          {/* Thumbnail for video (hidden when video is playing) */}
          {!isHovered && (
            <img
              src={item.thumbnailUrl}
              alt={`Thumbnail ${item.id}`}
              className="h-full w-full object-cover"
              onLoad={() => setThumbnailLoaded(true)}
            />
          )}
          {/* Actual video (shown on hover) */}
          <video
            src={item.url}
            className={`h-full w-full object-cover ${isHovered ? "block" : "hidden"}`}
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        </>
      ) : (
        // Image
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={`Image ${item.id}`}
          className="h-full w-full object-cover"
        />
      )}

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Button
            onClick={() => console.log("Using asset:", item)}
            variant="secondary"
            size="sm"
            className="flex items-center gap-x-1 text-xs"
          >
            Use <PlusIcon size={12} />
          </Button>
        </div>
      )}

      {/* Optional: Show file size */}
      <div className="absolute bottom-1 right-1 text-xs text-white/70">
        {(item.size / (1024 * 1024)).toFixed(1)}MB
      </div>
    </div>
  );
};
const MediaSection: React.FC<{
  title: string;
  items: S3Asset[];
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
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
);

const MediaLibrary: React.FC = () => {
  // const [cloudImages, setCloudImages] = useState<PexelsMedia[]>([]);
  // const [cloudVideos, setCloudVideos] = useState<PexelsMedia[]>([]);
  const [userUploadedAssets, setUserUploadedAssets] = useState<S3Asset[]>([]);
  const fetchUserAssets = async () => {
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();

      const formattedAssets: S3Asset[] = data.assets.map((asset: any) => {
        const isVideo = asset.url.match(/\.(mp4|mov|webm)$/i);

        return {
          id: asset.key,
          url: asset.url,
          type: isVideo ? "video" : "image",
          // For videos, we can generate thumbnail using the first frame
          thumbnailUrl: isVideo ? `${asset.url}#t=0.1` : undefined,
          lastModified: asset.lastModified,
          size: asset.size,
        };
      });

      setUserUploadedAssets(formattedAssets);
    } catch (error) {
      console.error("Error fetching user assets:", error);
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        fetchUserAssets();
        // const [imagesResponse, videosResponse] = await Promise.all([
        //   axios.get<PexelsResponse>(
        //     "https://api.pexels.com/v1/curated?per_page=5&orientation=portrait",
        //     {
        //       headers: { Authorization: PEXELS_API_KEY },
        //     },
        //   ),

        //   axios.get<PexelsResponse>(
        //     "https://api.pexels.com/videos/popular?per_page=5&orientation=portrait",
        //     {
        //       headers: { Authorization: PEXELS_API_KEY },
        //     },
        //   ),
        // ]);

        // setCloudImages(imagesResponse.data.photos || []);
        // setCloudVideos(videosResponse.data.videos || []);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, []);

  // if (1 === 1) return null;

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
          title="User Uploaded Assets"
          items={userUploadedAssets}
          type="image"
          icon={<UploadIcon size={16} />}
        />

        {/* <MediaSection
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
        /> */}
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
