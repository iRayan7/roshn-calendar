import { NextRequest, NextResponse } from "next/server";
import { getAllMatches } from "@/lib/sportsdb";
import { getViewershipInfo } from "@/lib/viewership";
import { getDefaultTiers } from "@/lib/teams";
import { MatchWithViewership, Tier } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_TIERS = new Set(["S", "A", "B", "C"]);

function parseTiers(param: string | null): Record<string, Tier> | null {
  if (!param) return null;
  try {
    const parsed = JSON.parse(param);
    if (typeof parsed === "object" && parsed !== null) {
      const clean: Record<string, Tier> = {};
      for (const [k, v] of Object.entries(parsed)) {
        clean[k] = VALID_TIERS.has(v as string) ? (v as Tier) : "C";
      }
      return clean;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const includeRoshn = searchParams.get("roshn") !== "false";
  const includeYelo = searchParams.get("yelo") !== "false";
  const customTiers = parseTiers(searchParams.get("tiers"));

  const tiers: Record<string, Tier> = { ...getDefaultTiers(), ...customTiers };

  const matches = await getAllMatches(includeRoshn, includeYelo);

  const matchesWithViewership: MatchWithViewership[] = matches.map((m) => {
    const homeTier = tiers[m.homeTeamId] || "C";
    const awayTier = tiers[m.awayTeamId] || "C";
    const viewership = getViewershipInfo(homeTier, awayTier);
    return { ...m, viewership, homeTier, awayTier };
  });

  return NextResponse.json({
    matches: matchesWithViewership,
    totalCount: matchesWithViewership.length,
  });
}
