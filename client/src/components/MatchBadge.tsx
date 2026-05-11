/**
 * MatchBadge — Sommy's match score for a wine, calibrated against the user's palate.
 *
 * Conceptual contract:
 *   - Shows only when there's a fresh score AND confidence is high/medium.
 *   - Low confidence renders nothing (honesty rule from the rubric).
 *   - Stale scores (palate_version mismatch) render dimmed at 50% opacity until
 *     the orchestrator replaces them with a fresh score.
 *   - No palate form → never renders (parent gates).
 *
 * Visual hierarchy (matches the brand quiet/burgundy palette, no neon):
 *   - "Perfect Match" 90-100  → emerald, the strongest signal
 *   - "Strong Match"  75-89   → sage, warm and reassuring
 *   - "Worth Trying"  60-74   → terracotta, a curious nudge
 *   - "A Stretch"     45-59   → dusty rose, honest caution
 *   - "Off Profile"   0-44    → muted grey, off-route warning
 *
 * Tap to reveal why_short. Single tap toggles the explainer. Tap outside closes.
 */
import { useRef, useEffect } from "react";

export type MatchScore = {
  score?: number;
  band?: "Perfect Match" | "Strong Match" | "Worth Trying" | "A Stretch" | "Off Profile";
  confidence?: "high" | "medium" | "low";
  why_short?: string;
  why_long?: string;
  factors?: { label: string; alignment: "strong" | "moderate" | "neutral" | "weak" }[];
} | null | undefined;

function bandStyle(band: string | undefined) {
  switch (band) {
    case "Perfect Match":
      return { dot: "#4A7A52", bg: "rgba(74,122,82,0.10)",  color: "#3F6447", border: "rgba(74,122,82,0.40)" };
    case "Strong Match":
      return { dot: "#7A9E68", bg: "rgba(122,158,104,0.10)", color: "#5C7E4A", border: "rgba(122,158,104,0.40)" };
    case "Worth Trying":
      return { dot: "#B8702E", bg: "rgba(184,112,46,0.10)",  color: "#8C5420", border: "rgba(184,112,46,0.40)" };
    case "A Stretch":
      return { dot: "#A05060", bg: "rgba(160,80,96,0.10)",   color: "#7A3A4A", border: "rgba(160,80,96,0.40)" };
    case "Off Profile":
    default:
      return { dot: "#9A938A", bg: "rgba(154,147,138,0.10)", color: "#5A5248", border: "rgba(154,147,138,0.40)" };
  }
}

interface MatchBadgeProps {
  match: MatchScore;
  /** Whether this score is stale (palate_version mismatch). Renders dimmed. */
  stale?: boolean;
  /** Stable id for the tooltip state */
  hostId: string;
  /** Which tooltip is open across this host page */
  activeTooltipId: string | null;
  onToggleTooltip: (id: string | null) => void;
}

export function MatchBadge({ match, stale, hostId, activeTooltipId, onToggleTooltip }: MatchBadgeProps) {
  const id = `${hostId}-match`;
  const isActive = activeTooltipId === id;
  const ref = useRef<HTMLSpanElement | null>(null);

  // Close tooltip on outside tap
  useEffect(() => {
    if (!isActive) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggleTooltip(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isActive, onToggleTooltip]);

  if (!match || match.confidence === "low") return null;
  if (typeof match.score !== "number" || !match.band) return null;

  const s = bandStyle(match.band);

  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-block", marginTop: 4, marginRight: 6 }}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onToggleTooltip(isActive ? null : id); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "2px 9px 2px 7px", borderRadius: 11,
          background: s.bg, color: s.color,
          border: `1px solid ${s.border}`,
          fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
          letterSpacing: "0.07em", textTransform: "uppercase",
          cursor: "pointer",
          opacity: stale ? 0.5 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: s.dot,
          display: "inline-block",
        }} />
        <span style={{ fontWeight: 600, fontSize: "0.65rem", letterSpacing: 0 }}>{match.score}</span>
        <span>{match.band}</span>
      </span>

      {isActive && (
        <span
          onClick={(e) => { e.stopPropagation(); onToggleTooltip(null); }}
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            zIndex: 40, minWidth: 240, maxWidth: 320,
            background: "#1A1410", color: "#F7F4EF",
            padding: "10px 12px", borderRadius: 8,
            fontFamily: "'Jost', sans-serif", fontSize: "0.78rem",
            fontWeight: 300, lineHeight: 1.5,
            boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
          }}
        >
          {match.why_short && (
            <div style={{ fontWeight: 500, marginBottom: match.why_long ? 6 : 0 }}>
              {match.why_short}
            </div>
          )}
          {match.why_long && (
            <div style={{ fontSize: "0.74rem", fontWeight: 300, opacity: 0.92 }}>
              {match.why_long}
            </div>
          )}
          {Array.isArray(match.factors) && match.factors.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {match.factors.map((f, idx) => (
                <span key={idx} style={{
                  padding: "2px 7px", borderRadius: 8,
                  background: "rgba(247,244,239,0.12)",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: f.alignment === "strong" ? "#A8D4A0"
                       : f.alignment === "moderate" ? "#E0C68A"
                       : f.alignment === "weak" ? "#E0A0A8"
                       : "#D4D1CA",
                }}>{f.label}</span>
              ))}
            </div>
          )}
        </span>
      )}
    </span>
  );
}
