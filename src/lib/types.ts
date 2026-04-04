export type Tier = "S" | "A" | "B" | "C";

export type ViewershipLevel = 1 | 2 | 3 | 4 | 5;

export interface ViewershipInfo {
  level: ViewershipLevel;
  label: string;
  emoji: string;
  prefix: string;
  color: string;
  alarms: number[]; // minutes before match
}

export interface Team {
  id: string;
  name: string;
  badge: string;
  league: "roshn" | "yelo";
  defaultTier: Tier;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamBadge: string;
  awayTeamBadge: string;
  timestamp: string; // ISO string
  date: string;
  time: string;
  venue: string;
  round: string;
  league: "roshn" | "yelo";
  leagueName: string;
  status: string;
  homeScore: string | null;
  awayScore: string | null;
}

export interface MatchWithViewership extends Match {
  viewership: ViewershipInfo;
  homeTier: Tier;
  awayTier: Tier;
}

export interface CalendarSettings {
  tiers: Record<string, Tier>;
  leagues: {
    roshn: boolean;
    yelo: boolean;
  };
  minLevel: ViewershipLevel;
  alarmOverrides: Record<ViewershipLevel, number[]>;
}

export type ChangeType =
  | "time_changed"
  | "venue_changed"
  | "status_changed"
  | "score_updated"
  | "match_added"
  | "match_removed";

export interface ChangeLogEntry {
  id: string;
  matchId: string;
  type: ChangeType;
  homeTeam: string;
  awayTeam: string;
  round: string;
  league: "roshn" | "yelo";
  leagueName: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  detectedAt: string;
}

export interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strTimestamp: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
  intRound: string;
  strLeague: string;
  strStatus: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strPostponed: string;
}
