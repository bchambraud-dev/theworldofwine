/**
 * CellarCoach — Sommy's proactive coaching pings in My World's TODAY zone.
 *
 * Detects high-leverage conditions and surfaces a single, dismissible
 * coaching card. The whole feature is gentle by design:
 *   - Once per condition, ever (dismissed = gone for 30 days via localStorage)
 *   - Hidden completely when no condition is met (never naggy)
 *   - In-app only — no push, no email, no daily nudges
 *
 * Conditions (in priority order, highest-leverage first):
 *   1. PEAK_BOTTLES_NOW — wines entering peak this calendar year.
 *      "Your Tignanello 2020 is hitting peak — want pairing ideas?"
 *   2. PAST_PEAK_HEAVY — >20% of cellar past peak.
 *      "Want help building a rotation plan?"
 *   3. STYLE_NARROW — >70% of cellar in a single country.
 *      "You've leaned heavy into French wines; curious about exploring
 *      one bottle outside that lane?"
 *
 * Each card has two actions: Talk to Sommy (opens chat with seeded
 * message) or Dismiss. Tapping Sommy carries the context with a chat-
 * level deep-link via a custom event the SommyChat component listens for.
 *
 * Future (Premium gating, post-Stripe): show condition 1 to all users,
 * gate conditions 2 and 3 to Premium tier as "proactive cellar coaching".
 * For now everything is free so we can measure engagement first.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { directSelect } from "@/lib/supabaseDirectFetch";

type CellarWine = {
  id: string;
  wine_name: string | null;
  vintage: number | null;
  region: string | null;
  drink_from: number | null;
  drink_until: number | null;
  drink_peak_start: number | null;
  drink_peak_end: number | null;
};

type Coaching = {
  key: string;       // stable identifier for dismissal tracking
  label: string;     // short pill label (e.g. "PEAK BOTTLES")
  title: string;     // headline ("Your Tignanello 2020 is at peak")
  body: string;      // 1-2 sentence supporting text
  prompt: string;    // text that gets seeded into Sommy chat when user taps
  tone: "celebration" | "advisory" | "exploration";
};

const TONE_STYLES = {
  celebration: { bg: "rgba(31,107,53,0.06)", border: "rgba(31,107,53,0.22)", accent: "#1F6B35", label: "AT PEAK NOW" },
  advisory:    { bg: "rgba(166,112,85,0.08)", border: "rgba(166,112,85,0.28)", accent: "#A67055", label: "CELLAR PULSE" },
  exploration: { bg: "rgba(201,160,48,0.06)", border: "rgba(201,160,48,0.24)", accent: "#C9A030", label: "EXPLORE" },
} as const;

const DISMISS_KEY = (uid: string, key: string) => `coach_dismiss_${key}_${uid}`;
const DISMISS_TTL_DAYS = 30;

function isDismissed(uid: string, key: string): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY(uid, key));
    if (!v) return false;
    const ts = parseInt(v, 10);
    if (!ts) return false;
    return Date.now() - ts < DISMISS_TTL_DAYS * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

function markDismissed(uid: string, key: string): void {
  try { localStorage.setItem(DISMISS_KEY(uid, key), String(Date.now())); } catch {}
}

/**
 * Pick the single highest-priority coaching condition for this user, or
 * null if no condition warrants a ping. We only ever show ONE card at a
 * time to avoid overwhelm. Priority is hardcoded in the order below.
 */
function detectCoaching(wines: CellarWine[], uid: string): Coaching | null {
  if (wines.length === 0) return null;
  const year = new Date().getFullYear();

  // 1. PEAK_BOTTLES_NOW — celebrate a wine hitting peak. Highest priority
  // because it's tangible, actionable, and creates a moment.
  const atPeak = wines.filter((w) =>
    w.drink_peak_start && w.drink_peak_end &&
    year >= w.drink_peak_start && year <= w.drink_peak_end
  );
  if (atPeak.length > 0) {
    const wine = atPeak[0]; // pick the first; could prioritise by added_at later
    const wineName = `${wine.wine_name || "A wine"}${wine.vintage ? ` ${wine.vintage}` : ""}`;
    const key = `peak_${wine.id}`;
    if (!isDismissed(uid, key)) {
      return {
        key,
        tone: "celebration",
        label: TONE_STYLES.celebration.label,
        title: `${wineName} is at peak`,
        body: atPeak.length > 1
          ? `One of ${atPeak.length} bottles entering its drinking window. Want pairing ideas or thoughts on what to look for?`
          : `It's in its prime drinking window right now. Want pairing ideas or thoughts on what to look for?`,
        prompt: `${wineName} just hit peak in my cellar. What pairing or tasting tips do you have for opening it?`,
      };
    }
  }

  // 2. PAST_PEAK_HEAVY — >20% of active bottles past their drink-until year.
  // Coaching opportunity to discuss rotation strategy.
  const pastPeak = wines.filter((w) => w.drink_until && year > w.drink_until);
  const pastPeakRatio = pastPeak.length / wines.length;
  if (pastPeak.length >= 3 && pastPeakRatio > 0.2) {
    const key = `past_peak_${pastPeak.length}`;
    if (!isDismissed(uid, key)) {
      return {
        key,
        tone: "advisory",
        label: TONE_STYLES.advisory.label,
        title: `${pastPeak.length} bottles past peak`,
        body: `That's about ${Math.round(pastPeakRatio * 100)}% of your cellar. Want to talk through a rotation strategy so the next round of bottles lands at peak?`,
        prompt: `I have ${pastPeak.length} bottles past peak in my cellar (roughly ${Math.round(pastPeakRatio * 100)}% of total). How should I think about cellar rotation going forward?`,
      };
    }
  }

  // 3. STYLE_NARROW — >70% of cellar from one country. Suggest exploration.
  if (wines.length >= 8) {
    const byCountry: Record<string, number> = {};
    for (const w of wines) {
      const country = (w.region || "").split(",").pop()?.trim() || "Unknown";
      byCountry[country] = (byCountry[country] || 0) + 1;
    }
    const sorted = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
    const [topCountry, topCount] = sorted[0];
    if (topCountry !== "Unknown" && topCount / wines.length > 0.7) {
      const key = `narrow_${topCountry}_${wines.length}`;
      if (!isDismissed(uid, key)) {
        return {
          key,
          tone: "exploration",
          label: TONE_STYLES.exploration.label,
          title: `Your cellar leans heavily ${topCountry}`,
          body: `Around ${Math.round((topCount / wines.length) * 100)}% of your bottles come from ${topCountry}. Curious about wines that share what you love but come from somewhere else?`,
          prompt: `Most of my cellar is from ${topCountry}. Can you suggest one or two regions outside that whose wines might resonate with my palate?`,
        };
      }
    }
  }

  return null;
}

export default function CellarCoach() {
  const { user } = useAuth();
  const [coaching, setCoaching] = useState<Coaching | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const wines = await directSelect<CellarWine>(
          "wine_cellar",
          `select=id,wine_name,vintage,region,drink_from,drink_until,drink_peak_start,drink_peak_end&user_id=eq.${user.id}&status=eq.active&limit=200`,
        );
        if (!mounted) return;
        setCoaching(detectCoaching(wines || [], user.id));
      } catch {
        if (mounted) setCoaching(null);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  if (!coaching || !user) return null;

  const style = TONE_STYLES[coaching.tone];

  const handleAskSommy = () => {
    // Seed the Sommy chat with our prompt. SommyChat listens for this event.
    window.dispatchEvent(new CustomEvent("open-sommy", { detail: { prompt: coaching.prompt } }));
  };

  const handleDismiss = () => {
    markDismissed(user.id, coaching.key);
    setCoaching(null);
  };

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 10,
      position: "relative",
    }}>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 8, right: 8,
          width: 22, height: 22, borderRadius: "50%",
          background: "none", border: "none", cursor: "pointer",
          color: "#5A5248", fontFamily: "'Jost', sans-serif",
          fontSize: "1rem", lineHeight: 1, padding: 0,
        }}
      >
        ×
      </button>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
        letterSpacing: "0.12em", color: style.accent, marginBottom: 8,
      }}>
        {style.label}
      </div>
      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400,
        color: "#1A1410", lineHeight: 1.3, marginBottom: 6, paddingRight: 22,
      }}>
        {coaching.title}
      </div>
      <div style={{
        fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
        color: "#5A5248", lineHeight: 1.5, marginBottom: 12,
      }}>
        {coaching.body}
      </div>
      <button
        onClick={handleAskSommy}
        style={{
          background: style.accent, color: "#F7F4EF",
          border: "none", borderRadius: 8, padding: "7px 14px",
          fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem",
          letterSpacing: "0.1em", cursor: "pointer",
        }}
      >
        ASK SOMMY →
      </button>
    </div>
  );
}
