import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import { regionToCountry } from "./countryFlags";
import { directSelect, directInsert, directUpdate } from "./supabaseDirectFetch";

// useUserData — owns ALL behavioural user data.
// Loads once when userId is available, caches, exposes refresh + mutations.
// ProfilePanel and any other component reads from here — no component-level queries.

export interface UserStats {
  chats: number;
  regions: number;
  guides: number;
  wines: number;
}

export interface UserPreferences {
  preferred_types: string[];
}

export interface UserGoal {
  id: string;
  title: string;
  target_count: number;
  current_count: number;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  wine_name: string;
  producer: string | null;
  vintage: string | null;
  region: string | null;
  grapes: string | null;
  style: string | null;
  notes: string | null;
  personal_rating: number | null;
  price_estimate: string | null;
  date_tasted: string | null;
}

export interface WishlistEntry {
  id: string;
  wine_name: string;
  producer: string | null;
  region: string | null;
  grapes: string | null;
  style: string | null;
  price_estimate: string | null;
  why: string | null;
  source: string | null;
  created_at: string;
  vintage: string | null;
  nose: string | null;
  palate: string | null;
  texture: string | null;
  breathing: string | null;
  drink_from: number | null;
  drink_peak_start: number | null;
  drink_peak_end: number | null;
  drink_until: number | null;
  sommy_notes: string | null;
}

interface UserDataContextType {
  stats: UserStats;
  preferences: UserPreferences;
  recentTopics: string[];      // last 3 questions asked to Sommy
  completedGuideIds: string[]; // guide IDs the user has read
  goals: UserGoal[];
  journal: JournalEntry[];     // last 5 wines logged
  wishlist: WishlistEntry[];
  countriesExplored: string[];  // unique country names from journal regions
  dataLoading: boolean;
  // Mutations
  savePreferences: (level: string, types: string[]) => Promise<void>;
  refresh: () => void;
  silentRefresh: () => void;   // re-fetch without showing loading state
}

const DEFAULT_STATS: UserStats = { chats: 0, regions: 0, guides: 0, wines: 0 };
const DEFAULT_PREFS: UserPreferences = { preferred_types: [] };

const UserDataContext = createContext<UserDataContextType | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { userId, refreshProfile } = useAuth();
  const [stats, setStats]                     = useState<UserStats>(DEFAULT_STATS);
  const [preferences, setPreferences]         = useState<UserPreferences>(DEFAULT_PREFS);
  const [recentTopics, setRecentTopics]       = useState<string[]>([]);
  const [completedGuideIds, setCompletedGuideIds] = useState<string[]>([]);
  const [goals, setGoals]                     = useState<UserGoal[]>([]);
  const [journal, setJournal]                 = useState<JournalEntry[]>([]);
  const [wishlist, setWishlist]               = useState<WishlistEntry[]>([]);
  const [allRegions, setAllRegions]           = useState<string[]>([]);
  const [dataLoading, setDataLoading]         = useState(false);

  // Prevent re-fetching for the same user
  const loadedForRef = useRef<string | null>(null);

  const load = useCallback(async (uid: string, silent = false) => {
    if (!silent) setDataLoading(true);
    try {
      // All queries via raw fetch — bypasses supabase-js auth lock entirely.
      const [chatRows, regionRows, guideRows, wineIdRows, topicRows, prefRows, goalRows, journalRows, wishlistRows, regionOnlyRows] =
        await Promise.all([
          directSelect("sommy_conversations", `select=user_id&user_id=eq.${uid}&role=eq.user`),
          directSelect("user_activity", `select=user_id&user_id=eq.${uid}&activity_type=eq.region_view`),
          directSelect("user_activity", `select=item_id&user_id=eq.${uid}&activity_type=eq.guide_read`),
          directSelect("wine_journal", `select=id&user_id=eq.${uid}`),
          directSelect("sommy_conversations", `select=content&user_id=eq.${uid}&role=eq.user&order=created_at.desc&limit=3`),
          directSelect("user_preferences", `select=preferred_types&user_id=eq.${uid}`),
          directSelect("user_goals", `select=id,title,target_count,current_count,completed&user_id=eq.${uid}&completed=eq.false&order=created_at.desc&limit=3`),
          directSelect("wine_journal", `select=id,wine_name,producer,vintage,region,grapes,style,notes,personal_rating,price_estimate,date_tasted&user_id=eq.${uid}&order=date_tasted.desc.nullslast&limit=8`),
          directSelect("wine_wishlist", `select=id,wine_name,producer,region,grapes,style,price_estimate,why,source,created_at,vintage,nose,palate,texture,breathing,drink_from,drink_peak_start,drink_peak_end,drink_until,sommy_notes&user_id=eq.${uid}&order=created_at.desc`),
          directSelect("wine_journal", `select=region&user_id=eq.${uid}`),
        ]);

      setStats({
        chats:   chatRows.length,
        regions: regionRows.length,
        guides:  guideRows.length,
        wines:   wineIdRows.length,
      });

      setCompletedGuideIds(
        guideRows.map((r: any) => r.item_id as string).filter(Boolean)
      );

      setRecentTopics(
        topicRows.map((t: any) => t.content as string)
      );

      setPreferences({
        preferred_types: prefRows[0]?.preferred_types ?? [],
      });

      setGoals(goalRows as UserGoal[]);
      setJournal(journalRows as JournalEntry[]);
      setWishlist(wishlistRows as WishlistEntry[]);
      setAllRegions(
        regionOnlyRows.map((r: any) => r.region as string).filter(Boolean)
      );

    } catch (e) {
      console.error("UserData load error:", e);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Load when userId becomes available or changes.
  // userId is a stable primitive string — will NOT fire on every auth token refresh.
  useEffect(() => {
    if (!userId) {
      // User signed out — reset everything
      setStats(DEFAULT_STATS);
      setPreferences(DEFAULT_PREFS);
      setRecentTopics([]);
      setCompletedGuideIds([]);
      setGoals([]);
      setJournal([]);
      setWishlist([]);
      setAllRegions([]);
      loadedForRef.current = null;
      return;
    }
    if (loadedForRef.current === userId) return; // already loaded for this user
    loadedForRef.current = userId;
    load(userId);
  }, [userId, load]);

  const refresh = useCallback(() => {
    if (!userId) return;
    loadedForRef.current = null;
    load(userId);
  }, [userId, load]);

  // Silent refresh: picks up latest data without triggering the loading skeleton
  const silentRefresh = useCallback(() => {
    if (!userId) return;
    loadedForRef.current = null;
    load(userId, true); // silent = true, no loading spinner
  }, [userId, load]);

  const savePreferences = useCallback(async (level: string, types: string[]) => {
    if (!userId) return;
    try {
      await Promise.all([
        directUpdate("user_profiles", userId, { experience_level: level }),
        directInsert("user_preferences", { user_id: userId, preferred_types: types }),
      ]);
    } catch {
      // upsert may fail if row exists — try update instead
      try {
        await directUpdate("user_preferences", userId, { preferred_types: types });
      } catch { /* ignore */ }
    }
    await refreshProfile();
    setPreferences({ preferred_types: types });
  }, [userId, refreshProfile]);

  const countriesExplored = useMemo(() => {
    const countrySet = new Set<string>();
    allRegions.forEach(region => {
      const country = regionToCountry(region);
      if (country) countrySet.add(country);
    });
    return Array.from(countrySet).sort();
  }, [allRegions]);

  return (
    <UserDataContext.Provider value={{
      stats, preferences, recentTopics, completedGuideIds, goals, journal, wishlist,
      countriesExplored, dataLoading, savePreferences, refresh, silentRefresh,
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
