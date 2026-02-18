"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarSettings, Tier, ViewershipLevel } from "@/lib/types";
import { getDefaultTiers, TIER_ORDER } from "@/lib/teams";

const STORAGE_KEY = "spl-calendar-settings";
const VALID_TIERS = new Set<string>(TIER_ORDER);

function sanitizeTiers(tiers: Record<string, string>): Record<string, Tier> {
  const clean: Record<string, Tier> = {};
  for (const [id, tier] of Object.entries(tiers)) {
    clean[id] = VALID_TIERS.has(tier) ? (tier as Tier) : "C";
  }
  return clean;
}

const DEFAULT_SETTINGS: CalendarSettings = {
  tiers: getDefaultTiers(),
  leagues: { roshn: true, yelo: true },
  minLevel: 1 as ViewershipLevel,
  alarmOverrides: {
    5: [120, 60, 30],
    4: [60, 30],
    3: [30],
    2: [15],
    1: [],
  },
};

export function useCalendarSettings() {
  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          leagues: { ...DEFAULT_SETTINGS.leagues, ...parsed.leagues },
          tiers: sanitizeTiers({ ...DEFAULT_SETTINGS.tiers, ...parsed.tiers }),
        });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, loaded]);

  const setTeamTier = useCallback((teamId: string, tier: Tier) => {
    setSettings((prev) => ({
      ...prev,
      tiers: { ...prev.tiers, [teamId]: tier },
    }));
  }, []);

  const setLeague = useCallback(
    (league: "roshn" | "yelo", enabled: boolean) => {
      setSettings((prev) => ({
        ...prev,
        leagues: { ...prev.leagues, [league]: enabled },
      }));
    },
    []
  );

  const setMinLevel = useCallback((level: ViewershipLevel) => {
    setSettings((prev) => ({ ...prev, minLevel: level }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getCalendarUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const base = `${window.location.origin}/api/calendar`;
    const params = new URLSearchParams();

    if (!settings.leagues.roshn) params.set("roshn", "false");
    if (!settings.leagues.yelo) params.set("yelo", "false");
    if (settings.minLevel > 1) params.set("minLevel", String(settings.minLevel));

    // Only include non-default tiers in the URL to keep it shorter
    const defaults = getDefaultTiers();
    const customTiers: Record<string, Tier> = {};
    let hasCustom = false;
    for (const [id, tier] of Object.entries(settings.tiers)) {
      if (defaults[id] !== tier) {
        customTiers[id] = tier;
        hasCustom = true;
      }
    }
    if (hasCustom) {
      params.set("tiers", JSON.stringify(customTiers));
    }

    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [settings]);

  return {
    settings,
    loaded,
    setTeamTier,
    setLeague,
    setMinLevel,
    resetToDefaults,
    getCalendarUrl,
  };
}
