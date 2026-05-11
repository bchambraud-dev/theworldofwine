/**
 * AwardsRow — shared bottle-aware awards badge renderer.
 *
 * Single source of truth for how awards render on every surface that shows a wine:
 *   - My Cellar
 *   - My Experiences (Journal)
 *   - My Wishlist (future, 4b)
 *   - Sommy chat / scan cards (future, 4c)
 *
 * Conceptual contract (per twow-pm-review):
 *   - Awards are PER-BOTTLE, not per-producer. Pass exactly the `awards_json` for THIS wine row.
 *   - confidence === "low"  → render nothing (hides obscure/unknown wines silently)
 *   - empty awards array    → render nothing (a flagship-but-no-classification wine)
 *   - max 4 badges rendered (rest dropped, never paginated)
 *   - tap-to-reveal context tooltip; one tooltip open at a time per host page
 *
 * Tooltip state lives in the caller. We expose activeId + onToggle so multiple
 * cards on a page don't fight each other.
 */
import React from "react";

export type AwardEntry = {
  type: string;
  label: string;
  tone: string;
  context?: string;
};

export type AwardsJson = {
  awards?: AwardEntry[];
  is_flagship?: boolean;
  confidence?: "high" | "medium" | "low";
  notes?: string;
} | null | undefined;

// Quiet, brand-aligned palette. Never neon. Matches the cellar palette established earlier.
function badgeStyle(tone: string) {
  const palettes: Record<string, { bg: string; color: string; border: string }> = {
    classification: { bg: "rgba(26,20,16,0.05)",    color: "#1A1410", border: "rgba(26,20,16,0.25)" },
    score:          { bg: "rgba(140,28,46,0.07)",   color: "#7A1424", border: "rgba(140,28,46,0.35)" },
    recognized:     { bg: "rgba(212,165,106,0.12)", color: "#8C6A2E", border: "rgba(212,165,106,0.45)" },
    iconic:         { bg: "rgba(212,165,106,0.16)", color: "#7A5A20", border: "rgba(212,165,106,0.55)" },
  };
  return palettes[tone] || palettes.classification;
}

interface AwardsRowProps {
  /** awards_json from the wine row (any surface) */
  awards: AwardsJson;
  /** Stable id prefix for tooltip state (e.g. cellar wine id, journal entry id) */
  hostId: string;
  /** Which tooltip is currently open across this host page */
  activeTooltipId: string | null;
  /** Toggle handler — receives the tooltip id or null */
  onToggleTooltip: (id: string | null) => void;
  /** Optional max badges to render (default 4) */
  max?: number;
  /** Optional top margin override */
  marginTop?: number;
}

export function AwardsRow({
  awards,
  hostId,
  activeTooltipId,
  onToggleTooltip,
  max = 4,
  marginTop = 4,
}: AwardsRowProps) {
  if (!awards || awards.confidence === "low") return null;
  const list = Array.isArray(awards.awards) ? awards.awards : [];
  if (list.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop, position: "relative" }}>
      {list.slice(0, max).map((a, idx) => {
        const s = badgeStyle(a.tone);
        const id = `${hostId}-aw-${idx}`;
        const isActive = activeTooltipId === id;
        return (
          <span
            key={id}
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onToggleTooltip(isActive ? null : id); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "1px 7px", borderRadius: 8,
              fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem",
              letterSpacing: "0.07em", textTransform: "uppercase",
              background: s.bg, color: s.color,
              border: `1px solid ${s.border}`,
              cursor: "pointer",
              position: "relative",
            }}
          >
            {(a.tone === "iconic" || a.tone === "recognized") && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            )}
            {a.label}
            {isActive && a.context && (
              <span
                onClick={(e) => { e.stopPropagation(); onToggleTooltip(null); }}
                style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0,
                  zIndex: 30, minWidth: 200, maxWidth: 260,
                  background: "#1A1410", color: "#F7F4EF",
                  padding: "7px 10px", borderRadius: 6,
                  fontFamily: "'Jost', sans-serif", fontSize: "0.7rem",
                  fontWeight: 300, letterSpacing: "normal", textTransform: "none",
                  lineHeight: 1.4,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                }}
              >{a.context}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
