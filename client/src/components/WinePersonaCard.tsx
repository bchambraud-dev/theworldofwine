/**
 * WinePersonaCard — Sommy's read on the user's wine identity.
 *
 * Shown on the Profile page as the centerpiece below the user's name +
 * stats. Generates from the user's palate digest + journal aggregate
 * stats. Regenerates when palate_version bumps (stale detection).
 *
 * States:
 *   - no_palate  → CTA card prompting the user to start the palate form
 *   - generating → loading shimmer + auto-generate in background
 *   - ready      → archetype + headline + paragraph + 6 trait cards
 *   - ready+stale→ render current persona dimmed, regenerate in background
 *
 * The persona JSON is also a foundation for future social/community features.
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { directSelect, directUpdate } from "@/lib/supabaseDirectFetch";

interface PersonaTraitCard {
  label: string;
  value: string;
  hint?: string;
}

interface WinePersona {
  archetype_name: string;
  headline: string;
  paragraph: string;
  trait_cards: PersonaTraitCard[];
}

interface Props {
  userId: string;
  /** Called when the persona generates for the first time so parent can refresh. */
  onPersonaReady?: () => void;
  /** Called when the user taps the "Start palate" CTA or the in-card
      "edit your palate" link. Parent opens the intake sheet. */
  onStartPalate?: () => void;
}

type State =
  | { kind: "loading" }
  | { kind: "no_palate" }
  | { kind: "generating" }
  | { kind: "ready"; persona: WinePersona; stale: boolean };

export default function WinePersonaCard({ userId, onPersonaReady, onStartPalate }: Props) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const generatingRef = useRef(false);

  const generate = useCallback(async (
    palateDigest: any,
    palateVersion: number,
    experienceLevel: string,
    journalStats: any,
  ) => {
    if (generatingRef.current) return;
    generatingRef.current = true;
    try {
      const resp = await fetch("/api/wine-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "persona",
          palate_digest: palateDigest,
          experience_level: experienceLevel,
          journal_stats: journalStats,
        }),
      });
      if (!resp.ok) throw new Error(`persona generation failed (${resp.status})`);
      const json = await resp.json();
      const persona: WinePersona = json.data;
      await directUpdate("user_profiles", userId, {
        wine_persona_json: persona,
        wine_persona_palate_version: palateVersion,
        wine_persona_generated_at: new Date().toISOString(),
      });
      setState({ kind: "ready", persona, stale: false });
      onPersonaReady?.();
    } catch (e) {
      console.warn("persona generation failed:", e);
    } finally {
      generatingRef.current = false;
    }
  }, [userId, onPersonaReady]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [prefsRows, profileRows] = await Promise.all([
          directSelect<any>(
            "user_preferences",
            `select=palate_digest,palate_version,palate_form_complete&user_id=eq.${userId}`,
          ),
          directSelect<any>(
            "user_profiles",
            `select=wine_persona_json,wine_persona_palate_version,experience_level&id=eq.${userId}`,
          ),
        ]);

        const prefs   = (Array.isArray(prefsRows)   && prefsRows[0])   || null;
        const profile = (Array.isArray(profileRows) && profileRows[0]) || null;

        if (!prefs || !prefs.palate_form_complete || !prefs.palate_digest) {
          setState({ kind: "no_palate" });
          return;
        }

        // Aggregate journal stats (no specific wine names — same rule as chat context).
        let journalStats: any = null;
        try {
          const journal = await directSelect<any>(
            "wine_journal",
            `select=personal_rating,region,grapes&user_id=eq.${userId}`,
          );
          if (Array.isArray(journal) && journal.length > 0) {
            const highlyRated = journal.filter(w => (w.personal_rating ?? 0) >= 4);
            const regions = Array.from(new Set(journal.map(w => w.region).filter(Boolean))).slice(0, 10);
            const grapes  = Array.from(new Set(journal.map(w => w.grapes).filter(Boolean))).slice(0, 10);
            const ratings = journal.map(w => w.personal_rating).filter(r => r != null) as number[];
            const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
            journalStats = {
              total_logged: journal.length,
              highly_rated_count: highlyRated.length,
              avg_rating: avgRating,
              regions_explored: regions,
              grapes_tasted: grapes,
            };
          }
        } catch {
          /* non-fatal */
        }

        const experienceLevel = profile?.experience_level || "intermediate";

        if (profile?.wine_persona_json && profile.wine_persona_palate_version === prefs.palate_version) {
          setState({ kind: "ready", persona: profile.wine_persona_json, stale: false });
          return;
        }

        if (profile?.wine_persona_json) {
          setState({ kind: "ready", persona: profile.wine_persona_json, stale: true });
          generate(prefs.palate_digest, prefs.palate_version, experienceLevel, journalStats);
          return;
        }

        setState({ kind: "generating" });
        generate(prefs.palate_digest, prefs.palate_version, experienceLevel, journalStats);
      } catch (e) {
        console.warn("persona load failed:", e);
        setState({ kind: "no_palate" });
      }
    })();
  }, [userId, generate]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (state.kind === "loading") {
    return (
      <CardShell>
        <div style={{ height: 18, width: 130, background: "#EDEAE3", borderRadius: 4, marginBottom: 10 }} />
        <div style={{ height: 24, width: "75%", background: "#EDEAE3", borderRadius: 4, marginBottom: 14 }} />
        <div style={{ height: 14, width: "100%", background: "#EDEAE3", borderRadius: 4, marginBottom: 6 }} />
        <div style={{ height: 14, width: "90%", background: "#EDEAE3", borderRadius: 4 }} />
      </CardShell>
    );
  }

  if (state.kind === "no_palate") {
    return (
      <CardShell highlight>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#8C1C2E", marginBottom: 8 }}>
          YOUR WINE PERSONA
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.3, marginBottom: 10 }}>
          Sommy doesn’t know you yet.
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.5, marginBottom: 14 }}>
          Tell me about your palate and I’ll give you a wine identity — plus match scores on every wine in your cellar.
        </div>
        <button onClick={onStartPalate} style={{
          background: "#8C1C2E", color: "#F7F4EF", border: "none",
          padding: "10px 18px", borderRadius: 22,
          fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 500,
          cursor: "pointer",
        }}>
          Start your palate
        </button>
      </CardShell>
    );
  }

  if (state.kind === "generating") {
    return (
      <CardShell highlight>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#8C1C2E", marginBottom: 8 }}>
          YOUR WINE PERSONA
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.05rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.3 }}>
          Sommy is reading your palate…
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", marginTop: 6 }}>
          This usually takes about 10 seconds.
        </div>
      </CardShell>
    );
  }

  // ready (fresh or stale)
  const { persona, stale } = state;
  return (
    <CardShell highlight>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em",
        color: "#8C1C2E", marginBottom: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>YOUR WINE PERSONA</span>
        {stale && (
          <span style={{
            fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em",
            color: "#5A5248", opacity: 0.7,
          }}>SOMMY IS REFINING…</span>
        )}
      </div>

      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: "1.45rem", fontWeight: 400,
        color: "#1A1410", lineHeight: 1.15, marginBottom: 6, opacity: stale ? 0.55 : 1,
      }}>
        {persona.archetype_name}
      </div>

      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: "0.96rem", fontWeight: 400, fontStyle: "italic",
        color: "#8C1C2E", lineHeight: 1.35, marginBottom: 12, opacity: stale ? 0.55 : 1,
      }}>
        {persona.headline}
      </div>

      <div style={{
        fontFamily: "'Jost', sans-serif", fontSize: "0.86rem", fontWeight: 300,
        color: "#1A1410", lineHeight: 1.55, marginBottom: 18, opacity: stale ? 0.55 : 1,
      }}>
        {persona.paragraph}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, opacity: stale ? 0.55 : 1 }}>
        {persona.trait_cards.slice(0, 6).map((t, i) => (
          <div key={i} style={{
            background: "white", border: "1px solid rgba(140,28,46,0.18)",
            borderRadius: 10, padding: "10px 12px",
          }}>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#8C1C2E", marginBottom: 4,
            }}>{t.label}</div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: "0.88rem", fontWeight: 500,
              color: "#1A1410", lineHeight: 1.2,
            }}>{t.value}</div>
            {t.hint && (
              <div style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300,
                color: "#5A5248", lineHeight: 1.4, marginTop: 4,
              }}>{t.hint}</div>
            )}
          </div>
        ))}
      </div>

      {/* Edit-your-palate link — only meaningful when a persona exists, since
          editing the palate regenerates the persona. Always visible below the
          trait cards so users always know where to update their preferences. */}
      {onStartPalate && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button onClick={onStartPalate} style={{
            background: "none", border: "none", padding: "6px 10px", cursor: "pointer",
            fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.1em", color: "#8C1C2E",
          }}>
            EDIT YOUR PALATE →
          </button>
        </div>
      )}
    </CardShell>
  );
}

function CardShell({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight
        ? "linear-gradient(180deg, rgba(140,28,46,0.04) 0%, rgba(212,165,106,0.06) 100%)"
        : "white",
      border: `1px solid ${highlight ? "rgba(140,28,46,0.22)" : "#EDEAE3"}`,
      borderRadius: 14, padding: "18px 18px 20px", marginBottom: 24,
    }}>
      {children}
    </div>
  );
}
