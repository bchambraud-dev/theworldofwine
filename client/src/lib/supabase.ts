import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://auth.theworldofwine.org";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: "implicit",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "sb-ycgxczvsxiilqzvyzpso-auth-token",
  },
});

export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  experience_level: ExperienceLevel | null;
  onboarding_complete: boolean;
  base_country: string | null;
  currency_code: string | null;
  created_at: string;
}

export interface WineJournalEntry {
  id: string;
  user_id: string;
  wine_name: string;
  producer: string | null;
  region: string | null;
  vintage: number | null;
  grape_varieties: string[];
  personal_rating: number | null;
  notes: string | null;
  occasion: string | null;
  food_paired: string | null;
  date_tasted: string;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description: string | null;
  target_count: number;
  current_count: number;
  completed: boolean;
  deadline: string | null;
  created_at: string;
  completed_at: string | null;
}
