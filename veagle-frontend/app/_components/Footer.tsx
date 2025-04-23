// app/components/Footer.tsx
"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  // FaXTwitter
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#262626] text-white border-t-[1px]">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Logo */}
        <div className="text-2xl font-bold text-lime-400">VEAGLE</div>

        {/* Navigation Links */}
        <nav className="flex space-x-8">
          <Link href="/resources" className="hover:text-lime-400">
            Resources
          </Link>
          <Link href="/help-center" className="hover:text-lime-400">
            Help Center
          </Link>
          <Link href="/contact" className="hover:text-lime-400">
            Contact us
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <FaFacebookF className="text-lime-400 w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <FaInstagram className="text-lime-400 w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            aria-label="X"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            {/* <FaXTwitter className="text-lime-400 w-4 h-4" /> */}
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#323232] py-4">
        <p className="text-center text-sm text-gray-400">
          © {year} VEAGLE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
