import {
  type OpenAiVerboseTranscription,
  openAiWhisperApiToCaptions,
} from "@remotion/openai-whisper";
import { NextRequest, NextResponse } from "next/server";
// import { OpenAI } from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    console.log("Received transcription request");

    // const formData = await req.formData();
    // console.log({ formData });

    // const file = formData.get("file"); // Access the uploaded audio file

    // Get the Blob from the request
    const blob = await req.blob();
    console.log({ blob });

    // Convert Blob to ArrayBuffer, then to Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Transcribing audio file with OpenAI...", buffer);
    // Check if 'file' is indeed a File type
    // if (!(file instanceof File)) {
    //   return NextResponse.json({
    //     status: "fail",
    //     message: "No valid file uploaded",
    //   });
    // }

    // Send the audio file data directly to OpenAI for transcription
    // const transcription = await openai.audio.transcriptions.create({
    //   file: buffer,
    //   model: "whisper-1", // Whisper model for transcription
    //   response_format: "text", // You can also use 'json' or other formats
    // });

    // const models = await openai.models.list();
    // console.log(models);

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    formData.append("prompt", "Hello, welcome to my lecture."); // Teaches the AI to return punctuation
    formData.append("timestamp_granularities[]", "word");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const transcription = (await res.json()) as OpenAiVerboseTranscription;
    console.log("transcription", transcription);

    const { captions } = openAiWhisperApiToCaptions({ transcription });

    const response = {
      captions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({
      status: "fail",
      error: "Error during transcription",
    });
  }
}
