// app/components/EmptyState.tsx
"use client";

import Image from "next/image";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center m-auto justify-center py-2 text-white text-center w-fit">
      <div className="font-semibold mb-4">
        <Image width={150} height={40} alt="ds" src="/exclamation.png" />
      </div>
      <p className="text-lg text-gray-300 mb-6">
        You haven't added any matches yet. <br />
        Start now!
      </p>
      {/* <button className="bg-lime-400 text-gray-900 px-6 py-3 rounded-full hover:bg-lime-500 transition">
        Add match +
      </button> */}
    </div>
  );
}
