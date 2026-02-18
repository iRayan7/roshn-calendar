import { Tier, ViewershipLevel, ViewershipInfo } from "./types";

const TIER_SCORES: Record<Tier, number> = {
  S: 4,
  A: 3,
  B: 2,
  C: 1,
};

export function calculateViewershipLevel(
  homeTier: Tier,
  awayTier: Tier
): ViewershipLevel {
  const combined = TIER_SCORES[homeTier] + TIER_SCORES[awayTier];
  // Combined range: 2 (C+C) to 8 (S+S)
  if (combined >= 7) return 5;  // S+S, S+A
  if (combined >= 6) return 4;  // A+A, S+B
  if (combined >= 4) return 3;  // S+C, A+B, B+B
  if (combined >= 3) return 2;  // A+C, B+C
  return 1;                     // C+C
}

const VIEWERSHIP_INFO: Record<ViewershipLevel, Omit<ViewershipInfo, "level">> = {
  5: {
    label: "Blockbuster",
    emoji: "🔴🔥",
    prefix: "🔴🔥 BLOCKBUSTER:",
    color: "#DC2626",
    alarms: [120, 60, 30],
  },
  4: {
    label: "High",
    emoji: "🟠",
    prefix: "🟠 HIGH:",
    color: "#EA580C",
    alarms: [60, 30],
  },
  3: {
    label: "Notable",
    emoji: "🟡",
    prefix: "🟡 NOTABLE:",
    color: "#CA8A04",
    alarms: [30],
  },
  2: {
    label: "Standard",
    emoji: "🟢",
    prefix: "🟢",
    color: "#16A34A",
    alarms: [15],
  },
  1: {
    label: "Low",
    emoji: "⚪",
    prefix: "",
    color: "#9CA3AF",
    alarms: [],
  },
};

export function getViewershipInfo(
  homeTier: Tier,
  awayTier: Tier,
  alarmOverrides?: Record<ViewershipLevel, number[]>
): ViewershipInfo {
  const level = calculateViewershipLevel(homeTier, awayTier);
  const info = VIEWERSHIP_INFO[level];
  return {
    level,
    ...info,
    alarms: alarmOverrides?.[level] ?? info.alarms,
  };
}

export function formatMatchTitle(
  homeTeam: string,
  awayTeam: string,
  viewership: ViewershipInfo
): string {
  const matchup = `${homeTeam} vs ${awayTeam}`;
  if (viewership.prefix) {
    return `${viewership.prefix} ${matchup}`;
  }
  return matchup;
}
