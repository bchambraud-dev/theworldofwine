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
    // 1. getSession() fires immediately with the stored session.
    //    The Supabase client auto-refreshes expired tokens internally
    //    before making REST calls, so fetchProfile works even if the
    //    stored access_token has expired.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const nextUser = session?.user ?? null;
      setUser(prev => (prev?.id === nextUser?.id ? prev : nextUser));
      try {
        if (nextUser) await fetchProfile(nextUser.id);
      } catch (e) {
        console.error("fetchProfile error (getSession):", e);
      }
      if (!initialized.current) {
        initialized.current = true;
        setLoading(false);
      }
    });

    // 2. onAuthStateChange handles subsequent events: token refresh,
    //    sign-out, new sign-in. The user object is stabilised by ID
    //    so downstream effects don't re-fire on every token refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const nextUser = session?.user ?? null;
        setUser(prev => (prev?.id === nextUser?.id ? prev : nextUser));
        try {
          if (nextUser) {
            await fetchProfile(nextUser.id);
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error("fetchProfile error (authChange):", e);
        } finally {
          // Always clear loading in case getSession didn't fire first
          if (!initialized.current) {
            initialized.current = true;
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
