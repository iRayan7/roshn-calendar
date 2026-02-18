"use client";

import { useEffect, useState, useCallback } from "react";
import { MatchWithViewership } from "@/lib/types";
import { useCalendarSettings } from "@/hooks/useCalendarSettings";
import MatchList from "@/components/MatchList";
import TeamTierConfig from "@/components/TeamTierConfig";
import LeagueToggle from "@/components/LeagueToggle";
import CalendarUrl from "@/components/CalendarUrl";

type Tab = "matches" | "tiers" | "calendar";

export default function Home() {
  const {
    settings,
    loaded,
    setTeamTier,
    setLeague,
    setMinLevel,
    resetToDefaults,
    getCalendarUrl,
  } = useCalendarSettings();

  const [matches, setMatches] = useState<MatchWithViewership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("matches");

  const fetchMatches = useCallback(async () => {
    if (!loaded) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (!settings.leagues.roshn) params.set("roshn", "false");
      if (!settings.leagues.yelo) params.set("yelo", "false");
      params.set("tiers", JSON.stringify(settings.tiers));

      const res = await fetch(`/api/matches?${params}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  }, [loaded, settings.leagues.roshn, settings.leagues.yelo, settings.tiers]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "matches", label: "Matches" },
    { id: "tiers", label: "Team Tiers" },
    { id: "calendar", label: "Calendar URL" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            SPL Match Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Roshn Saudi League &amp; Yelo League — with viewership tier system
          </p>

          <div className="mt-4">
            <LeagueToggle leagues={settings.leagues} onToggle={setLeague} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === "matches" && (
          <MatchList matches={matches} loading={loading} />
        )}

        {activeTab === "tiers" && (
          <TeamTierConfig
            tiers={settings.tiers}
            onSetTier={setTeamTier}
            onReset={resetToDefaults}
            leagues={settings.leagues}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarUrl
            url={getCalendarUrl()}
            minLevel={settings.minLevel}
            onMinLevelChange={setMinLevel}
          />
        )}
      </main>
    </div>
  );
}
