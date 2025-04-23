"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";

interface AddMatchDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  openUploadVideo: () => void; // Function to open UploadVideo dialog
}

export default function AddMatchDialog({
  isOpen,
  closeModal,
  openUploadVideo,
}: AddMatchDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/25 backdrop-blur-sm"
    >
      <DialogPanel className="bg-[#262626] p-6 rounded-4xl text-white w-96">
        <DialogTitle className="text-2xl font-semibold mb-4">
          Add Match
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              //   openUploadVideo((prev: boolean) => !prev); // Call the function to open UploadVideo
              //   closeModal((prev: boolean) => !prev);
              openUploadVideo(); // Call the function to open UploadVideo
              closeModal();
            }} // Use the passed function to open UploadVideo
            className="w-full border-[1px] border-[#737373] rounded-2xl flex items-start justify-items-start gap-5 px-4 py-2 transition"
          >
            <Image src="upload-icon.svg" alt="" width={20} height={20} /> Upload
            video
          </button>
          <button
            onClick={closeModal}
            className="w-full border-[1px] border-[#737373] rounded-2xl flex items-start justify-items-start gap-5 px-4 py-2 transition"
          >
            <Image src="camera-icon.svg" alt="" width={20} height={20} /> Record
            from camera
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
