/**
 * RatingGradient — emotional 1-to-5 rating using a colour gradient.
 *
 * Replaces the 5-star rating system. Why colours over stars:
 *   - Stars are ambiguous ("is a 3 good or bad?"). Colours map directly
 *     to the emotional question the user wants to answer: did I like it?
 *   - Visual scan in lists is much faster (one colour cell vs five filled
 *     stars to count).
 *   - Sets up the long-term vision (June 2026): cross-user persona+rating
 *     aggregates become a producer-feedback marketplace. Colours encode
 *     reaction with no critic-bias semantics.
 *
 * Data: stays as integer 1-5 in `personal_rating`. No schema change.
 *
 * Accessibility:
 *   - Each rating has a text label (never colour-only)
 *   - Selected dot has a ring + scale (non-colour cue for the ~8% with
 *     red/green colour blindness)
 *
 * Modes:
 *   - INPUT (onChange present): all five dots shown, tap to select.
 *     Tapping the already-selected value clears it.
 *   - DISPLAY (no onChange): just the single coloured dot + label.
 *     Used inline in cards/lists.
 */

import React from "react";

export const RATING_COLORS = {
  1: "#C03838", // Disliked   — crimson
  2: "#D87530", // Meh        — orange
  3: "#C9A030", // OK         — mustard
  4: "#82A547", // Great      — sage green
  5: "#1F6B35", // Loved it   — forest green
} as const;

export const RATING_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Pass",
  2: "Meh",
  3: "OK",
  4: "Great",
  5: "Loved",
};

const SIZES = {
  sm: { dot: 14, gap: 6, font: 0.62, label: 0.5 },
  md: { dot: 20, gap: 8, font: 0.78, label: 0.55 },
  lg: { dot: 28, gap: 10, font: 0.95, label: 0.6 },
} as const;

type Size = keyof typeof SIZES;

export default function RatingGradient({
  value,
  onChange,
  size = "md",
  showLabel = true,
}: {
  value: number | null | undefined;
  onChange?: (n: number) => void;
  size?: Size;
  /** Show the text label below or beside the selected dot. */
  showLabel?: boolean;
}) {
  const s = SIZES[size];
  const interactive = !!onChange;
  const current = (value && value >= 1 && value <= 5 ? value : 0) as 0 | 1 | 2 | 3 | 4 | 5;

  // ─── Display mode (read-only) ─────────────────────────────────────────────
  // When no rating yet, show a faint placeholder so the row doesn't look
  // empty in journal/cellar contexts.
  if (!interactive) {
    if (!current) {
      return (
        <span style={{
          fontFamily: "'Geist Mono', monospace", fontSize: `${s.label}rem`,
          letterSpacing: "0.08em", color: "#8C7468",
        }}>
          UNRATED
        </span>
      );
    }
    const color = RATING_COLORS[current];
    const label = RATING_LABELS[current];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: s.gap }}>
        <span
          aria-label={`Rating: ${label}`}
          style={{
            display: "inline-block",
            width: s.dot, height: s.dot, borderRadius: "50%",
            background: color,
            boxShadow: `0 0 0 2px ${color}22`,
          }}
        />
        {showLabel && (
          <span style={{
            fontFamily: "'Geist Mono', monospace", fontSize: `${s.label}rem`,
            letterSpacing: "0.08em", color: "#5A5248",
          }}>
            {label.toUpperCase()}
          </span>
        )}
      </span>
    );
  }

  // ─── Input mode (tap to rate) ─────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
      <div style={{ display: "flex", gap: s.gap, alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = n === current;
          const color = RATING_COLORS[n as 1 | 2 | 3 | 4 | 5];
          return (
            <button
              key={n}
              type="button"
              aria-label={`Rate ${RATING_LABELS[n as 1 | 2 | 3 | 4 | 5]}`}
              onClick={() => onChange(n === current ? 0 : n)}
              style={{
                width: s.dot + (isSelected ? 4 : 0),
                height: s.dot + (isSelected ? 4 : 0),
                borderRadius: "50%",
                background: color,
                border: isSelected ? `2px solid #F7F4EF` : "none",
                boxShadow: isSelected
                  ? `0 0 0 2px ${color}, 0 2px 6px ${color}44`
                  : "0 1px 2px rgba(0,0,0,0.06)",
                opacity: current === 0 || isSelected ? 1 : 0.32,
                cursor: "pointer",
                padding: 0,
                transition: "opacity 0.15s, transform 0.15s, box-shadow 0.15s",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
      {showLabel && (
        <span style={{
          fontFamily: "'Geist Mono', monospace", fontSize: `${s.label}rem`,
          letterSpacing: "0.1em", color: current ? "#1A1410" : "#8C7468",
          minHeight: "0.9rem", // reserve space so layout doesn't jump
        }}>
          {current ? RATING_LABELS[current].toUpperCase() : "TAP TO RATE"}
        </span>
      )}
    </div>
  );
}
