/* eslint-disable @next/next/no-img-element */
"use client";

import { removeBackground } from "@imgly/background-removal";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { ImageSequenceItemType } from "~/types/timeline.types";

const Page = () => {
  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);
  const addTextBehindImageOps = useVideoStore(
    (store) => store.addTextBehindImageOps,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTextBehindImageVideo = async () => {
    if (activeSeqItem?.itemType !== "image") {
      console.log("Please select an image item");
      return;
    }

    setIsLoading(true);
    const imageId = activeSeqItem.itemId;
    const image = sequenceItems[imageId] as ImageSequenceItemType;

    const imageUrl = image.editableProps.imageUrl;
    console.log("imageUrl", imageUrl);

    try {
      const imageBlob = await removeBackground(imageUrl);
      console.log("removedBackground", imageBlob);
      const url = URL.createObjectURL(imageBlob);
      console.log("url", url);
      setPreviewUrl(url);
      addTextBehindImageOps(activeSeqItem.layerId, imageId, url);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Captions</h1>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 p-4">
        <Button
          onClick={handleGenerateTextBehindImageVideo}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Generate Text behind image video"}
        </Button>

        {previewUrl && (
          <div className="mt-4 rounded-lg border p-4">
            <h2 className="mb-2 text-sm font-medium">Preview:</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-700">
              <img
                src={previewUrl}
                alt="Background removed preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
