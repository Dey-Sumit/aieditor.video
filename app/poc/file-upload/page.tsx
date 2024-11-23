"use client";
// components/FileUpload.tsx
import { useState } from "react";

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: file.size,
          contentType: file.type,
        }),
      });

      const { presignedUrl, readUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      return readUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);

      const uploadPromises = fileList.map(handleUpload);
      const urls = await Promise.all(uploadPromises);
      console.log("Uploaded URLs:", urls);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} multiple accept="image/*" />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
