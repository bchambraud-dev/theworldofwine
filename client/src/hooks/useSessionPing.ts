import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { getAccessToken } from "@/lib/supabaseDirectFetch";

// Pings /api/session-ping on mount + every 15 min while the tab is visible.
// Pauses when the tab is hidden (visibility API), resumes when it returns.
// Silent — never surfaces errors to the user; DAU tracking is best-effort.

const PING_INTERVAL_MS = 15 * 60 * 1000; // 15 min

async function ping(): Promise<void> {
  try {
    const token = getAccessToken();
    if (!token) return;
    await fetch("/api/session-ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Fire-and-forget; use keepalive so navigations don't cancel the ping
      keepalive: true,
    });
  } catch {
    // Best-effort — never bubble errors up.
  }
}

export function useSessionPing() {
  const { user } = useAuth();
  const intervalRef = useRef<number | null>(null);
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    if (!user?.id) return;

    // Ping on mount (fire immediately)
    ping();
    lastPingRef.current = Date.now();

    // Schedule heartbeat
    const start = () => {
      if (intervalRef.current !== null) return;
      intervalRef.current = window.setInterval(() => {
        // Only ping if the tab is visible
        if (document.visibilityState === "visible") {
          ping();
          lastPingRef.current = Date.now();
        }
      }, PING_INTERVAL_MS);
    };
    const stop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    start();

    // When tab becomes visible after >= interval elapsed, ping immediately
    const onVis = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastPingRef.current;
        if (elapsed >= PING_INTERVAL_MS) {
          ping();
          lastPingRef.current = Date.now();
        }
        start();
      } else {
        stop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [user?.id]);
}
