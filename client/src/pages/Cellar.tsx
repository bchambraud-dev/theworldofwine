import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  directInsert, directUpdate, directDelete, directSelect,
  getAccessToken, SUPABASE_URL, ANON_KEY,
} from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode } from "@/lib/countryFlags";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";

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

type FilterKey = "all" | "ready" | "peak" | "aging" | "consumed" | "gifted";
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

function formatPrice(n: number | null): string {
  if (n == null || n === 0) return "";
  return `$${n.toLocaleString()}`;
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
  if (phase === "aging") return "Aging";
  if (phase === "ready") return "Ready";
  if (phase === "peak") return "Peak";
  if (phase === "soon") return "Drink soon";
  if (phase === "past") return "Past peak";
  if (phase === "consumed") return "Consumed";
  if (phase === "gifted") return "Gifted";
  return "";
}

function phaseColor(phase: string): string {
  if (phase === "aging") return "#B0ADA6";
  if (phase === "ready") return "#4A7A52";
  if (phase === "peak") return "#2E6538";
  if (phase === "soon") return "#C8962E";
  if (phase === "past") return "#8C1C2E";
  return "#D4D1CA";
}

// ── Drinking Window Bar ─────────────────────────────────────────────────────────

function DrinkingWindowBar({ wine }: { wine: CellarWine }) {
  const from = wine.drink_from;
  const until = wine.drink_until;
  if (!from || !until || until <= from) return null;

  const peakStart = wine.drink_peak_start || from;
  const peakEnd = wine.drink_peak_end || until;
  const span = until - from;
  const nowPos = Math.max(0, Math.min(1, (CURRENT_YEAR - from) / span));

  // Segment percentages
  const readyPct = ((peakStart - from) / span) * 100;
  const peakPct = ((peakEnd - peakStart) / span) * 100;
  const soonPct = ((until - peakEnd) / span) * 100;

  const phase = getWinePhase(wine);

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ ...mono("0.48rem"), color: phaseColor(phase) }}>{phaseLabel(phase).toUpperCase()}</span>
        <span style={{ ...mono("0.44rem"), color: "#D4D1CA" }}>{from}–{until}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, overflow: "hidden", background: "#EDEAE3" }}>
        {/* Ready segment */}
        {readyPct > 0 && (
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${readyPct}%`, background: "#4A7A52", borderRadius: "3px 0 0 3px",
          }} />
        )}
        {/* Peak segment */}
        <div style={{
          position: "absolute", left: `${readyPct}%`, top: 0, height: "100%",
          width: `${peakPct}%`, background: "#2E6538",
        }} />
        {/* Drink soon segment */}
        {soonPct > 0 && (
          <div style={{
            position: "absolute", left: `${readyPct + peakPct}%`, top: 0, height: "100%",
            width: `${soonPct}%`, background: "#C8962E", borderRadius: "0 3px 3px 0",
          }} />
        )}
        {/* Now marker */}
        {CURRENT_YEAR >= from && CURRENT_YEAR <= until && (
          <div style={{
            position: "absolute", left: `${nowPos * 100}%`, top: -2,
            width: 2, height: 10, background: "#1A1410", borderRadius: 1,
            transform: "translateX(-1px)",
          }} />
        )}
        {/* Now marker if before range */}
        {CURRENT_YEAR < from && (
          <div style={{
            position: "absolute", left: -4, top: -2,
            width: 2, height: 10, background: "#B0ADA6", borderRadius: 1,
          }} />
        )}
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

export default function Cellar() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Data
  const [wines, setWines] = useState<CellarWine[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<CellarGoals | null>(null);
  const [healthText, setHealthText] = useState("");

  // UI state
  const [filter, setFilter] = useState<FilterKey>("all");
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

  useEffect(() => { loadCellar(); loadGoals(); }, [loadCellar, loadGoals]);

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
        setHealthText(data.assessment || "");
      }
    } catch (e) {
      console.error("Health fetch error:", e);
    } finally {
      setHealthLoading(false);
    }
  }, [goals, wines]);

  useEffect(() => {
    if (goals && wines.length > 0 && !healthText) fetchHealth();
  }, [goals, wines.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
        purchase_price: priceNum && !isNaN(priceNum) ? priceNum : null,
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
  const uniqueRegions = new Set(activeWines.map(w => w.region).filter(Boolean)).size;
  const readyCount = activeWines.filter(w => {
    const phase = getWinePhase(w);
    return phase === "ready" || phase === "peak" || phase === "soon";
  }).length;

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
    return true;
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
    padding: "5px 12px", borderRadius: 16,
    border: `1.5px solid ${active ? "#8C1C2E" : "#EDEAE3"}`,
    background: active ? "#8C1C2E" : "white",
    color: active ? "#F7F4EF" : "#5A5248",
    fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem",
    letterSpacing: "0.08em", cursor: "pointer",
    textTransform: "uppercase" as const,
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 20 }}>
            Sign in to manage your cellar.
          </p>
          <button onClick={() => setLocation("/sign-in")} style={{
            padding: "10px 24px", border: "none", borderRadius: 20,
            background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", cursor: "pointer",
          }}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...mono(), color: "#D4D1CA", marginBottom: 4 }}>YOUR COLLECTION</div>
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
            { label: "VALUE", value: totalValue > 0 ? `$${Math.round(totalValue).toLocaleString()}` : "–" },
            { label: "REGIONS", value: uniqueRegions },
            { label: "READY", value: readyCount },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              padding: "12px 6px", textAlign: "center",
              borderRight: i < 3 ? "1px solid #EDEAE3" : "none",
            }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 400, color: "#8C1C2E" }}>
                {loading ? "·" : value}
              </div>
              <div style={{ ...mono("0.5rem"), color: "#D4D1CA", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Cellar Health card ── */}
        {healthText && step === "idle" && (
          <div style={{
            background: "rgba(140,28,46,0.03)", border: "1px solid rgba(140,28,46,0.12)",
            borderRadius: 12, padding: "14px 16px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ ...mono("0.52rem"), color: "#8C1C2E" }}>SOMMY'S CELLAR ASSESSMENT</div>
              <button onClick={() => { setHealthText(""); fetchHealth(); }} style={{
                background: "none", border: "none", cursor: "pointer",
                ...mono("0.48rem"), color: "#8C1C2E",
              }}>{healthLoading ? "..." : "REFRESH"}</button>
            </div>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300,
              color: "#1A1410", lineHeight: 1.6, margin: 0,
            }}>{healthText}</p>
          </div>
        )}

        {/* ── Filter chips ── */}
        {step === "idle" && wines.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {(["all", "ready", "peak", "aging", "consumed", "gifted"] as FilterKey[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={chipStyle(filter === f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
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
        {step === "idle" && !loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(wine => {
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
                          fontFamily: "'Fraunces', serif", fontSize: "0.92rem", fontWeight: 400,
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
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#8C1C2E", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {wine.producer}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        {wine.region && (
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#5A5248", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {cc && <img src={`https://flagcdn.com/28x21/${cc.toLowerCase()}.png`} alt="" width={14} height={10} style={{ borderRadius: 1.5, objectFit: "cover" }} />}
                            {wine.region}
                          </span>
                        )}
                        {wine.purchase_price != null && wine.purchase_price > 0 && (
                          <span style={{ ...mono("0.52rem"), color: "#5A5248" }}>${wine.purchase_price}</span>
                        )}
                        {wine.market_value_estimate != null && wine.market_value_estimate > 0 && wine.market_value_estimate !== wine.purchase_price && (
                          <span style={{ ...mono("0.52rem"), color: "#8C1C2E" }}>~${wine.market_value_estimate}</span>
                        )}
                      </div>
                      {/* Drinking window bar */}
                      {wine.status === "active" && <DrinkingWindowBar wine={wine} />}
                      {/* Status for consumed/gifted */}
                      {wine.status !== "active" && (
                        <div style={{ ...mono("0.48rem"), color: phaseColor(phase), marginTop: 4 }}>
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
                        {wine.grapes && <span style={{ ...mono("0.5rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{wine.grapes.toUpperCase()}</span>}
                        {wine.style && <span style={{ ...mono("0.5rem"), padding: "3px 8px", background: "#F7F4EF", borderRadius: 6 }}>{wine.style.toUpperCase()}</span>}
                      </div>
                      {/* Purchase info */}
                      {(wine.purchase_source || wine.purchase_date) && (
                        <div style={{ ...mono("0.48rem"), color: "#D4D1CA", marginBottom: 8 }}>
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
                          fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
                          color: "#1A1410", lineHeight: 1.55, margin: "0 0 10px",
                          padding: "10px 14px", background: "rgba(140,28,46,0.03)", borderRadius: 10,
                        }}>
                          <div style={{ ...mono("0.48rem"), color: "#8C1C2E", marginBottom: 6 }}>SOMMY'S ASSESSMENT</div>
                          {wine.sommy_assessment}
                        </div>
                      )}
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
        {step === "idle" && !loading && filtered.length === 0 && wines.length > 0 && (
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
