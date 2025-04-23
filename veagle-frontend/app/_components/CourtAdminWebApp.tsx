"use client";

import Image from "next/image";
import Link from "next/link";

export default function CourtAdminWebApp() {
  return (
    <div className="bg-[#262626] p-6 px-11 lg:px-6 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-5 text-white min-w-72 relative">
      <div className="">
        {/* Text Section */}
        <h3 className="text-xl font-semibold mb-4">Court Admin Web App</h3>
        <p className="text-sm text-gray-400 mb-4 max-w-[600px]">
          An AI-powered dashboard for court admins to schedule bookings, control
          the cameras, manage matches, and access footage and player stats
          seamlessly.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2 bg-lime-400 text-gray-900 rounded-full hover:bg-lime-500 transition"
        >
          Visit App
        </Link>
      </div>
      {/* Logo */}
      <Image
        src="/veagle-logo.png" // Replace with your actual logo image
        alt="Veagle Logo"
        width={80}
        height={80}
        className="absolute top-3 left-3 z-50"
      />

      {/* Image section */}
      <div className="relative w-full h-[50vh]">
        <Image
          src="/court-admin-phones.png" // Replace with the actual image URL
          alt="Court Admin Web App Demo"
          layout="fill"
          objectFit="contain"
          className="rounded-lg z-10"
        />
      </div>
    </div>
  );
}
