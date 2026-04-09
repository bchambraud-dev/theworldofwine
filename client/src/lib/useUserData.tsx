import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

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
  region: string | null;
  personal_rating: number | null;
  date_tasted: string | null;
}

interface UserDataContextType {
  stats: UserStats;
  preferences: UserPreferences;
  recentTopics: string[];      // last 3 questions asked to Sommy
  completedGuideIds: string[]; // guide IDs the user has read
  goals: UserGoal[];
  journal: JournalEntry[];     // last 5 wines logged
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
  const [dataLoading, setDataLoading]         = useState(false);

  // Prevent re-fetching for the same user
  const loadedForRef = useRef<string | null>(null);

  const load = useCallback(async (uid: string, silent = false) => {
    if (!silent) setDataLoading(true);
    try {
      const [chats, regions, guides, wines, topics, prefs, goalsRes, journalRes] =
        await Promise.all([
          supabase.from("sommy_conversations")
            .select("user_id", { count: "exact" })
            .eq("user_id", uid).eq("role", "user"),

          supabase.from("user_activity")
            .select("user_id", { count: "exact" })
            .eq("user_id", uid).eq("activity_type", "region_view"),

          supabase.from("user_activity")
            .select("item_id", { count: "exact" })
            .eq("user_id", uid).eq("activity_type", "guide_read"),

          supabase.from("wine_journal")
            .select("user_id", { count: "exact" })
            .eq("user_id", uid),

          supabase.from("sommy_conversations")
            .select("content")
            .eq("user_id", uid).eq("role", "user")
            .order("created_at", { ascending: false })
            .limit(3),

          supabase.from("user_preferences")
            .select("preferred_types")
            .eq("user_id", uid)
            .single(),

          supabase.from("user_goals")
            .select("id, title, target_count, current_count, completed")
            .eq("user_id", uid).eq("completed", false)
            .order("created_at", { ascending: false })
            .limit(3),

          supabase.from("wine_journal")
            .select("id, wine_name, region, personal_rating, date_tasted")
            .eq("user_id", uid)
            .order("date_tasted", { ascending: false, nullsFirst: false })
            .limit(5),
        ]);

      setStats({
        chats:   chats.count   ?? 0,
        regions: regions.count ?? 0,
        guides:  guides.count  ?? 0,
        wines:   wines.count   ?? 0,
      });

      // Extract completed guide IDs for learning path
      setCompletedGuideIds(
        (guides.data ?? []).map((r: any) => r.item_id as string).filter(Boolean)
      );

      setRecentTopics(
        (topics.data ?? []).map((t: any) => t.content as string)
      );

      setPreferences({
        preferred_types: (prefs.data as any)?.preferred_types ?? [],
      });

      setGoals((goalsRes.data ?? []) as UserGoal[]);
      setJournal((journalRes.data ?? []) as JournalEntry[]);

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
    await Promise.all([
      supabase.from("user_profiles")
        .update({ experience_level: level })
        .eq("id", userId),
      supabase.from("user_preferences")
        .upsert({ user_id: userId, preferred_types: types }),
    ]);
    await refreshProfile(); // updates profile in auth context (for level badge etc.)
    setPreferences({ preferred_types: types });
  }, [userId, refreshProfile]);

  return (
    <UserDataContext.Provider value={{
      stats, preferences, recentTopics, completedGuideIds, goals, journal,
      dataLoading, savePreferences, refresh, silentRefresh,
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
