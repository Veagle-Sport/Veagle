// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
// import { MenuIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="text-white px-10 py-3 flex items-center justify-between bg-[#262626] border-b-[1px]">
      {/* Logo + Title */}
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="/veagle-logo.png" // replace with your neon-green Veagle icon
            alt="Veagle Logo"
            width={32}
            height={32}
          />
          <span className="ml-3 text-lg font-semibold">
            Al-Motawa Park Stadiums
          </span>
        </div>
      </Link>
      {/* Hamburger Menu */}
      <button
        aria-label="Open menu"
        className="p-2 hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        {/* <MenuIcon className="w-6 h-6" /> */}
      </button>
    </header>
  );
}
