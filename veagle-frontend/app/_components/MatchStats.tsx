"use client";

export default function MatchStats() {
  return (
    <div className="bg-[#262626] p-6 rounded-3xl text-white">
      {/* Row 1 */}
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col items-center bg-[#1f1f1f] rounded-lg py-4 px-6 w-32 text-center">
          <div className="text-2xl text-lime-400 mb-2">5</div>
          <div className="text-sm text-gray-400">Goals</div>
        </div>

        <div className="flex flex-col items-center bg-[#1f1f1f] rounded-lg py-4 px-6 w-32 text-center">
          <div className="text-2xl text-lime-400 mb-2">1/2</div>
          <div className="text-sm text-gray-400">Penalties</div>
        </div>

        <div className="flex flex-col items-center bg-[#1f1f1f] rounded-lg py-4 px-6 w-32 text-center">
          <div className="text-2xl text-lime-400 mb-2">218</div>
          <div className="text-sm text-gray-400">Passes</div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col w-full gap-4 mb-4">
        <div className="flex flex-col items-start bg-[#1f1f1f] rounded-lg py-4 px-6">
          <div className="text-2xl text-lime-400 mb-2">5</div>
          <div className="text-sm text-gray-400">Shots on Target</div>
        </div>

        <div className="flex flex-col items-start bg-[#1f1f1f] rounded-lg py-4 px-6">
          <div className="text-2xl text-lime-400 mb-2">5</div>
          <div className="text-sm text-gray-400">Clean Sheets</div>
        </div>

        <div className="flex flex-col items-start bg-[#1f1f1f] rounded-lg py-4 px-6">
          <div className="text-2xl text-lime-400 mb-2">5</div>
          <div className="text-sm text-gray-400">Goalkeeper Saves</div>
        </div>
      </div>
    </div>
  );
}
