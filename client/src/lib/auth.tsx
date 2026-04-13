import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "./supabase";
import { directSelect, SUPABASE_URL, ANON_KEY, getAccessToken } from "./supabaseDirectFetch";

// ─── Auth Context ───────────────────────────────────────────────────────────
// FULLY bypasses the Supabase JS client for session init, profile fetch,
// and sign-out. The supabase-js auth lock (navigator.locks + initializePromise)
// can hang indefinitely after OAuth callback errors or network flakes.
//
// We only use supabase.auth for:
// - signInWithOAuth (fires a redirect, doesn't touch the lock)
// - onAuthStateChange (listener, but we don't depend on it for init)

const STORAGE_KEY = "sb-ycgxczvsxiilqzvyzpso-auth-token";

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

  const finish = () => {
    if (!done.current) { done.current = true; setLoading(false); }
  };

  const stableSetUser = (next: User | null) => {
    setUser(prev => (prev?.id === next?.id ? prev : next));
  };

  // Fetch profile via raw fetch — bypasses supabase-js auth lock.
  const fetchProfileDirect = async (uid: string): Promise<UserProfile | null> => {
    try {
      const token = getAccessToken();
      if (!token) return null;
      const rows = await directSelect<UserProfile>(
        "user_profiles",
        `select=*&id=eq.${uid}`,
        5000,
      );
      return rows?.[0] ?? null;
    } catch {
      return null;
    }
  };

  // Read session from localStorage — bypasses supabase-js entirely.
  const readStoredSession = (): Session | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.access_token || !parsed?.user) return null;
      return parsed as Session;
    } catch {
      return null;
    }
  };

  // Process a session (from localStorage or onAuthStateChange)
  const handleSession = useCallback(async (s: Session | null) => {
    setSession(s);
    const u = s?.user ?? null;
    stableSetUser(u);
    if (u) {
      const p = await fetchProfileDirect(u.id);
      if (p) setProfile(p);
    } else {
      setProfile(null);
    }
    finish();
  }, []);

  // ─── Initialisation ─────────────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(finish, 4000);

    // 1. Immediate: read from localStorage (instant, no network, no lock)
    const stored = readStoredSession();
    if (stored) {
      handleSession(stored).catch(() => finish());
    } else {
      // No stored session — user is not logged in
      finish();
    }

    // 2. Ongoing: listen for auth events (sign-in callback, token refresh)
    // This is safe because onAuthStateChange doesn't await initializePromise
    // in newer supabase-js versions — it registers immediately.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        try { await handleSession(s); } catch { finish(); }
      },
    );

    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, [handleSession]);

  // ─── Actions ────────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    // 1. Clear React state immediately
    setSession(null);
    setUser(null);
    setProfile(null);

    // 2. Clear localStorage directly — this is what prevents the zombie
    localStorage.removeItem(STORAGE_KEY);

    // 3. Tell Supabase server to revoke the refresh token (fire-and-forget)
    // Use raw fetch, not supabase.auth.signOut() which hangs on the auth lock.
    const token = getAccessToken();
    try {
      await Promise.race([
        fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "apikey": ANON_KEY,
          },
        }),
        new Promise(r => setTimeout(r, 2000)),
      ]);
    } catch {
      // Server-side revocation failed — that's OK, localStorage is already cleared
    }

    // 4. Also try the supabase client sign-out as a fallback (with tight timeout)
    Promise.race([
      supabase.auth.signOut(),
      new Promise(r => setTimeout(r, 1000)),
    ]).catch(() => {});
  };

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfileDirect(user.id);
      if (p) setProfile(p);
    }
  }, [user]);

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
