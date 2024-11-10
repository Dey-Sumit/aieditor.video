// All the audio extraction related functions
const timeToSeconds = (time) => {
  if (typeof time === "number") return time;

  const parts = time.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(time);
};

// Your existing helper functions
function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }

  return result;
}

function writeFloat32(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(options) {
  const { samples, format, sampleRate, numChannels, bitDepth } = options;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);

  if (format === 1) {
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }

  return buffer;
}

function audioBufferToWav(buffer, opt) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = opt.float32 ? 3 : 1;
  const bitDepth = format === 3 ? 32 : 16;

  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }

  return encodeWAV({
    samples: result,
    format,
    sampleRate,
    numChannels,
    bitDepth,
  });
}

// Main extraction function
async function extractAudioFromVideo(videoFile, range = {}) {
  let src = null; // Define src outside try block

  try {
    // If videoFile is already a blob URL
    if (typeof videoFile === "string" && videoFile.startsWith("blob:")) {
      src = videoFile;
    } else {
      // If videoFile is a File object
      src = URL.createObjectURL(videoFile);
    }

    // Check if we have a valid src
    if (!src) {
      throw new Error("Invalid video file or source");
    }

    const context = new AudioContext();
    console.log("Fetching from:", src); // Debug log

    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Response:", response); // Debug log
    const arrayBuffer = await response.arrayBuffer();
    console.log("Array buffer size:", arrayBuffer.byteLength); // Debug log

    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    console.log("Audio buffer created:", {
      duration: audioBuffer.duration,
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
    }); // Debug log

    const startTime = range.start ? timeToSeconds(range.start) : 0;
    const endTime = range.end ? timeToSeconds(range.end) : audioBuffer.duration;

    if (startTime < 0 || endTime > audioBuffer.duration || startTime >= endTime) {
      throw new Error(
        `Invalid time range. Video duration is ${audioBuffer.duration.toFixed(2)} seconds`
      );
    }

    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const sampleLength = endSample - startSample;

    const slicedBuffer = new AudioBuffer({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: sampleLength,
      sampleRate: sampleRate,
    });

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const slicedData = new Float32Array(sampleLength);

      for (let i = 0; i < sampleLength; i++) {
        slicedData[i] = channelData[i + startSample];
      }

      slicedBuffer.copyToChannel(slicedData, channel);
    }

    const wavData = audioBufferToWav(slicedBuffer, { float32: true });
    return new Blob([wavData], { type: "audio/wav" });
  } catch (error) {
    console.error("Error details:", error); // More detailed error logging
    throw error;
  } finally {
    // Only revoke the URL if we created it
    if (src && typeof videoFile !== "string") {
      URL.revokeObjectURL(src);
    }
  }
}
