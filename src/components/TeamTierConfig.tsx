"use client";

import { Tier } from "@/lib/types";
import { ROSHN_TEAMS, YELO_TEAMS, TIER_ORDER, TIER_LABELS, TIER_COLORS } from "@/lib/teams";

interface TeamTierConfigProps {
  tiers: Record<string, Tier>;
  onSetTier: (teamId: string, tier: Tier) => void;
  onReset: () => void;
  leagues: { roshn: boolean; yelo: boolean };
}

function TierButton({
  tier,
  active,
  onClick,
}: {
  tier: Tier;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded text-xs font-bold transition-all ${
        active
          ? `${TIER_COLORS[tier]} text-white shadow-sm`
          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      }`}
    >
      {tier}
    </button>
  );
}

export default function TeamTierConfig({
  tiers,
  onSetTier,
  onReset,
  leagues,
}: TeamTierConfigProps) {
  const sections = [
    { label: "Roshn Saudi League", teams: ROSHN_TEAMS, show: leagues.roshn },
    { label: "Yelo League", teams: YELO_TEAMS, show: leagues.yelo },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Team Tiers</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Assign each team a popularity tier to determine viewership levels
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Reset defaults
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {TIER_ORDER.map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span
              className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center text-white ${TIER_COLORS[tier]}`}
            >
              {tier}
            </span>
            <span className="text-gray-500">{TIER_LABELS[tier]}</span>
          </div>
        ))}
      </div>

      {sections
        .filter((s) => s.show)
        .map((section) => (
          <div key={section.label} className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {section.label}
            </h4>
            <div className="grid gap-1.5">
              {section.teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-700 w-40 truncate">
                    {team.name}
                  </span>
                  <div className="flex gap-1">
                    {TIER_ORDER.map((tier) => (
                      <TierButton
                        key={tier}
                        tier={tier}
                        active={tiers[team.id] === tier}
                        onClick={() => onSetTier(team.id, tier)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
