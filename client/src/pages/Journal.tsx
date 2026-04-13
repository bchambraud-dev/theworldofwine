import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useUserData, type WishlistEntry } from "@/lib/useUserData";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { directInsert, directUpdate, directDelete, getAccessToken, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode, COUNTRY_FACTS } from "@/lib/countryFlags";

// ── Types ───────────────────────────────────────────────────────────────────────

interface Wine {
  id: string;
  user_id: string;
  wine_name: string;
  producer: string | null;
  vintage: string | null;
  region: string | null;
  grapes: string | null;
  style: string | null;
  notes: string | null;
  personal_rating: number | null;
  date_tasted: string | null;
  image_url: string | null;
  price_estimate: string | null;
  sommy_description: string | null;
  achievement: string | null;
  primary_notes: string | null;
  secondary_notes: string | null;
  nose: string | null;
  texture: string | null;
  created_at: string;
}

interface ParsedCard {
  name: string;
  producer: string;
  vintage: string;
  region: string;
  grapes: string;
  style: string;
  price: string;
  primary: string;
  secondary: string;
  nose: string;
  texture: string;
}

type SortField = "date" | "rating" | "price";
type LogStep = "idle" | "choose" | "manual" | "scanning" | "review" | "achievement";
type JournalTab = "journal" | "wishlist";

// Compress phone camera images (3-5MB) down to ~150KB before upload/API call
function compressImage(dataUrl: string, maxDim = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Filter out AI placeholder text from wine card fields.
// Handles numbers (vintage can be integer from DB) and strings.
function cleanField(val: unknown): string | null {
  if (val == null) return null;
  const v = String(val).trim();
  if (!v || v === "NV" || v === "N/A" || v === "Unknown") return null;
  if (v.includes("[not") || v.includes("[Not") || v.includes("not visible") || v.includes("Not visible")) return null;
  return v;
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

function parseWineCard(text: string): { card: ParsedCard | null; prose: string } {
  const match = text.match(/WINE_CARD_START\n([\s\S]*?)\nWINE_CARD_END/);
  if (!match) return { card: null, prose: text };
  const lines = match[1].split("\n");
  const obj: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx > 0) obj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  const card: ParsedCard = {
    name: obj.name || "",
    producer: obj.producer || "",
    vintage: obj.vintage || "",
    region: obj.region || "",
    grapes: obj.grapes || "",
    style: obj.style || "",
    price: obj.price || "",
    primary: obj.primary || "",
    secondary: obj.secondary || "",
    nose: obj.nose || "",
    texture: obj.texture || "",
  };
  const prose = text.replace(/WINE_CARD_START[\s\S]*?WINE_CARD_END\n?/, "").trim();
  return { card: card.name ? card : null, prose };
}

function formatDate(str: string | null): string {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function priceToNumber(p: string | null): number {
  if (!p) return 0;
  const m = p.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

// ── Bookmark icon SVG ────────────────────────────────────────────────────────────

function BookmarkIcon({ filled = false, size = 16, color = "#8C1C2E" }: { filled?: boolean; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ── Subcomponents ───────────────────────────────────────────────────────────────

function Stars({ value, onChange, size = "1.1rem" }: { value: number; onChange?: (n: number) => void; size?: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)}
          style={{ background: "none", border: "none", cursor: onChange ? "pointer" : "default", padding: 0, fontSize: size, color: n <= value ? "#8C1C2E" : "#EDEAE3" }}>
          ●
        </button>
      ))}
    </div>
  );
}

function SortChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 14px", borderRadius: 20,
      border: `1.5px solid ${active ? "#8C1C2E" : "#EDEAE3"}`,
      background: active ? "#8C1C2E" : "white",
      color: active ? "#F7F4EF" : "#5A5248",
      fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
      letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase",
    }}>
      {label}
    </button>
  );
}

// ── Tasting characteristic pills ─────────────────────────────────────────────
// Colour-codes individual pills by flavour family (matching the ftag system
// used on producer/grape detail pages). Texture pills stay neutral grey.

const flavorColors: Record<string, { bg: string; color: string; border: string }> = {
  fruit:   { bg: "rgba(184,50,74,0.06)",  color: "rgba(160,30,55,0.85)",  border: "rgba(184,50,74,0.25)" },
  floral:  { bg: "rgba(160,80,160,0.06)", color: "rgba(140,60,140,0.85)", border: "rgba(160,80,160,0.25)" },
  earth:   { bg: "rgba(120,85,45,0.06)",  color: "rgba(100,70,30,0.85)",  border: "rgba(120,85,45,0.25)" },
  oak:     { bg: "rgba(150,110,40,0.06)", color: "rgba(130,95,25,0.85)",  border: "rgba(150,110,40,0.25)" },
  spice:   { bg: "rgba(180,100,40,0.06)", color: "rgba(150,80,20,0.85)",  border: "rgba(180,100,40,0.25)" },
  mineral: { bg: "rgba(70,100,150,0.06)", color: "rgba(50,85,140,0.85)",  border: "rgba(70,100,150,0.25)" },
  neutral: { bg: "#F7F4EF",               color: "#5A5248",               border: "transparent" },
};

const flavorKeywords: Record<string, string> = {
  // fruit
  blackcurrant: "fruit", cassis: "fruit", cherry: "fruit", raspberry: "fruit",
  plum: "fruit", strawberry: "fruit", citrus: "fruit", lemon: "fruit",
  berry: "fruit", fig: "fruit", apple: "fruit", pear: "fruit", peach: "fruit",
  blackberry: "fruit", blueberry: "fruit", apricot: "fruit", melon: "fruit",
  tropical: "fruit", grapefruit: "fruit", lime: "fruit", orange: "fruit",
  cranberry: "fruit", pomegranate: "fruit", dark: "fruit", red: "fruit",
  // earth
  earth: "earth", mushroom: "earth", truffle: "earth", soil: "earth",
  tobacco: "earth", leather: "earth", mineral: "mineral", wet: "earth",
  forest: "earth", undergrowth: "earth", slate: "mineral", chalk: "mineral",
  // oak / winemaking
  cedar: "oak", oak: "oak", vanilla: "oak", butter: "oak",
  toast: "oak", smoke: "oak", brioche: "oak", caramel: "oak",
  chocolate: "oak", coffee: "oak", mocha: "oak", charred: "oak",
  // floral
  violet: "floral", rose: "floral", floral: "floral", lavender: "floral",
  jasmine: "floral", blossom: "floral", petal: "floral", acacia: "floral",
  // spice / herbal
  pepper: "spice", spice: "spice", cinnamon: "spice", clove: "spice",
  thyme: "spice", sage: "spice", herb: "spice", anise: "spice",
  licorice: "spice", nutmeg: "spice", dried: "spice",
};

function classifyNote(note: string): string {
  const lower = note.toLowerCase();
  for (const [kw, cat] of Object.entries(flavorKeywords)) {
    if (lower.includes(kw)) return cat;
  }
  return "neutral";
}

const categoryLabelStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem",
  letterSpacing: "0.12em", color: "#D4D1CA", textTransform: "uppercase",
  flexShrink: 0, paddingTop: 2,
};

function TastingPills({ primary, secondary, nose, texture }: {
  primary?: string | null; secondary?: string | null;
  nose?: string | null; texture?: string | null;
}) {
  const cats: { label: string; items: string[]; colorize: boolean }[] = [];
  if (primary) cats.push({ label: "PRIMARY", items: primary.split(",").map(s => s.trim()).filter(Boolean), colorize: true });
  if (secondary) cats.push({ label: "SECONDARY", items: secondary.split(",").map(s => s.trim()).filter(Boolean), colorize: true });
  if (nose) cats.push({ label: "NOSE", items: nose.split(",").map(s => s.trim()).filter(Boolean), colorize: true });
  if (texture) cats.push({ label: "TEXTURE", items: texture.split(",").map(s => s.trim()).filter(Boolean), colorize: false });
  if (cats.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {cats.map(cat => (
        <div key={cat.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
          <span style={categoryLabelStyle}>{cat.label}</span>
          {cat.items.map((item, i) => {
            const c = cat.colorize ? flavorColors[classifyNote(item)] || flavorColors.neutral : flavorColors.neutral;
            return (
              <span key={i} style={{
                fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem",
                letterSpacing: "0.08em", padding: "3px 8px",
                background: c.bg, color: c.color,
                border: `1px solid ${c.border}`,
                borderRadius: 6, textTransform: "uppercase", whiteSpace: "nowrap",
              }}>{item}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Achievement engine ──────────────────────────────────────────────────────────

function computeAchievement(
  newWine: { region?: string; grapes?: string; price_estimate?: string },
  existingWines: Wine[],
): string {
  const count = existingWines.length + 1; // including this new one

  // First wine ever
  if (count === 1) {
    return "Your journal has officially started. Every great palate begins somewhere.";
  }

  // New country in your passport
  const newCountry = regionToCountry(newWine.region);
  if (newCountry) {
    const existingCountries = new Set(
      existingWines.map(w => regionToCountry(w.region)).filter(Boolean) as string[]
    );
    if (!existingCountries.has(newCountry)) {
      const fact = COUNTRY_FACTS[newCountry] || "";
      return `New country in your passport: ${newCountry}.${fact ? ` ${fact}` : ""}`;
    }
  }

  // First from this region
  const region = newWine.region?.trim();
  if (region) {
    const existingRegions = new Set(existingWines.map(w => w.region?.trim()?.toLowerCase()).filter(Boolean));
    if (!existingRegions.has(region.toLowerCase())) {
      const regionCount = existingRegions.size + 1;
      return `That's your first ${region} wine — you're now ${regionCount} region${regionCount > 1 ? "s" : ""} deep.`;
    }
  }

  // First of a grape variety
  const grapes = newWine.grapes?.trim();
  if (grapes) {
    const primary = grapes.split(",")[0].trim();
    const existingGrapes = new Set(
      existingWines
        .map(w => w.grapes?.split(",")[0]?.trim()?.toLowerCase())
        .filter(Boolean),
    );
    if (primary && !existingGrapes.has(primary.toLowerCase())) {
      return `Your first ${primary}. Notice what you liked about it — that's the beginning of knowing your palate.`;
    }
  }

  // Milestone counts
  if (count === 5) return "Five wines logged. You're starting to build real reference points.";
  if (count === 10) return "Ten wines in the journal. Your palate is developing a story.";
  if (count === 25) return "25 wines — that's a serious collection of experiences.";
  if (count === 50) return "50 wines logged. You're not a beginner anymore.";

  // Default — price context
  if (newWine.price_estimate) {
    const price = priceToNumber(newWine.price_estimate);
    const avgPrice = existingWines.reduce((s, w) => s + priceToNumber(w.price_estimate), 0) / existingWines.length;
    if (price > 0 && avgPrice > 0 && price < avgPrice * 0.6) {
      return "That's one of the most affordable wines in your journal. Let's see how it compares.";
    }
  }

  return `Wine number ${count}. Keep exploring — every bottle teaches you something.`;
}

// ── Source label ─────────────────────────────────────────────────────────────────

function sourceLabel(source: string | null): string {
  if (source === "sommy") return "Sommy recommended";
  if (source === "explore") return "Saved from explore";
  if (source === "manual") return "Added manually";
  return "Added manually";
}

// ── Main component ──────────────────────────────────────────────────────────────

const OFFSET = "calc(52px + 4px)"; // topbar only (filter bar hidden on this page)

export default function Journal() {
  const { user } = useAuth();
  const { silentRefresh, wishlist: wishlistData } = useUserData();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<JournalTab>("journal");

  // Wine list
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [saveError, setSaveError] = useState("");

  // Wishlist local state (mirrors useUserData but allows local mutations)
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  useEffect(() => { setWishlist(wishlistData); }, [wishlistData]);

  // Wishlist manual add form
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistWhy, setWishlistWhy] = useState("");
  const [wishlistSaving, setWishlistSaving] = useState(false);

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteWishlistId, setConfirmDeleteWishlistId] = useState<string | null>(null);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{
    wine_name: string;
    date_tasted: string;
    personal_rating: number;
    notes: string;
    region: string;
    grapes: string;
    style: string;
    price_estimate: string;
    producer: string;
  }>({ wine_name: "", date_tasted: "", personal_rating: 0, notes: "", region: "", grapes: "", style: "", price_estimate: "", producer: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Logging flow state machine
  const [step, setStep] = useState<LogStep>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>("image/jpeg");
  const [scanning, setScanning] = useState(false);

  // Review state (auto-populated by Sommy or manual)
  const [cardData, setCardData] = useState<ParsedCard | null>(null);
  const [sommyProse, setSommyProse] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [achievementMsg, setAchievementMsg] = useState("");

  // Manual form fallbacks
  const [manualName, setManualName] = useState("");
  const [manualRegion, setManualRegion] = useState("");

  // ── Load wines ──────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    if (!user) return;
    setLoadError(false);
    try {
      const { data, error } = await supabase
        .from("wine_journal")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Normalise types: Postgres returns decimal as string, vintage as int
      setWines((data || []).map((w: any) => ({
        ...w,
        vintage: w.vintage != null ? String(w.vintage) : null,
        personal_rating: w.personal_rating != null ? Number(w.personal_rating) : null,
      })) as Wine[]);
    } catch (e) {
      console.error("Journal load error:", e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // ── Sort ─────────────────────────────────────────────────────────────────────

  const sorted = [...wines].sort((a, b) => {
    if (sortBy === "rating") return (b.personal_rating || 0) - (a.personal_rating || 0);
    if (sortBy === "price") return priceToNumber(b.price_estimate) - priceToNumber(a.price_estimate);
    return new Date(b.date_tasted || b.created_at).getTime() - new Date(a.date_tasted || a.created_at).getTime();
  });

  // ── Image handling ──────────────────────────────────────────────────────────

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = async () => {
      const rawUrl = reader.result as string;
      // Compress before anything else — phone photos are 3-5MB, we need ~150KB
      const compressed = await compressImage(rawUrl, 800, 0.75);
      setImagePreview(compressed);
      setImageBase64(compressed.split(",")[1]);
      setImageMediaType("image/jpeg");
      setStep("scanning");
      scanWithSommy(compressed.split(",")[1], "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  // ── Sommy label recognition ─────────────────────────────────────────────────

  const scanWithSommy = async (base64: string, mediaType: string) => {
    setScanning(true);
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
        // Strip PROFILE_UPDATE if present
        const clean = data.text.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/, "").trim();
        const { card, prose } = parseWineCard(clean);
        setCardData(card);
        setSommyProse(prose);
        setStep("review");
      } else {
        // Fallback to manual
        setStep("manual");
      }
    } catch (e) {
      console.error("Scan error:", e);
      setStep("manual");
    } finally {
      setScanning(false);
    }
  };

  // ── Save wine ───────────────────────────────────────────────────────────────

  const saveWine = async () => {
    if (!user) return;
    const wineName = cardData?.name || manualName.trim();
    if (!wineName) return;

    setSaving(true);
    setSaveError("");
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Session expired. Please sign in again.");

      // Upload label image (10s timeout — save the wine even if upload is slow)
      let imgUrl: string | null = null;
      if (imageBase64) {
        try {
          const byteChars = atob(imageBase64);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
          const blob = new Blob([byteArray], { type: imageMediaType });
          const ext = imageMediaType.includes("png") ? "png" : "jpg";
          const path = `${user.id}/${Date.now()}.${ext}`;

          const uploadRes = await Promise.race([
            fetch(`${SUPABASE_URL}/storage/v1/object/wine-labels/${path}`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": ANON_KEY,
                "Content-Type": imageMediaType,
              },
              body: blob,
            }),
            new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("Upload timeout")), 10000)),
          ]);
          if (uploadRes.ok) {
            imgUrl = `${SUPABASE_URL}/storage/v1/object/public/wine-labels/${path}`;
          }
        } catch (uploadErr) {
          console.warn("Image upload failed, continuing without image:", uploadErr);
        }
      }

      // Compute achievement
      const achievement = computeAchievement(
        { region: cardData?.region || manualRegion, grapes: cardData?.grapes, price_estimate: cardData?.price },
        wines,
      );

      // Vintage is integer in the DB — convert to number or null
      const vintageStr = cleanField(cardData?.vintage);
      const vintageNum = vintageStr ? parseInt(vintageStr) : null;

      const row = {
        user_id: user.id,
        wine_name: wineName,
        producer: cleanField(cardData?.producer) || null,
        vintage: (vintageNum && !isNaN(vintageNum)) ? vintageNum : null,
        region: cleanField(cardData?.region) || manualRegion.trim() || null,
        grapes: cleanField(cardData?.grapes) || null,
        style: cleanField(cardData?.style) || null,
        personal_rating: rating || null,
        date_tasted: date || null,
        notes: notes.trim() || null,
        image_url: imgUrl,
        price_estimate: cleanField(cardData?.price) || null,
        sommy_description: sommyProse || null,
        primary_notes: cleanField(cardData?.primary) || null,
        secondary_notes: cleanField(cardData?.secondary) || null,
        nose: cleanField(cardData?.nose) || null,
        texture: cleanField(cardData?.texture) || null,
        achievement,
      };

      await directInsert("wine_journal", row);

      setAchievementMsg(achievement);
      setStep("achievement");
      await load();
      silentRefresh();
    } catch (e: any) {
      console.error("Save wine error:", e);
      setSaveError(e?.message || "Failed to save. Try signing out and back in.");
    } finally {
      setSaving(false);
    }
  };

  // ── Reset flow ──────────────────────────────────────────────────────────────

  const resetFlow = () => {
    setStep("idle");
    setImagePreview(null);
    setImageBase64(null);
    setCardData(null);
    setSommyProse("");
    setRating(0);
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
    setManualName("");
    setManualRegion("");
    setAchievementMsg("");
  };

  // ── Delete wine (with confirmation) ───────────────────────────────────────

  const del = async (id: string) => {
    try {
      await directDelete("wine_journal", id);
      setWines(prev => prev.filter(w => w.id !== id));
      setConfirmDeleteId(null);
      setExpandedId(null);
      silentRefresh();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // ── Edit wine ──────────────────────────────────────────────────────────────

  const startEdit = (wine: Wine) => {
    setEditingId(wine.id);
    setEditFields({
      wine_name: wine.wine_name,
      date_tasted: wine.date_tasted || "",
      personal_rating: wine.personal_rating || 0,
      notes: wine.notes || "",
      region: wine.region || "",
      grapes: wine.grapes || "",
      style: wine.style || "",
      price_estimate: wine.price_estimate || "",
      producer: wine.producer || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setEditSaving(true);
    try {
      const updates: Record<string, unknown> = {
        wine_name: editFields.wine_name,
        date_tasted: editFields.date_tasted || null,
        personal_rating: editFields.personal_rating || null,
        notes: editFields.notes.trim() || null,
        region: editFields.region.trim() || null,
        grapes: editFields.grapes.trim() || null,
        style: editFields.style.trim() || null,
        price_estimate: editFields.price_estimate.trim() || null,
        producer: editFields.producer.trim() || null,
      };
      await directUpdate("wine_journal", editingId, updates);
      // Update local state
      setWines(prev => prev.map(w => w.id === editingId ? { ...w, ...updates } as Wine : w));
      setEditingId(null);
      silentRefresh();
    } catch (e: any) {
      console.error("Edit error:", e);
      setSaveError(e?.message || "Failed to update.");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Wishlist: manual add ──────────────────────────────────────────────────

  const addToWishlist = async () => {
    if (!user || !wishlistName.trim()) return;
    setWishlistSaving(true);
    try {
      await directInsert("wine_wishlist", {
        user_id: user.id,
        wine_name: wishlistName.trim(),
        why: wishlistWhy.trim() || null,
        source: "manual",
      });
      setWishlistName("");
      setWishlistWhy("");
      setShowWishlistForm(false);
      silentRefresh();
      // Optimistically add to local state
      const newEntry: WishlistEntry = {
        id: crypto.randomUUID(),
        wine_name: wishlistName.trim(),
        producer: null,
        region: null,
        grapes: null,
        style: null,
        price_estimate: null,
        why: wishlistWhy.trim() || null,
        source: "manual",
        created_at: new Date().toISOString(),
      };
      setWishlist(prev => [newEntry, ...prev]);
    } catch (e: any) {
      console.error("Wishlist add error:", e);
    } finally {
      setWishlistSaving(false);
    }
  };

  // ── Wishlist: delete ──────────────────────────────────────────────────────

  const deleteWishlistItem = async (id: string) => {
    try {
      await directDelete("wine_wishlist", id);
      setWishlist(prev => prev.filter(w => w.id !== id));
      setConfirmDeleteWishlistId(null);
      silentRefresh();
    } catch (e) {
      console.error("Wishlist delete error:", e);
    }
  };

  // ── Wishlist: "Tried it" → pre-fill journal log ──────────────────────────

  const triedIt = (entry: WishlistEntry) => {
    setActiveTab("journal");
    setStep("manual");
    setManualName(entry.wine_name);
    setManualRegion(entry.region || "");
  };

  // ── Detail expand ───────────────────────────────────────────────────────────

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Styles ──────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #EDEAE3", borderRadius: 10,
    background: "white", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
    outline: "none", boxSizing: "border-box",
  };

  const mono = (size = "0.6rem"): React.CSSProperties => ({
    fontFamily: "'Geist Mono', monospace", fontSize: size,
    letterSpacing: "0.12em", color: "#5A5248",
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ ...mono(), color: "#D4D1CA", marginBottom: 4 }}>YOUR COLLECTION</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1A1410", margin: 0 }}>
              Wine Journal
            </h1>
          </div>
          {step === "idle" && user && activeTab === "journal" && (
            <button onClick={() => setStep("choose")} style={{
              padding: "9px 18px", border: "none", borderRadius: 20,
              background: "#8C1C2E", color: "#F7F4EF",
              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, cursor: "pointer",
            }}>
              + Log a wine
            </button>
          )}
        </div>

        {/* ── Tabs ── */}
        {user && step === "idle" && (
          <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1.5px solid #EDEAE3" }}>
            <button
              onClick={() => setActiveTab("journal")}
              style={{
                padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: activeTab === "journal" ? "#8C1C2E" : "#D4D1CA",
                borderBottom: activeTab === "journal" ? "2px solid #8C1C2E" : "2px solid transparent",
                marginBottom: -1.5,
              }}
            >
              Journal
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              style={{
                padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: activeTab === "wishlist" ? "#8C1C2E" : "#D4D1CA",
                borderBottom: activeTab === "wishlist" ? "2px solid #8C1C2E" : "2px solid transparent",
                marginBottom: -1.5,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <BookmarkIcon size={12} filled={activeTab === "wishlist"} color={activeTab === "wishlist" ? "#8C1C2E" : "#D4D1CA"} />
              Wishlist
              {wishlist.length > 0 && (
                <span style={{
                  background: activeTab === "wishlist" ? "#8C1C2E" : "#D4D1CA",
                  color: "#F7F4EF", borderRadius: 8, padding: "1px 6px",
                  fontSize: "0.52rem", fontWeight: 400, lineHeight: 1.4,
                }}>
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />

        {/* ── Sign-in prompt ── */}
        {!user && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 20 }}>
              Sign in to start logging wines.
            </p>
            <button onClick={() => setLocation("/sign-in")}
              style={{ padding: "10px 24px", border: "none", borderRadius: 20, background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", cursor: "pointer" }}>
              Sign in
            </button>
          </div>
        )}

        {/* ── Step: Choose method ── */}
        {step === "choose" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <button onClick={() => fileInputRef.current?.click()} style={{
                background: "white", border: "1.5px solid #EDEAE3", borderRadius: 14, padding: "22px 20px",
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(140,28,46,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                  +
                </div>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 400, color: "#1A1410" }}>
                    Snap or upload a label
                  </div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>
                    Sommy will identify and describe it
                  </div>
                </div>
              </button>
              <button onClick={() => setStep("manual")} style={{
                background: "white", border: "1.5px solid #EDEAE3", borderRadius: 14, padding: "22px 20px",
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(90,82,72,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0, fontFamily: "'Jost', sans-serif", color: "#5A5248" }}>
                  Aa
                </div>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 400, color: "#1A1410" }}>
                    Log manually
                  </div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>
                    Type the wine name and details yourself
                  </div>
                </div>
              </button>
            </div>
            <button onClick={resetFlow} style={{
              width: "100%", padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10,
              background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        )}

        {/* ── Step: Scanning ── */}
        {step === "scanning" && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            {imagePreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 20, border: "1px solid #EDEAE3" }}>
                <img src={imagePreview} alt="Wine label" style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }} />
              </div>
            )}
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#1A1410", marginBottom: 8 }}>
              Sommy is identifying this wine...
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "#D4D1CA" }}>
              Reading the label and looking it up
            </div>
          </div>
        )}

        {/* ── Step: Review (Sommy identified) ── */}
        {step === "review" && (
          <div style={{ marginBottom: 24 }}>
            {imagePreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid #EDEAE3" }}>
                <img src={imagePreview} alt="Wine label" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
              </div>
            )}

            {/* Wine card */}
            {cardData && (
              <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 400, color: "#1A1410", marginBottom: 4, lineHeight: 1.3 }}>
                  {cardData.name}
                  {cleanField(cardData.vintage) && <span style={{ fontWeight: 300 }}> {cleanField(cardData.vintage)}</span>}
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "#5A5248", marginBottom: 10 }}>
                  {[cardData.producer, cardData.region].filter(Boolean).join(" · ")}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cardData.grapes && <span style={{ ...mono("0.55rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{cardData.grapes.toUpperCase()}</span>}
                  {cardData.style && <span style={{ ...mono("0.55rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{cardData.style.toUpperCase()}</span>}
                  {cardData.price && <span style={{ ...mono("0.55rem"), padding: "3px 8px", background: "rgba(140,28,46,0.06)", borderRadius: 6, color: "#8C1C2E" }}>{cardData.price}</span>}
                </div>
              </div>
            )}

            {/* Tasting characteristics */}
            {cardData && (cardData.primary || cardData.secondary || cardData.nose || cardData.texture) && (
              <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                <TastingPills primary={cardData.primary} secondary={cardData.secondary} nose={cardData.nose} texture={cardData.texture} />
              </div>
            )}

            {/* Sommy's description */}
            {sommyProse && (
              <div style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
                color: "#1A1410", lineHeight: 1.65, marginBottom: 20,
                padding: "14px 16px", background: "rgba(140,28,46,0.03)", borderRadius: 12,
              }}>
                {sommyProse}
              </div>
            )}

            {/* Rating + notes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#1A1410", marginBottom: 10 }}>
                How did you find it?
              </div>
              <Stars value={rating} onChange={setRating} size="1.4rem" />
            </div>

            <textarea
              placeholder="Any notes? What stood out? (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }}
            />

            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={resetFlow} style={{
                flex: 1, padding: "12px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={saveWine} disabled={saving || (!cardData?.name && !manualName.trim())} style={{
                flex: 1, padding: "12px", border: "none", borderRadius: 10,
                background: saving ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
                cursor: saving ? "default" : "pointer",
              }}>
                {saving ? "Saving..." : "Save to journal"}
              </button>
            </div>
            {saveError && (
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "#8C1C2E", marginTop: 10, textAlign: "center" }}>
                {saveError}
              </p>
            )}
          </div>
        )}

        {/* ── Step: Manual entry ── */}
        {step === "manual" && (
          <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
            <div style={{ ...mono(), marginBottom: 16 }}>LOG MANUALLY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input placeholder="Wine name *" value={manualName} onChange={e => setManualName(e.target.value)} style={inputStyle} />
              <input placeholder="Region or producer" value={manualRegion} onChange={e => setManualRegion(e.target.value)} style={inputStyle} />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
              <div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginBottom: 8 }}>Your rating</div>
                <Stars value={rating} onChange={setRating} />
              </div>
              <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={resetFlow} style={{
                flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
              }}>Cancel</button>
              <button onClick={saveWine} disabled={saving || !manualName.trim()} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 10,
                background: saving || !manualName.trim() ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
                cursor: saving || !manualName.trim() ? "default" : "pointer",
              }}>{saving ? "Saving..." : "Log wine"}</button>
            </div>
          </div>
        )}

        {/* ── Step: Achievement ── */}
        {step === "achievement" && (
          <div style={{
            background: "white", border: "1px solid #EDEAE3", borderRadius: 14,
            padding: "32px 24px", marginBottom: 24, textAlign: "center",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#4A7A52", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", margin: "0 auto 16px" }}>
              &#x2713;
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginBottom: 10 }}>
              Wine saved
            </div>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
              color: "#5A5248", lineHeight: 1.6, margin: "0 0 20px",
            }}>
              {achievementMsg}
            </p>
            <button onClick={resetFlow} style={{
              padding: "10px 28px", border: "none", borderRadius: 20,
              background: "#8C1C2E", color: "#F7F4EF",
              fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, cursor: "pointer",
            }}>
              View journal
            </button>
          </div>
        )}

        {/* ═══════════════ JOURNAL TAB ═══════════════ */}
        {activeTab === "journal" && (
          <>
            {/* ── Sort chips ── */}
            {step === "idle" && !loading && wines.length > 1 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                <SortChip label="Date" active={sortBy === "date"} onClick={() => setSortBy("date")} />
                <SortChip label="Rating" active={sortBy === "rating"} onClick={() => setSortBy("rating")} />
                <SortChip label="Price" active={sortBy === "price"} onClick={() => setSortBy("price")} />
              </div>
            )}

            {/* ── Loading ── */}
            {loading && user && step === "idle" && (
              <div style={{ textAlign: "center", padding: 40, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#D4D1CA" }}>Loading...</div>
            )}

            {/* ── Load error ── */}
            {loadError && !loading && step === "idle" && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#1A1410", marginBottom: 8 }}>Couldn't load your wines</div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6, marginBottom: 16 }}>This usually means your session needs refreshing.</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => load()} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #EDEAE3", background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", cursor: "pointer", color: "#5A5248" }}>Retry</button>
                  <button onClick={() => setLocation("/sign-in")} style={{ padding: "8px 18px", borderRadius: 20, border: "none", background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>Sign in again</button>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && user && wines.length === 0 && step === "idle" && (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
                  Your cellar is empty
                </div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6 }}>
                  Snap a photo of a wine label and Sommy will identify it, tell you what to expect, and log it here — building your personal wine memory over time.
                </p>
              </div>
            )}

            {/* ── Wine list ── */}
            {step === "idle" && !loading && sorted.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sorted.map(wine => {
                  const isExpanded = expandedId === wine.id;
                  const isEditing = editingId === wine.id;
                  return (
                    <div key={wine.id} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "hidden" }}>
                      {/* Main row */}
                      <button
                        onClick={() => { setExpandedId(isExpanded ? null : wine.id); if (isEditing) cancelEdit(); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, width: "100%",
                          padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                        }}
                      >
                        {/* Thumbnail */}
                        {wine.image_url ? (
                          <img src={wine.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#EDEAE3", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...mono("0.5rem"), color: "#D4D1CA" }}>
                            No img
                          </div>
                        )}
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'Fraunces', serif", fontSize: "0.92rem", fontWeight: 400,
                            color: "#1A1410", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {wine.wine_name}
                            {cleanField(wine.vintage) && <span style={{ fontWeight: 300, fontSize: "0.85rem" }}> {cleanField(wine.vintage)}</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                            {wine.region && (
                              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                {(() => {
                                  const c = countryCode(regionToCountry(wine.region));
                                  if (!c) return null;
                                  return <img src={`https://flagcdn.com/28x21/${c.toLowerCase()}.png`} alt="" width={14} height={10} style={{ borderRadius: 1.5, objectFit: "cover", flexShrink: 0 }} />;
                                })()}
                                {wine.region}
                              </span>
                            )}
                            {wine.personal_rating !== null && <Stars value={wine.personal_rating} size="0.65rem" />}
                            {wine.date_tasted && (
                              <span style={{ ...mono("0.55rem"), color: "#D4D1CA" }}>{formatDate(wine.date_tasted)}</span>
                            )}
                          </div>
                        </div>
                        {/* Price badge */}
                        {wine.price_estimate && (
                          <span style={{ ...mono("0.55rem"), color: "#8C1C2E", flexShrink: 0 }}>
                            {wine.price_estimate}
                          </span>
                        )}
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && !isEditing && (
                        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #EDEAE3" }}>
                          {/* Tags */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 12, marginBottom: 10 }}>
                            {wine.grapes && <span style={{ ...mono("0.5rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{wine.grapes.toUpperCase()}</span>}
                            {wine.style && <span style={{ ...mono("0.5rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{wine.style.toUpperCase()}</span>}
                          </div>
                          {/* Tasting characteristics */}
                          {(wine.primary_notes || wine.secondary_notes || wine.nose || wine.texture) && (
                            <div style={{ marginBottom: 10 }}>
                              <TastingPills primary={wine.primary_notes} secondary={wine.secondary_notes} nose={wine.nose} texture={wine.texture} />
                            </div>
                          )}
                          {/* Sommy's description */}
                          {wine.sommy_description && (
                            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6, margin: "0 0 10px" }}>
                              {wine.sommy_description}
                            </p>
                          )}
                          {/* User notes */}
                          {wine.notes && (
                            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.5, margin: "0 0 10px", fontStyle: "italic" }}>
                              "{wine.notes}"
                            </p>
                          )}
                          {/* Achievement */}
                          {wine.achievement && (
                            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#4A7A52", margin: "0 0 10px" }}>
                              {wine.achievement}
                            </p>
                          )}
                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            <button onClick={() => startEdit(wine)} style={{
                              background: "none", border: "none", cursor: "pointer",
                              fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                              letterSpacing: "0.08em", color: "#8C1C2E", padding: 0,
                            }}>
                              EDIT
                            </button>
                            {confirmDeleteId === wine.id ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248" }}>Remove this wine?</span>
                                <button onClick={() => setConfirmDeleteId(null)} style={{
                                  background: "none", border: "1px solid #EDEAE3", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                                  fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.08em", color: "#5A5248",
                                }}>CANCEL</button>
                                <button onClick={() => del(wine.id)} style={{
                                  background: "#8C1C2E", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                                  fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.08em", color: "#F7F4EF",
                                }}>REMOVE</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDeleteId(wine.id)} style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                                letterSpacing: "0.08em", color: "#D4D1CA", padding: 0,
                              }}>
                                REMOVE FROM JOURNAL
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Edit mode */}
                      {isExpanded && isEditing && (
                        <div style={{ padding: "14px", borderTop: "1px solid #EDEAE3" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>WINE NAME</div>
                              <input value={editFields.wine_name} onChange={e => setEditFields(f => ({ ...f, wine_name: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>DATE TASTED</div>
                              <input type="date" value={editFields.date_tasted} onChange={e => setEditFields(f => ({ ...f, date_tasted: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>RATING</div>
                              <Stars value={editFields.personal_rating} onChange={n => setEditFields(f => ({ ...f, personal_rating: n }))} size="1.2rem" />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>NOTES</div>
                              <textarea value={editFields.notes} onChange={e => setEditFields(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>PRODUCER</div>
                              <input value={editFields.producer} onChange={e => setEditFields(f => ({ ...f, producer: e.target.value }))} style={{ ...inputStyle, color: "#5A5248" }} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>REGION</div>
                              <input value={editFields.region} onChange={e => setEditFields(f => ({ ...f, region: e.target.value }))} style={{ ...inputStyle, color: "#5A5248" }} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>GRAPES</div>
                              <input value={editFields.grapes} onChange={e => setEditFields(f => ({ ...f, grapes: e.target.value }))} style={{ ...inputStyle, color: "#5A5248" }} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>STYLE</div>
                              <input value={editFields.style} onChange={e => setEditFields(f => ({ ...f, style: e.target.value }))} style={{ ...inputStyle, color: "#5A5248" }} />
                            </div>
                            <div>
                              <div style={{ ...mono("0.5rem"), marginBottom: 4 }}>PRICE</div>
                              <input value={editFields.price_estimate} onChange={e => setEditFields(f => ({ ...f, price_estimate: e.target.value }))} style={{ ...inputStyle, color: "#5A5248" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={cancelEdit} style={{
                              flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
                            }}>Cancel</button>
                            <button onClick={saveEdit} disabled={editSaving || !editFields.wine_name.trim()} style={{
                              flex: 1, padding: "10px", border: "none", borderRadius: 10,
                              background: editSaving ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                              cursor: editSaving ? "default" : "pointer",
                            }}>{editSaving ? "Saving..." : "Save changes"}</button>
                          </div>
                          {saveError && (
                            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "#8C1C2E", marginTop: 8, textAlign: "center" }}>{saveError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════════ WISHLIST TAB ═══════════════ */}
        {activeTab === "wishlist" && step === "idle" && user && (
          <>
            {/* Add button / form */}
            {showWishlistForm ? (
              <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
                <div style={{ ...mono(), marginBottom: 12 }}>ADD TO WISHLIST</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  <input placeholder="Wine name *" value={wishlistName} onChange={e => setWishlistName(e.target.value)} style={inputStyle} />
                  <textarea placeholder="Notes — why do you want to try this? (optional)" value={wishlistWhy} onChange={e => setWishlistWhy(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setShowWishlistForm(false); setWishlistName(""); setWishlistWhy(""); }} style={{
                    flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248", cursor: "pointer",
                  }}>Cancel</button>
                  <button onClick={addToWishlist} disabled={wishlistSaving || !wishlistName.trim()} style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: 10,
                    background: wishlistSaving || !wishlistName.trim() ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                    cursor: wishlistSaving || !wishlistName.trim() ? "default" : "pointer",
                  }}>{wishlistSaving ? "Adding..." : "Add to wishlist"}</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowWishlistForm(true)} style={{
                width: "100%", padding: "12px", border: "1.5px dashed #EDEAE3", borderRadius: 12,
                background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                color: "#8C1C2E", cursor: "pointer", marginBottom: 16,
              }}>
                + Add to wishlist
              </button>
            )}

            {/* Empty state */}
            {wishlist.length === 0 && (
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

            {/* Wishlist cards */}
            {wishlist.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {wishlist.map(entry => (
                  <div key={entry.id} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: "14px 16px" }}>
                    {/* Wine name + producer */}
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.95rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.3, marginBottom: 2 }}>
                      {entry.wine_name}
                    </div>
                    {(entry.producer || entry.region) && (
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginBottom: 8 }}>
                        {[entry.producer, entry.region].filter(Boolean).join(" · ")}
                      </div>
                    )}

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                      {entry.grapes && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "#F7F4EF", borderRadius: 5 }}>{entry.grapes.toUpperCase()}</span>}
                      {entry.style && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "#F7F4EF", borderRadius: 5 }}>{entry.style.toUpperCase()}</span>}
                      {entry.price_estimate && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "rgba(140,28,46,0.06)", borderRadius: 5, color: "#8C1C2E" }}>{entry.price_estimate}</span>}
                    </div>

                    {/* Why text */}
                    {entry.why && (
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.5, margin: "0 0 8px", fontStyle: "italic" }}>
                        "{entry.why}"
                      </p>
                    )}

                    {/* Source badge */}
                    <div style={{ ...mono("0.48rem"), color: "#D4D1CA", marginBottom: 10 }}>
                      {sourceLabel(entry.source).toUpperCase()}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button onClick={() => triedIt(entry)} style={{
                        padding: "6px 14px", border: "1.5px solid #8C1C2E", borderRadius: 8, background: "white",
                        fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.08em",
                        color: "#8C1C2E", cursor: "pointer",
                      }}>
                        TRIED IT
                      </button>
                      {confirmDeleteWishlistId === entry.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248" }}>Remove?</span>
                          <button onClick={() => setConfirmDeleteWishlistId(null)} style={{
                            background: "none", border: "1px solid #EDEAE3", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                            fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "#5A5248",
                          }}>CANCEL</button>
                          <button onClick={() => deleteWishlistItem(entry.id)} style={{
                            background: "#8C1C2E", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                            fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", color: "#F7F4EF",
                          }}>REMOVE</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteWishlistId(entry.id)} style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem",
                          letterSpacing: "0.08em", color: "#D4D1CA", padding: 0,
                        }}>
                          REMOVE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
