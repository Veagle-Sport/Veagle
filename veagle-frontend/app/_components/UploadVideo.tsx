"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface UploadVideoProps {
  show: boolean;
  hide: () => void;
}

export default function UploadVideo({ show, hide }: UploadVideoProps) {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [path, setPath] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset file state when modal is closed
  useEffect(() => {
    if (!show) {
      setFile(null);
      setError(null);
    }
  }, [show]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // If there's already a file, prevent uploading another
      if (file) {
        setError(
          "A file has already been uploaded. Please close the modal to upload a new file."
        );
        return;
      }
      handleUpload(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  // const handleUpload = async (e: { preventDefault: () => void }) => {};
  const handleUpload = async (file: any) => {
    // e.preventDefault();
    if (!file) {
      setError("Please provide both a video and an email address.");
      return;
    }
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("originalVideo", file);

    try {
      const response = await fetch("http://3.111.52.82/matchs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, keep the status text.
        }
        setError(`Upload failed: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      console.log("Upload response:", data);
      setPath(data.originalVideo);
    } catch (error: any) {
      if (error instanceof Error) {
        setError(`Upload failed: ${error.message}`);
      } else {
        setError("Upload failed: An unexpected error occurred.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalize = async () => {
    if (!path) {
      setError("Please make sure the file is uploaded.");
      return;
    }
    try {
      console.log("start analyzing");
      const response = await fetch(
        "http://ec2-13-200-242-34.ap-south-1.compute.amazonaws.com:5000/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video_path: path }),
        }
      );
      console.log("Response status:", response);
      if (!response.ok) {
        // Try to parse an error message
        let message = response.statusText;
        try {
          const err = await response.json();
          message = err?.message || message;
        } catch {
          // ignore non-JSON errors
        }
        throw new Error(`Request failed: ${message}`);
      }

      const jsonData = await response.json();
      console.log("Processing response:", jsonData);
      return jsonData;
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw err;
    }
    //  finally {
    //    setLoading(false);
    //  }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={hide}
    >
      <div
        className="w-full max-w-md bg-[#262626] p-6 rounded-lg text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {isUploading && (
          <div className="absolute inset-0 z-20 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <h2 className="text-base font-semibold mb-6">Upload match's video</h2>
        <p className="mb-4 text-sm">From your computer</p>

        {/* Video upload area */}
        <div className="mb-6">
          <label
            htmlFor="video-upload"
            className={`
              block border-2 border-dashed rounded-lg p-6 text-center
              ${
                file
                  ? "border-gray-600 bg-gray-700 cursor-not-allowed"
                  : "border-gray-600 bg-transparent cursor-pointer hover:bg-gray-800"
              }
            `}
          >
            <input
              type="file"
              accept="video/mp4,video/x-ms-wmv"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
              disabled={!!file}
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-3 bg-lime-400 rounded-full flex justify-center items-center">
                <Image
                  src="/play-icon.png"
                  alt="Play Icon"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-sm text-gray-400 mb-2">
                {path
                  ? "Video uploaded successfully, enter Email and analyze it!"
                  : "Drag and drop your video here!"}
              </p>
              {!file && <p className="text-xs text-gray-500">or</p>}
              {!file && (
                <span className="mt-2 text-lime-400 hover:text-lime-500">
                  Browse files
                </span>
              )}
            </div>
          </label>
        </div>

        {/* Email input */}
        <div className="mb-6">
          <label className="block text-sm font-medium" htmlFor="email">
            Write user's email <span className="text-yellow-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Ex: user@gmail.com"
            className="w-full bg-transparent border-b border-gray-600 focus:border-lime-500 focus:outline-none py-2 mb-4 text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end items-end">
          <button
            onClick={handleAnalize}
            disabled={isUploading || !path || !email}
            className={`w-fit px-5 py-1 rounded-2xl transition ${
              isUploading || !file || !email
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-lime-400 text-gray-900 hover:bg-lime-500"
            }`}
          >
            {isUploading ? "Uploading..." : "Analyze with AI +"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Close modal button */}
        <button
          onClick={hide}
          className="mt-4 w-full py-2 text-sm text-gray-300 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
