import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Step = "experience" | "style" | "goal" | "done";

const WINE_TYPES = [
  { key: "red", label: "Red", description: "Cabernet, Pinot Noir, Merlot" },
  { key: "white", label: "White", description: "Chardonnay, Riesling, Sauvignon Blanc" },
  { key: "sparkling", label: "Sparkling", description: "Champagne, Prosecco, Cava" },
  { key: "rosé", label: "Rosé", description: "Provence, dry and refreshing" },
  { key: "fortified", label: "Fortified", description: "Port, Sherry, Madeira" },
];

const STARTER_GOALS = [
  { type: "try_countries", title: "Try wines from 5 different countries", target: 5 },
  { type: "try_grapes", title: "Explore 8 different grape varieties", target: 8 },
  { type: "complete_journey", title: "Complete the Beginner's Journey", target: 1 },
  { type: "journal_entries", title: "Log 10 wines in your journal", target: 10 },
];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("experience");
  const [level, setLevel] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [goalIndex, setGoalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleType = (key: string) => {
    setSelectedTypes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);

    await supabase.from("user_profiles").update({
      experience_level: level,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    if (selectedTypes.length > 0) {
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        preferred_types: selectedTypes,
      });
    }

    if (goalIndex !== null) {
      const goal = STARTER_GOALS[goalIndex];
      await supabase.from("user_goals").insert({
        user_id: user.id,
        goal_type: goal.type,
        title: goal.title,
        target_count: goal.target,
      });
    }

    await refreshProfile();
    setStep("done");
    setTimeout(() => setLocation("/"), 1800);
  };

  const styles = {
    page: { minHeight: "100vh", background: "#F7F4EF", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: 24 },
    card: { background: "white", borderRadius: 20, padding: "40px 36px", maxWidth: 480, width: "100%", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1px solid #EDEAE3" },
    h1: { fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 400, color: "#1A1410", marginBottom: 8, lineHeight: 1.2 },
    sub: { fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 28, lineHeight: 1.6 },
    btn: (active: boolean) => ({
      display: "block", width: "100%", padding: "14px 18px", marginBottom: 8,
      border: `1.5px solid ${active ? "#8C1C2E" : "#EDEAE3"}`,
      borderRadius: 12, background: active ? "rgba(140,28,46,0.05)" : "white",
      cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s",
    }),
    btnLabel: { fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: active => active ? 500 : 300, color: "#1A1410" },
    btnSub: { fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginTop: 2 },
    cta: (enabled: boolean) => ({
      width: "100%", padding: "14px", borderRadius: 12, border: "none", marginTop: 8,
      background: enabled ? "#8C1C2E" : "#D4D1CA", color: "#F7F4EF", cursor: enabled ? "pointer" : "default",
      fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.15s",
    }),
    step: { fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#D4D1CA", marginBottom: 16 },
  };

  if (step === "done") {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🍷</div>
          <h1 style={{ ...styles.h1, textAlign: "center", marginBottom: 12 }}>You're all set.</h1>
          <p style={{ ...styles.sub, textAlign: "center" }}>Sommy is ready to guide your journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {step === "experience" && (
          <>
            <div style={styles.step}>STEP 1 OF 3</div>
            <h1 style={styles.h1}>Where are you in your wine journey?</h1>
            <p style={styles.sub}>Sommy will tailor everything to your level. You can always change this later.</p>
            {[
              { key: "beginner", label: "I'm just starting out", desc: "I mostly pick wine by price or the label" },
              { key: "intermediate", label: "I know my way around", desc: "I have favourite regions and grapes I seek out" },
              { key: "expert", label: "I'm pretty serious about wine", desc: "I read tasting notes, follow critics, visit regions" },
            ].map(opt => (
              <button key={opt.key} onClick={() => setLevel(opt.key)} style={styles.btn(level === opt.key)}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: level === opt.key ? 500 : 400, color: "#1A1410" }}>{opt.label}</div>
                <div style={styles.btnSub}>{opt.desc}</div>
              </button>
            ))}
            <button onClick={() => setStep("style")} disabled={!level} style={styles.cta(!!level)}>Continue</button>
          </>
        )}

        {step === "style" && (
          <>
            <div style={styles.step}>STEP 2 OF 3</div>
            <h1 style={styles.h1}>What do you usually drink?</h1>
            <p style={styles.sub}>Pick all that apply — Sommy uses this to make better recommendations.</p>
            {WINE_TYPES.map(t => (
              <button key={t.key} onClick={() => toggleType(t.key)} style={styles.btn(selectedTypes.includes(t.key))}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: selectedTypes.includes(t.key) ? 500 : 400, color: "#1A1410" }}>{t.label}</div>
                <div style={styles.btnSub}>{t.description}</div>
              </button>
            ))}
            <button onClick={() => setStep("goal")} style={styles.cta(true)}>
              {selectedTypes.length === 0 ? "Skip" : "Continue"}
            </button>
          </>
        )}

        {step === "goal" && (
          <>
            <div style={styles.step}>STEP 3 OF 3</div>
            <h1 style={styles.h1}>Set your first goal</h1>
            <p style={styles.sub}>Goals give your journey direction. Sommy will track your progress and celebrate wins.</p>
            {STARTER_GOALS.map((g, i) => (
              <button key={g.type} onClick={() => setGoalIndex(i)} style={styles.btn(goalIndex === i)}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: goalIndex === i ? 500 : 400, color: "#1A1410" }}>{g.title}</div>
              </button>
            ))}
            <button onClick={finish} disabled={saving} style={styles.cta(!saving)}>
              {saving ? "Setting up your journey..." : goalIndex !== null ? "Let's go" : "Skip for now"}
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        {(["experience", "style", "goal"] as Step[]).map(s => (
          <div key={s} style={{ width: 6, height: 6, borderRadius: "50%", background: step === s ? "#8C1C2E" : "#D4D1CA", transition: "background 0.2s" }} />
        ))}
      </div>
    </div>
  );
}
