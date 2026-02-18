"use client";

import { useState } from "react";
import { ViewershipLevel } from "@/lib/types";

interface CalendarUrlProps {
  url: string;
  minLevel: ViewershipLevel;
  onMinLevelChange: (level: ViewershipLevel) => void;
}

export default function CalendarUrl({
  url,
  minLevel,
  onMinLevelChange,
}: CalendarUrlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const levels: ViewershipLevel[] = [1, 2, 3, 4, 5];
  const levelLabels: Record<ViewershipLevel, string> = {
    1: "All matches",
    2: "Standard+ (2+)",
    3: "Notable+ (3+)",
    4: "High+ (4+)",
    5: "Blockbuster only (5)",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Minimum Viewership Level
        </h3>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onMinLevelChange(level)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                minLevel === level
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {levelLabels[level]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Calendar Subscription URL
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600 font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              copied
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          How to subscribe in Google Calendar
        </h4>
        <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
          <li>Copy the URL above</li>
          <li>
            Open{" "}
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Calendar
            </a>
          </li>
          <li>Click the &quot;+&quot; next to &quot;Other calendars&quot; in the sidebar</li>
          <li>Select &quot;From URL&quot;</li>
          <li>Paste the URL and click &quot;Add calendar&quot;</li>
          <li>Google Calendar will auto-refresh every few hours</li>
        </ol>
      </div>
    </div>
  );
}
