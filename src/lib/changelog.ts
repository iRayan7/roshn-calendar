import { Match, ChangeLogEntry, ChangeType } from "./types";

interface MatchSnapshot {
  timestamp: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  homeScore: string | null;
  awayScore: string | null;
}

function snapshotMatch(m: Match): MatchSnapshot {
  return {
    timestamp: m.timestamp,
    date: m.date,
    time: m.time,
    venue: m.venue,
    status: m.status,
    homeScore: m.homeScore,
    awayScore: m.awayScore,
  };
}

function makeEntry(
  match: Match,
  type: ChangeType,
  description: string,
  oldValue?: string,
  newValue?: string
): ChangeLogEntry {
  return {
    id: `${match.id}-${type}-${Date.now()}`,
    matchId: match.id,
    type,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    round: match.round,
    league: match.league,
    leagueName: match.leagueName,
    description,
    oldValue,
    newValue,
    detectedAt: new Date().toISOString(),
  };
}

function formatTime(timestamp: string): string {
  try {
    const d = new Date(timestamp + "Z");
    return d.toLocaleString("en-SA", {
      timeZone: "Asia/Riyadh",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timestamp;
  }
}

export function diffMatches(
  oldMatches: Record<string, MatchSnapshot>,
  newMatches: Match[]
): ChangeLogEntry[] {
  const changes: ChangeLogEntry[] = [];
  const newIds = new Set<string>();

  for (const match of newMatches) {
    newIds.add(match.id);
    const old = oldMatches[match.id];

    if (!old) {
      changes.push(
        makeEntry(match, "match_added", `New match added: ${match.homeTeam} vs ${match.awayTeam}`)
      );
      continue;
    }

    if (old.timestamp !== match.timestamp) {
      changes.push(
        makeEntry(
          match,
          "time_changed",
          `${match.homeTeam} vs ${match.awayTeam} rescheduled`,
          formatTime(old.timestamp),
          formatTime(match.timestamp)
        )
      );
    }

    if (old.venue !== match.venue) {
      changes.push(
        makeEntry(
          match,
          "venue_changed",
          `${match.homeTeam} vs ${match.awayTeam} venue changed`,
          old.venue,
          match.venue
        )
      );
    }

    const finishedStatuses = new Set(["Match Finished", "FT", "AET", "AP"]);
    if (old.status !== match.status) {
      let desc = `${match.homeTeam} vs ${match.awayTeam} status: ${match.status}`;
      if (finishedStatuses.has(match.status) && match.homeScore !== null && match.awayScore !== null) {
        desc = `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} (${match.status})`;
      }
      changes.push(makeEntry(match, "status_changed", desc, old.status, match.status));
    }

    if (
      (old.homeScore !== match.homeScore || old.awayScore !== match.awayScore) &&
      old.status === match.status
    ) {
      const oldScore =
        old.homeScore !== null ? `${old.homeScore} - ${old.awayScore}` : "No score";
      const newScore =
        match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : "No score";
      changes.push(
        makeEntry(
          match,
          "score_updated",
          `${match.homeTeam} vs ${match.awayTeam} score updated`,
          oldScore,
          newScore
        )
      );
    }
  }

  return changes;
}

export function buildSnapshotMap(matches: Match[]): Record<string, MatchSnapshot> {
  const map: Record<string, MatchSnapshot> = {};
  for (const m of matches) {
    map[m.id] = snapshotMatch(m);
  }
  return map;
}
