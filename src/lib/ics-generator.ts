import { MatchWithViewership } from "./types";
import { formatMatchTitle } from "./viewership";

function escapeICS(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function formatDate(timestamp: string): string {
  // timestamp is like "2026-02-15T19:00:00" (UTC)
  return timestamp.replace(/[-:]/g, "").replace("T", "T").split(".")[0] + "Z";
}

function addHours(timestamp: string, hours: number): string {
  const d = new Date(timestamp + "Z");
  d.setHours(d.getHours() + hours);
  return d.toISOString().replace(/[-:]/g, "").replace(".000", "").replace("T", "T");
}

function generateAlarms(match: MatchWithViewership): string {
  return match.viewership.alarms
    .map(
      (minutes) => `BEGIN:VALARM\r
TRIGGER:-PT${minutes}M\r
ACTION:DISPLAY\r
DESCRIPTION:${escapeICS(match.viewership.label)} match in ${minutes >= 60 ? `${minutes / 60} hour${minutes > 60 ? "s" : ""}` : `${minutes} minutes`}!\r
END:VALARM`
    )
    .join("\r\n");
}

function priorityFromLevel(level: number): number {
  // ICS priority: 1 = highest, 9 = lowest
  return Math.max(1, 6 - level);
}

function generateEvent(match: MatchWithViewership): string {
  const title = formatMatchTitle(match.homeTeam, match.awayTeam, match.viewership);
  const dtstart = formatDate(match.timestamp);
  const dtend = addHours(match.timestamp, 2);
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  const descriptionParts = [
    `${match.leagueName} - Round ${match.round}`,
    `⭐ VIEWERSHIP: ${match.viewership.label.toUpperCase()} (${match.viewership.level}/5)`,
  ];
  if (match.viewership.level >= 4) {
    descriptionParts.push("Expect peak viewership");
  }
  if (match.venue !== "TBD") {
    descriptionParts.push(`Venue: ${match.venue}`);
  }

  const alarms = generateAlarms(match);

  let event = `BEGIN:VEVENT\r
UID:roshn-${match.id}@splcalendar\r
DTSTAMP:${now}\r
DTSTART:${dtstart}\r
DTEND:${dtend}\r
SUMMARY:${escapeICS(title)}\r
DESCRIPTION:${descriptionParts.map(escapeICS).join("\\n")}\r
CATEGORIES:${match.viewership.label.toUpperCase()}\r
PRIORITY:${priorityFromLevel(match.viewership.level)}\r
STATUS:CONFIRMED\r
`;

  if (match.venue !== "TBD") {
    event += `LOCATION:${escapeICS(match.venue)}\r\n`;
  }

  if (alarms) {
    event += alarms + "\r\n";
  }

  event += "END:VEVENT";
  return event;
}

export function generateICS(matches: MatchWithViewership[]): string {
  const events = matches.map(generateEvent).join("\r\n");

  return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//SPL Calendar//Roshn & Yelo//EN\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
X-WR-CALNAME:SPL Matches\r
X-WR-TIMEZONE:Asia/Riyadh\r
REFRESH-INTERVAL;VALUE=DURATION:PT1H\r
X-PUBLISHED-TTL:PT1H\r
${events}\r
END:VCALENDAR`;
}
