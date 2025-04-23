// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
// If you don't want to install heroicons, you can replace these with any SVG icons
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up your auth logic here
    console.log({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/signin-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#262626] bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md text-white">
        <div className="flex flex-col items-start mb-6">
          <Image
            src="/veagle-logo.png"
            alt="VEAGLE Logo"
            width={56}
            height={56}
            // className="bg-white"
          />
          <h1 className="text-2xl font-bold">Welcome to VEAGLE</h1>
          <p className="text-gray-300 text-sm">The Eyes of the Game.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">
              Email <span className="text-yellow-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: veaglestadium@gmail.com"
              required
              className="mt-1 w-full bg-transparent border-b border-gray-600 focus:border-blue-500 focus:outline-none py-2 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Password <span className="text-yellow-400">*</span>
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 focus:outline-none py-2 pr-10 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
              >
                {/* {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )} */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition bg-[#737373] 
                ${
                  isValid
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-right">
          <span className="text-yellow-400">*</span> Indicates required fields
        </p>
      </div>
    </div>
  );
}
