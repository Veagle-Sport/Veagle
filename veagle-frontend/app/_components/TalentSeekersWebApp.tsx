"use client";

import { useState } from "react";
import Image from "next/image";
import Iframe from "react-iframe"; // Import react-iframe

export default function TalentSeekersWebApp() {
  const [showIframe, setShowIframe] = useState(false); // State to toggle iframe visibility

  const handleClick = () => {
    setShowIframe(true); // Set the state to true when the button is clicked
  };

  const handleClose = () => {
    setShowIframe(false); // Set the state to false to close the iframe
  };

  return (
    <div className="bg-[#262626] p-6 rounded-3xl flex flex-col justify-center items-center gap-5 text-white min-w-72 relative">
      <Image
        src="/veagle-logo.png"
        alt="Veagle Logo"
        width={80}
        height={80}
        className="absolute top-3 left-3 z-50"
      />
      <div className="relative w-full h-[50vh]">
        <Image
          src="/talent-seeker-images.png" // Replace with actual image URL
          alt="Talent Seekers Web App Demo"
          layout="fill"
          objectFit="contain"
          className="rounded-lg z-10"
        />
      </div>
      <h3 className="text-xl">Talent Seekers Web App</h3>
      <p className="text-sm text-gray-400">
        A platform for scouts and clubs to discover, evaluate, and connect with
        emerging football talent through video highlights and performance data.
      </p>

      {/* Button to show iframe */}
      <button
        onClick={handleClick}
        className="inline-block px-6 py-2 border border-lime-400 text-lime-400 rounded-full hover:bg-lime-500 hover:text-white transition"
      >
        View Demo
      </button>

      {/* Conditionally render the iframe in a popup modal */}
      {showIframe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose} // Close the modal when clicking the backdrop
        >
          <div
            className="relative w-[800px] h-[450px] bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-900 bg-lime-400 rounded-full p-2"
            >
              &times;
            </button>

            <Iframe
              url="https://embed.figma.com/proto/FvHbBUebyJaTXdrrmsqq1o/VEAGLE?node-id=135-1198&scaling=scale-down&content-scaling=fixed&page-id=1%3A5&starting-point-node-id=135%3A1198&embed-host=share"
              width="100%"
              height="100%"
              allowFullScreen
              allow="fullscreen"
              styles={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
