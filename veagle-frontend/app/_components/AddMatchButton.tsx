"use client";

import { Dispatch, SetStateAction } from "react";

interface AddMatchButtonProps {
  // Prop to set the modal state
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddMatchButton({ setIsOpen }: AddMatchButtonProps) {
  // Toggle the state of the modal
  const toggleModal = () => setIsOpen((prev: boolean) => !prev);

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={toggleModal} // Toggling the modal state on click
        className="bg-[#CBE249] text-gray-900 px-7 py-2 rounded-full hover:bg-amber-200 transition font-bold"
      >
        Add match +
      </button>
    </div>
  );
}
