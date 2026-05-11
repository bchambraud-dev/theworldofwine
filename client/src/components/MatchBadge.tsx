/**
 * MatchBadge — circular score badge for the top-right of a wine card.
 *
 * Design intent (May 2026 user feedback):
 *   - Circle, not pill. Score is one number → use the right shape.
 *   - Top-right of card, not stacked on the left. Creates clean visual hierarchy.
 *   - Three positive/neutral colors. No negative colors (orange/red).
 *     A First Growth white I happen not to favor is still a great wine.
 *
 * Color signal:
 *   - 85+ score  → emerald (Perfect Match — clear wheelhouse)
 *   - 70-84      → sage green (Strong Match — likely love)
 *   - 55-69      → slate blue (Worth Trying — curious taste)
 *   - <55        → quiet grey (no negative framing; explainer still available on tap)
 *
 * Tap behavior:
 *   - Single tap toggles a floating explainer card
 *   - Explainer shows: band label (if any), why_short, why_long, factor chips
 *   - For low-confidence: hides badge entirely (rubric honesty rule)
 *   - Tap outside or tap circle again to close
 *
 * Stale handling:
 *   - When the palate version moved but rescore hasn't completed, render at
 *     50% opacity so the user still sees something rather than a blank space.
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

// Visual band: derived purely from score, independent of API's textual band field.
// Keeps UI honest even if the rubric drifts.
type VisualBand = "perfect" | "strong" | "worth" | "neutral";
function visualBand(score: number): VisualBand {
  if (score >= 85) return "perfect";
  if (score >= 70) return "strong";
  if (score >= 55) return "worth";
  return "neutral";
}

// Label shown in the explainer popup. Empty for neutral — the score speaks for itself.
function bandLabel(band: VisualBand, apiBand: string | undefined): string {
  if (band === "perfect") return "Perfect Match";
  if (band === "strong")  return "Strong Match";
  if (band === "worth")   return "Worth Trying";
  // For low-score wines, keep it neutral — never "Off Profile" in UI copy.
  return "Outside your usual lane";
}

function colors(band: VisualBand) {
  switch (band) {
    case "perfect":
      // Emerald — strongest positive signal
      return { ring: "#4A7A52", fill: "rgba(74,122,82,0.13)",  text: "#3F6447", dot: "#4A7A52" };
    case "strong":
      // Sage — warm green, still positive
      return { ring: "#7A9E68", fill: "rgba(122,158,104,0.13)", text: "#5C7E4A", dot: "#7A9E68" };
    case "worth":
      // Slate blue — curious, not warning
      return { ring: "#6E8AAE", fill: "rgba(110,138,174,0.12)", text: "#4D6585", dot: "#6E8AAE" };
    case "neutral":
    default:
      // Quiet grey — outside the lane, no negative framing
      return { ring: "#B5AFA5", fill: "rgba(181,175,165,0.14)", text: "#7A7568", dot: "#B5AFA5" };
  }
}

interface MatchBadgeProps {
  match: MatchScore;
  /** Whether this score is stale (palate_version mismatch). Renders dimmed. */
  stale?: boolean;
  hostId: string;
  activeTooltipId: string | null;
  onToggleTooltip: (id: string | null) => void;
  /** Circle size in px (default 40 — fits a stacked score + "MATCH" label
      without crowding. Slightly larger than 36 to keep both lines readable. */
  size?: number;
}

export function MatchBadge({
  match, stale, hostId, activeTooltipId, onToggleTooltip, size = 40,
}: MatchBadgeProps) {
  const id = `${hostId}-match`;
  const isActive = activeTooltipId === id;
  const ref = useRef<HTMLDivElement | null>(null);

  // Close popover on outside tap
  useEffect(() => {
    if (!isActive) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggleTooltip(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isActive, onToggleTooltip]);

  if (!match || match.confidence === "low") return null;
  if (typeof match.score !== "number") return null;

  const score = Math.max(0, Math.min(100, Math.round(match.score)));
  const band = visualBand(score);
  const c = colors(band);
  const label = bandLabel(band, match.band);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* The circle itself */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleTooltip(isActive ? null : id); }}
        aria-label={`${score} percent match`}
        style={{
          width: size, height: size, borderRadius: "50%",
          background: c.fill,
          border: `1.5px solid ${c.ring}`,
          color: c.text,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          fontFamily: "'Fraunces', serif",
          opacity: stale ? 0.45 : 1,
          transition: "opacity 0.25s ease, transform 0.15s ease",
          transform: isActive ? "scale(0.96)" : "scale(1)",
          boxShadow: isActive ? "none" : `0 1px 3px rgba(26,20,16,0.06)`,
          lineHeight: 1,
        }}
      >
        <span style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "0.72rem", fontWeight: 500, lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>{score}<span style={{ fontSize: "0.65em", fontWeight: 400, opacity: 0.78, marginLeft: 0.5 }}>%</span></span>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.36rem", fontWeight: 500, lineHeight: 1,
          letterSpacing: "0.12em", marginTop: 2,
          opacity: 0.78,
        }}>MATCH</span>
      </button>

      {/* Explainer popover — right-aligned with the circle and given a high z-index
          so nothing on the card (drink-window timeline, NOW chip, neighboring badges)
          bleeds through. Score is NOT duplicated here — the user can already see it
          on the circle they just tapped. Title color matches the band ring. */}
      {isActive && (
        <div
          onClick={(e) => { e.stopPropagation(); onToggleTooltip(null); }}
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            zIndex: 100, minWidth: 240, maxWidth: 300,
            background: "#1A1410", color: "#F7F4EF",
            padding: "12px 14px", borderRadius: 10,
            boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
            isolation: "isolate",
          }}
        >
          {/* Header: band label only, colored to match the circle ring. */}
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: "0.95rem", fontWeight: 500,
            color: c.ring, marginBottom: 8, lineHeight: 1.2,
          }}>{label}</div>

          {match.why_short && (
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 400,
              color: "#F7F4EF", marginBottom: match.why_long ? 6 : 0, lineHeight: 1.45,
            }}>{match.why_short}</div>
          )}
          {match.why_long && (
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", fontWeight: 300,
              color: "rgba(247,244,239,0.85)", lineHeight: 1.5,
            }}>{match.why_long}</div>
          )}
          {Array.isArray(match.factors) && match.factors.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
              {match.factors.slice(0, 5).map((f, idx) => (
                <span key={idx} style={{
                  padding: "2px 7px", borderRadius: 8,
                  background: "rgba(247,244,239,0.10)",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: f.alignment === "strong" ? "#A8D4A0"
                       : f.alignment === "moderate" ? "#C8D4E0"
                       : "#D4D1CA",
                }}>{f.label}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
