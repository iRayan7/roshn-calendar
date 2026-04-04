"use client";

import { useState } from "react";
import { ChangeLogEntry, ChangeType } from "@/lib/types";

const typeConfig: Record<ChangeType, { icon: string; color: string; bg: string }> = {
  time_changed: { icon: "🕐", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  venue_changed: { icon: "📍", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  status_changed: { icon: "📋", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  score_updated: { icon: "⚽", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  match_added: { icon: "➕", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  match_removed: { icon: "➖", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const typeLabels: Record<ChangeType, string> = {
  time_changed: "Rescheduled",
  venue_changed: "Venue Change",
  status_changed: "Status Update",
  score_updated: "Score Update",
  match_added: "New Match",
  match_removed: "Removed",
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-SA", { month: "short", day: "numeric" });
}

function LogEntry({ entry }: { entry: ChangeLogEntry }) {
  const config = typeConfig[entry.type];

  return (
    <div className={`border rounded-lg p-3 ${config.bg}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{config.icon}</span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
              {typeLabels[entry.type]}
            </span>
            <span className="text-xs text-gray-400">
              {entry.leagueName} — Round {entry.round}
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-gray-900 leading-snug">
            {entry.description}
          </p>

          {entry.oldValue && entry.newValue && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
              <span className="line-through">{entry.oldValue}</span>
              <span>→</span>
              <span className="font-medium text-gray-700">{entry.newValue}</span>
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
          {formatRelativeTime(entry.detectedAt)}
        </span>
      </div>
    </div>
  );
}

interface ChangeLogProps {
  logs: ChangeLogEntry[];
  loading: boolean;
  onClear: () => void;
}

type FilterType = "all" | ChangeType;

export default function ChangeLog({ logs, loading, onClear }: ChangeLogProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  const filterCounts: Record<string, number> = { all: logs.length };
  for (const l of logs) {
    filterCounts[l.type] = (filterCounts[l.type] || 0) + 1;
  }

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "time_changed", label: "Rescheduled" },
    { id: "status_changed", label: "Status" },
    { id: "score_updated", label: "Scores" },
    { id: "venue_changed", label: "Venue" },
    { id: "match_added", label: "New" },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Schedule Changes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Updates detected each time you visit. Changes persist locally.
          </p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {logs.length > 0 && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {filters.map((f) => {
            const count = filterCounts[f.id] || 0;
            if (f.id !== "all" && count === 0) return null;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === f.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm text-gray-500">
            {logs.length === 0
              ? "No changes detected yet. Updates will appear here when match schedules change."
              : "No changes match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <LogEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
