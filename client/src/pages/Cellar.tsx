import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  directInsert, directUpdate, directDelete, directSelect,
  getAccessToken, SUPABASE_URL, ANON_KEY,
} from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode } from "@/lib/countryFlags";
import { displayPriceSync, preloadRates, convertToUSD } from "@/lib/currencyConvert";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";
import LoginPrompt from "@/components/LoginPrompt";
import { AwardsRow } from "@/components/AwardsRow";

// ── Types ───────────────────────────────────────────────────────────────────────

interface CellarWine {
  id: string;
  user_id: string;
  wine_name: string;
  producer: string | null;
  vintage: number | null;
  region: string | null;
  grapes: string | null;
  style: string | null;
  quantity: number;
  purchase_price: number | null;
  purchase_source: string | null;
  purchase_date: string | null;
  market_value_estimate: number | null;
  notes: string | null;
  image_url: string | null;
  drink_from: number | null;
  drink_peak_start: number | null;
  drink_peak_end: number | null;
  drink_until: number | null;
  status: string;
  status_notes: string | null;
  status_updated_at: string | null;
  journal_entry_id: string | null;
  sommy_assessment: string | null;
  tasting_notes_json: { notes: { category: string; term: string }[] } | null;
  tasting_notes_generated_at: string | null;
  food_pairings_json: { pairings: { dish: string; why: string }[] } | null;
  food_pairings_generated_at: string | null;
  awards_json: {
    awards?: { type: string; label: string; tone: string; context: string }[];
    is_flagship?: boolean;
    confidence?: "high" | "medium" | "low";
    notes?: string;
  } | null;
  awards_generated_at: string | null;
  created_at: string;
}

interface CellarGoals {
  user_id: string;
  goal_style: string | null;
  budget_range: string | null;
  preferred_regions: string | null;
  preferred_styles: string | null;
  notes: string | null;
}

interface ParsedCard {
  name: string; producer: string; vintage: string; region: string;
  grapes: string; style: string; price: string;
}

type FilterKey = "all" | "aging" | "ready" | "peak" | "soon" | "past" | "consumed" | "gifted";
type SortKey = "drink_soonest" | "recent" | "price_desc" | "price_asc" | "vintage_old" | "vintage_new" | "name_asc";

// (Award badge palette + rendering moved to <AwardsRow /> shared component.)

// Taste pill palette (matches Sommy chat + producer pages)
const TASTE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  fruit:   { bg: "rgba(184,50,74,0.06)",   color: "rgba(160,30,55,0.9)",   border: "rgba(184,50,74,0.3)" },
  floral:  { bg: "rgba(160,80,160,0.06)",  color: "rgba(140,60,140,0.9)",  border: "rgba(160,80,160,0.3)" },
  earth:   { bg: "rgba(120,85,45,0.08)",   color: "rgba(100,70,30,0.9)",   border: "rgba(120,85,45,0.3)" },
  spice:   { bg: "rgba(200,110,40,0.07)",  color: "rgba(170,90,30,0.9)",   border: "rgba(200,110,40,0.3)" },
  oak:     { bg: "rgba(120,80,30,0.08)",   color: "rgba(100,65,20,0.95)",  border: "rgba(120,80,30,0.3)" },
  mineral: { bg: "rgba(110,130,150,0.08)", color: "rgba(80,100,125,0.9)",  border: "rgba(110,130,150,0.3)" },
  fresh:   { bg: "rgba(74,122,82,0.07)",   color: "rgba(50,100,60,0.9)",   border: "rgba(74,122,82,0.3)" },
};

const SORT_LABELS: Record<SortKey, string> = {
  drink_soonest: "Drink soonest",
  recent: "Recently added",
  price_desc: "Price: high to low",
  price_asc: "Price: low to high",
  vintage_old: "Vintage: oldest first",
  vintage_new: "Vintage: newest first",
  name_asc: "Name: A to Z",
};
type Step = "idle" | "scanning" | "form";

// ── Helpers ─────────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const OFFSET = "52px"; // topbar only (no sub-nav)

const mono = (size = "0.6rem"): React.CSSProperties => ({
  fontFamily: "'Geist Mono', monospace", fontSize: size,
  letterSpacing: "0.12em", color: "#5A5248",
});

function compressImage(dataUrl: string, maxDim = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else       { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

function parseWineCard(text: string): ParsedCard | null {
  const match = text.match(/WINE_CARD_START\n([\s\S]*?)\nWINE_CARD_END/);
  if (!match) return null;
  const obj: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) obj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  if (!obj.name) return null;
  return {
    name: obj.name || "", producer: obj.producer || "", vintage: obj.vintage || "",
    region: obj.region || "", grapes: obj.grapes || "", style: obj.style || "",
    price: obj.price || "",
  };
}

function cleanField(val: unknown): string | null {
  if (val == null) return null;
  const v = String(val).trim();
  if (!v || v === "NV" || v === "N/A" || v === "Unknown") return null;
  if (v.includes("[not") || v.includes("[Not") || v.includes("not visible")) return null;
  return v;
}

function formatDate(str: string | null): string {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Prices are stored in USD internally. Display in user's currency via live conversion.
function formatCellarPrice(amountUSD: number | null, currencyCode?: string | null): string {
  return displayPriceSync(amountUSD, currencyCode || "USD");
}

function getWinePhase(w: CellarWine): string {
  if (w.status === "consumed") return "consumed";
  if (w.status === "gifted") return "gifted";
  if (!w.drink_from) return "unknown";
  if (CURRENT_YEAR < w.drink_from) return "aging";
  if (w.drink_until && CURRENT_YEAR > w.drink_until) return "past";
  if (w.drink_peak_start && w.drink_peak_end && CURRENT_YEAR >= w.drink_peak_start && CURRENT_YEAR <= w.drink_peak_end) return "peak";
  if (w.drink_peak_end && w.drink_until && CURRENT_YEAR > w.drink_peak_end) return "soon";
  return "ready";
}

function phaseLabel(phase: string): string {
  if (phase === "aging") return "Hold";
  if (phase === "ready") return "Young";
  if (phase === "peak") return "Peak";
  if (phase === "soon") return "Drink Soon";
  if (phase === "past") return "Past Peak";
  if (phase === "consumed") return "Consumed";
  if (phase === "gifted") return "Gifted";
  return "";
}

function phaseColor(phase: string): string {
  if (phase === "aging") return "#7A9AB5";   // slate blue — patience
  if (phase === "ready") return "#6B9E6B";   // sage green — opening up
  if (phase === "peak") return "#1F6B35";    // deep emerald — absolute best
  if (phase === "soon") return "#C8962E";    // warm gold — act now
  if (phase === "past") return "#A67055";    // muted terracotta — fading
  return "#D4D1CA";
}

// ── Decanting Guidance ───────────────────────────────────────────────────────

interface DecantAdvice {
  level: "yes" | "recommended" | "optional" | "no";
  duration: string;
  method: string;
  tip: string;
}

function getDecantingAdvice(wine: CellarWine): DecantAdvice {
  const g = (wine.grapes || "").toLowerCase();
  const s = (wine.style || "").toLowerCase();
  const r = (wine.region || "").toLowerCase();
  const n = (wine.wine_name || "").toLowerCase();
  const age = wine.vintage ? CURRENT_YEAR - wine.vintage : 0;

  // Sparkling — never
  if (s.includes("sparkling") || s.includes("champagne") || r.includes("champagne") || s.includes("cava") || s.includes("prosecco") || g.includes("champagne")) {
    return { level: "no", duration: "", method: "", tip: "Sparkling wines lose their fizz in a decanter. Serve straight from the bottle." };
  }

  // Fortified — vintage port yes, others optional
  if (s.includes("port") || s.includes("fortified") || s.includes("sherry") || s.includes("madeira")) {
    if (n.includes("vintage") || n.includes("lbv") || n.includes("late bottled") || (s.includes("port") && age > 10)) {
      return { level: "yes", duration: "2-4 hours", method: "Decant through a fine filter to catch sediment", tip: "Vintage Port throws heavy sediment. Stand the bottle upright a day before, then pour slowly and stop when you see grit." };
    }
    return { level: "optional", duration: "15-30 min", method: "Brief pour into decanter", tip: "Most fortified wines are ready from the bottle, but a short decant can help them open." };
  }

  // Sweet / dessert
  if (s.includes("sweet") || s.includes("dessert") || s.includes("botrytis") || r.includes("sauternes") || r.includes("tokaj")) {
    return { level: "no", duration: "", method: "", tip: "Serve chilled, straight from the bottle. Decanting dulls the delicate aromatics." };
  }

  // Rosé
  if (s.includes("rosé") || s.includes("rose")) {
    return { level: "no", duration: "", method: "", tip: "Rosé is at its best served fresh and chilled." };
  }

  // White wines
  const isWhite = s.includes("white") || g.includes("chardonnay") || g.includes("sauvignon blanc") || g.includes("riesling") || g.includes("viognier") || g.includes("gewurz") || g.includes("pinot grigio") || g.includes("pinot gris") || g.includes("albari") || g.includes("chenin") || g.includes("grüner") || g.includes("gruner");
  if (isWhite) {
    const fullBodyWhite = g.includes("chardonnay") || g.includes("viognier") || g.includes("chenin") || s.includes("oaked") || r.includes("burgundy") || r.includes("meursault") || r.includes("montrachet");
    if (fullBodyWhite) {
      return { level: "optional", duration: "15-30 min", method: "Gentle pour into a decanter", tip: "Full-bodied whites can benefit from a brief aeration — it opens up the buttery, oak-driven layers." };
    }
    return { level: "no", duration: "", method: "", tip: "Light, crisp whites are best served fresh from the bottle." };
  }

  // --- RED WINES ---

  // Very old (20+ years) — gentle treatment
  if (age >= 20) {
    return { level: "recommended", duration: "15-30 min", method: "Stand bottle upright 24hrs before. Pour very gently, leaving sediment behind", tip: "Old wines are fragile. A brief, gentle decant separates sediment without stripping the delicate aromatics that took decades to develop." };
  }

  // Mature (10-20 years)
  if (age >= 10 && age < 20) {
    return { level: "recommended", duration: "30-60 min", method: "Careful pour, leave sediment in the bottle", tip: "Mature wines benefit from a gentle decant — it separates sediment and lets the bouquet unfold without rushing it." };
  }

  // Big tannic grapes
  const bigTannic = g.includes("cabernet sauvignon") || g.includes("nebbiolo") || g.includes("tannat") || g.includes("mourvèdre") || g.includes("mourvedre") || g.includes("petit verdot") || g.includes("aglianico") || g.includes("sagrantino") || r.includes("barolo") || r.includes("barbaresco");
  if (bigTannic) {
    return { level: "yes", duration: "2-3 hours", method: "Standard decant — pour boldly and let it breathe", tip: "These wines are built with serious structure. Extended decanting softens the tannins and lets the fruit and complexity shine through." };
  }

  // Syrah, Malbec, Tempranillo family
  const mediumBold = g.includes("syrah") || g.includes("shiraz") || g.includes("malbec") || g.includes("tempranillo") || g.includes("monastrell") || g.includes("petite sirah") || r.includes("rhône") || r.includes("rhone") || r.includes("barossa") || r.includes("mendoza") || r.includes("rioja");
  if (mediumBold) {
    return { level: "yes", duration: "1-2 hours", method: "Standard decant", tip: "Give these wines time to open — decanting brings out layers of dark fruit, spice, and earth." };
  }

  // Bordeaux blends
  const isBordeaux = r.includes("bordeaux") || r.includes("médoc") || r.includes("medoc") || r.includes("saint-émilion") || r.includes("saint-emilion") || r.includes("pomerol") || r.includes("margaux") || r.includes("pauillac") || r.includes("saint-julien") || r.includes("graves") || r.includes("pessac") || (g.includes("cabernet") && g.includes("merlot"));
  if (isBordeaux) {
    if (age < 5) return { level: "yes", duration: "2-3 hours", method: "Standard decant — pour boldly", tip: "Young Bordeaux is built for the long haul. Generous decanting helps unlock what years of cellaring would otherwise reveal." };
    return { level: "yes", duration: "1-2 hours", method: "Standard decant", tip: "Bordeaux deserves to breathe. Decanting lets the complex layers of cassis, cedar, and earth unfold." };
  }

  // Medium reds
  const medRed = g.includes("merlot") || g.includes("sangiovese") || g.includes("grenache") || g.includes("garnacha") || g.includes("carignan") || g.includes("zinfandel") || g.includes("primitivo") || r.includes("chianti") || r.includes("brunello") || r.includes("priorat") || r.includes("châteauneuf") || r.includes("chateauneuf");
  if (medRed) {
    return { level: "recommended", duration: "30-60 min", method: "Standard decant", tip: "A moderate decant helps these wines show their best — the fruit opens up and any rough edges smooth out." };
  }

  // Pinot Noir / Burgundy — lighter touch
  const isPinot = g.includes("pinot noir") || r.includes("burgundy") || r.includes("bourgogne") || r.includes("willamette") || r.includes("central otago");
  if (isPinot) {
    if (age < 3) return { level: "optional", duration: "20-30 min", method: "Gentle pour or just swirl in glass", tip: "Young Pinot can benefit from a short aeration, but don't overdo it — this grape is all about delicacy." };
    return { level: "optional", duration: "15-20 min", method: "Gentle pour", tip: "Pinot Noir rarely needs a full decant. A brief rest or generous swirl in the glass is usually enough." };
  }

  // Light reds
  if (g.includes("gamay") || g.includes("frappato") || g.includes("dolcetto") || r.includes("beaujolais")) {
    return { level: "no", duration: "", method: "", tip: "Light, fresh reds are best enjoyed straight away — a slight chill if you like." };
  }

  // Natural / orange wine
  if (s.includes("natural") || s.includes("orange") || s.includes("skin-contact")) {
    return { level: "recommended", duration: "30-60 min", method: "Standard decant", tip: "Natural wines often benefit from air — give them a chance to blow off any initial funk and show their true character." };
  }

  // Default red
  if (s.includes("red") || g) {
    return { level: "recommended", duration: "30-60 min", method: "Standard decant", tip: "When in doubt with a red, a 30-60 minute decant rarely hurts and often helps." };
  }

  // Generic fallback
  return { level: "optional", duration: "15-30 min", method: "Pour and taste — decant if it feels tight", tip: "Not sure? Pour a small taste first. If it feels closed or tannic, give it some air." };
}

const DECANT_LABEL: Record<string, { text: string; color: string }> = {
  yes: { text: "DECANT", color: "#8C1C2E" },
  recommended: { text: "RECOMMENDED", color: "#C8962E" },
  optional: { text: "OPTIONAL", color: "#5A5248" },
  no: { text: "NOT NEEDED", color: "#6B9E6B" },
};

// Bar segment colors
const BAR_READY = "#6B9E6B";     // sage green
const BAR_PEAK = "#1F6B35";      // deep emerald
const BAR_SOON = "#C8962E";      // warm gold
const BAR_HOLD = "#7A9AB5";      // slate blue

// ── Drinking Window Bar ─────────────────────────────────────────────────────────

function DrinkingWindowBar({ wine }: { wine: CellarWine }) {
  const from = wine.drink_from;
  const until = wine.drink_until;
  if (!from || !until || until <= from) return null;

  const peakStart = wine.drink_peak_start || from;
  const peakEnd = wine.drink_peak_end || until;
  const phase = getWinePhase(wine);
  if (phase === "consumed" || phase === "gifted" || phase === "unknown") return null;

  const isBefore = CURRENT_YEAR < from;
  const isAfter = CURRENT_YEAR > until;

  // Extended span includes hold/past tails
  const holdYears = isBefore ? Math.min(from - CURRENT_YEAR, 6) : 0;
  const pastYears = isAfter ? Math.min(CURRENT_YEAR - until, 4) : 0;
  const windowSpan = until - from;
  const totalSpan = holdYears + windowSpan + pastYears;

  // Percentages of the total bar
  const holdPct = (holdYears / totalSpan) * 100;
  const readyPct = ((peakStart - from) / totalSpan) * 100;
  const peakPct = ((peakEnd - peakStart) / totalSpan) * 100;
  const soonPct = ((until - peakEnd) / totalSpan) * 100;
  const pastPct = (pastYears / totalSpan) * 100;

  // NOW position on the full bar
  const nowOffset = isBefore
    ? ((CURRENT_YEAR - (from - holdYears)) / totalSpan) * 100
    : isAfter
    ? ((holdYears + windowSpan + (CURRENT_YEAR - until)) / totalSpan) * 100
    : ((holdYears + (CURRENT_YEAR - from)) / totalSpan) * 100;

  // Key year positions for labels below the bar
  const yearMarkers: { year: number; pct: number; label?: string }[] = [];
  if (holdYears > 0) yearMarkers.push({ year: from, pct: holdPct, label: "Ready" });
  if (peakStart > from) yearMarkers.push({ year: peakStart, pct: holdPct + readyPct, label: "Peak" });
  if (peakEnd < until) yearMarkers.push({ year: peakEnd, pct: holdPct + readyPct + peakPct });
  if (pastYears > 0) yearMarkers.push({ year: until, pct: holdPct + readyPct + peakPct + soonPct });

  const markerColor = phaseColor(phase);

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      {/* Phase label — with extra bottom margin so NOW pill doesn't collide */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ ...mono("0.58rem"), color: markerColor }}>{phaseLabel(phase).toUpperCase()}</span>
      </div>

      {/* Bar */}
      <div style={{ position: "relative", height: 8, borderRadius: 4, overflow: "visible", background: "#EDEAE3" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden" }}>
          {/* Hold tail — slate blue */}
          {holdPct > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${holdPct}%`, background: BAR_HOLD, opacity: 0.5 }} />
          )}
          {/* Ready — sage green */}
          {readyPct > 0 && (
            <div style={{ position: "absolute", left: `${holdPct}%`, top: 0, height: "100%", width: `${readyPct}%`, background: BAR_READY }} />
          )}
          {/* Peak — deep emerald */}
          <div style={{ position: "absolute", left: `${holdPct + readyPct}%`, top: 0, height: "100%", width: `${peakPct}%`, background: BAR_PEAK }} />
          {/* Drink soon — warm gold */}
          {soonPct > 0 && (
            <div style={{ position: "absolute", left: `${holdPct + readyPct + peakPct}%`, top: 0, height: "100%", width: `${soonPct}%`, background: BAR_SOON }} />
          )}
          {/* Past tail — muted terracotta */}
          {pastPct > 0 && (
            <div style={{ position: "absolute", left: `${holdPct + readyPct + peakPct + soonPct}%`, top: 0, height: "100%", width: `${pastPct}%`, background: "#A67055", opacity: 0.5 }} />
          )}
        </div>

        {/* NOW marker */}
        <div style={{
          position: "absolute", left: `${Math.max(2, Math.min(98, nowOffset))}%`, top: -18,
          transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center",
          zIndex: 2,
        }}>
          <div style={{
            fontSize: "0.5rem", fontFamily: "'Geist Mono', monospace", fontWeight: 700,
            color: "#FFFFFF", background: markerColor, borderRadius: 4,
            padding: "2px 6px", lineHeight: 1.2, whiteSpace: "nowrap",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}>
            NOW
          </div>
          <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `4px solid ${markerColor}` }} />
          <div style={{ width: 2, height: 8, background: markerColor, borderRadius: 1, marginTop: -1 }} />
        </div>
      </div>

      {/* Year markers below the bar */}
      <div style={{ position: "relative", height: 14, marginTop: 2 }}>
        {yearMarkers.map((m, i) => (
          <span key={i} style={{
            position: "absolute", left: `${m.pct}%`, transform: "translateX(-50%)",
            fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500,
            color: "#7A7568", whiteSpace: "nowrap", top: 0,
          }}>
            {m.year}
          </span>
        ))}
        {/* End year on the right */}
        <span style={{
          position: "absolute", right: 0,
          fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500,
          color: "#7A7568", top: 0,
        }}>
          {until + pastYears}
        </span>
      </div>
    </div>
  );
}

// ── Stars (for consumed log) ────────────────────────────────────────────────────

function Stars({ value, onChange, size = "1rem" }: { value: number; onChange?: (n: number) => void; size?: string }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} onClick={() => onChange?.(n === value ? 0 : n)} style={{
          cursor: onChange ? "pointer" : "default", fontSize: size,
          color: n <= value ? "#C8962E" : "#EDEAE3",
        }}>&#9733;</span>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────

// Module-level cache survives component unmount/remount (page navigation)
const cellarHealthCache = { text: "", fingerprint: "", collapsed: false };

export default function Cellar() {
  const { user, profile } = useAuth();
  const [, setLocation] = useLocation();

  // Data
  const [wines, setWines] = useState<CellarWine[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<CellarGoals | null>(null);
  // Persist assessment: module cache for navigation, DB for app restarts
  const [healthText, setHealthTextRaw] = useState(() => cellarHealthCache.text);
  const [healthCollapsed, setHealthCollapsed] = useState(() => cellarHealthCache.collapsed);
  const [cachedWineFingerprint, setCachedWineFingerprint] = useState(() => cellarHealthCache.fingerprint);
  const [dbLoaded, setDbLoaded] = useState(false);

  const setHealthText = useCallback((text: string) => {
    setHealthTextRaw(text);
    cellarHealthCache.text = text;
  }, []);

  // Sync health state to module-level cache
  useEffect(() => { cellarHealthCache.text = healthText; }, [healthText]);
  useEffect(() => { cellarHealthCache.fingerprint = cachedWineFingerprint; }, [cachedWineFingerprint]);
  useEffect(() => { cellarHealthCache.collapsed = healthCollapsed; }, [healthCollapsed]);

  // UI state
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>(() => {
    if (typeof window === "undefined") return "drink_soonest";
    const stored = localStorage.getItem("cellar_sort");
    if (stored && stored in SORT_LABELS) return stored as SortKey;
    return "drink_soonest";
  });
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("cellar_sort", sortKey);
  }, [sortKey]);
  const [step, setStep] = useState<Step>("idle");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Scan state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Add form
  const [formName, setFormName] = useState("");
  const [formProducer, setFormProducer] = useState("");
  const [formVintage, setFormVintage] = useState("");
  const [formRegion, setFormRegion] = useState("");
  const [formGrapes, setFormGrapes] = useState("");
  const [formStyle, setFormStyle] = useState("");
  const [formQuantity, setFormQuantity] = useState(1);
  const [formPrice, setFormPrice] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, any>>({});
  const [editSaving, setEditSaving] = useState(false);

  // Consumed/gifted mini-form
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"consumed" | "gifted" | null>(null);
  const [actionDate, setActionDate] = useState(new Date().toISOString().split("T")[0]);
  const [actionNotes, setActionNotes] = useState("");
  const [actionRating, setActionRating] = useState(0);
  const [actionSaving, setActionSaving] = useState(false);

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Tasting notes / food pairings generation state
  const [tastingLoadingId, setTastingLoadingId] = useState<string | null>(null);
  const [pairingsLoadingId, setPairingsLoadingId] = useState<string | null>(null);

  // Award badge tooltip (which badge is currently revealing its context note)
  const [activeAwardTooltip, setActiveAwardTooltip] = useState<string | null>(null);

  // Goals form
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [goalStyle, setGoalStyle] = useState("");
  const [goalBudget, setGoalBudget] = useState("");
  const [goalSaving, setGoalSaving] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);

  // ── Load data ──────────────────────────────────────────────────────────────

  const loadCellar = useCallback(async () => {
    if (!user) return;
    try {
      const data = await directSelect<CellarWine>(
        "wine_cellar",
        `select=*&user_id=eq.${user.id}&order=created_at.desc`,
      );
      setWines(data.map(w => ({
        ...w,
        vintage: w.vintage != null ? Number(w.vintage) : null,
        quantity: Number(w.quantity) || 1,
        purchase_price: w.purchase_price != null ? Number(w.purchase_price) : null,
        market_value_estimate: w.market_value_estimate != null ? Number(w.market_value_estimate) : null,
        drink_from: w.drink_from != null ? Number(w.drink_from) : null,
        drink_peak_start: w.drink_peak_start != null ? Number(w.drink_peak_start) : null,
        drink_peak_end: w.drink_peak_end != null ? Number(w.drink_peak_end) : null,
        drink_until: w.drink_until != null ? Number(w.drink_until) : null,
      })));
    } catch (e) {
      console.error("Cellar load error:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Generate-or-fetch tasting notes / food pairings for a wine
  const generateWineContext = useCallback(async (wine: CellarWine, kind: "tasting" | "pairings" | "awards") => {
    if (kind === "tasting") setTastingLoadingId(wine.id);
    else if (kind === "pairings") setPairingsLoadingId(wine.id);
    // "awards" generation runs silently in the background — no loading state
    try {
      const resp = await fetch("/api/wine-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          wine: {
            id: wine.id,
            wine_name: wine.wine_name,
            vintage: wine.vintage,
            producer: wine.producer,
            region: wine.region,
            grapes: wine.grapes,
            style: wine.style,
          },
        }),
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const json = await resp.json();
      const nowIso = new Date().toISOString();
      // Persist cache directly from the client using the user's auth token
      // (server-side write was failing silently because the service-role key
      // isn't configured on Vercel — this is more correct anyway since RLS
      // already restricts writes to the row owner).
      try {
        const patch = kind === "tasting"
          ? { tasting_notes_json: json.data, tasting_notes_generated_at: nowIso }
          : kind === "pairings"
          ? { food_pairings_json: json.data, food_pairings_generated_at: nowIso }
          : { awards_json: json.data, awards_generated_at: nowIso };
        await directUpdate("wine_cellar", wine.id, patch);
      } catch (cacheErr) {
        console.warn("Failed to cache wine context to DB:", cacheErr);
      }
      // Update local state so UI re-renders without a full reload
      setWines(prev => prev.map(w => {
        if (w.id !== wine.id) return w;
        if (kind === "tasting") {
          return { ...w, tasting_notes_json: json.data, tasting_notes_generated_at: nowIso };
        } else if (kind === "pairings") {
          return { ...w, food_pairings_json: json.data, food_pairings_generated_at: nowIso };
        } else {
          return { ...w, awards_json: json.data, awards_generated_at: nowIso };
        }
      }));
    } catch (e) {
      console.error("wine-context error:", e);
      // Awards run silently — don't surface their errors to the user
      if (kind !== "awards") {
        setError(`Couldn't generate ${kind === "tasting" ? "tasting notes" : "pairings"} — try again in a moment`);
      }
    } finally {
      if (kind === "tasting") setTastingLoadingId(null);
      else if (kind === "pairings") setPairingsLoadingId(null);
    }
  }, []);

  // Auto-generate awards in the background for any cellar wines that don't yet
  // have them. Throttled: one wine at a time, max 6 per session, so we never
  // blast Sommy with parallel calls. Runs once per cellar load.
  const awardsBackfillRanRef = useRef(false);
  useEffect(() => {
    if (!user || wines.length === 0) return;
    if (awardsBackfillRanRef.current) return;
    const missing = wines.filter(w => w.status === "active" && !w.awards_json).slice(0, 6);
    if (missing.length === 0) return;
    awardsBackfillRanRef.current = true;
    (async () => {
      for (const w of missing) {
        try {
          await generateWineContext(w, "awards");
        } catch {
          // swallow — don't break the chain on a single failure
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, wines.length]);

  const loadGoals = useCallback(async () => {
    if (!user) return;
    try {
      const data = await directSelect<CellarGoals>(
        "cellar_goals",
        `select=*&user_id=eq.${user.id}`,
      );
      if (data.length > 0) {
        setGoals(data[0]);
        setGoalStyle(data[0].goal_style || "");
        setGoalBudget(data[0].budget_range || "");
      }
    } catch {
      // Goals table may not exist yet — not critical
    }
  }, [user]);

  useEffect(() => { preloadRates(); loadCellar(); loadGoals(); }, [loadCellar, loadGoals]);

  // Load persisted assessment from DB on first mount (only if module cache is empty)
  useEffect(() => {
    if (cellarHealthCache.text || !user) { setDbLoaded(true); return; }
    (async () => {
      try {
        const rows = await directSelect("user_profiles", `id=eq.${user.id}&select=cellar_assessment,cellar_assessment_fingerprint`);
        if (rows?.[0]?.cellar_assessment) {
          setHealthText(rows[0].cellar_assessment);
          setCachedWineFingerprint(rows[0].cellar_assessment_fingerprint || "");
          cellarHealthCache.fingerprint = rows[0].cellar_assessment_fingerprint || "";
          setHealthCollapsed(true); // collapsed by default on app restart
        }
      } catch { /* non-critical */ }
      setDbLoaded(true);
    })();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cellar Health ──────────────────────────────────────────────────────────

  const fetchHealth = useCallback(async () => {
    if (!goals || wines.filter(w => w.status === "active").length === 0) return;
    setHealthLoading(true);
    try {
      const res = await fetch("/api/cellar-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cellar: wines.filter(w => w.status === "active").map(w => ({
            wine_name: w.wine_name, region: w.region, grapes: w.grapes,
            style: w.style, vintage: w.vintage, quantity: w.quantity, status: w.status,
          })),
          goals: {
            goal_style: goals.goal_style, budget_range: goals.budget_range,
            preferred_regions: goals.preferred_regions, preferred_styles: goals.preferred_styles,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.assessment || "";
        setHealthText(text);
        // Persist to DB
        if (user && text) {
          const fp = wines.filter(w => w.status === "active").map(w => `${w.wine_name}|${w.quantity}`).sort().join(",");
          directUpdate("user_profiles", user.id, {
            cellar_assessment: text,
            cellar_assessment_fingerprint: fp,
            cellar_assessment_at: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.error("Health fetch error:", e);
    } finally {
      setHealthLoading(false);
    }
  }, [goals, wines, user]);

  useEffect(() => {
    if (!goals || wines.length === 0 || !dbLoaded) return;
    // Create a fingerprint of cellar contents to detect changes
    const activeNames = wines.filter(w => w.status === "active").map(w => `${w.wine_name}|${w.quantity}`).sort().join(",");
    const fingerprint = activeNames;
    // Only fetch if cellar contents actually changed
    if (fingerprint !== cachedWineFingerprint) {
      setCachedWineFingerprint(fingerprint);
      cellarHealthCache.fingerprint = fingerprint;
      fetchHealth();
    }
  }, [goals, wines.length, dbLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Image handling ─────────────────────────────────────────────────────────

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = async () => {
      const rawUrl = reader.result as string;
      const compressed = await compressImage(rawUrl, 800, 0.75);
      setImagePreview(compressed);
      setImageBase64(compressed.split(",")[1]);
      setStep("scanning");
      setScanning(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "Read this wine label and identify the wine." }],
            image: { data: compressed.split(",")[1], mediaType: "image/jpeg" },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const card = parseWineCard(data.text || "");
          if (card) {
            setFormName(card.name);
            setFormProducer(card.producer);
            setFormVintage(card.vintage === "NV" ? "" : card.vintage);
            setFormRegion(card.region);
            setFormGrapes(card.grapes);
            setFormStyle(card.style);
          }
        }
      } catch (e) {
        console.error("Scan error:", e);
      } finally {
        setScanning(false);
        setStep("form");
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Save wine to cellar ────────────────────────────────────────────────────

  const saveToCellar = async () => {
    if (!user || !formName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Session expired.");

      // Upload image if exists
      let imgUrl: string | null = null;
      if (imageBase64) {
        try {
          const byteChars = atob(imageBase64);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const path = `${user.id}/cellar-${Date.now()}.jpg`;
          const uploadRes = await Promise.race([
            fetch(`${SUPABASE_URL}/storage/v1/object/wine-labels/${path}`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY, "Content-Type": "image/jpeg" },
              body: blob,
            }),
            new Promise<Response>((_, rej) => setTimeout(() => rej(new Error("Upload timeout")), 10000)),
          ]);
          if (uploadRes.ok) imgUrl = `${SUPABASE_URL}/storage/v1/object/public/wine-labels/${path}`;
        } catch { /* continue without image */ }
      }

      const vintageNum = formVintage ? parseInt(formVintage) : null;
      const priceNum = formPrice ? parseFloat(formPrice.replace(/[^0-9.]/g, "")) : null;

      const row: Record<string, unknown> = {
        user_id: user.id,
        wine_name: formName.trim(),
        producer: formProducer.trim() || null,
        vintage: vintageNum && !isNaN(vintageNum) ? vintageNum : null,
        region: formRegion.trim() || null,
        grapes: formGrapes.trim() || null,
        style: formStyle.trim() || null,
        quantity: formQuantity,
        purchase_price: (priceNum && !isNaN(priceNum)) ? await convertToUSD(priceNum, profile?.currency_code || "USD") : null,
        purchase_source: formSource.trim() || null,
        purchase_date: formDate || null,
        notes: formNotes.trim() || null,
        image_url: imgUrl,
        status: "active",
      };

      await directInsert("wine_cellar", row);

      // Get Sommy's assessment in background
      fetchAssessment(row);

      resetForm();
      await loadCellar();
    } catch (e: any) {
      console.error("Cellar save error:", e);
      setError(e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const fetchAssessment = async (row: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/cellar-assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wine_name: row.wine_name,
          producer: row.producer,
          vintage: row.vintage,
          region: row.region,
          grapes: row.grapes,
          style: row.style,
          currency: profile?.currency_code || "USD",
        }),
      });
      if (!res.ok) return;
      const data = await res.json();

      // Find the just-inserted wine (most recent) and update it
      const latest = await directSelect<CellarWine>(
        "wine_cellar",
        `select=id&user_id=eq.${user!.id}&wine_name=eq.${encodeURIComponent(String(row.wine_name))}&order=created_at.desc&limit=1`,
      );
      if (latest.length > 0) {
        await directUpdate("wine_cellar", latest[0].id, {
          drink_from: data.drink_from || null,
          drink_peak_start: data.drink_peak_start || null,
          drink_peak_end: data.drink_peak_end || null,
          drink_until: data.drink_until || null,
          market_value_estimate: data.market_value_estimate || null,
          sommy_assessment: data.assessment || null,
        });
        await loadCellar();
      }
    } catch (e) {
      console.error("Assessment fetch error:", e);
    }
  };

  // ── Form helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setStep("idle");
    setFormName(""); setFormProducer(""); setFormVintage(""); setFormRegion("");
    setFormGrapes(""); setFormStyle(""); setFormQuantity(1); setFormPrice("");
    setFormSource(""); setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes(""); setImagePreview(null); setImageBase64(null); setError("");
  };

  // ── Consumed / Gifted ──────────────────────────────────────────────────────

  const handleAction = async () => {
    if (!actionId || !actionType) return;
    setActionSaving(true);
    try {
      const wine = wines.find(w => w.id === actionId);
      if (!wine) return;

      const newQty = wine.quantity - 1;
      if (newQty <= 0) {
        await directUpdate("wine_cellar", actionId, {
          status: actionType,
          quantity: 0,
          status_notes: actionNotes.trim() || null,
          status_updated_at: new Date().toISOString(),
        });
      } else {
        await directUpdate("wine_cellar", actionId, {
          quantity: newQty,
          status_notes: actionNotes.trim() || null,
          status_updated_at: new Date().toISOString(),
        });
      }

      // If consumed and last bottle, offer to log in journal
      if (actionType === "consumed" && newQty <= 0) {
        setLocation(`/journey/journal?log=1&name=${encodeURIComponent(wine.wine_name)}&region=${encodeURIComponent(wine.region || "")}`);
      }

      setActionId(null); setActionType(null);
      setActionNotes(""); setActionRating(0);
      setExpandedId(null);
      await loadCellar();
    } catch (e: any) {
      console.error("Action error:", e);
    } finally {
      setActionSaving(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const startEdit = (w: CellarWine) => {
    setEditingId(w.id);
    setEditFields({
      wine_name: w.wine_name,
      producer: w.producer || "",
      vintage: w.vintage ? String(w.vintage) : "",
      region: w.region || "",
      grapes: w.grapes || "",
      style: w.style || "",
      quantity: w.quantity,
      purchase_price: w.purchase_price ? String(w.purchase_price) : "",
      purchase_source: w.purchase_source || "",
      notes: w.notes || "",
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setEditSaving(true);
    try {
      const vintageNum = editFields.vintage ? parseInt(editFields.vintage) : null;
      const priceNum = editFields.purchase_price ? parseFloat(editFields.purchase_price) : null;
      await directUpdate("wine_cellar", editingId, {
        wine_name: editFields.wine_name,
        producer: editFields.producer.trim() || null,
        vintage: vintageNum && !isNaN(vintageNum) ? vintageNum : null,
        region: editFields.region.trim() || null,
        grapes: editFields.grapes.trim() || null,
        style: editFields.style.trim() || null,
        quantity: Number(editFields.quantity) || 1,
        purchase_price: priceNum && !isNaN(priceNum) ? priceNum : null,
        purchase_source: editFields.purchase_source.trim() || null,
        notes: editFields.notes.trim() || null,
      });
      setEditingId(null);
      await loadCellar();
    } catch (e: any) {
      console.error("Edit error:", e);
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const deleteWine = async (id: string) => {
    try {
      await directDelete("wine_cellar", id);
      setConfirmDeleteId(null);
      setExpandedId(null);
      await loadCellar();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // ── Goals ──────────────────────────────────────────────────────────────────

  const saveGoals = async () => {
    if (!user) return;
    setGoalSaving(true);
    try {
      if (goals) {
        await directUpdate("cellar_goals", goals.user_id, {
          goal_style: goalStyle || null,
          budget_range: goalBudget || null,
        });
      } else {
        await directInsert("cellar_goals", {
          user_id: user.id,
          goal_style: goalStyle || null,
          budget_range: goalBudget || null,
        });
      }
      await loadGoals();
      setHealthText("");
      // Trigger health assessment
      setTimeout(() => fetchHealth(), 500);
    } catch (e: any) {
      console.error("Goals save error:", e);
    } finally {
      setGoalSaving(false);
    }
  };

  // ── Computed stats ─────────────────────────────────────────────────────────

  const activeWines = wines.filter(w => w.status === "active");
  const totalBottles = activeWines.reduce((s, w) => s + w.quantity, 0);
  const totalValue = activeWines.reduce((s, w) => s + (w.market_value_estimate || 0) * w.quantity, 0);
  const totalCost = activeWines.reduce((s, w) => s + (w.purchase_price || 0) * w.quantity, 0);
  const valueDelta = totalValue - totalCost;
  const uniqueRegions = new Set(activeWines.map(w => w.region).filter(Boolean)).size;
  const peakCount = activeWines.filter(w => getWinePhase(w) === "peak").length;

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = wines.filter(w => {
    if (filter === "all") return w.status === "active";
    if (filter === "consumed") return w.status === "consumed";
    if (filter === "gifted") return w.status === "gifted";
    if (w.status !== "active") return false;
    const phase = getWinePhase(w);
    if (filter === "ready") return phase === "ready";
    if (filter === "peak") return phase === "peak";
    if (filter === "aging") return phase === "aging";
    if (filter === "soon") return phase === "soon";
    if (filter === "past") return phase === "past";
    return true;
  });

  // Sort applied on top of the filtered set.
  // Helpers to coerce values that can arrive as strings from the API into
  // proper numbers, and to push missing values consistently to the end.
  const HUGE = Number.POSITIVE_INFINITY;
  const NEG_HUGE = Number.NEGATIVE_INFINITY;
  const num = (v: unknown): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = typeof v === "number" ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
  };
  const marketPrice = (w: CellarWine): number | null =>
    num(w.market_value_estimate) ?? num(w.purchase_price);
  const ts = (w: CellarWine): number =>
    w.created_at ? new Date(w.created_at).getTime() : 0;
  // Phase priority for "drink soonest" — lower number = surface first.
  const phaseUrgency = (w: CellarWine): number => {
    const phase = getWinePhase(w);
    if (phase === "past") return 0;
    if (phase === "soon") return 1;
    if (phase === "peak") return 2;
    if (phase === "ready") return 3;
    if (phase === "aging") return 4;
    return 5; // unknown / unparseable
  };
  // Tie-breaker that keeps ordering stable when a primary key matches.
  const tieBreak = (a: CellarWine, b: CellarWine) => {
    const nameDiff = (a.wine_name || "").localeCompare(b.wine_name || "", undefined, { sensitivity: "base" });
    if (nameDiff !== 0) return nameDiff;
    return (a.id || "").localeCompare(b.id || "");
  };
  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "drink_soonest": {
        // Primary: phase urgency (past < soon < peak < ready < aging)
        // Secondary: drink_peak_end ascending (within phase, those whose peak
        // ends sooner come first)
        const phaseDiff = phaseUrgency(a) - phaseUrgency(b);
        if (phaseDiff !== 0) return phaseDiff;
        const aEnd = a.drink_peak_end ?? a.drink_until ?? HUGE;
        const bEnd = b.drink_peak_end ?? b.drink_until ?? HUGE;
        if (aEnd !== bEnd) return aEnd - bEnd;
        return tieBreak(a, b);
      }
      case "recent": {
        const diff = ts(b) - ts(a);
        if (diff !== 0) return diff;
        return tieBreak(a, b);
      }
      case "price_desc": {
        // Use market value estimate as the benchmark (falls back to purchase price)
        const aP = marketPrice(a);
        const bP = marketPrice(b);
        // Wines with no price data sort to the end regardless of direction
        if (aP === null && bP === null) return tieBreak(a, b);
        if (aP === null) return 1;
        if (bP === null) return -1;
        if (aP !== bP) return bP - aP;
        return tieBreak(a, b);
      }
      case "price_asc": {
        const aP = marketPrice(a);
        const bP = marketPrice(b);
        if (aP === null && bP === null) return tieBreak(a, b);
        if (aP === null) return 1;
        if (bP === null) return -1;
        if (aP !== bP) return aP - bP;
        return tieBreak(a, b);
      }
      case "vintage_old": {
        const aV = a.vintage ?? null;
        const bV = b.vintage ?? null;
        if (aV === null && bV === null) return tieBreak(a, b);
        if (aV === null) return 1;
        if (bV === null) return -1;
        if (aV !== bV) return aV - bV;
        return tieBreak(a, b);
      }
      case "vintage_new": {
        const aV = a.vintage ?? null;
        const bV = b.vintage ?? null;
        if (aV === null && bV === null) return tieBreak(a, b);
        if (aV === null) return 1;
        if (bV === null) return -1;
        if (aV !== bV) return bV - aV;
        return tieBreak(a, b);
      }
      case "name_asc": {
        return tieBreak(a, b);
      }
      default:
        return 0;
    }
  });

  // ── Styles ─────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #EDEAE3", borderRadius: 10,
    background: "white", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
    outline: "none", boxSizing: "border-box",
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 12px", borderRadius: 16,
    border: `1.5px solid ${active ? "#8C1C2E" : "#EDEAE3"}`,
    background: active ? "#8C1C2E" : "white",
    color: active ? "#F7F4EF" : "#5A5248",
    fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
    letterSpacing: "0.08em", cursor: "pointer",
    textTransform: "uppercase" as const,
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!user) {
    return <LoginPrompt title="Your wines, tracked" description="Log in to start building your cellar — drinking windows, market value, and Sommy's assessment for every bottle." />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...mono(), color: "#7A7568", marginBottom: 4 }}>YOUR COLLECTION</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1A1410", margin: 0 }}>
            My Cellar
          </h1>
        </div>

        {/* ── Stats strip ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          background: "white", border: "1px solid #EDEAE3", borderRadius: 12,
          marginBottom: 16, overflow: "hidden",
        }}>
          {[
            { label: "BOTTLES", value: totalBottles },
            { label: "VALUE", value: totalValue > 0 ? formatCellarPrice(totalValue, profile?.currency_code) : "–", sub: totalCost > 0 && totalValue > 0 ? `BASE ${formatCellarPrice(totalCost, profile?.currency_code)}  ${valueDelta >= 0 ? "+" : ""}${formatCellarPrice(Math.abs(valueDelta), profile?.currency_code)}` : undefined },
            { label: "REGIONS", value: uniqueRegions },
            { label: "PEAK", value: peakCount },
          ].map(({ label, value, sub }: any, i: number) => (
            <div key={label} style={{
              padding: "12px 6px", textAlign: "center",
              borderRight: i < 3 ? "1px solid #EDEAE3" : "none",
            }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 400, color: "#8C1C2E" }}>
                {loading ? "·" : value}
              </div>
              <div style={{ ...mono("0.5rem"), color: "#D4D1CA", marginTop: 2 }}>{label}</div>
              {sub && !loading && (
                <div style={{ ...mono("0.42rem"), color: valueDelta >= 0 ? "#4A7A52" : "#C03838", marginTop: 3, lineHeight: 1.4 }}>
                  {sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Cellar Health card (collapsible) ── */}
        {healthText && step === "idle" && (
          <div style={{
            background: "rgba(140,28,46,0.03)", border: "1px solid rgba(140,28,46,0.12)",
            borderRadius: 12, padding: healthCollapsed ? "10px 16px" : "14px 16px", marginBottom: 16,
            transition: "padding 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setHealthCollapsed(!healthCollapsed)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ ...mono("0.56rem"), color: "#8C1C2E" }}>SOMMY'S CELLAR ASSESSMENT</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {!healthCollapsed && (
                  <button onClick={(e) => { e.stopPropagation(); setHealthText(""); setCachedWineFingerprint(""); fetchHealth(); }} style={{
                    background: "none", border: "none", cursor: "pointer",
                    ...mono("0.52rem"), color: "#8C1C2E",
                  }}>{healthLoading ? "..." : "REFRESH"}</button>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: healthCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <div style={{ maxHeight: healthCollapsed ? 0 : 400, overflow: "hidden", transition: "max-height 0.3s ease, margin 0.3s ease", marginTop: healthCollapsed ? 0 : 10 }}>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
                color: "#1A1410", lineHeight: 1.65, margin: 0,
              }}>{healthText}</p>
            </div>
          </div>
        )}

        {/* ── Sort dropdown ── */}
        {step === "idle" && wines.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, position: "relative" }}>
            <button
              onClick={() => setSortMenuOpen(o => !o)}
              data-testid="cellar-sort-button"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 12px",
                border: "1px solid #EDEAE3",
                borderRadius: 16,
                background: "white",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.66rem",
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#5A5248",
                cursor: "pointer",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5A5248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="9" y1="18" x2="15" y2="18" />
              </svg>
              Sort: {SORT_LABELS[sortKey]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5A5248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {sortMenuOpen && (
              <>
                {/* Click-outside backdrop */}
                <div onClick={() => setSortMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                  background: "white",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #EDEAE3",
                  minWidth: 220,
                  overflow: "hidden",
                }}>
                  {(Object.keys(SORT_LABELS) as SortKey[]).map(key => {
                    const isActive = sortKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSortKey(key); setSortMenuOpen(false); }}
                        data-testid={`cellar-sort-${key}`}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "11px 14px",
                          background: isActive ? "#F7F4EF" : "white",
                          border: "none", borderBottom: "1px solid #F7F4EF",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.86rem",
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? "#8C1C2E" : "#1A1410",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <span>{SORT_LABELS[key]}</span>
                        {isActive && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Filter chips ── */}
        {step === "idle" && wines.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {(["all", "aging", "ready", "peak", "soon", "past", "consumed", "gifted"] as FilterKey[]).map(f => {
              const labels: Record<string, string> = { all: "All", aging: "Aging", ready: "Young", peak: "Peak", soon: "Drink Soon", past: "Past Peak", consumed: "Consumed", gifted: "Gifted" };
              return (
              <button key={f} onClick={() => setFilter(f)} style={chipStyle(filter === f)}>
                {labels[f] || f}
              </button>
            );})}
          </div>
        )}

        {/* ── Add buttons ── */}
        {step === "idle" && (
          <ImageCapture onImageSelect={handleImageSelect}>
            {({ openCamera, openGallery }) => (
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button onClick={openCamera} style={{
                  flex: 1, padding: "14px 12px", border: "1.5px dashed #8C1C2E", borderRadius: 12,
                  background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
                  fontWeight: 400, color: "#8C1C2E", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Scan a label
                </button>
                <button onClick={openGallery} title="Choose from gallery" style={{
                  width: 28, height: "auto", minHeight: 28, borderRadius: 14, border: "1.5px solid #EDEAE3",
                  background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, alignSelf: "center",
                }}>
                  <GalleryIcon size={14} color="#5A5248" />
                </button>
                <button onClick={() => setStep("form")} style={{
                  flex: 1, padding: "14px 12px", border: "1.5px dashed #EDEAE3", borderRadius: 12,
                  background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
                  fontWeight: 400, color: "#5A5248", cursor: "pointer",
                }}>Add manually</button>
              </div>
            )}
          </ImageCapture>
        )}

        {/* ── Scanning state ── */}
        {step === "scanning" && (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {imagePreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid #EDEAE3" }}>
                <img src={imagePreview} alt="Label" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} />
              </div>
            )}
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#1A1410", marginBottom: 6 }}>
              Sommy is reading the label...
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "#D4D1CA" }}>
              Identifying wine details for your cellar
            </div>
          </div>
        )}

        {/* ── Add form ── */}
        {step === "form" && (
          <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
            <div style={{ ...mono(), marginBottom: 16 }}>ADD TO CELLAR</div>

            {imagePreview && (
              <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 14, border: "1px solid #EDEAE3" }}>
                <img src={imagePreview} alt="Label" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input placeholder="Wine name *" value={formName} onChange={e => setFormName(e.target.value)} style={inputStyle} />
              <input placeholder="Producer" value={formProducer} onChange={e => setFormProducer(e.target.value)} style={inputStyle} />
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Vintage" value={formVintage} onChange={e => setFormVintage(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <input placeholder="Region" value={formRegion} onChange={e => setFormRegion(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Grapes" value={formGrapes} onChange={e => setFormGrapes(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <input placeholder="Style" value={formStyle} onChange={e => setFormStyle(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>

              {/* Quantity stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ ...mono("0.55rem"), color: "#5A5248", width: 70 }}>QUANTITY</span>
                <button onClick={() => setFormQuantity(Math.max(1, formQuantity - 1))} style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #EDEAE3", background: "white",
                  fontFamily: "'Jost', sans-serif", fontSize: "1rem", cursor: "pointer", color: "#5A5248",
                }}>-</button>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#1A1410", minWidth: 30, textAlign: "center" }}>{formQuantity}</span>
                <button onClick={() => setFormQuantity(formQuantity + 1)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #EDEAE3", background: "white",
                  fontFamily: "'Jost', sans-serif", fontSize: "1rem", cursor: "pointer", color: "#5A5248",
                }}>+</button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "#D4D1CA" }}>$</span>
                  <input placeholder="Price" value={formPrice} onChange={e => setFormPrice(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 24 }} />
                </div>
                <input placeholder="Source (e.g. wine shop)" value={formSource} onChange={e => setFormSource(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} style={inputStyle} />
              <textarea placeholder="Notes (optional)" value={formNotes} onChange={e => setFormNotes(e.target.value)}
                rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={resetForm} style={{
                flex: 1, padding: "12px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
              }}>Cancel</button>
              <button onClick={saveToCellar} disabled={saving || !formName.trim()} style={{
                flex: 1, padding: "12px", border: "none", borderRadius: 10,
                background: saving || !formName.trim() ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
                cursor: saving || !formName.trim() ? "default" : "pointer",
              }}>{saving ? "Adding..." : "Add to cellar"}</button>
            </div>
            {error && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "#8C1C2E", marginTop: 10, textAlign: "center" }}>{error}</p>}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && step === "idle" && (
          <div style={{ textAlign: "center", padding: 40, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#D4D1CA" }}>Loading...</div>
        )}

        {/* ── Empty state ── */}
        {!loading && activeWines.length === 0 && step === "idle" && filter === "all" && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4D1CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
              <path d="M8 22v-8a4 4 0 0 1 8 0v8" />
              <line x1="4" y1="22" x2="20" y2="22" />
            </svg>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
              Your cellar is empty
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6 }}>
              Scan a wine label or add bottles manually. Sommy will estimate drinking windows and help you track your collection.
            </p>
          </div>
        )}

        {/* ── Wine list ── */}
        {step === "idle" && !loading && sorted.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.map(wine => {
              const isExpanded = expandedId === wine.id;
              const isEditing = editingId === wine.id;
              const isActioning = actionId === wine.id;
              const phase = getWinePhase(wine);
              const cc = countryCode(regionToCountry(wine.region));

              return (
                <div key={wine.id} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "hidden" }}>
                  {/* Main row */}
                  <button onClick={() => { setExpandedId(isExpanded ? null : wine.id); if (isEditing) setEditingId(null); }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    {/* Thumbnail */}
                    {wine.image_url ? (
                      <img src={wine.image_url} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: 8, background: "#EDEAE3", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4D1CA" strokeWidth="1.5">
                          <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
                          <path d="M8 22v-8a4 4 0 0 1 8 0v8" />
                          <line x1="4" y1="22" x2="20" y2="22" />
                        </svg>
                      </div>
                    )}
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400,
                          color: "#1A1410", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                        }}>
                          {wine.wine_name}
                          {wine.vintage && <span style={{ fontWeight: 300, fontSize: "0.85rem" }}> {wine.vintage}</span>}
                        </div>
                        {/* Quantity badge */}
                        {wine.quantity > 1 && (
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%", background: "#8C1C2E",
                            color: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem", flexShrink: 0,
                          }}>x{wine.quantity}</span>
                        )}
                      </div>
                      {wine.producer && (
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "#8C1C2E", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {wine.producer}
                        </div>
                      )}
                      {/* Bottle-aware award badges — shared AwardsRow renders
                          high & medium confidence only, hides empty/low silently. */}
                      <AwardsRow
                        awards={wine.awards_json}
                        hostId={wine.id}
                        activeTooltipId={activeAwardTooltip}
                        onToggleTooltip={setActiveAwardTooltip}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        {wine.region && (
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {cc && <img src={`https://flagcdn.com/28x21/${cc.toLowerCase()}.png`} alt="" width={14} height={10} style={{ borderRadius: 1.5, objectFit: "cover" }} />}
                            {wine.region}
                          </span>
                        )}
                        {wine.purchase_price != null && wine.purchase_price > 0 && (
                          <span style={{ ...mono("0.52rem"), color: "#5A5248" }}>{formatCellarPrice(wine.purchase_price, profile?.currency_code)}</span>
                        )}
                        {wine.market_value_estimate != null && wine.market_value_estimate > 0 && wine.market_value_estimate !== wine.purchase_price && (
                          <span style={{ ...mono("0.52rem"), color: "#8C1C2E" }} title="Estimated by Sommy (AI) - not a live market price">est. {formatCellarPrice(wine.market_value_estimate, profile?.currency_code)}</span>
                        )}
                      </div>
                      {/* Drinking window bar */}
                      {wine.status === "active" && <DrinkingWindowBar wine={wine} />}
                      {/* Status for consumed/gifted */}
                      {wine.status !== "active" && (
                        <div style={{ ...mono("0.56rem"), color: phaseColor(phase), marginTop: 4 }}>
                          {phaseLabel(phase).toUpperCase()}
                          {wine.status_updated_at && ` — ${formatDate(wine.status_updated_at)}`}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* ── Expanded detail ── */}
                  {isExpanded && !isEditing && !isActioning && (
                    <div style={{ padding: "0 14px 14px", borderTop: "1px solid #EDEAE3" }}>
                      {/* Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 12, marginBottom: 10 }}>
                        {wine.grapes && <span style={{ ...mono("0.55rem"), padding: "4px 10px", background: "#F7F4EF", borderRadius: 6 }}>{wine.grapes.toUpperCase()}</span>}
                        {wine.style && <span style={{ ...mono("0.55rem"), padding: "4px 10px", background: "#F7F4EF", borderRadius: 6 }}>{wine.style.toUpperCase()}</span>}
                      </div>
                      {/* Purchase info */}
                      {(wine.purchase_source || wine.purchase_date) && (
                        <div style={{ ...mono("0.52rem"), color: "#7A7568", marginBottom: 8 }}>
                          {[wine.purchase_source, wine.purchase_date && `Purchased ${formatDate(wine.purchase_date)}`].filter(Boolean).join(" · ")}
                        </div>
                      )}
                      {/* Notes */}
                      {wine.notes && (
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.5, margin: "0 0 10px", fontStyle: "italic" }}>
                          "{wine.notes}"
                        </p>
                      )}
                      {/* Sommy's assessment */}
                      {wine.sommy_assessment && (
                        <div style={{
                          fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
                          color: "#1A1410", lineHeight: 1.65, margin: "0 0 10px",
                          padding: "10px 14px", background: "rgba(140,28,46,0.03)", borderRadius: 10,
                        }}>
                          <div style={{ ...mono("0.56rem"), color: "#8C1C2E", marginBottom: 6 }}>SOMMY'S ASSESSMENT</div>
                          {wine.sommy_assessment}
                        </div>
                      )}
                      {/* Decanting guidance */}
                      {(() => {
                        const da = getDecantingAdvice(wine);
                        const dl = DECANT_LABEL[da.level];
                        return (
                          <div style={{
                            margin: "0 0 12px", padding: "10px 14px",
                            background: "#FAFAF7", borderRadius: 10,
                            border: "1px solid #EDEAE3",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <div style={{ ...mono("0.56rem"), color: "#5A5248" }}>DECANTING</div>
                              <span style={{
                                ...mono("0.48rem"), color: dl.color,
                                padding: "2px 8px", borderRadius: 4,
                                background: dl.color + "12",
                                fontWeight: 600,
                              }}>{dl.text}</span>
                              {da.duration && (
                                <span style={{ ...mono("0.52rem"), color: "#8C1C2E", marginLeft: "auto" }}>{da.duration}</span>
                              )}
                            </div>
                            <p style={{
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
                              fontWeight: 300, color: "#1A1410", lineHeight: 1.55,
                              margin: 0,
                            }}>{da.tip}</p>
                            {da.method && (
                              <div style={{ ...mono("0.48rem"), color: "#7A7568", marginTop: 6 }}>
                                {da.method.toUpperCase()}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {/* Tasting notes — generated by Sommy, cached forever */}
                      <div style={{ marginBottom: 10 }}>
                        {wine.tasting_notes_json?.notes && wine.tasting_notes_json.notes.length > 0 ? (
                          <div style={{
                            padding: "10px 14px", background: "#FAFAF7",
                            borderRadius: 10, border: "1px solid #EDEAE3",
                          }}>
                            <div style={{ ...mono("0.56rem"), color: "#5A5248", marginBottom: 8 }}>TASTING NOTES</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {wine.tasting_notes_json.notes.map((n, idx) => {
                                const palette = TASTE_COLORS[n.category] || TASTE_COLORS.fruit;
                                return (
                                  <span key={idx} style={{
                                    display: "inline-block", padding: "3px 10px",
                                    borderRadius: 12, fontSize: "0.74rem",
                                    fontFamily: "'Geist Mono', monospace",
                                    textTransform: "lowercase", letterSpacing: "0.04em",
                                    border: `1px solid ${palette.border}`,
                                    background: palette.bg, color: palette.color,
                                  }}>{n.term}</span>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => generateWineContext(wine, "tasting")}
                            disabled={tastingLoadingId === wine.id}
                            data-testid={`taste-btn-${wine.id}`}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              padding: "8px 14px", borderRadius: 10,
                              background: "white", border: "1px solid #EDEAE3",
                              cursor: tastingLoadingId === wine.id ? "wait" : "pointer",
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                              color: "#8C1C2E", opacity: tastingLoadingId === wine.id ? 0.6 : 1,
                            }}
                          >
                            {tastingLoadingId === wine.id ? (
                              <>Sommy is thinking…</>
                            ) : (
                              <>What does this taste like? <span style={{ marginLeft: 2 }}>→</span></>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Food pairings — generated by Sommy, cached forever */}
                      <div style={{ marginBottom: 12 }}>
                        {wine.food_pairings_json?.pairings && wine.food_pairings_json.pairings.length > 0 ? (
                          <div style={{
                            padding: "10px 14px", background: "#FAFAF7",
                            borderRadius: 10, border: "1px solid #EDEAE3",
                          }}>
                            <div style={{ ...mono("0.56rem"), color: "#5A5248", marginBottom: 8 }}>PAIRS WITH</div>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                              {wine.food_pairings_json.pairings.map((p, idx) => (
                                <li key={idx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <div style={{
                                    fontFamily: "'Jost', sans-serif", fontSize: "0.86rem",
                                    fontWeight: 500, color: "#1A1410", lineHeight: 1.4,
                                  }}>{p.dish}</div>
                                  <div style={{
                                    fontFamily: "'Jost', sans-serif", fontSize: "0.76rem",
                                    fontWeight: 300, color: "#5A5248", lineHeight: 1.45,
                                    fontStyle: "italic",
                                  }}>{p.why}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <button
                            onClick={() => generateWineContext(wine, "pairings")}
                            disabled={pairingsLoadingId === wine.id}
                            data-testid={`pair-btn-${wine.id}`}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              padding: "8px 14px", borderRadius: 10,
                              background: "white", border: "1px solid #EDEAE3",
                              cursor: pairingsLoadingId === wine.id ? "wait" : "pointer",
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                              color: "#8C1C2E", opacity: pairingsLoadingId === wine.id ? 0.6 : 1,
                            }}
                          >
                            {pairingsLoadingId === wine.id ? (
                              <>Sommy is thinking…</>
                            ) : (
                              <>Pair with food <span style={{ marginLeft: 2 }}>→</span></>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      {wine.status === "active" && (
                        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                          <button onClick={() => { setActionId(wine.id); setActionType("consumed"); setActionDate(new Date().toISOString().split("T")[0]); }} style={{
                            background: "none", border: "none", cursor: "pointer", ...mono("0.55rem"), color: "#4A7A52", padding: 0,
                          }}>CONSUMED</button>
                          <button onClick={() => { setActionId(wine.id); setActionType("gifted"); }} style={{
                            background: "none", border: "none", cursor: "pointer", ...mono("0.55rem"), color: "#5A5248", padding: 0,
                          }}>GIFTED</button>
                          <button onClick={() => startEdit(wine)} style={{
                            background: "none", border: "none", cursor: "pointer", ...mono("0.55rem"), color: "#8C1C2E", padding: 0,
                          }}>EDIT</button>
                          {confirmDeleteId === wine.id ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248" }}>Remove?</span>
                              <button onClick={() => setConfirmDeleteId(null)} style={{
                                background: "none", border: "1px solid #EDEAE3", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                                ...mono("0.5rem"), color: "#5A5248",
                              }}>CANCEL</button>
                              <button onClick={() => deleteWine(wine.id)} style={{
                                background: "#8C1C2E", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                                ...mono("0.5rem"), color: "#F7F4EF",
                              }}>DELETE</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(wine.id)} style={{
                              background: "none", border: "none", cursor: "pointer", ...mono("0.55rem"), color: "#D4D1CA", padding: 0,
                            }}>DELETE</button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Consumed / Gifted mini-form ── */}
                  {isExpanded && isActioning && (
                    <div style={{ padding: "14px", borderTop: "1px solid #EDEAE3" }}>
                      <div style={{ ...mono("0.55rem"), marginBottom: 12, color: actionType === "consumed" ? "#4A7A52" : "#5A5248" }}>
                        {actionType === "consumed" ? "LOG AS CONSUMED" : "LOG AS GIFTED"}
                      </div>
                      {actionType === "consumed" && (
                        <>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 6, color: "#5A5248" }}>WHEN</div>
                            <input type="date" value={actionDate} onChange={e => setActionDate(e.target.value)} style={inputStyle} />
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 6, color: "#5A5248" }}>RATING</div>
                            <Stars value={actionRating} onChange={setActionRating} />
                          </div>
                        </>
                      )}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ ...mono("0.48rem"), marginBottom: 6, color: "#5A5248" }}>NOTES</div>
                        <textarea placeholder={actionType === "consumed" ? "How was it?" : "Who did you give it to?"} value={actionNotes}
                          onChange={e => setActionNotes(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                      </div>
                      {wine.quantity > 1 && (
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginBottom: 12 }}>
                          This will reduce quantity from {wine.quantity} to {wine.quantity - 1}.
                        </p>
                      )}
                      {wine.quantity <= 1 && actionType === "consumed" && (
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#4A7A52", marginBottom: 12 }}>
                          Last bottle — you'll be taken to your journal to log tasting notes.
                        </p>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setActionId(null); setActionType(null); setActionNotes(""); setActionRating(0); }} style={{
                          flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
                        }}>Cancel</button>
                        <button onClick={handleAction} disabled={actionSaving} style={{
                          flex: 1, padding: "10px", border: "none", borderRadius: 10,
                          background: actionSaving ? "#D4D1CA" : (actionType === "consumed" ? "#4A7A52" : "#8C1C2E"),
                          color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                          cursor: actionSaving ? "default" : "pointer",
                        }}>{actionSaving ? "Saving..." : "Confirm"}</button>
                      </div>
                    </div>
                  )}

                  {/* ── Edit mode ── */}
                  {isExpanded && isEditing && (
                    <div style={{ padding: "14px", borderTop: "1px solid #EDEAE3" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                        <div>
                          <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>WINE NAME</div>
                          <input value={editFields.wine_name} onChange={e => setEditFields(f => ({ ...f, wine_name: e.target.value }))} style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>PRODUCER</div>
                            <input value={editFields.producer} onChange={e => setEditFields(f => ({ ...f, producer: e.target.value }))} style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>VINTAGE</div>
                            <input value={editFields.vintage} onChange={e => setEditFields(f => ({ ...f, vintage: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>REGION</div>
                            <input value={editFields.region} onChange={e => setEditFields(f => ({ ...f, region: e.target.value }))} style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>GRAPES</div>
                            <input value={editFields.grapes} onChange={e => setEditFields(f => ({ ...f, grapes: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>STYLE</div>
                            <input value={editFields.style} onChange={e => setEditFields(f => ({ ...f, style: e.target.value }))} style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>QTY</div>
                            <input type="number" min={1} value={editFields.quantity} onChange={e => setEditFields(f => ({ ...f, quantity: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>PRICE ($)</div>
                            <input value={editFields.purchase_price} onChange={e => setEditFields(f => ({ ...f, purchase_price: e.target.value }))} style={inputStyle} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>SOURCE</div>
                            <input value={editFields.purchase_source} onChange={e => setEditFields(f => ({ ...f, purchase_source: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>NOTES</div>
                          <textarea value={editFields.notes} onChange={e => setEditFields(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEditingId(null)} style={{
                          flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
                        }}>Cancel</button>
                        <button onClick={saveEdit} disabled={editSaving || !editFields.wine_name?.trim()} style={{
                          flex: 1, padding: "10px", border: "none", borderRadius: 10,
                          background: editSaving ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                          cursor: editSaving ? "default" : "pointer",
                        }}>{editSaving ? "Saving..." : "Save changes"}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── No results for filter ── */}
        {step === "idle" && !loading && sorted.length === 0 && wines.length > 0 && (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#D4D1CA" }}>
              No wines match this filter.
            </p>
          </div>
        )}

        {/* ── Cellar Goals ── */}
        {step === "idle" && !loading && (
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setGoalsOpen(!goalsOpen)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
              padding: "12px 16px", background: "white", border: "1px solid #EDEAE3",
              borderRadius: goalsOpen ? "12px 12px 0 0" : 12, cursor: "pointer",
            }}>
              <span style={{ ...mono("0.55rem"), color: "#5A5248" }}>CELLAR GOALS</span>
              <span style={{ fontSize: "0.8rem", color: "#D4D1CA" }}>{goalsOpen ? "−" : "+"}</span>
            </button>

            {goalsOpen && (
              <div style={{
                background: "white", border: "1px solid #EDEAE3", borderTop: "none",
                borderRadius: "0 0 12px 12px", padding: "16px",
              }}>
                {!goals && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6, margin: "0 0 16px" }}>
                    I'd love to help you build your cellar with intention. What are you going for?
                  </p>
                )}

                <div style={{ marginBottom: 14 }}>
                  <div style={{ ...mono("0.48rem"), color: "#5A5248", marginBottom: 8 }}>GOAL STYLE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Versatile", "Focused", "Investment", "Everyday", "Special Occasion"].map(s => (
                      <button key={s} onClick={() => setGoalStyle(goalStyle === s ? "" : s)} style={chipStyle(goalStyle === s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ ...mono("0.48rem"), color: "#5A5248", marginBottom: 8 }}>BUDGET RANGE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Under $20", "$20-50", "$50-100", "$100+"].map(b => (
                      <button key={b} onClick={() => setGoalBudget(goalBudget === b ? "" : b)} style={chipStyle(goalBudget === b)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={saveGoals} disabled={goalSaving || (!goalStyle && !goalBudget)} style={{
                  width: "100%", padding: "11px", border: "none", borderRadius: 10,
                  background: goalSaving || (!goalStyle && !goalBudget) ? "#D4D1CA" : "#8C1C2E",
                  color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
                  cursor: goalSaving || (!goalStyle && !goalBudget) ? "default" : "pointer",
                }}>
                  {goalSaving ? "Saving..." : goals ? "Update goals" : "Save goals"}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
