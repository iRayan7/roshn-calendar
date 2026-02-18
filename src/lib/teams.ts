import { Team, Tier } from "./types";

export const ROSHN_LEAGUE_ID = "4668";
export const YELO_LEAGUE_ID = "5627";
export const CURRENT_SEASON = "2025-2026";

export const ROSHN_TEAMS: Team[] = [
  { id: "136013", name: "Al-Hilal", badge: "", league: "roshn", defaultTier: "S" },
  { id: "136022", name: "Al-Nassr", badge: "", league: "roshn", defaultTier: "S" },
  { id: "136018", name: "Al-Ittihad", badge: "", league: "roshn", defaultTier: "A" },
  { id: "137721", name: "Al-Ahli", badge: "", league: "roshn", defaultTier: "A" },
  { id: "136020", name: "Al-Shabab", badge: "", league: "roshn", defaultTier: "B" },
  { id: "136017", name: "Al-Ettifaq", badge: "", league: "roshn", defaultTier: "B" },
  { id: "136015", name: "Al-Qadsiah", badge: "", league: "roshn", defaultTier: "B" },
  { id: "136012", name: "Al-Taawoun", badge: "", league: "roshn", defaultTier: "C" },
  { id: "136011", name: "Al-Fateh", badge: "", league: "roshn", defaultTier: "C" },
  { id: "136014", name: "Al-Fayha", badge: "", league: "roshn", defaultTier: "C" },
  { id: "136200", name: "Al-Hazem", badge: "", league: "roshn", defaultTier: "C" },
  { id: "139080", name: "Al-Khaleej", badge: "", league: "roshn", defaultTier: "C" },
  { id: "149112", name: "Al-Kholood", badge: "", league: "roshn", defaultTier: "C" },
  { id: "147444", name: "Al-Okhdood", badge: "", league: "roshn", defaultTier: "C" },
  { id: "147445", name: "Al-Riyadh", badge: "", league: "roshn", defaultTier: "C" },
  { id: "137852", name: "Damac", badge: "", league: "roshn", defaultTier: "C" },
  { id: "150638", name: "Al-Najma Unaizah", badge: "", league: "roshn", defaultTier: "C" },
  { id: "150637", name: "Neom", badge: "", league: "roshn", defaultTier: "C" },
];

export const YELO_TEAMS: Team[] = [
  { id: "137855", name: "Abha", badge: "", league: "yelo", defaultTier: "C" },
  { id: "137854", name: "Al-Adalah", badge: "", league: "yelo", defaultTier: "C" },
  { id: "152918", name: "Al-Anwar", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150639", name: "Al-Arabi Al-Saudi", badge: "", league: "yelo", defaultTier: "C" },
  { id: "136019", name: "Al-Batin", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150640", name: "Al-Bukiryah", badge: "", league: "yelo", defaultTier: "C" },
  { id: "152917", name: "Al-Diriyah", badge: "", league: "yelo", defaultTier: "C" },
  { id: "136021", name: "Al-Faisaly", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150091", name: "Al-Jabalain", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150644", name: "Al-Jandal", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150645", name: "Al-Jubail", badge: "", league: "yelo", defaultTier: "C" },
  { id: "149111", name: "Al-Orobah", badge: "", league: "yelo", defaultTier: "C" },
  { id: "136016", name: "Al-Raed", badge: "", league: "yelo", defaultTier: "C" },
  { id: "143173", name: "Al-Tai", badge: "", league: "yelo", defaultTier: "C" },
  { id: "152473", name: "Al-Ula", badge: "", league: "yelo", defaultTier: "C" },
  { id: "136199", name: "Al-Wehda", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150643", name: "Al-Zulfi", badge: "", league: "yelo", defaultTier: "C" },
  { id: "150641", name: "Jeddah Club", badge: "", league: "yelo", defaultTier: "C" },
];

export const ALL_TEAMS: Team[] = [...ROSHN_TEAMS, ...YELO_TEAMS];

export function getDefaultTiers(): Record<string, Tier> {
  const tiers: Record<string, Tier> = {};
  for (const team of ALL_TEAMS) {
    tiers[team.id] = team.defaultTier;
  }
  return tiers;
}

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find((t) => t.id === id);
}

export const TIER_ORDER: Tier[] = ["S", "A", "B", "C"];

export const TIER_LABELS: Record<Tier, string> = {
  S: "Mega",
  A: "High",
  B: "Medium",
  C: "Low",
};

export const TIER_COLORS: Record<Tier, string> = {
  S: "bg-red-500",
  A: "bg-orange-500",
  B: "bg-yellow-500",
  C: "bg-gray-400",
};
