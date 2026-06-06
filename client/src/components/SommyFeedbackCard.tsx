/**
 * SommyFeedbackCard — renders structured tasting feedback from /api/tasting-compare.
 *
 * Replaces the previous flowing-prose response with three labelled sections:
 *   - WHAT YOU NAILED — affirmation of correct notes
 *   - WHAT TO LOOK FOR NEXT TIME — gaps framed as opportunities, each with
 *     a concrete sensory tip
 *   - A SMALL CALIBRATION — gentle reframes (only when something needs it)
 *
 * Plus a one-sentence wine insight at the bottom.
 *
 * Tone rule: this component never uses words like "missed" or "wrong" in
 * its labels. The API system prompt enforces the same in the content.
 *
 * Fallback: if the API returned old-shape flat text (parse failed
 * upstream), we just render the prose so the user never sees nothing.
 */

import React from "react";

export type SommyFeedback = {
  opener: string;
  nailed: { note: string; affirmation: string }[];
  look_for_next_time: { note: string; tip: string }[];
  calibration: { what_user_said: string; gentle_reframe: string }[];
  insight: string;
};

export default function SommyFeedbackCard({
  feedback,
  fallbackText,
}: {
  feedback?: SommyFeedback | null;
  /** Plain-text fallback used when the API failed to return structured data. */
  fallbackText?: string;
}) {
  // Fallback path — render plain prose so users never get an empty card
  if (!feedback && fallbackText) {
    return (
      <div style={{
        background: "rgba(140,28,46,0.03)", borderRadius: 12, padding: 16,
        fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
        color: "#1A1410", lineHeight: 1.65, marginBottom: 20,
        whiteSpace: "pre-wrap",
      }}>
        {fallbackText}
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Opener — warm acknowledgment in italics, sets the tone */}
      {feedback.opener && (
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: "1.02rem", fontStyle: "italic",
          color: "#1A1410", lineHeight: 1.5, marginBottom: 18, padding: "0 4px",
        }}>
          {feedback.opener}
        </div>
      )}

      {/* WHAT YOU NAILED */}
      {feedback.nailed.length > 0 && (
        <Section
          label="WHAT YOU NAILED"
          accent="#1F6B35"
          bg="rgba(31,107,53,0.05)"
          border="rgba(31,107,53,0.18)"
          items={feedback.nailed.map((n) => ({
            primary: n.note,
            secondary: n.affirmation,
            bullet: "✓",
            bulletColor: "#1F6B35",
          }))}
        />
      )}

      {/* WHAT TO LOOK FOR NEXT TIME */}
      {feedback.look_for_next_time.length > 0 && (
        <Section
          label="WHAT TO LOOK FOR NEXT TIME"
          accent="#8C1C2E"
          bg="rgba(140,28,46,0.04)"
          border="rgba(140,28,46,0.18)"
          items={feedback.look_for_next_time.map((n) => ({
            primary: n.note,
            secondary: n.tip,
            bullet: "→",
            bulletColor: "#8C1C2E",
          }))}
        />
      )}

      {/* A SMALL CALIBRATION — only when there's something to gently reframe */}
      {feedback.calibration.length > 0 && (
        <Section
          label="A SMALL CALIBRATION"
          accent="#C9A030"
          bg="rgba(201,160,48,0.06)"
          border="rgba(201,160,48,0.22)"
          items={feedback.calibration.map((n) => ({
            primary: `You said "${n.what_user_said}"`,
            secondary: n.gentle_reframe,
            bullet: "·",
            bulletColor: "#C9A030",
          }))}
        />
      )}

      {/* One-sentence wine insight at the bottom */}
      {feedback.insight && (
        <div style={{
          background: "#F2EFE8", borderRadius: 10, padding: "12px 14px",
          fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300,
          fontStyle: "italic", color: "#5A5248", lineHeight: 1.5,
          borderLeft: "3px solid #8C1C2E",
        }}>
          {feedback.insight}
        </div>
      )}
    </div>
  );
}

function Section({
  label, accent, bg, border, items,
}: {
  label: string;
  accent: string;
  bg: string;
  border: string;
  items: { primary: string; secondary: string; bullet: string; bulletColor: string }[];
}) {
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 12,
      padding: "14px 16px", marginBottom: 12,
    }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
        letterSpacing: "0.12em", color: accent, marginBottom: 10,
      }}>
        {label}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: it.bullet === "·" ? "1.2rem" : "0.85rem",
              fontWeight: 600, color: it.bulletColor, lineHeight: it.bullet === "·" ? 0.6 : 1.3,
              flexShrink: 0, paddingTop: it.bullet === "·" ? 4 : 0,
              minWidth: 14,
            }}>
              {it.bullet}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: "0.94rem", fontWeight: 400,
                color: "#1A1410", lineHeight: 1.35, marginBottom: 3,
              }}>
                {it.primary}
              </div>
              <div style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300,
                color: "#5A5248", lineHeight: 1.5,
              }}>
                {it.secondary}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
