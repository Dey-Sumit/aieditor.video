// Main application logic
document.addEventListener("DOMContentLoaded", () => {
  const videoFile = document.getElementById("videoFile");
  const startTime = document.getElementById("startTime");
  const endTime = document.getElementById("endTime");
  const extractButton = document.getElementById("extractButton");
  const videoPreview = document.getElementById("videoPreview");
  const audioPreview = document.getElementById("audioPreview");
  const downloadBtn = document.getElementById("downloadBtn");

  let extractedBlob = null;

  // Handle file selection
  videoFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      videoPreview.src = URL.createObjectURL(file);
    }
  });

  // Handle extraction
  extractButton.addEventListener("click", async () => {
    const file = videoFile.files[0];
    if (!file) {
      alert("Please select a video file");
      return;
    }

    try {
      extractButton.disabled = true;
      extractButton.textContent = "Extracting...";

      // Create blob URL for video preview
      const videoUrl = URL.createObjectURL(file);
      videoPreview.src = videoUrl;

      console.log("Processing file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      extractedBlob = await extractAudioFromVideo(file, {
        start: startTime.value,
        end: endTime.value,
      });

      const audioUrl = URL.createObjectURL(extractedBlob);
      audioPreview.src = audioUrl;
      downloadBtn.classList.remove("hidden");

      // Clean up video preview URL
      URL.revokeObjectURL(videoUrl);
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Error extracting audio: " + error.message);
    } finally {
      extractButton.disabled = false;
      extractButton.textContent = "Extract Audio";
    }
  });

  // Handle download
  downloadBtn.addEventListener("click", () => {
    if (extractedBlob) {
      const url = URL.createObjectURL(extractedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_audio.wav";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  });
});
