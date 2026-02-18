"use client";

import { MatchWithViewership } from "@/lib/types";
import ViewershipBadge from "./ViewershipBadge";

export default function MatchCard({ match }: { match: MatchWithViewership }) {
  const matchDate = new Date(match.timestamp + "Z");
  const isPast = matchDate < new Date();

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        isPast ? "opacity-60 bg-gray-50" : "bg-white hover:shadow-md"
      }`}
      style={{ borderLeftColor: match.viewership.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {match.leagueName} &middot; Round {match.round}
        </span>
        <ViewershipBadge viewership={match.viewership} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold text-sm">{match.homeTeam}</span>
            {match.homeTeamBadge && (
              <img
                src={match.homeTeamBadge}
                alt={match.homeTeam}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
          <span className="text-[10px] text-gray-400 uppercase">{match.homeTier}</span>
        </div>

        <div className="text-center px-3">
          {isPast && match.homeScore !== null ? (
            <div className="text-lg font-bold">
              {match.homeScore} - {match.awayScore}
            </div>
          ) : (
            <div className="text-xs font-medium text-gray-500">VS</div>
          )}
          <div className="text-[11px] text-gray-400 mt-1">
            {matchDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-[11px] text-gray-400">
            {matchDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {match.awayTeamBadge && (
              <img
                src={match.awayTeamBadge}
                alt={match.awayTeam}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-semibold text-sm">{match.awayTeam}</span>
          </div>
          <span className="text-[10px] text-gray-400 uppercase">{match.awayTier}</span>
        </div>
      </div>

      {match.venue !== "TBD" && (
        <div className="text-[11px] text-gray-400 mt-2 text-center">
          📍 {match.venue}
        </div>
      )}
    </div>
  );
}
