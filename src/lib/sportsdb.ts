import { Match, SportsDBEvent } from "./types";
import { ROSHN_LEAGUE_ID, YELO_LEAGUE_ID, CURRENT_SEASON } from "./teams";

const API_KEY = process.env.THESPORTSDB_API_KEY || "3";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

function mapLeague(leagueId: string): "roshn" | "yelo" {
  return leagueId === YELO_LEAGUE_ID ? "yelo" : "roshn";
}

function eventToMatch(event: SportsDBEvent, league: "roshn" | "yelo"): Match {
  return {
    id: event.idEvent,
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    homeTeamId: event.idHomeTeam,
    awayTeamId: event.idAwayTeam,
    homeTeamBadge: event.strHomeTeamBadge || "",
    awayTeamBadge: event.strAwayTeamBadge || "",
    timestamp: event.strTimestamp,
    date: event.dateEvent,
    time: event.strTime,
    venue: event.strVenue || "TBD",
    round: event.intRound,
    league,
    leagueName: league === "roshn" ? "Roshn Saudi League" : "Yelo League",
    status: event.strStatus,
    homeScore: event.intHomeScore,
    awayScore: event.intAwayScore,
  };
}

async function fetchEvents(url: string): Promise<SportsDBEvent[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events || [];
}

async function getRoundMatches(
  leagueId: string,
  round: number
): Promise<SportsDBEvent[]> {
  return fetchEvents(
    `${BASE_URL}/eventsround.php?id=${leagueId}&r=${round}&s=${CURRENT_SEASON}`
  );
}

async function getSeasonEvents(leagueId: string): Promise<SportsDBEvent[]> {
  return fetchEvents(
    `${BASE_URL}/eventsseason.php?id=${leagueId}&s=${CURRENT_SEASON}`
  );
}

function deduplicateMatches(matches: Match[]): Match[] {
  const seen = new Set<string>();
  const unique: Match[] = [];
  for (const match of matches) {
    if (!seen.has(match.id)) {
      seen.add(match.id);
      unique.push(match);
    }
  }
  return unique;
}

async function getLeagueMatches(leagueId: string): Promise<Match[]> {
  const league = mapLeague(leagueId);

  // First get season events to determine current round
  const seasonEvents = await getSeasonEvents(leagueId);
  let currentRound = 1;
  if (seasonEvents.length > 0) {
    const rounds = seasonEvents.map((e) => parseInt(e.intRound)).filter(Boolean);
    currentRound = Math.max(...rounds);
  }

  // Fetch rounds: from 2 before current to end of season (34 rounds)
  // Batch in groups of 5 to avoid hammering the API
  const startRound = Math.max(1, currentRound - 2);
  const endRound = 34;
  const allEvents: SportsDBEvent[] = [...seasonEvents];

  for (let batchStart = startRound; batchStart <= endRound; batchStart += 5) {
    const batchEnd = Math.min(batchStart + 4, endRound);
    const batchPromises: Promise<SportsDBEvent[]>[] = [];
    for (let r = batchStart; r <= batchEnd; r++) {
      batchPromises.push(getRoundMatches(leagueId, r));
    }
    const batchResults = await Promise.all(batchPromises);
    allEvents.push(...batchResults.flat());
  }

  const matches = allEvents.map((e) => eventToMatch(e, league));
  return deduplicateMatches(matches);
}

export async function getAllMatches(
  includeRoshn: boolean,
  includeYelo: boolean
): Promise<Match[]> {
  const promises: Promise<Match[]>[] = [];

  if (includeRoshn) promises.push(getLeagueMatches(ROSHN_LEAGUE_ID));
  if (includeYelo) promises.push(getLeagueMatches(YELO_LEAGUE_ID));

  const results = await Promise.all(promises);
  const allMatches = deduplicateMatches(results.flat());
  allMatches.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return allMatches;
}

export async function getUpcomingMatches(
  includeRoshn: boolean,
  includeYelo: boolean
): Promise<Match[]> {
  const all = await getAllMatches(includeRoshn, includeYelo);
  const now = new Date().toISOString().replace("Z", "");
  return all.filter((m) => m.timestamp >= now || m.status === "Not Started");
}
