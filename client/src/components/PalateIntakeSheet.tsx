/**
 * PalateIntakeSheet — five-page palate intake form.
 *
 * Architectural notes (per twow-pm-review):
 *   - Per-page save: every "Next" tap persists the page's fields to user_preferences
 *     so users who bail halfway can resume.
 *   - Final confirm: bumps palate_version, marks palate_form_complete=true, and
 *     fires the post-save handler so the parent can kick off a full rescore.
 *   - palate_form_step (int 0-5) tracks resume state; we resume on that step.
 *   - Tone: Sommy-led, first-person, max one short line per page. Then the question.
 *
 * Scoring rubric integration:
 *   - Fields here feed into PALATE_DIGEST_SYSTEM in /api/wine-context.
 *   - flavour_preferences, structure (body/acidity/tannin 1-10),
 *     regions_of_interest, regions_to_explore, adventurousness (1-5),
 *     budget_min/max + currency, price_quality_posture, preferred_types.
 *
 * Currency awareness:
 *   - Budget uses user's currency_code from user_profiles (defaults to SGD for the
 *     current user). Brackets adjust to feel natural in that currency.
 *
 * Voice:
 *   - First-person Sommy. No emojis. Short lines (≤12 words per intro line).
 *   - Never says "AI" or "I'll guess".
 */
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { directUpdate, getAccessToken, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";

// ── Constants ────────────────────────────────────────────────────────────────

const WINE_TYPES = [
  { key: "red",       label: "Red" },
  { key: "white",     label: "White" },
  { key: "sparkling", label: "Sparkling" },
  { key: "rosé",      label: "Rosé" },
  { key: "orange",    label: "Orange" },
  { key: "dessert",   label: "Dessert" },
  { key: "fortified", label: "Fortified" },
];

const FLAVOUR_TAGS = [
  "dark fruit", "red fruit", "citrus", "tropical fruit", "stone fruit",
  "floral", "herbal", "earthy", "smoky", "oaky",
  "savoury", "spicy", "buttery", "mineral", "honeyed",
];

const REGIONS = [
  "Bordeaux", "Burgundy", "Rhône", "Champagne", "Loire", "Alsace",
  "Tuscany", "Piedmont", "Sicily",
  "Rioja", "Ribera del Duero", "Priorat",
  "Mosel", "Rheingau",
  "Douro", "Porto",
  "Napa Valley", "Sonoma", "Oregon",
  "Mendoza", "Maipo", "Casablanca",
  "Barossa", "McLaren Vale", "Margaret River",
  "Marlborough", "Central Otago",
  "Mendoza", "Stellenbosch",
];

// Dedupe (Mendoza appeared twice on purpose to catch ordering errors — fix here)
const REGION_OPTIONS = Array.from(new Set(REGIONS));

const ADVENTURE_BANDS = [
  { value: 1, label: "Stick with what I know",   sub: "Comfort first" },
  { value: 2, label: "Mostly familiar",          sub: "An occasional new bottle" },
  { value: 3, label: "Curious",                  sub: "Open to a nudge" },
  { value: 4, label: "Open to anything",         sub: "Push me a little" },
  { value: 5, label: "Bring on the unknown",     sub: "Surprise me" },
];

const PRICE_POSTURES = [
  { key: "value-first",          label: "Best bang for buck",     sub: "I want value above all" },
  { key: "balanced",             label: "Fair price, fair wine",  sub: "Quality and price should balance" },
  { key: "quality-first",        label: "Happy to pay for quality", sub: "Price isn't the main factor" },
  { key: "occasion",             label: "Splurge on occasion",    sub: "Save up for the right bottle" },
];

// Budget brackets per currency. Numbers chosen to feel natural in each market.
// Brackets per user feedback (May 2026): under 30, 30—50, 50—100, 100—200, 200+.
const BUDGET_BRACKETS_BY_CURRENCY: Record<string, { min: number; max: number; label: string }[]> = {
  SGD: [
    { min: 0,   max: 30,   label: "Under 30" },
    { min: 30,  max: 50,   label: "30 — 50" },
    { min: 50,  max: 100,  label: "50 — 100" },
    { min: 100, max: 200,  label: "100 — 200" },
    { min: 200, max: 99999, label: "200+" },
  ],
  USD: [
    { min: 0,   max: 30,   label: "Under 30" },
    { min: 30,  max: 50,   label: "30 — 50" },
    { min: 50,  max: 100,  label: "50 — 100" },
    { min: 100, max: 200,  label: "100 — 200" },
    { min: 200, max: 99999, label: "200+" },
  ],
  EUR: [
    { min: 0,   max: 30,   label: "Under 30" },
    { min: 30,  max: 50,   label: "30 — 50" },
    { min: 50,  max: 100,  label: "50 — 100" },
    { min: 100, max: 200,  label: "100 — 200" },
    { min: 200, max: 99999, label: "200+" },
  ],
  GBP: [
    { min: 0,   max: 30,   label: "Under 30" },
    { min: 30,  max: 50,   label: "30 — 50" },
    { min: 50,  max: 100,  label: "50 — 100" },
    { min: 100, max: 200,  label: "100 — 200" },
    { min: 200, max: 99999, label: "200+" },
  ],
};

function brackets(currency: string) {
  return BUDGET_BRACKETS_BY_CURRENCY[currency] || BUDGET_BRACKETS_BY_CURRENCY.SGD;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface ExistingPalate {
  preferred_types?: string[] | null;
  body_preference?: number | null;
  acidity_preference?: number | null;
  tannin_preference?: number | null;
  flavour_preferences?: string[] | null;
  regions_of_interest?: string[] | null;
  regions_to_explore?: string[] | null;
  adventurousness?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency?: string | null;
  price_quality_posture?: string | null;
  palate_form_step?: number | null;
  palate_form_complete?: boolean | null;
}

interface Props {
  userId: string;
  currency: string;
  existing: ExistingPalate | null;
  /** Called after the final page is confirmed and the digest is generated. */
  onComplete: () => void;
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PalateIntakeSheet({ userId, currency, existing, onComplete, onClose }: Props) {
  // Resume at the step the user left at, or 0 for fresh start
  const startStep = existing?.palate_form_step && !existing.palate_form_complete
    ? Math.min(existing.palate_form_step, 4)
    : 0;
  const [step, setStep] = useState<number>(startStep);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Page 1: Wine types
  const [types, setTypes] = useState<string[]>(existing?.preferred_types ?? []);

  // Page 2: Flavour preferences
  const [flavours, setFlavours] = useState<string[]>(existing?.flavour_preferences ?? []);

  // Page 3: Structure
  const [body,    setBody]    = useState<number>(existing?.body_preference    ?? 5);
  const [acidity, setAcidity] = useState<number>(existing?.acidity_preference ?? 5);
  const [tannin,  setTannin]  = useState<number>(existing?.tannin_preference  ?? 5);

  // Page 4: Regions + adventurousness
  const [regionsLoved,   setRegionsLoved]   = useState<string[]>(existing?.regions_of_interest ?? []);
  const [regionsCurious, setRegionsCurious] = useState<string[]>(existing?.regions_to_explore  ?? []);
  const [adventurousness, setAdventurousness] = useState<number>(existing?.adventurousness ?? 3);

  // Page 5: Budget + posture
  const [budgetIdx, setBudgetIdx] = useState<number>(() => {
    if (existing?.budget_min == null) return 1;
    const b = brackets(currency);
    const found = b.findIndex(br => br.min === existing.budget_min);
    return found >= 0 ? found : 1;
  });
  const [posture, setPosture] = useState<string>(existing?.price_quality_posture ?? "balanced");

  // ── Per-page save ──────────────────────────────────────────────────────────

  // Upsert helper: user_preferences has UNIQUE(user_id) after our migration so
  // we can safely PATCH by user_id without worrying about duplicates.
  const upsertPrefs = useCallback(async (patch: Record<string, unknown>) => {
    const token = await getAccessToken();
    if (!token) throw new Error("not authenticated");
    // First try PATCH-by-user_id (existing row); fall back to POST if no row.
    const patchResp = await fetch(`${SUPABASE_URL}/rest/v1/user_preferences?user_id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(patch),
    });
    if (!patchResp.ok) throw new Error(`patch failed: ${patchResp.status}`);
    const rows = await patchResp.json();
    if (Array.isArray(rows) && rows.length > 0) return; // updated existing
    // No row yet — insert
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/user_preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ user_id: userId, ...patch }),
    });
    if (!insertResp.ok) throw new Error(`insert failed: ${insertResp.status}`);
  }, [userId]);

  const saveCurrentPage = useCallback(async (nextStep: number) => {
    const patch: Record<string, unknown> = {
      palate_form_step: nextStep,
    };
    if (step === 0) patch.preferred_types = types;
    if (step === 1) patch.flavour_preferences = flavours;
    if (step === 2) {
      patch.body_preference = body;
      patch.acidity_preference = acidity;
      patch.tannin_preference = tannin;
    }
    if (step === 3) {
      patch.regions_of_interest = regionsLoved;
      patch.regions_to_explore = regionsCurious;
      patch.adventurousness = adventurousness;
    }
    if (step === 4) {
      const b = brackets(currency)[budgetIdx];
      patch.budget_min = b.min;
      patch.budget_max = b.max;
      patch.budget_currency = currency;
      patch.price_quality_posture = posture;
    }
    await upsertPrefs(patch);
  }, [step, types, flavours, body, acidity, tannin, regionsLoved, regionsCurious, adventurousness, budgetIdx, posture, currency, upsertPrefs]);

  const handleNext = useCallback(async () => {
    setSubmitError(null);
    setSaving(true);
    try {
      const nextStep = step + 1;
      await saveCurrentPage(nextStep);
      setStep(nextStep);
    } catch (e: any) {
      setSubmitError(e?.message || "Couldn't save");
    } finally {
      setSaving(false);
    }
  }, [step, saveCurrentPage]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  // ── Final confirm ──────────────────────────────────────────────────────────

  const handleFinish = useCallback(async () => {
    setSubmitError(null);
    setSaving(true);
    try {
      // 1. Save page 5 fields
      await saveCurrentPage(5);

      // 2. Generate palate digest via the new API endpoint
      const formForDigest = {
        preferred_types: types,
        flavour_preferences: flavours,
        body_preference: body,
        acidity_preference: acidity,
        tannin_preference: tannin,
        regions_of_interest: regionsLoved,
        regions_to_explore: regionsCurious,
        adventurousness,
        budget_min: brackets(currency)[budgetIdx].min,
        budget_max: brackets(currency)[budgetIdx].max,
        budget_currency: currency,
        price_quality_posture: posture,
      };
      const resp = await fetch("/api/wine-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "palate_digest", form: formForDigest }),
      });
      if (!resp.ok) throw new Error(`Sommy digest failed: ${resp.status}`);
      const json = await resp.json();

      // 3. Persist digest + bump version + mark complete
      // Bump palate_version using current value + 1. We do a fresh read first
      // so we never clobber an out-of-date copy.
      const token = await getAccessToken();
      const cur = await fetch(`${SUPABASE_URL}/rest/v1/user_preferences?user_id=eq.${userId}&select=palate_version`, {
        headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
      });
      const curRows = await cur.json();
      const curVersion = (Array.isArray(curRows) && curRows[0]?.palate_version) || 0;
      await upsertPrefs({
        palate_digest: json.data,
        palate_version: curVersion + 1,
        palate_updated_at: new Date().toISOString(),
        palate_form_complete: true,
        palate_form_step: 5,
      });

      onComplete();
    } catch (e: any) {
      setSubmitError(e?.message || "Couldn't finalize your palate");
    } finally {
      setSaving(false);
    }
  }, [saveCurrentPage, types, flavours, body, acidity, tannin, regionsLoved, regionsCurious, adventurousness, budgetIdx, posture, currency, userId, upsertPrefs, onComplete]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = (
    (step === 0 && types.length > 0) ||
    (step === 1 && flavours.length >= 2) ||
    (step === 2) ||
    (step === 3 && regionsLoved.length + regionsCurious.length > 0) ||
    (step === 4)
  );

  // Portal to <body> so the sheet sits in its own root stacking context, above
  // the global Sommy floating button (z-index 900) and any page-level overlays.
  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(26,20,16,0.55)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: 560,
        background: "#F7F4EF",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
        padding: "12px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D4D1CA" }} />
        </div>

        {/* Progress */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.12em", color: "#5A5248", textTransform: "uppercase" }}>
              Your palate · {step + 1} of {totalSteps}
            </div>
            <button onClick={onClose} style={{
              background: "none", border: "none", padding: 4, cursor: "pointer",
              fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#5A5248",
            }}>CLOSE</button>
          </div>
          <div style={{ height: 3, background: "rgba(140,28,46,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#8C1C2E", transition: "width 0.25s ease" }} />
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "8px 20px 16px", flex: 1 }}>
          {step === 0 && <Page1 types={types} setTypes={setTypes} />}
          {step === 1 && <Page2 flavours={flavours} setFlavours={setFlavours} />}
          {step === 2 && <Page3 body={body} setBody={setBody} acidity={acidity} setAcidity={setAcidity} tannin={tannin} setTannin={setTannin} />}
          {step === 3 && <Page4
            regionsLoved={regionsLoved} setRegionsLoved={setRegionsLoved}
            regionsCurious={regionsCurious} setRegionsCurious={setRegionsCurious}
            adventurousness={adventurousness} setAdventurousness={setAdventurousness}
          />}
          {step === 4 && <Page5 currency={currency} budgetIdx={budgetIdx} setBudgetIdx={setBudgetIdx} posture={posture} setPosture={setPosture} />}
        </div>

        {/* Error banner */}
        {submitError && (
          <div style={{
            margin: "0 20px 12px", padding: "10px 12px",
            background: "rgba(140,28,46,0.08)", borderRadius: 8,
            fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "#7A1424",
          }}>{submitError}</div>
        )}

        {/* Footer actions */}
        <div style={{
          padding: "12px 20px calc(16px + env(safe-area-inset-bottom, 0px))",
          background: "#F7F4EF", borderTop: "1px solid #EDEAE3",
          display: "flex", gap: 10, alignItems: "center",
          position: "sticky", bottom: 0,
        }}>
          {step > 0 ? (
            <button onClick={handleBack} disabled={saving} style={{
              flex: "0 0 auto", padding: "12px 20px", borderRadius: 24,
              border: "1px solid #EDEAE3", background: "white",
              fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248",
              cursor: saving ? "default" : "pointer",
            }}>Back</button>
          ) : <div style={{ flex: "0 0 auto", width: 0 }} />}

          {step < totalSteps - 1 ? (
            <button onClick={handleNext} disabled={saving || !canProceed} style={{
              flex: 1, padding: "13px 18px", borderRadius: 24, border: "none",
              background: canProceed && !saving ? "#8C1C2E" : "#D4D1CA",
              color: "#F7F4EF",
              fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 500,
              cursor: canProceed && !saving ? "pointer" : "default",
            }}>{saving ? "Saving..." : "Next"}</button>
          ) : (
            <button onClick={handleFinish} disabled={saving} style={{
              flex: 1, padding: "13px 18px", borderRadius: 24, border: "none",
              background: saving ? "#D4D1CA" : "#8C1C2E",
              color: "#F7F4EF",
              fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 500,
              cursor: saving ? "default" : "pointer",
            }}>{saving ? "Sommy is calibrating..." : "Tell Sommy I'm done"}</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Shared UI atoms ──────────────────────────────────────────────────────────

function SommyLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
        letterSpacing: "0.12em", color: "#8C1C2E", textTransform: "uppercase",
        marginBottom: 6,
      }}>SOMMY</div>
      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 400,
        color: "#1A1410", lineHeight: 1.35,
      }}>{children}</div>
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
      color: "#5A5248", marginBottom: 14, lineHeight: 1.45,
    }}>{children}</div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 14px", borderRadius: 20,
      border: `1.5px solid ${active ? "#8C1C2E" : "#EDEAE3"}`,
      background: active ? "#8C1C2E" : "white",
      color: active ? "#F7F4EF" : "#1A1410",
      fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
      fontWeight: active ? 500 : 400,
      cursor: "pointer", textTransform: "capitalize",
      transition: "all 0.15s ease",
    }}>{children}</button>
  );
}

// ── Pages ────────────────────────────────────────────────────────────────────

function Page1({ types, setTypes }: { types: string[]; setTypes: (v: string[]) => void }) {
  const toggle = (k: string) => setTypes(types.includes(k) ? types.filter(t => t !== k) : [...types, k]);
  return (
    <>
      <SommyLine>Which wine types do you enjoy?</SommyLine>
      <Question>Pick all that apply — you can change this anytime. No wrong answers.</Question>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {WINE_TYPES.map(t => (
          <Chip key={t.key} active={types.includes(t.key)} onClick={() => toggle(t.key)}>{t.label}</Chip>
        ))}
      </div>
    </>
  );
}

function Page2({ flavours, setFlavours }: { flavours: string[]; setFlavours: (v: string[]) => void }) {
  const toggle = (k: string) => setFlavours(flavours.includes(k) ? flavours.filter(t => t !== k) : [...flavours, k]);
  return (
    <>
      <SommyLine>Which flavours pull you in?</SommyLine>
      <Question>Pick two or more. These are the notes that make a wine click for you.</Question>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FLAVOUR_TAGS.map(f => (
          <Chip key={f} active={flavours.includes(f)} onClick={() => toggle(f)}>{f}</Chip>
        ))}
      </div>
    </>
  );
}

function Slider({ label, value, setValue, low, high }: {
  label: string; value: number; setValue: (v: number) => void; low: string; high: string;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "#1A1410" }}>{label}</span>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "#8C1C2E" }}>{value}</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{
        width: "100%", height: 4, accentColor: "#8C1C2E",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248" }}>{low}</span>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248" }}>{high}</span>
      </div>
    </div>
  );
}

function Page3({ body, setBody, acidity, setAcidity, tannin, setTannin }: {
  body: number; setBody: (v: number) => void;
  acidity: number; setAcidity: (v: number) => void;
  tannin: number; setTannin: (v: number) => void;
}) {
  return (
    <>
      <SommyLine>How do you like your wine to feel?</SommyLine>
      <Question>Slide each one toward how you actually drink.</Question>
      <Slider label="Body"    value={body}    setValue={setBody}    low="Light & airy" high="Bold & rich" />
      <Slider label="Acidity" value={acidity} setValue={setAcidity} low="Soft"         high="Bright & zippy" />
      <Slider label="Tannin"  value={tannin}  setValue={setTannin}  low="Easy"         high="Firm & grippy" />
    </>
  );
}

function Page4({
  regionsLoved, setRegionsLoved, regionsCurious, setRegionsCurious,
  adventurousness, setAdventurousness,
}: {
  regionsLoved: string[]; setRegionsLoved: (v: string[]) => void;
  regionsCurious: string[]; setRegionsCurious: (v: string[]) => void;
  adventurousness: number; setAdventurousness: (v: number) => void;
}) {
  const toggleLoved = (r: string) => setRegionsLoved(regionsLoved.includes(r) ? regionsLoved.filter(x => x !== r) : [...regionsLoved, r]);
  const toggleCurious = (r: string) => setRegionsCurious(regionsCurious.includes(r) ? regionsCurious.filter(x => x !== r) : [...regionsCurious, r]);
  return (
    <>
      <SommyLine>Where in the world feels like home?</SommyLine>
      <Question>Regions you love. Tap as many as feel right.</Question>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {REGION_OPTIONS.map(r => (
          <Chip key={`l-${r}`} active={regionsLoved.includes(r)} onClick={() => toggleLoved(r)}>{r}</Chip>
        ))}
      </div>

      <Question>And regions you're curious about — places you'd like Sommy to nudge you toward.</Question>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
        {REGION_OPTIONS.map(r => (
          <Chip key={`c-${r}`} active={regionsCurious.includes(r)} onClick={() => toggleCurious(r)}>{r}</Chip>
        ))}
      </div>

      <div style={{
        fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 500,
        color: "#1A1410", marginBottom: 10,
      }}>How adventurous should I be when I recommend?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ADVENTURE_BANDS.map(b => (
          <button key={b.value} onClick={() => setAdventurousness(b.value)} style={{
            padding: "10px 14px", borderRadius: 10, textAlign: "left",
            border: `1.5px solid ${adventurousness === b.value ? "#8C1C2E" : "#EDEAE3"}`,
            background: adventurousness === b.value ? "rgba(140,28,46,0.05)" : "white",
            cursor: "pointer",
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: adventurousness === b.value ? 500 : 400, color: "#1A1410" }}>{b.label}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>{b.sub}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function Page5({ currency, budgetIdx, setBudgetIdx, posture, setPosture }: {
  currency: string;
  budgetIdx: number; setBudgetIdx: (v: number) => void;
  posture: string; setPosture: (v: string) => void;
}) {
  const b = brackets(currency);
  return (
    <>
      <SommyLine>What's your typical bottle budget?</SommyLine>
      <Question>The range you reach for most of the time.</Question>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {b.map((br, idx) => (
          <Chip key={br.label} active={budgetIdx === idx} onClick={() => setBudgetIdx(idx)}>
            {currency} {br.label}
          </Chip>
        ))}
      </div>

      <div style={{
        fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 500,
        color: "#1A1410", marginBottom: 10,
      }}>How do you think about price vs quality?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PRICE_POSTURES.map(p => (
          <button key={p.key} onClick={() => setPosture(p.key)} style={{
            padding: "10px 14px", borderRadius: 10, textAlign: "left",
            border: `1.5px solid ${posture === p.key ? "#8C1C2E" : "#EDEAE3"}`,
            background: posture === p.key ? "rgba(140,28,46,0.05)" : "white",
            cursor: "pointer",
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: posture === p.key ? 500 : 400, color: "#1A1410" }}>{p.label}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>{p.sub}</div>
          </button>
        ))}
      </div>
    </>
  );
}
