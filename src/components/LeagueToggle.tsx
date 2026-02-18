"use client";

interface LeagueToggleProps {
  leagues: { roshn: boolean; yelo: boolean };
  onToggle: (league: "roshn" | "yelo", enabled: boolean) => void;
}

export default function LeagueToggle({ leagues, onToggle }: LeagueToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onToggle("roshn", !leagues.roshn)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
          leagues.roshn
            ? "bg-green-50 border-green-300 text-green-800"
            : "bg-gray-50 border-gray-200 text-gray-400"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            leagues.roshn ? "bg-green-500" : "bg-gray-300"
          }`}
        />
        Roshn Saudi League
      </button>
      <button
        onClick={() => onToggle("yelo", !leagues.yelo)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
          leagues.yelo
            ? "bg-yellow-50 border-yellow-300 text-yellow-800"
            : "bg-gray-50 border-gray-200 text-gray-400"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            leagues.yelo ? "bg-yellow-500" : "bg-gray-300"
          }`}
        />
        Yelo League
      </button>
    </div>
  );
}
