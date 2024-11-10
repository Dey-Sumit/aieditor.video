"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { CAPTION_DATA } from "~/data/nested-composition.data";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import { processCaptions } from "~/utils/captions.utils";
import { genId } from "~/utils/misc.utils";

type CaptionState = {
  status: "idle" | "processing" | "error";
  error?: string;
};

// Mock API calls with delays
const mockGenerateAndProcessCaptions = async () => {
  // First delay simulates caption generation
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const captions = CAPTION_DATA.captions;

  // Second delay simulates processing
  await new Promise((resolve) => setTimeout(resolve, 500));
  return processCaptions({
    captions,
    fps: 30,
    layerId: genId("l"),
  });
};

export default function CaptionGenerator() {
  const [captionState, setCaptionState] = useState<CaptionState>({
    status: "idle",
  });

  const addFreshCaptionsToMedia = useVideoStore(
    (store) => store.addFreshCaptionsToMedia,
  );
  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);

  const handleGenerateCaptions = async () => {
    if (
      activeSeqItem?.itemType !== "audio" &&
      activeSeqItem?.itemType !== "video"
    ) {
      toast.error("Please select an audio or video item");
      return;
    }

    const mediaId = activeSeqItem.itemId;
    const mediaLayerId = activeSeqItem.layerId;
    const captionLayerId = genId("l");

    try {
      setCaptionState({ status: "processing" });

      toast.promise(mockGenerateAndProcessCaptions(), {
        loading: "Generating captions...",
        success: (processedData) => {
          addFreshCaptionsToMedia(
            mediaLayerId,
            mediaId,
            captionLayerId,
            processedData,
          );
          return "Captions generated successfully";
        },
        error: "Failed to generate captions",
      });

      setCaptionState({ status: "idle" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setCaptionState({
        status: "error",
        error: errorMessage,
      });
      console.error("Caption generation error:", error);
    }
  };

  const isProcessing = captionState.status === "processing";

  return (
    <div className="w-full">
      <div className="flex h-[56px] items-center border-b px-4">
        <h1 className="text-lg font-semibold">Captions</h1>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 p-4">
        <h2 className="text-center text-2xl font-bold">Generate Captions</h2>

        <Button
          onClick={handleGenerateCaptions}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Captions...
            </>
          ) : (
            "Generate Captions"
          )}
        </Button>

        {captionState.error && (
          <p className="text-center text-sm text-destructive">
            {captionState.error}
          </p>
        )}
      </div>
    </div>
  );
}
