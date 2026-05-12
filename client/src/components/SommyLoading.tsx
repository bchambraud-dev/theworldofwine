/**
 * SommyLoading — playful multi-stage loading state for in-flight Sommy requests.
 *
 * Two modes:
 *   - text (default): subtle "Sommy is thinking..." pill, calm
 *   - scan: full cheeky experience for label scans which take 30-50s
 *           Rotates through 4-5 witty Sommy-voice steps with a swirling
 *           wine glass icon. Reframes the wait as part of the experience.
 *
 * Design intent (May 2026):
 *   - First-person Sommy voice ("I'm consulting my notes", not "Sommy is...")
 *   - No emojis (user rule, per memory)
 *   - On-brand: burgundy + cream palette, Fraunces for the verb, Jost for support
 *   - Glass swirl is a gentle SVG rotation with a subtle "wine" arc inside
 *   - Step changes every ~5s so even slow scans don't feel stuck
 *
 * Why not just one line? When a label scan takes 35s, a single rotating
 * "Sommy is thinking..." feels broken. Multi-stage tells the user the wait
 * is intentional and progress is happening, even though the underlying call
 * is monolithic.
 */
import { useEffect, useState } from "react";

const SCAN_STEPS = [
  "Reading the label",
  "Consulting my notes",
  "Letting the tannins settle",
  "Tasting it mentally",
  "Pouring my thoughts together",
];

interface Props {
  /** "scan" = playful multi-stage. "text" = simple thinking pill. */
  mode?: "scan" | "text";
}

export default function SommyLoading({ mode = "text" }: Props) {
  // Rotate steps every 5s. We cap on the last step so the message doesn't
  // loop back to "Reading the label" if the response takes a long time —
  // implies progress, not aimless waiting.
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (mode !== "scan") return;
    const t = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, SCAN_STEPS.length - 1));
    }, 5000);
    return () => clearInterval(t);
  }, [mode]);

  if (mode === "text") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{
          background: "#EDEAE3", borderRadius: "14px 14px 14px 4px",
          padding: "11px 15px",
          fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", fontWeight: 300,
          color: "#5A5248", opacity: 0.6,
        }}>
          Sommy is thinking...
        </div>
      </div>
    );
  }

  // Scan mode: glass swirl + rotating step
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{
        background: "linear-gradient(180deg, rgba(140,28,46,0.04) 0%, rgba(212,165,106,0.06) 100%)",
        border: "1px solid rgba(140,28,46,0.18)",
        borderRadius: "14px 14px 14px 4px",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 14,
        minWidth: 220,
      }}>
        {/* Swirling glass icon */}
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          animation: "sommy-swirl 2.6s ease-in-out infinite",
          transformOrigin: "50% 70%",
        }}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#8C1C2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Glass bowl */}
            <path d="M7 3h10c0 4-2 7-5 7s-5-3-5-7z" />
            {/* Wine surface — a small arc near the top of the bowl */}
            <path d="M8.4 5h7.2" stroke="#8C1C2E" strokeWidth="1.4" />
            {/* Stem + base */}
            <line x1="12" y1="10" x2="12" y2="17" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        </div>

        {/* Rotating step text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#8C1C2E", marginBottom: 3,
          }}>
            SOMMY
          </div>
          <div
            key={stepIdx /* re-mount on step change so the fade animation re-fires */}
            style={{
              fontFamily: "'Fraunces', serif", fontSize: "0.95rem", fontWeight: 400,
              color: "#1A1410", lineHeight: 1.2,
              animation: "sommy-fade-in 0.4s ease-out",
            }}
          >
            {SCAN_STEPS[stepIdx]}
            <span style={{ opacity: 0.4, marginLeft: 2 }}>…</span>
          </div>
        </div>
      </div>

      {/* Inline keyframes scoped to this component */}
      <style>{`
        @keyframes sommy-swirl {
          0%   { transform: rotate(-12deg); }
          50%  { transform: rotate(12deg); }
          100% { transform: rotate(-12deg); }
        }
        @keyframes sommy-fade-in {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
