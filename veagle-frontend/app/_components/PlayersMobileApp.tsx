"use client";

import { useState } from "react";
import Image from "next/image";

export default function PlayersMobileApp() {
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
        className="absolute top-3 right-3 z-50"
      />
      <Image
        src="/mobile-app-images.png"
        alt="Players Mobile App"
        width={130}
        height={130}
        className="rounded-lg z-10"
      />
      <h3 className="text-xl">Players Mobile App</h3>
      <p className="text-sm text-gray-400">
        An app for players to showcase skills, track progress, and get noticed
        by scouts and clubs.
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

            <iframe
              src="https://embed.figma.com/proto/FvHbBUebyJaTXdrrmsqq1o/VEAGLE?node-id=50-2592&scaling=scale-down&content-scaling=fixed&page-id=1%3A4&starting-point-node-id=118%3A5457&embed-host=share"
              width="100%"
              height="100%"
              allowFullScreen
              allow="fullscreen"
              style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
