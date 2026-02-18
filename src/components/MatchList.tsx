"use client";

import { MatchWithViewership, ViewershipLevel } from "@/lib/types";
import MatchCard from "./MatchCard";
import { useState } from "react";

interface MatchListProps {
  matches: MatchWithViewership[];
  loading: boolean;
}

export default function MatchList({ matches, loading }: MatchListProps) {
  const [filterLevel, setFilterLevel] = useState<ViewershipLevel | 0>(0);
  const [showPast, setShowPast] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const now = new Date();

  const isFinished = (m: MatchWithViewership) => {
    const ended = ["Match Finished", "FT", "AET", "AP"];
    return ended.includes(m.status) || (m.homeScore !== null && m.awayScore !== null);
  };

  const filtered = matches.filter((m) => {
    if (filterLevel > 0 && m.viewership.level < filterLevel) return false;
    if (!showPast && (isFinished(m) || new Date(m.timestamp + "Z") < now))
      return false;
    return true;
  });

  const levels = [0, 5, 4, 3, 2, 1] as const;
  const levelLabels: Record<number, string> = {
    0: "All",
    5: "🔴🔥 Blockbuster",
    4: "🟠 High",
    3: "🟡 Notable",
    2: "🟢 Standard",
    1: "⚪ Low",
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setFilterLevel(level as ViewershipLevel | 0)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              filterLevel === level
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {levelLabels[level]}
          </button>
        ))}
        <label className="flex items-center gap-1.5 ml-auto text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showPast}
            onChange={(e) => setShowPast(e.target.checked)}
            className="rounded"
          />
          Show past
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No matches found for the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400 text-center">
        Showing {filtered.length} of {matches.length} matches
      </div>
    </div>
  );
}
