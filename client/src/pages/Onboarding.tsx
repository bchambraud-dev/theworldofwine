import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { CURRENCIES } from "@/lib/currencies";

type Step = "location" | "experience" | "style" | "goal" | "done";

const COUNTRIES = [
  "United States",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Denmark",
  "France",
  "Germany",
  "Hong Kong",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Peru",
  "Philippines",
  "Portugal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "UAE",
  "United Kingdom",
];

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  "United States": "USD",
  "United Kingdom": "GBP",
  "Australia": "AUD",
  "Canada": "CAD",
  "New Zealand": "NZD",
  "Switzerland": "CHF",
  "Singapore": "SGD",
  "Japan": "JPY",
  "China": "CNY",
  "Hong Kong": "HKD",
  "South Korea": "KRW",
  "Thailand": "THB",
  "Malaysia": "MYR",
  "India": "INR",
  "South Africa": "ZAR",
  "Brazil": "BRL",
  "Argentina": "ARS",
  "Chile": "CLP",
  "Mexico": "MXN",
  "Sweden": "SEK",
  "Denmark": "DKK",
  "Norway": "NOK",
  "UAE": "AED",
  "Israel": "ILS",
  "Indonesia": "IDR",
  "Philippines": "PHP",
  "Colombia": "COP",
  "Peru": "PEN",
  // Euro countries
  "France": "EUR",
  "Germany": "EUR",
  "Italy": "EUR",
  "Spain": "EUR",
  "Portugal": "EUR",
  "Austria": "EUR",
  "Belgium": "EUR",
  "Netherlands": "EUR",
  "Ireland": "EUR",
};

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

const STEPS: Step[] = ["location", "experience", "style", "goal"];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("location");
  const [country, setCountry] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [level, setLevel] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [goalIndex, setGoalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleType = (key: string) => {
    setSelectedTypes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    const mapped = COUNTRY_CURRENCY_MAP[value];
    if (mapped) setCurrencyCode(mapped);
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);

    await supabase.from("user_profiles").update({
      experience_level: level,
      base_country: country || null,
      currency_code: currencyCode,
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
    // Auto-open Sommy with welcome greeting on landing page
    setTimeout(() => setLocation("/?welcome=1"), 1800);
  };

  const stepIndex = STEPS.indexOf(step);

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
    btnSub: { fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginTop: 2 },
    cta: (enabled: boolean) => ({
      width: "100%", padding: "14px", borderRadius: 12, border: "none", marginTop: 8,
      background: enabled ? "#8C1C2E" : "#D4D1CA", color: "#F7F4EF", cursor: enabled ? "pointer" : "default",
      fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.15s",
    }),
    step: { fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#D4D1CA", marginBottom: 16 },
    select: {
      width: "100%", padding: "13px 14px", marginBottom: 12,
      border: "1.5px solid #EDEAE3", borderRadius: 12, background: "white",
      fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 400, color: "#1A1410",
      cursor: "pointer", appearance: "none" as const,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235A5248' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 14px center",
    },
    label: {
      fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
      letterSpacing: "0.12em", color: "#5A5248", marginBottom: 6, display: "block",
    },
  };

  if (step === "done") {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center" }}>
          <svg
            viewBox="0 0 80 100"
            style={{ width: 48, height: 60, color: "#8C1C2E", marginBottom: 16 }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
            <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
            <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
          </svg>
          <h1 style={{ ...styles.h1, textAlign: "center", marginBottom: 12 }}>You're all set.</h1>
          <p style={{ ...styles.sub, textAlign: "center" }}>Sommy is ready to guide your journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {step === "location" && (
          <>
            <div style={styles.step}>STEP 1 OF 4</div>
            <h1 style={styles.h1}>Where are you based?</h1>
            <p style={styles.sub}>Sommy uses this for prices, availability, and regional recommendations.</p>

            <label style={styles.label}>COUNTRY</label>
            <select
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
              style={styles.select}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={{ ...styles.label, marginTop: 8 }}>PREFERRED CURRENCY</label>
            <select
              value={currencyCode}
              onChange={e => setCurrencyCode(e.target.value)}
              style={styles.select}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>
              ))}
            </select>

            <button onClick={() => setStep("experience")} style={styles.cta(true)}>
              {country ? "Continue" : "Skip"}
            </button>
          </>
        )}

        {step === "experience" && (
          <>
            <div style={styles.step}>STEP 2 OF 4</div>
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
            <div style={styles.step}>STEP 3 OF 4</div>
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
            <div style={styles.step}>STEP 4 OF 4</div>
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
        {STEPS.map((s, i) => (
          <div key={s} style={{ width: 6, height: 6, borderRadius: "50%", background: i === stepIndex ? "#8C1C2E" : i < stepIndex ? "#5A5248" : "#D4D1CA", transition: "background 0.2s" }} />
        ))}
      </div>
    </div>
  );
}
