import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useUserData, type WishlistEntry } from "@/lib/useUserData";
import { useLocation } from "wouter";
import { directInsert, directDelete, directUpdate, directSelect } from "@/lib/supabaseDirectFetch";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";
import LoginPrompt from "@/components/LoginPrompt";
import { AwardsRow } from "@/components/AwardsRow";
import { MatchBadge } from "@/components/MatchBadge";

// ── Helpers ──

function compressImage(dataUrl: string, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else       { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

interface ParsedCard {
  name: string; producer: string; vintage: string; region: string;
  grapes: string; style: string; price: string;
  nose: string; palate: string; texture: string; breathing: string;
  drink_from: string; drink_peak_start: string; drink_peak_end: string; drink_until: string;
}

function parseWineCard(text: string): { card: ParsedCard | null; prose: string } {
  const lines = text.split("\n");
  const card: Record<string, string> = {};
  let afterCard = false;
  const proseLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("**") && line.includes(":")) {
      const m = line.match(/\*\*(.+?)\*\*:\s*(.*)/);
      if (m) card[m[1].toLowerCase().trim()] = m[2].trim();
    } else {
      if (Object.keys(card).length > 0) afterCard = true;
      if (afterCard) proseLines.push(line);
    }
  }

  if (!card["wine"] && !card["name"]) return { card: null, prose: text };

  return {
    card: {
      name: card["wine"] || card["name"] || "",
      producer: card["producer"] || "",
      vintage: card["vintage"] || "",
      region: card["region"] || "",
      grapes: card["grapes"] || card["grape"] || "",
      style: card["style"] || "",
      price: card["price"] || card["price range"] || "",
      nose: card["nose"] || "",
      palate: card["palate"] || "",
      texture: card["texture"] || "",
      breathing: card["breathing"] || card["decant"] || "",
      drink_from: card["drink from"] || card["drink_from"] || "",
      drink_peak_start: card["drink peak start"] || card["drink_peak_start"] || card["peak start"] || "",
      drink_peak_end: card["drink peak end"] || card["drink_peak_end"] || card["peak end"] || "",
      drink_until: card["drink until"] || card["drink_until"] || "",
    },
    prose: proseLines.join("\n").trim(),
  };
}

function sourceLabel(source: string | null): string {
  if (source === "sommy") return "Sommy recommended";
  if (source === "explore") return "Saved from explore";
  if (source === "scan") return "Scanned label";
  if (source === "manual") return "Added manually";
  return "Added manually";
}

// ── Icons ──

function BookmarkIcon({ size = 16, color = "#8C1C2E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={14} height={14} viewBox="0 0 24 24"
      fill="none" stroke="#5A5248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Drinking Window Bar (matches Cellar.tsx) ──

const CURRENT_YEAR = new Date().getFullYear();

function getPhase(entry: WishlistEntry): string {
  if (!entry.drink_from) return "unknown";
  if (CURRENT_YEAR < entry.drink_from) return "aging";
  if (entry.drink_until && CURRENT_YEAR > entry.drink_until) return "past";
  if (entry.drink_peak_start && entry.drink_peak_end && CURRENT_YEAR >= entry.drink_peak_start && CURRENT_YEAR <= entry.drink_peak_end) return "peak";
  if (entry.drink_peak_end && entry.drink_until && CURRENT_YEAR > entry.drink_peak_end) return "soon";
  return "ready";
}

function phaseLabel(phase: string): string {
  if (phase === "aging") return "Hold";
  if (phase === "ready") return "Ready";
  if (phase === "peak") return "Peak";
  if (phase === "soon") return "Drink Soon";
  if (phase === "past") return "Past Peak";
  return "";
}

function phaseColor(phase: string): string {
  if (phase === "aging") return "#7A9AB5";
  if (phase === "ready") return "#6B9E6B";
  if (phase === "peak") return "#1F6B35";
  if (phase === "soon") return "#C8962E";
  if (phase === "past") return "#A67055";
  return "#D4D1CA";
}

const BAR_HOLD = "#7A9AB5";
const BAR_READY = "#6B9E6B";
const BAR_PEAK = "#1F6B35";
const BAR_SOON = "#C8962E";

function ReadinessBar({ entry }: { entry: WishlistEntry }) {
  const from = entry.drink_from;
  const until = entry.drink_until;
  if (!from || !until || until <= from) return null;

  const peakStart = entry.drink_peak_start || from;
  const peakEnd = entry.drink_peak_end || until;
  const phase = getPhase(entry);
  if (phase === "unknown") return null;

  const isBefore = CURRENT_YEAR < from;
  const isAfter = CURRENT_YEAR > until;

  const holdYears = isBefore ? Math.min(from - CURRENT_YEAR, 6) : 0;
  const pastYears = isAfter ? Math.min(CURRENT_YEAR - until, 4) : 0;
  const windowSpan = until - from;
  const totalSpan = holdYears + windowSpan + pastYears;

  const holdPct = (holdYears / totalSpan) * 100;
  const readyPct = ((peakStart - from) / totalSpan) * 100;
  const peakPct = ((peakEnd - peakStart) / totalSpan) * 100;
  const soonPct = ((until - peakEnd) / totalSpan) * 100;
  const pastPct = (pastYears / totalSpan) * 100;

  const nowOffset = isBefore
    ? ((CURRENT_YEAR - (from - holdYears)) / totalSpan) * 100
    : isAfter
    ? ((holdYears + windowSpan + (CURRENT_YEAR - until)) / totalSpan) * 100
    : ((holdYears + (CURRENT_YEAR - from)) / totalSpan) * 100;

  const yearMarkers: { year: number; pct: number }[] = [];
  if (holdYears > 0) yearMarkers.push({ year: from, pct: holdPct });
  if (peakStart > from) yearMarkers.push({ year: peakStart, pct: holdPct + readyPct });
  if (peakEnd < until) yearMarkers.push({ year: peakEnd, pct: holdPct + readyPct + peakPct });
  if (pastYears > 0) yearMarkers.push({ year: until, pct: holdPct + readyPct + peakPct + soonPct });

  const markerColor = phaseColor(phase);

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ ...mono("0.58rem"), color: markerColor }}>{phaseLabel(phase).toUpperCase()}</span>
      </div>

      <div style={{ position: "relative", height: 8, borderRadius: 4, overflow: "visible", background: "#EDEAE3" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden" }}>
          {holdPct > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${holdPct}%`, background: BAR_HOLD, opacity: 0.5 }} />
          )}
          {readyPct > 0 && (
            <div style={{ position: "absolute", left: `${holdPct}%`, top: 0, height: "100%", width: `${readyPct}%`, background: BAR_READY }} />
          )}
          <div style={{ position: "absolute", left: `${holdPct + readyPct}%`, top: 0, height: "100%", width: `${peakPct}%`, background: BAR_PEAK }} />
          {soonPct > 0 && (
            <div style={{ position: "absolute", left: `${holdPct + readyPct + peakPct}%`, top: 0, height: "100%", width: `${soonPct}%`, background: BAR_SOON }} />
          )}
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

// ── Tasting pills ──

function tastingPillColor(note: string): { bg: string; fg: string } {
  const n = note.toLowerCase();
  // Fruit
  if (/cherry|berry|plum|raspberry|strawberry|cassis|blackcurrant|fig|cranberry|apple|pear|peach|apricot|citrus|lemon|tropical|mango|melon|grapefruit|lychee|fruit/.test(n))
    return { bg: "rgba(140,28,46,0.08)", fg: "#8C1C2E" };
  // Floral
  if (/rose|violet|floral|lavender|jasmine|blossom|honeysuckle/.test(n))
    return { bg: "rgba(180,80,140,0.08)", fg: "#9A4D7A" };
  // Earth
  if (/earth|mushroom|truffle|soil|tobacco|leather|hay|forest|wet/.test(n))
    return { bg: "rgba(90,82,72,0.08)", fg: "#5A5248" };
  // Oak / spice
  if (/oak|cedar|vanilla|toast|smoke|caramel|butter|spice|cinnamon|pepper|clove|nutmeg/.test(n))
    return { bg: "rgba(160,120,60,0.10)", fg: "#8A6A30" };
  // Mineral
  if (/mineral|flint|chalk|slate|stone|graphite|salt/.test(n))
    return { bg: "rgba(100,120,140,0.08)", fg: "#5A6A7A" };
  // Default
  return { bg: "rgba(90,82,72,0.06)", fg: "#5A5248" };
}

function TastingPills({ label, text }: { label: string; text: string }) {
  const pills = text.split(",").map(s => s.trim()).filter(Boolean);
  if (pills.length === 0) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...mono("0.56rem"), color: "#7A7568", marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {pills.map((p, i) => {
          const c = tastingPillColor(p);
          return (
            <span key={i} style={{
              ...mono("0.55rem"), padding: "4px 10px", borderRadius: 5,
              background: c.bg, color: c.fg,
            }}>
              {p.toUpperCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Constants ──

const OFFSET = "52px";

const mono = (size = "0.6rem"): React.CSSProperties => ({
  fontFamily: "'Geist Mono', monospace", fontSize: size,
  letterSpacing: "0.12em", color: "#5A5248",
});

// ── Main Component ──

// ── Retailer Search ─────────────────────────────────────────────────────────
interface Retailer { name: string; url: string; note: string }

function RetailerLink({ r }: { r: Retailer }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 10px", background: "white", borderRadius: 6,
        border: "1px solid #EDEAE3", textDecoration: "none",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#8C1C2E")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#EDEAE3")}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, color: "#1A1410" }}>
          {r.name}
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "#5A5248", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {r.note}
        </div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4D1CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 8 }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}

// Client-side rate limit: max 8 retailer searches per hour
const SEARCH_LIMIT = 8;
const SEARCH_WINDOW = 60 * 60 * 1000; // 1 hour
let searchTimestamps: number[] = [];

function canSearch(): boolean {
  const now = Date.now();
  searchTimestamps = searchTimestamps.filter(t => now - t < SEARCH_WINDOW);
  return searchTimestamps.length < SEARCH_LIMIT;
}
function recordSearch() { searchTimestamps.push(Date.now()); }

function RetailerSearch({ wineName, country }: { wineName: string; country: string | null }) {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [fallbacks, setFallbacks] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [limited, setLimited] = useState(false);

  const search = async () => {
    if (!canSearch()) {
      setLimited(true);
      setSearched(true);
      setFallbacks([
        { name: "Vivino", url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wineName)}`, note: "Search and compare prices" },
        { name: "Wine-Searcher", url: `https://www.wine-searcher.com/find/${encodeURIComponent(wineName)}`, note: "Price comparison across retailers" },
      ]);
      return;
    }
    setLoading(true);
    recordSearch();
    try {
      const params = new URLSearchParams({ wine: wineName });
      if (country) params.set("country", country);
      const res = await fetch(`/api/find-retailers?${params}`, { signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRetailers(data.retailers || []);
      setFallbacks(data.fallbacks || []);
    } catch {
      setRetailers([]);
      setFallbacks([
        { name: "Vivino", url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wineName)}`, note: "Search and compare prices" },
        { name: "Wine-Searcher", url: `https://www.wine-searcher.com/find/${encodeURIComponent(wineName)}`, note: "Price comparison across retailers" },
      ]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  if (!searched) {
    return (
      <button
        onClick={search}
        disabled={loading}
        style={{
          width: "100%", padding: "10px 12px", border: "1.5px dashed #EDEAE3", borderRadius: 8,
          background: "#F7F4EF", cursor: loading ? "default" : "pointer",
          fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", fontWeight: 500,
          letterSpacing: "0.08em", color: loading ? "#7A7568" : "#8C1C2E",
          textTransform: "uppercase", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, transition: "all 0.15s",
        }}
      >
        {loading ? (
          <>
            <style>{`
              @keyframes drop-pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.15); opacity: 1; }
              }
              @keyframes drop-ring {
                0% { transform: scale(0.8); opacity: 0.6; }
                100% { transform: scale(1.8); opacity: 0; }
              }
            `}</style>
            <div style={{ position: "relative", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #8C1C2E", animation: "drop-ring 1.2s ease-out infinite" }} />
              <svg width="12" height="12" viewBox="0 0 24 24" style={{ animation: "drop-pulse 1.2s ease-in-out infinite" }}>
                <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" fill="#8C1C2E" />
              </svg>
            </div>
            Searching for this bottle...
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Find Retailers{country ? ` in ${country}` : ""}
          </>
        )}
      </button>
    );
  }

  return (
    <div style={{ background: "#F7F4EF", borderRadius: 8, padding: "10px 12px" }}>
      {retailers.length > 0 ? (
        <>
          <div style={{ ...mono("0.56rem"), color: "#4A7A52", marginBottom: 8 }}>
            FOUND {retailers.length} RETAILER{retailers.length > 1 ? "S" : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {retailers.map((r, i) => <RetailerLink key={i} r={r} />)}
          </div>
        </>
      ) : (
        <>
          <div style={{ ...mono("0.56rem"), color: "#7A7568", marginBottom: 6 }}>
            {limited ? "SEARCH LIMIT REACHED" : "NO DIRECT MATCHES FOUND"}
          </div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.5, marginBottom: 8 }}>
            {limited
              ? "Try again in a bit. In the meantime, check these:"
              : `Worth checking with reputable retailers${country ? ` in ${country}` : ""}.`}
          </div>
        </>
      )}

      {/* Fallback search links (only shown when no direct matches) */}
      {fallbacks.length > 0 && (
        <div style={{ marginTop: retailers.length > 0 ? 10 : 0 }}>
          {retailers.length > 0 && (
            <div style={{ ...mono("0.52rem"), color: "#7A7568", marginBottom: 6 }}>ALSO TRY</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {fallbacks.map((r, i) => <RetailerLink key={i} r={r} />)}
          </div>
        </div>
      )}

      <button
        onClick={() => { setSearched(false); setRetailers([]); setFallbacks([]); }}
        style={{
          marginTop: 8, background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.08em",
          color: "#7A7568", textTransform: "uppercase",
        }}
      >
        Search again
      </button>
    </div>
  );
}

export default function Wishlist() {
  const { user, profile } = useAuth();
  const { silentRefresh, wishlist: wishlistData } = useUserData();
  const [, setLocation] = useLocation();

  // Wishlist local state
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  useEffect(() => { setWishlist(wishlistData); }, [wishlistData]);

  // Tooltip state for shared badge components
  const [activeAwardTooltip, setActiveAwardTooltip] = useState<string | null>(null);
  const [activeMatchTooltip, setActiveMatchTooltip] = useState<string | null>(null);

  // Palate state — drives match scoring. Identical pattern to the cellar so
  // the user experience is consistent across surfaces.
  const [palateVersion, setPalateVersion] = useState<number | null>(null);
  const [palateDigest, setPalateDigest] = useState<any>(null);
  const [palateReady, setPalateReady] = useState(false);

  // Rescore progress
  const [rescoreTotal, setRescoreTotal] = useState(0);
  const [rescoreDone, setRescoreDone]   = useState(0);

  // Sort
  type WishlistSortKey =
    | "recent"
    | "match_desc"
    | "match_asc"
    | "price_desc"
    | "price_asc"
    | "vintage_old"
    | "vintage_new"
    | "name_asc";
  const SORT_LABELS: Record<WishlistSortKey, string> = {
    recent:      "Recently added",
    match_desc:  "Best matches first",
    match_asc:   "Most adventurous first",
    price_desc:  "Price: high to low",
    price_asc:   "Price: low to high",
    vintage_old: "Vintage: oldest first",
    vintage_new: "Vintage: newest first",
    name_asc:    "Name: A to Z",
  };
  const [sortKey, setSortKey] = useState<WishlistSortKey>(() => {
    if (typeof window === "undefined") return "recent";
    const stored = window.localStorage.getItem("wishlist_sort");
    if (stored && stored in SORT_LABELS) return stored as WishlistSortKey;
    return "recent";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("wishlist_sort", sortKey);
  }, [sortKey]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Manual add form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [saving, setSaving] = useState(false);

  // Scan state
  const [scanning, setScanning] = useState(false);

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Expand state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Image handling for scan
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = async () => {
      const rawUrl = reader.result as string;
      const compressed = await compressImage(rawUrl, 800, 0.75);
      setScanning(true);
      scanWithSommy(compressed.split(",")[1], "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  const scanWithSommy = async (base64: string, mediaType: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: "I'd like to log this wine in my journal. Read the label, identify it, and give me your personal take on it. What should I expect from this bottle?",
          }],
          image: { data: base64, mediaType },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.text) {
        const clean = data.text.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/, "").trim();
        const { card, prose } = parseWineCard(clean);
        if (card) {
          try {
            await directInsert("wine_wishlist", {
              user_id: user!.id,
              wine_name: card.name,
              producer: card.producer || null,
              region: card.region || null,
              grapes: card.grapes || null,
              style: card.style || null,
              price_estimate: card.price || null,
              why: prose ? prose.slice(0, 200) : null,
              source: "scan",
              vintage: card.vintage || null,
              nose: card.nose || null,
              palate: card.palate || null,
              texture: card.texture || null,
              breathing: card.breathing || null,
              drink_from: card.drink_from ? parseInt(card.drink_from) : null,
              drink_peak_start: card.drink_peak_start ? parseInt(card.drink_peak_start) : null,
              drink_peak_end: card.drink_peak_end ? parseInt(card.drink_peak_end) : null,
              drink_until: card.drink_until ? parseInt(card.drink_until) : null,
              sommy_notes: prose || null,
            });
            silentRefresh();
          } catch (err) {
            console.error("Wishlist scan save error:", err);
          }
        }
      }
    } catch (e) {
      console.error("Scan error:", e);
    } finally {
      setScanning(false);
    }
  };

  // Manual add
  const addToWishlist = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await directInsert("wine_wishlist", {
        user_id: user.id,
        wine_name: name.trim(),
        why: why.trim() || null,
        source: "manual",
      });
      setName("");
      setWhy("");
      setShowForm(false);
      silentRefresh();
      const newEntry: WishlistEntry = {
        id: crypto.randomUUID(),
        wine_name: name.trim(),
        producer: null, region: null, grapes: null, style: null, price_estimate: null,
        why: why.trim() || null,
        source: "manual",
        created_at: new Date().toISOString(),
        vintage: null, nose: null, palate: null, texture: null, breathing: null,
        drink_from: null, drink_peak_start: null, drink_peak_end: null, drink_until: null,
        sommy_notes: null,
        awards_json: null, awards_generated_at: null,
        match_score_json: null, match_score_palate_version: null, match_score_generated_at: null,
      };
      setWishlist(prev => [newEntry, ...prev]);
    } catch (e: any) {
      console.error("Wishlist add error:", e);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const deleteItem = async (id: string) => {
    try {
      await directDelete("wine_wishlist", id);
      setWishlist(prev => prev.filter(w => w.id !== id));
      setConfirmDeleteId(null);
      if (expandedId === id) setExpandedId(null);
      silentRefresh();
    } catch (e) {
      console.error("Wishlist delete error:", e);
    }
  };

  // ── Palate load ────────────────────────────────────────────────────────────
  // Same pattern as cellar — detect form completion + digest + version.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rows = await directSelect<any>(
          "user_preferences",
          `select=palate_digest,palate_version,palate_form_complete&user_id=eq.${user.id}`
        );
        const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        if (row && row.palate_form_complete && row.palate_digest && typeof row.palate_version === "number") {
          setPalateDigest(row.palate_digest);
          setPalateVersion(row.palate_version);
          setPalateReady(true);
        }
      } catch (e) { /* non-fatal */ }
    })();
  }, [user]);

  // ── Awards background generation (throttled, max 6/session) ──────────────
  const awardsBackfillRanRef = useRef(false);
  useEffect(() => {
    if (!user || wishlist.length === 0) return;
    if (awardsBackfillRanRef.current) return;
    const missing = wishlist.filter(w => !w.awards_json).slice(0, 6);
    if (missing.length === 0) return;
    awardsBackfillRanRef.current = true;
    (async () => {
      for (const w of missing) {
        try {
          const resp = await fetch("/api/wine-context", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "awards",
              wine: {
                id: w.id,
                wine_name: w.wine_name,
                vintage: w.vintage ? Number(w.vintage) : null,
                producer: w.producer,
                region: w.region,
                grapes: w.grapes,
                style: w.style,
              },
            }),
          });
          if (!resp.ok) continue;
          const json = await resp.json();
          const nowIso = new Date().toISOString();
          try {
            await directUpdate("wine_wishlist", w.id, {
              awards_json: json.data,
              awards_generated_at: nowIso,
            });
          } catch (cacheErr) {
            console.warn("Failed to cache wishlist awards:", cacheErr);
          }
          setWishlist(prev => prev.map(x =>
            x.id === w.id ? { ...x, awards_json: json.data, awards_generated_at: nowIso } : x
          ));
        } catch {
          // swallow — awards are silent enrichment
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, wishlist.length]);

  // ── Match score orchestrator (concurrent batches of 4) ────────────────────
  const rescoreRunRef = useRef<number | null>(null);
  useEffect(() => {
    if (!user || !palateReady || palateVersion == null || palateDigest == null) return;
    if (wishlist.length === 0) return;

    const stale = wishlist.filter(w => w.match_score_palate_version !== palateVersion);
    if (stale.length === 0) {
      setRescoreTotal(0);
      setRescoreDone(0);
      return;
    }
    if (rescoreRunRef.current === palateVersion) return;
    rescoreRunRef.current = palateVersion;

    setRescoreTotal(stale.length);
    setRescoreDone(0);

    const runOne = async (w: WishlistEntry) => {
      try {
        const resp = await fetch("/api/wine-context", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "match",
            palate_digest: palateDigest,
            wine: {
              id: w.id,
              wine_name: w.wine_name,
              vintage: w.vintage ? Number(w.vintage) : null,
              producer: w.producer,
              region: w.region,
              grapes: w.grapes,
              style: w.style,
            },
          }),
        });
        if (!resp.ok) return;
        const json = await resp.json();
        const nowIso = new Date().toISOString();
        try {
          await directUpdate("wine_wishlist", w.id, {
            match_score_json: json.data,
            match_score_palate_version: palateVersion,
            match_score_generated_at: nowIso,
          });
        } catch (cacheErr) {
          console.warn("Failed to cache wishlist match:", cacheErr);
        }
        setWishlist(prev => prev.map(x => x.id === w.id ? {
          ...x,
          match_score_json: json.data,
          match_score_palate_version: palateVersion,
          match_score_generated_at: nowIso,
        } : x));
      } catch {
        // silent per-wine failure
      } finally {
        setRescoreDone(d => d + 1);
      }
    };

    (async () => {
      const BATCH = 4;
      for (let i = 0; i < stale.length; i += BATCH) {
        const slice = stale.slice(i, i + BATCH);
        await Promise.all(slice.map(runOne));
      }
      setTimeout(() => { setRescoreTotal(0); setRescoreDone(0); }, 1200);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, palateReady, palateVersion, palateDigest, wishlist.length]);

  // ── Sort ────────────────────────────────────────────────────────────────────
  const parsePrice = (s: string | null): number | null => {
    if (!s) return null;
    const m = s.match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  };
  const tieBreak = (a: WishlistEntry, b: WishlistEntry) =>
    (a.wine_name || "").localeCompare(b.wine_name || "");
  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortKey) {
      case "recent": {
        const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return diff !== 0 ? diff : tieBreak(a, b);
      }
      case "match_desc": {
        const aS = typeof a.match_score_json?.score === "number" ? a.match_score_json.score : null;
        const bS = typeof b.match_score_json?.score === "number" ? b.match_score_json.score : null;
        if (aS === null && bS === null) return tieBreak(a, b);
        if (aS === null) return 1;
        if (bS === null) return -1;
        return aS !== bS ? bS - aS : tieBreak(a, b);
      }
      case "match_asc": {
        const aS = typeof a.match_score_json?.score === "number" ? a.match_score_json.score : null;
        const bS = typeof b.match_score_json?.score === "number" ? b.match_score_json.score : null;
        if (aS === null && bS === null) return tieBreak(a, b);
        if (aS === null) return 1;
        if (bS === null) return -1;
        return aS !== bS ? aS - bS : tieBreak(a, b);
      }
      case "price_desc": {
        const aP = parsePrice(a.price_estimate);
        const bP = parsePrice(b.price_estimate);
        if (aP === null && bP === null) return tieBreak(a, b);
        if (aP === null) return 1;
        if (bP === null) return -1;
        return aP !== bP ? bP - aP : tieBreak(a, b);
      }
      case "price_asc": {
        const aP = parsePrice(a.price_estimate);
        const bP = parsePrice(b.price_estimate);
        if (aP === null && bP === null) return tieBreak(a, b);
        if (aP === null) return 1;
        if (bP === null) return -1;
        return aP !== bP ? aP - bP : tieBreak(a, b);
      }
      case "vintage_old": {
        const aV = a.vintage ? Number(a.vintage) : null;
        const bV = b.vintage ? Number(b.vintage) : null;
        if (aV === null && bV === null) return tieBreak(a, b);
        if (aV === null) return 1;
        if (bV === null) return -1;
        return aV !== bV ? aV - bV : tieBreak(a, b);
      }
      case "vintage_new": {
        const aV = a.vintage ? Number(a.vintage) : null;
        const bV = b.vintage ? Number(b.vintage) : null;
        if (aV === null && bV === null) return tieBreak(a, b);
        if (aV === null) return 1;
        if (bV === null) return -1;
        return aV !== bV ? bV - aV : tieBreak(a, b);
      }
      case "name_asc": return tieBreak(a, b);
      default: return 0;
    }
  });

  // "Tried it" -> go to journal log
  const triedIt = (entry: WishlistEntry) => {
    setLocation(`/journey/journal?log=1&name=${encodeURIComponent(entry.wine_name)}&region=${encodeURIComponent(entry.region || "")}`);
  };

  const hasExpandableContent = (entry: WishlistEntry) =>
    !!(entry.nose || entry.palate || entry.texture || entry.breathing || entry.drink_from || entry.sommy_notes);

  const userCountry = profile?.base_country || null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #EDEAE3", borderRadius: 10,
    background: "white", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
    outline: "none", boxSizing: "border-box",
  };

  if (!user) {
    return <LoginPrompt title="Wines worth remembering" description="Log in to save wines you want to try — Sommy's tasting notes, readiness timeline, and where to find them." />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...mono(), color: "#7A7568", marginBottom: 4 }}>WINES TO TRY</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1A1410", margin: 0 }}>
            Wishlist
          </h1>
        </div>

        {/* Add buttons / form */}
        {showForm ? (
          <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
            <div style={{ ...mono(), marginBottom: 12 }}>ADD TO WISHLIST</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              <input placeholder="Wine name *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              <textarea placeholder="Notes — why do you want to try this? (optional)" value={why} onChange={e => setWhy(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowForm(false); setName(""); setWhy(""); }} style={{
                flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
              }}>Cancel</button>
              <button onClick={addToWishlist} disabled={saving || !name.trim()} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 10,
                background: saving || !name.trim() ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                cursor: saving || !name.trim() ? "default" : "pointer",
              }}>{saving ? "Adding..." : "Add to wishlist"}</button>
            </div>
          </div>
        ) : scanning ? (
          <div style={{
            width: "100%", padding: "20px", border: "1.5px solid #EDEAE3", borderRadius: 12,
            background: "white", textAlign: "center", marginBottom: 16,
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#8C1C2E", marginBottom: 6 }}>
              Sommy is reading the label...
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248" }}>
              This will be saved to your wishlist
            </div>
          </div>
        ) : (
          <ImageCapture onImageSelect={handleImageSelect}>
            {({ openCamera, openGallery }) => (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={openCamera} style={{
                  flex: 1, padding: "12px", border: "1.5px dashed #8C1C2E", borderRadius: 12,
                  background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                  color: "#8C1C2E", cursor: "pointer",
                }}>Scan a label</button>
                <button onClick={openGallery} title="Choose from gallery" style={{
                  width: 28, height: "auto", minHeight: 28, borderRadius: 14, border: "1.5px solid #EDEAE3",
                  background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, alignSelf: "center",
                }}>
                  <GalleryIcon size={14} color="#5A5248" />
                </button>
                <button onClick={() => setShowForm(true)} style={{
                  flex: 1, padding: "12px", border: "1.5px dashed #EDEAE3", borderRadius: 12,
                  background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                  color: "#5A5248", cursor: "pointer",
                }}>Add manually</button>
              </div>
            )}
          </ImageCapture>
        )}

        {/* Empty state */}
        {wishlist.length === 0 && !scanning && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <BookmarkIcon size={28} color="#D4D1CA" />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginTop: 12, marginBottom: 8 }}>
              Nothing here yet
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6 }}>
              Save wines you want to try from Sommy's recommendations, or add them manually above.
            </p>
          </div>
        )}

        {/* Calibration banner — mirrors the cellar's during palate rescore. */}
        {rescoreTotal > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "linear-gradient(90deg, rgba(140,28,46,0.06) 0%, rgba(212,165,106,0.06) 100%)",
            border: "1px solid rgba(140,28,46,0.18)", borderRadius: 10,
            padding: "10px 12px", marginBottom: 14,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              border: "2px solid rgba(140,28,46,0.2)", borderTopColor: "#8C1C2E",
              animation: "spin 0.8s linear infinite", flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, color: "#1A1410" }}>
                Sommy is calibrating your wishlist matches
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "#5A5248", marginTop: 1 }}>
                {rescoreDone} OF {rescoreTotal}
              </div>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        {/* Sort menu — only rendered when there's something to sort. */}
        {wishlist.length > 1 && (
          <div style={{ position: "relative", marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setSortMenuOpen(o => !o)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 16,
                border: "1px solid #EDEAE3", background: "white",
                fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#5A5248", cursor: "pointer",
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
                <div onClick={() => setSortMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                  background: "white", borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #EDEAE3", minWidth: 220, overflow: "hidden",
                }}>
                  {(Object.keys(SORT_LABELS) as WishlistSortKey[])
                    // Match-based sorts hidden until the user has a palate digest —
                    // otherwise the sort produces meaningless ordering.
                    .filter(key => palateReady || (key !== "match_desc" && key !== "match_asc"))
                    .map(key => {
                      const isActive = sortKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => { setSortKey(key); setSortMenuOpen(false); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            width: "100%", padding: "11px 14px", border: "none",
                            background: isActive ? "rgba(140,28,46,0.06)" : "white",
                            fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
                            fontWeight: isActive ? 500 : 300,
                            color: isActive ? "#8C1C2E" : "#1A1410",
                            cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#8C1C2E" : "transparent" }} />
                          <span>{SORT_LABELS[key]}</span>
                        </button>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Wishlist cards */}
        {wishlist.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedWishlist.map(entry => {
              const isExpanded = expandedId === entry.id;
              const canExpand = hasExpandableContent(entry);
              const hasMatch = palateReady && entry.match_score_json && typeof entry.match_score_json.score === "number";

              return (
                <div key={entry.id} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "visible", position: "relative" }}>
                  {/* Match score circle in card top-right (same component as cellar) */}
                  {hasMatch && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      zIndex: activeMatchTooltip === `${entry.id}-match` ? 120 : 2,
                    }}>
                      <MatchBadge
                        match={entry.match_score_json}
                        stale={entry.match_score_palate_version !== palateVersion}
                        hostId={entry.id}
                        activeTooltipId={activeMatchTooltip}
                        onToggleTooltip={setActiveMatchTooltip}
                      />
                    </div>
                  )}
                  {/* Card header — clickable to expand */}
                  <div
                    onClick={() => canExpand && toggleExpand(entry.id)}
                    style={{ padding: "14px 16px", paddingRight: hasMatch ? 60 : 16, cursor: canExpand ? "pointer" : "default" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{
                        fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400,
                        color: "#1A1410", lineHeight: 1.3, marginBottom: 2,
                        wordBreak: "break-word", overflowWrap: "anywhere", flex: 1,
                      }}>
                        {entry.wine_name}
                        {entry.vintage && (
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem", fontWeight: 500, color: "#5A5248", marginLeft: 6 }}>
                            {entry.vintage}
                          </span>
                        )}
                      </div>
                      {canExpand && <ChevronIcon open={isExpanded} />}
                    </div>
                    {(entry.producer || entry.region) && (
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginBottom: 8 }}>
                        {[entry.producer, entry.region].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    {/* Bottle-aware awards — shared component, wrapped to give
                        a small bottom margin against the grape/style chips below. */}
                    <div style={{ marginBottom: entry.awards_json?.awards?.length ? 8 : 0 }}>
                      <AwardsRow
                        awards={entry.awards_json}
                        hostId={entry.id}
                        activeTooltipId={activeAwardTooltip}
                        onToggleTooltip={setActiveAwardTooltip}
                        marginTop={0}
                      />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                      {entry.grapes && <span style={{ ...mono("0.55rem"), padding: "4px 10px", background: "#F7F4EF", borderRadius: 5 }}>{entry.grapes.toUpperCase()}</span>}
                      {entry.style && <span style={{ ...mono("0.55rem"), padding: "4px 10px", background: "#F7F4EF", borderRadius: 5 }}>{entry.style.toUpperCase()}</span>}
                      {entry.price_estimate && <span style={{ ...mono("0.55rem"), padding: "4px 10px", background: "rgba(140,28,46,0.06)", borderRadius: 5, color: "#8C1C2E" }}>{entry.price_estimate}</span>}
                    </div>
                    {entry.why && (
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.5, margin: "0 0 8px", fontStyle: "italic" }}>
                        "{entry.why}"
                      </p>
                    )}
                    <div style={{ ...mono("0.52rem"), color: "#7A7568" }}>
                      {sourceLabel(entry.source).toUpperCase()}
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div style={{
                    maxHeight: isExpanded ? 1200 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}>
                    <div style={{ borderTop: "1px solid #EDEAE3", padding: "14px 16px" }}>

                      {/* Tasting notes */}
                      {(entry.nose || entry.palate || entry.texture) && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ ...mono("0.56rem"), color: "#8C1C2E", marginBottom: 8, letterSpacing: "0.14em" }}>SOMMY'S TASTING NOTES</div>
                          {entry.nose && <TastingPills label="Nose" text={entry.nose} />}
                          {entry.palate && <TastingPills label="Palate" text={entry.palate} />}
                          {entry.texture && <TastingPills label="Texture" text={entry.texture} />}
                        </div>
                      )}

                      {/* Breathing */}
                      {entry.breathing && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ ...mono("0.56rem"), color: "#7A7568", marginBottom: 4 }}>BREATHING</div>
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6 }}>
                            {entry.breathing}
                          </div>
                        </div>
                      )}

                      {/* Readiness bar */}
                      {entry.drink_from && entry.drink_until && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ ...mono("0.56rem"), color: "#7A7568", marginBottom: 4 }}>DRINKING WINDOW</div>
                          <ReadinessBar entry={entry} />
                        </div>
                      )}

                      {/* Sommy notes */}
                      {entry.sommy_notes && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ ...mono("0.56rem"), color: "#7A7568", marginBottom: 4 }}>SOMMY'S NOTES</div>
                          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.65, margin: 0 }}>
                            {entry.sommy_notes}
                          </p>
                        </div>
                      )}

                      {/* Find Retailers */}
                      <RetailerSearch wineName={[entry.wine_name, entry.producer, entry.vintage].filter(Boolean).join(" ")} country={userCountry} />
                    </div>
                  </div>

                  {/* Action buttons — always visible */}
                  <div style={{ padding: "0 16px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => triedIt(entry)} style={{
                      padding: "6px 14px", border: "1.5px solid #8C1C2E", borderRadius: 8, background: "white",
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.08em",
                      color: "#8C1C2E", cursor: "pointer",
                    }}>TRIED IT</button>
                    {confirmDeleteId === entry.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248" }}>Remove?</span>
                        <button onClick={() => setConfirmDeleteId(null)} style={{
                          background: "none", border: "1px solid #EDEAE3", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                          fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "#5A5248",
                        }}>CANCEL</button>
                        <button onClick={() => deleteItem(entry.id)} style={{
                          background: "#8C1C2E", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                          fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "#F7F4EF",
                        }}>REMOVE</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(entry.id)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem",
                        letterSpacing: "0.08em", color: "#7A7568", padding: 0,
                      }}>REMOVE</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
