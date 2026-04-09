import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "./supabase";

// auth.tsx — thin layer: session identity only.
// Behavioural data (stats, preferences, topics) lives in useUserData.tsx.

interface AuthContextType {
  session: Session | null;
  user: User | null;       // stable: same reference unless userId changes
  userId: string | null;   // primitive — safe to use as useEffect dependency
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession]   = useState<Session | null>(null);
  const [user, setUser]         = useState<User | null>(null);
  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const initialized = useRef(false);

  // Fetch profile with retries (DB trigger may lag on first sign-in)
  const fetchProfile = async (userId: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) { setProfile(data as UserProfile); return; }
      if (i < retries - 1) await new Promise(r => setTimeout(r, 600));
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    // Single subscription only — onAuthStateChange fires INITIAL_SESSION
    // immediately if a stored session exists, so getSession() is redundant
    // and causes the double-fire that thrashes child component effects.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        const nextUser = session?.user ?? null;

        // Stabilise the user object: only replace the reference if the
        // user ID actually changed. Without this, every auth token refresh
        // creates a new object → downstream useEffect deps fire repeatedly.
        setUser(prev => {
          if (prev?.id === nextUser?.id) return prev;
          return nextUser;
        });

        try {
          if (nextUser) {
            await fetchProfile(nextUser.id);
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error("fetchProfile error:", e);
        } finally {
          if (!initialized.current) {
            initialized.current = true;
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    // Clear state immediately — never block UI on a network call
    setSession(null);
    setUser(null);
    setProfile(null);
    Promise.race([
      supabase.auth.signOut(),
      new Promise(resolve => setTimeout(resolve, 3000)),
    ]).catch(() => {});
  };

  const userId = user?.id ?? null;

  return (
    <AuthContext.Provider value={{
      session, user, userId, profile, loading,
      signInWithGoogle, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
