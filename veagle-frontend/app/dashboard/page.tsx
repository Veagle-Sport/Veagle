"use client";

import { useState } from "react";
import AddMatchButton from "../_components/AddMatchButton";
import EmptyState from "../_components/EmptyState";
import UploadVideo from "../_components/UploadVideo";
import AddMatchDialog from "../_components/AddMatchDialog"; // Import AddMatchDialog
import MatchTable from "../_components/MatchTable";

export default function DashboardPage() {
  // Separate state for each dialog
  const [isAddMatchDialogOpen, setIsAddMatchDialogOpen] = useState(false);
  const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);

  // Toggle the visibility of UploadVideo dialog
  const openUploadVideo = () => setIsUploadVideoOpen(true);
  const closeUploadVideo = () => setIsUploadVideoOpen(false);
  const data = true;
  return (
    <div className="p-6">
      {/* container flex flex-col justify-center items-center mx-auto */}
      {data ? (
        <>
          <div className="flex w-full justify-between text-white rounded-xl">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Welcome back!</h2>
              <p className="text-sm text-gray-400 mb-6">
                Here’s a summary of all recorded matches. Track, review, and
                manage your matches data.
              </p>
            </div>
            <AddMatchButton setIsOpen={setIsAddMatchDialogOpen} />
          </div>
          <MatchTable />
        </>
      ) : (
        <>
          <EmptyState />
          <AddMatchButton setIsOpen={setIsAddMatchDialogOpen} />
        </>
      )}
      {/* AddMatchDialog is controlled by isAddMatchDialogOpen */}
      <AddMatchDialog
        isOpen={isAddMatchDialogOpen}
        closeModal={() => setIsAddMatchDialogOpen(false)}
        openUploadVideo={openUploadVideo} // Pass the function to open UploadVideo
      />
      {/* UploadVideo dialog is controlled by isUploadVideoOpen */}
      <UploadVideo
        show={isUploadVideoOpen}
        hide={closeUploadVideo} // Use the function to close UploadVideo
      />
    </div>
  );
}
