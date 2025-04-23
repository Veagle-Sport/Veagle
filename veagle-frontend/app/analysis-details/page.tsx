// app/components/MatchAnalysis.tsx

import MatchStats from "../_components/MatchStats";
import PlayerStatsTable from "../_components/PlayerStatsTable";

export default function MatchAnalysis() {
  const playerStats = [
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 10,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 19,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 5,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 4,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 12,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 12,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 13,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 10,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 14,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 15,
      passes: 6,
      shots: 2,
      points: 25,
    },
    {
      playerId: "#57853258",
      role: "GK",
      maxSpeed: 20,
      passes: 6,
      shots: 2,
      points: 25,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-6">
        {/* Video Section */}
        <div className="flex-1">
          <div className="relative">
            <video className="w-full" controls>
              <source src="/Video1.mp4" type="video/mp4" />
              <source src="/Video1.wmv" type="video/x-ms-wmv" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Match Info Section */}
        <MatchStats />
      </div>

      <PlayerStatsTable stats={playerStats} />
    </div>
  );
}
