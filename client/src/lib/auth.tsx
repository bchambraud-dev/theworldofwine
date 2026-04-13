import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "./supabase";

// ─── Auth Context ───────────────────────────────────────────────────────────
// Owns: session, user (stable by id), profile, loading flag.
// Design: NOTHING can leave `loading` stuck at true. Every code path
// reaches `finish()` within a bounded time. Every async call is wrapped
// in try/catch so a network failure never breaks the render tree.

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userId: string | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const done = useRef(false);

  // Mark initialisation complete — called from EVERY code path.
  const finish = () => {
    if (!done.current) { done.current = true; setLoading(false); }
  };

  // Stable user setter: only replace the reference if the actual user changes.
  const stableSetUser = (next: User | null) => {
    setUser(prev => (prev?.id === next?.id ? prev : next));
  };

  // Fetch profile with retries. Always resolves (never throws to caller).
  const fetchProfile = async (uid: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { data } = await supabase
          .from("user_profiles").select("*").eq("id", uid).single();
        if (data) { setProfile(data as UserProfile); return; }
      } catch { /* network error — retry */ }
      if (attempt < 2) await new Promise(r => setTimeout(r, 500));
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  // ─── Initialisation ─────────────────────────────────────────────────────
  //
  // CRITICAL: We do NOT use supabase.auth.getSession() for initial session read.
  // getSession() acquires a navigator.locks lock internally and awaits
  // initializePromise. If the auth state is in limbo (common after OAuth
  // callback errors or network flakes), getSession() hangs indefinitely.
  // The 4s safety timeout fires but by then session/user are null = zombie state.
  //
  // Instead, we read the session directly from localStorage (same place
  // supabase-js stores it) and hydrate from there. The onAuthStateChange
  // listener still fires for token refreshes, sign-in, sign-out, etc.
  //
  useEffect(() => {
    const timeout = setTimeout(finish, 4000);

    const handleSession = async (s: Session | null) => {
      setSession(s);
      const u = s?.user ?? null;
      stableSetUser(u);
      if (u) await fetchProfile(u.id);
      else setProfile(null);
      finish();
    };

    // 1. Read session directly from localStorage — bypasses auth lock entirely.
    const readStoredSession = (): Session | null => {
      try {
        const raw = localStorage.getItem("sb-ycgxczvsxiilqzvyzpso-auth-token");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // Supabase stores { access_token, refresh_token, expires_at, user, ... }
        if (!parsed?.access_token || !parsed?.user) return null;
        // Check if token is expired (expires_at is in seconds)
        const now = Math.floor(Date.now() / 1000);
        if (parsed.expires_at && parsed.expires_at < now - 60) {
          // Token expired more than 60s ago — let onAuthStateChange handle refresh
          return null;
        }
        return parsed as Session;
      } catch {
        return null;
      }
    };

    const stored = readStoredSession();
    if (stored) {
      handleSession(stored).catch(() => finish());
    } else {
      // No stored session — try getSession as fallback (with a race timeout)
      Promise.race([
        supabase.auth.getSession().then(({ data: { session: s } }) => handleSession(s)),
        new Promise<void>(resolve => setTimeout(resolve, 2000)),
      ]).catch(() => {}).finally(finish);
    }

    // 2. Ongoing: token refresh, sign-in, sign-out events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        try { await handleSession(s); } catch { finish(); }
      },
    );

    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    // Fire-and-forget with timeout — never block the UI
    Promise.race([
      supabase.auth.signOut(),
      new Promise(r => setTimeout(r, 3000)),
    ]).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{
      session, user, userId: user?.id ?? null, profile, loading,
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
