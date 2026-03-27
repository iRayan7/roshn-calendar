import { NextRequest, NextResponse } from "next/server";
import { getAllMatches } from "@/lib/sportsdb";
import { getViewershipInfo } from "@/lib/viewership";
import { generateICS } from "@/lib/ics-generator";
import { getDefaultTiers } from "@/lib/teams";
import { CalendarSettings, MatchWithViewership, Tier, ViewershipLevel } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_TIERS = new Set(["S", "A", "B", "C"]);

function parseTiers(param: string | null): Record<string, Tier> | null {
  if (!param) return null;
  try {
    const parsed = JSON.parse(param);
    if (typeof parsed === "object" && parsed !== null) {
      // Filter out any invalid tier values (e.g. old "D" values)
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
  const minLevel = Math.max(1, Math.min(5, parseInt(searchParams.get("minLevel") || "1"))) as ViewershipLevel;

  const tiers: Record<string, Tier> = { ...getDefaultTiers(), ...customTiers };

  const matches = await getAllMatches(includeRoshn, includeYelo);

  const matchesWithViewership: MatchWithViewership[] = matches.map((m) => {
    const homeTier = tiers[m.homeTeamId] || "C";
    const awayTier = tiers[m.awayTeamId] || "C";
    const viewership = getViewershipInfo(homeTier, awayTier);
    return { ...m, viewership, homeTier, awayTier };
  });

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const filtered = matchesWithViewership.filter((m) => {
    if (m.viewership.level < minLevel) return false;
    const matchDate = new Date(m.timestamp + "Z");
    return matchDate >= oneWeekAgo;
  });

  const ics = generateICS(filtered);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="spl-matches.ics"',
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
      "X-Event-Count": String(filtered.length),
      "X-Total-Matches": String(matches.length),
    },
  });
}
