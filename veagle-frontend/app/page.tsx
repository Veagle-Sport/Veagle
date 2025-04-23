// app/page.tsx

import Image from "next/image";
import PlayersMobileApp from "./_components/PlayersMobileApp";
import TalentSeekersWebApp from "./_components/TalentSeekersWebApp";
import CourtAdminWebApp from "./_components/CourtAdminWebApp";

export default function HomePage() {
  return (
    <div className="bg-[#1f1f1f] text-white px-8 text-center">
      <div className="py-6">
        <h1 className="text-gray-400 mb-4">Welcome to</h1>
        <Image
          src="/veagle-text.png"
          alt="Logo"
          width={300}
          height={300}
          className="mx-auto"
        />
      </div>

      <h2 className="text-2xl font-semibold text-white mb-8">Try our app</h2>
      <CourtAdminWebApp />
      <section className="my-12 w-full">
        <h2 className="text-2xl font-semibold text-white mb-8">
          Check the demos
        </h2>
        <div className="flex flex-col lg:flex-row p-5 justify-center gap-6 w-full">
          <TalentSeekersWebApp />
          <PlayersMobileApp />
        </div>
      </section>
    </div>
  );
}
