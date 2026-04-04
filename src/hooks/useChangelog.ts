"use client";

import { useState, useCallback, useEffect } from "react";
import { Match, ChangeLogEntry } from "@/lib/types";
import { diffMatches, buildSnapshotMap } from "@/lib/changelog";

const SNAPSHOT_KEY = "spl-match-snapshot";
const CHANGELOG_KEY = "spl-changelog";
const MAX_LOG_ENTRIES = 500;

export function useChangelog() {
  const [logs, setLogs] = useState<ChangeLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHANGELOG_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const processMatches = useCallback(
    (matches: Match[]) => {
      if (!loaded || matches.length === 0) return;

      try {
        const storedSnapshot = localStorage.getItem(SNAPSHOT_KEY);
        const oldSnapshot = storedSnapshot ? JSON.parse(storedSnapshot) : null;

        const newSnapshot = buildSnapshotMap(matches);
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(newSnapshot));

        if (!oldSnapshot) return;

        const changes = diffMatches(oldSnapshot, matches);
        if (changes.length === 0) return;

        setLogs((prev) => {
          const updated = [...changes, ...prev].slice(0, MAX_LOG_ENTRIES);
          localStorage.setItem(CHANGELOG_KEY, JSON.stringify(updated));
          return updated;
        });
      } catch {
        // ignore storage errors
      }
    },
    [loaded]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(CHANGELOG_KEY);
  }, []);

  return { logs, loaded, processMatches, clearLogs };
}
