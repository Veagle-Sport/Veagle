// app/components/PlayerStatsTable.tsx
interface PlayerStats {
  playerId: string;
  role: string;
  maxSpeed: number;
  passes: number;
  shots: number;
  points: number;
}

interface PlayerStatsTableProps {
  stats: PlayerStats[];
}

export default function PlayerStatsTable({ stats }: PlayerStatsTableProps) {
  return (
    <div className="bg-[#262626] p-6 rounded-3xl text-white mt-6">
      <table className="min-w-full table-auto">
        <thead className="bg-[#323232]">
          <tr>
            <th className="px-6 py-3 text-left">Player ID</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Max Speed (km/h)</th>
            <th className="px-6 py-3 text-left">Passes</th>
            <th className="px-6 py-3 text-left">Shots</th>
            <th className="px-6 py-3 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((player, index) => (
            <tr key={index} className="hover:bg-gray-800">
              <td className="px-6 py-4">{player.playerId}</td>
              <td className="px-6 py-4">{player.role}</td>
              <td className="px-6 py-4">{player.maxSpeed}</td>
              <td className="px-6 py-4">{player.passes}</td>
              <td className="px-6 py-4">{player.shots}</td>
              <td className="px-6 py-4">{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
