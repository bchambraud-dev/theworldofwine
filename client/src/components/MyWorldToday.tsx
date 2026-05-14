/**
 * MyWorldToday — the TODAY zone of the My World hub page.
 *
 * Goals:
 *  - Anchor the user with a quiet Sommy prompt (no time-of-day pressure)
 *  - Surface dismissible task cards for incomplete setup steps
 *  - Show a compact "cellar pulse" when relevant — wines in peak now,
 *    wines past peak — pulled live from wine_cellar so it stays honest.
 *  - Collapse gracefully when there's nothing to do.
 *
 * Important: NO daily-drinking nudges. Copy must be invitational, not
 * directional. Brice flagged this explicitly on May 14 2026.
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { directSelect } from "@/lib/supabaseDirectFetch";

type Pulse = {
  inPeak: number;
  pastPeak: number;
};

const DISMISS_KEY = (uid: string, kind: string) => `mw_dismiss_${kind}_${uid}`;

export default function MyWorldToday({
  paletteComplete,
  cellarCount,
  onStartPalate,
}: {
  paletteComplete: boolean;
  cellarCount: number;
  onStartPalate: () => void;
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [dismissPalate, setDismissPalate] = useState(false);
  const [dismissCellar, setDismissCellar] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDismissPalate(localStorage.getItem(DISMISS_KEY(user.id, "palate")) === "1");
    setDismissCellar(localStorage.getItem(DISMISS_KEY(user.id, "cellar")) === "1");
  }, [user]);

  // Compute cellar pulse: wines currently at peak, wines past peak.
  // Same phase logic as the Cellar page (peak: between peak_start/end;
  // past: after drink_until). Active status only.
  useEffect(() => {
    if (!user || cellarCount === 0) {
      setPulse({ inPeak: 0, pastPeak: 0 });
      return;
    }
    (async () => {
      try {
        const rows = await directSelect<any>(
          "wine_cellar",
          `select=drink_from,drink_until,drink_peak_start,drink_peak_end,status&user_id=eq.${user.id}&status=eq.active`,
        );
        const year = new Date().getFullYear();
        let inPeak = 0;
        let pastPeak = 0;
        for (const w of rows || []) {
          if (!w.drink_from) continue;
          if (w.drink_until && year > w.drink_until) {
            pastPeak += 1;
            continue;
          }
          if (
            w.drink_peak_start &&
            w.drink_peak_end &&
            year >= w.drink_peak_start &&
            year <= w.drink_peak_end
          ) {
            inPeak += 1;
          }
        }
        setPulse({ inPeak, pastPeak });
      } catch {
        setPulse({ inPeak: 0, pastPeak: 0 });
      }
    })();
  }, [user, cellarCount]);

  const handleDismiss = (kind: "palate" | "cellar") => {
    if (!user) return;
    localStorage.setItem(DISMISS_KEY(user.id, kind), "1");
    if (kind === "palate") setDismissPalate(true);
    else setDismissCellar(true);
  };

  const showPalateTask = !paletteComplete && !dismissPalate;
  const showCellarTask = cellarCount === 0 && !dismissCellar;
  const showPulse = pulse && (pulse.inPeak > 0 || pulse.pastPeak > 0);

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: "#8C1C2E",
          marginBottom: 14,
        }}
      >
        TODAY
      </div>

      {/* Sommy prompt — always present. Invitational, no time-of-day. */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-sommy"))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          background: "linear-gradient(135deg, #8C1C2E 0%, #6B1422 100%)",
          border: "none",
          borderRadius: 14,
          padding: "16px 18px",
          cursor: "pointer",
          textAlign: "left",
          marginBottom: 10,
          boxShadow: "0 4px 14px rgba(140,28,46,0.18)",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1rem",
              fontWeight: 400,
              color: "#F7F4EF",
              lineHeight: 1.25,
            }}
          >
            Curious about a wine?
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 300,
              color: "rgba(247,244,239,0.78)",
              marginTop: 2,
            }}
          >
            Ask Sommy — she's here for you
          </div>
        </div>
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "1rem",
            color: "rgba(247,244,239,0.7)",
          }}
        >
          →
        </span>
      </button>

      {/* Task: complete your palate. Dismissible. */}
      {showPalateTask && (
        <TaskCard
          icon="palate"
          title="Tell me your taste"
          body="Sommy works best when your taste is on record. Takes 5 minutes."
          cta="Start"
          onAction={onStartPalate}
          onDismiss={() => handleDismiss("palate")}
        />
      )}

      {/* Task: add your first wine. Dismissible. */}
      {showCellarTask && (
        <TaskCard
          icon="bottle"
          title="Add your first wine"
          body="Track bottles you own, their drinking windows, and what you've paid."
          cta="Add"
          onAction={() => setLocation("/journey/cellar")}
          onDismiss={() => handleDismiss("cellar")}
        />
      )}

      {/* Cellar pulse — only when relevant data exists. Honest empty state. */}
      {showPulse && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDEAE3",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.12em",
              color: "#5A5248",
            }}
          >
            CELLAR PULSE
          </div>
          {pulse!.inPeak > 0 && (
            <button
              onClick={() => setLocation("/journey/cellar")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#1F6B35",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  color: "#1A1410",
                  flex: 1,
                }}
              >
                {pulse!.inPeak} {pulse!.inPeak === 1 ? "wine is" : "wines are"} at peak
              </span>
              <span style={{ color: "#8C1C2E", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem" }}>→</span>
            </button>
          )}
          {pulse!.pastPeak > 0 && (
            <button
              onClick={() => setLocation("/journey/cellar")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#A67055",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  color: "#1A1410",
                  flex: 1,
                }}
              >
                {pulse!.pastPeak} {pulse!.pastPeak === 1 ? "wine is" : "wines are"} past peak
              </span>
              <span style={{ color: "#8C1C2E", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem" }}>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskCard({
  icon,
  title,
  body,
  cta,
  onAction,
  onDismiss,
}: {
  icon: "palate" | "bottle";
  title: string;
  body: string;
  cta: string;
  onAction: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(140,28,46,0.04)",
        border: "1px dashed rgba(140,28,46,0.28)",
        borderRadius: 12,
        padding: "14px 36px 14px 16px",
        marginBottom: 10,
      }}
    >
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#5A5248",
          fontFamily: "'Jost', sans-serif",
          fontSize: "1rem",
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(140,28,46,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon === "palate" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
              <path d="M19 10a7 7 0 0 1-14 0" />
              <line x1="12" y1="17" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 22h8" />
              <path d="M12 11v11" />
              <path d="M5 3l1 7c0 2.8 2.7 5 6 5s6-2.2 6-5l1-7" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "0.96rem",
              fontWeight: 500,
              color: "#1A1410",
              lineHeight: 1.25,
              marginBottom: 3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 300,
              color: "#5A5248",
              lineHeight: 1.45,
              marginBottom: 10,
            }}
          >
            {body}
          </div>
          <button
            onClick={onAction}
            style={{
              background: "#8C1C2E",
              color: "#F7F4EF",
              border: "none",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            {cta.toUpperCase()} →
          </button>
        </div>
      </div>
    </div>
  );
}
