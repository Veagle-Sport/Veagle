"use client";

import Link from "next/link";
import { useState } from "react";

interface Match {
  matchId: string;
  createdDate: string;
  startTime: string;
  endTime: string;
  status: "Pending" | "Completed" | "Cancelled";
}

export default function MatchTable() {
  const [filter, setFilter] = useState("All");

  const matches: Match[] = [
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Pending",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Completed",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Completed",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Completed",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Completed",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Cancelled",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Cancelled",
    },
    {
      matchId: "#278649",
      createdDate: "12/4/2025",
      startTime: "1:30 pm",
      endTime: "3:00 pm",
      status: "Completed",
    },
  ];

  const filteredMatches =
    filter === "All"
      ? matches
      : matches.filter((match) => match.status === filter);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="mb-4">
          <button
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-lg ${
              filter === "All"
                ? "border border-[#CBE249] text-[#CBE249]"
                : "border border-white text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`ml-2 px-4 py-2 rounded-lg ${
              filter === "Completed"
                ? "border border-[#CBE249] text-[#CBE249]"
                : "border border-white text-white"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`ml-2 px-4 py-2 rounded-lg ${
              filter === "Pending"
                ? "border border-[#CBE249] text-[#CBE249]"
                : "border border-white text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("Cancelled")}
            className={`ml-2 px-4 py-2 rounded-lg ${
              filter === "Cancelled"
                ? "border border-[#CBE249] text-[#CBE249]"
                : "border border-white text-white"
            }`}
          >
            Cancelled
          </button>
        </div>
        <div className="text-sm inline-block">
          <select className="bg-[#323232] text-white px-4 py-2 rounded-md">
            <option>Sort by: Date: New to Old</option>
            <option>Sort by: Date: Old to New</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border-[0.25px]">
        <thead className="border-[0.25px]">
          <tr className="bg-[#323232] text-gray-200">
            <th className="px-6 py-3 text-left">Match ID</th>
            <th className="px-6 py-3 text-left">Created Date</th>
            <th className="px-6 py-3 text-left">Start Time</th>
            <th className="px-6 py-3 text-left">End Time</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Analysis</th>
          </tr>
        </thead>
        <tbody>
          {filteredMatches.map((match, index) => (
            <tr key={index} className="hover:bg-[#2c2c2c]">
              <td className="px-6 py-4 border-r-[0.25px]">{match.matchId}</td>
              <td className="px-6 py-4 border-r-[0.25px]">
                {match.createdDate}
              </td>
              <td className="px-6 py-4 border-r-[0.25px]">{match.startTime}</td>
              <td className="px-6 py-4 border-r-[0.25px]">{match.endTime}</td>
              <td className={`px-6 py-4 border-r-[0.25px]`}>
                <span
                  className={`px-6 py-1 rounded-2xl ${
                    match.status === "Completed"
                      ? "bg-[#2CB94D26] text-[#2CB94D]"
                      : match.status === "Pending"
                      ? "bg-[#FFFFFF05] text-[#F2F2F2]"
                      : "bg-[#E600001A] text-[#E60000]"
                  }`}
                >
                  {match.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {match.status === "Completed" ? (
                  <Link
                    href="/analysis-details"
                    className="text-lime-400 hover:text-lime-500"
                  >
                    View details
                  </Link>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
