import { type Caption } from "@remotion/captions";
import { extractAudio } from "./audio-buffer-to-wav";

export type CaptionState =
  | {
      type: "idle";
    }
  | {
      type: "extracting-audio";
      src: string;
    }
  | {
      type: "captioning";
    }
  | {
      type: "error";
      error: Error;
    }
  | {
      type: "done";
      captions: Caption[];
    };

export const getCaptions = async ({
  src,
  setCaptionState,
}: {
  src: string;
  setCaptionState: (state: CaptionState) => void;
}) => {
  try {
    setCaptionState({
      type: "extracting-audio",
      src,
    });
    const audioBuffer = await extractAudio(src);
    console.log({ audioBuffer });

    setCaptionState({
      type: "captioning",
    });

    // Convert the ArrayBuffer to a Blob with the appropriate MIME type (e.g., "audio/wav")
    // const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });

    // Create FormData and append the audio file
    const formData = new FormData();
    // formData.append("file", audioBlob, "audio.wav"); // Adding the file with a custom name

    // Send the FormData to the backend
    const res = await fetch(`/api/captions`, {
      method: "POST",
      // body: formData, // No need for headers with FormData; it auto-sets `Content-Type`
      headers: {
        "Content-Type": "audio/wav",
      },
      body: audioBuffer,
    });
    const json = await res.json();
    setCaptionState({
      type: "done",
      captions: json.captions,
    });
    return json.captions;
  } catch (err) {
    setCaptionState({
      type: "error",
      error: err as Error,
    });
  }
};
