import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useUserData, type WishlistEntry } from "@/lib/useUserData";
import { useLocation } from "wouter";
import { directInsert, directDelete, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";

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
    },
    prose: proseLines.join("\n").trim(),
  };
}

function sourceLabel(source: string | null): string {
  if (source === "sommy") return "Sommy recommended";
  if (source === "explore") return "Saved from explore";
  if (source === "manual") return "Added manually";
  return "Added manually";
}

// ── Icons ──

function BookmarkIcon({ size = 16, filled = false, color = "#8C1C2E" }: { size?: number; filled?: boolean; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const OFFSET = "52px"; // topbar only (no sub-nav)

const mono = (size = "0.6rem"): React.CSSProperties => ({
  fontFamily: "'Geist Mono', monospace", fontSize: size,
  letterSpacing: "0.12em", color: "#5A5248",
});

export default function Wishlist() {
  const { user } = useAuth();
  const { silentRefresh, wishlist: wishlistData } = useUserData();
  const [, setLocation] = useLocation();

  // Wishlist local state
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  useEffect(() => { setWishlist(wishlistData); }, [wishlistData]);

  // Manual add form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [saving, setSaving] = useState(false);

  // Scan state
  const [scanning, setScanning] = useState(false);

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
      silentRefresh();
    } catch (e) {
      console.error("Wishlist delete error:", e);
    }
  };

  // "Tried it" → go to journal log
  const triedIt = (entry: WishlistEntry) => {
    setLocation(`/journey/journal?log=1&name=${encodeURIComponent(entry.wine_name)}&region=${encodeURIComponent(entry.region || "")}`);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #EDEAE3", borderRadius: 10,
    background: "white", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
    outline: "none", boxSizing: "border-box",
  };

  if (!user) {
    return (
      <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 20 }}>
            Sign in to see your wishlist.
          </p>
          <button onClick={() => setLocation("/sign-in")}
            style={{ padding: "10px 24px", border: "none", borderRadius: 20, background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...mono(), color: "#D4D1CA", marginBottom: 4 }}>WINES TO TRY</div>
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

        {/* Wishlist cards */}
        {wishlist.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wishlist.map(entry => (
              <div key={entry.id} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.95rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.3, marginBottom: 2 }}>
                  {entry.wine_name}
                </div>
                {(entry.producer || entry.region) && (
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginBottom: 8 }}>
                    {[entry.producer, entry.region].filter(Boolean).join(" · ")}
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {entry.grapes && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "#F7F4EF", borderRadius: 5 }}>{entry.grapes.toUpperCase()}</span>}
                  {entry.style && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "#F7F4EF", borderRadius: 5 }}>{entry.style.toUpperCase()}</span>}
                  {entry.price_estimate && <span style={{ ...mono("0.5rem"), padding: "2px 7px", background: "rgba(140,28,46,0.06)", borderRadius: 5, color: "#8C1C2E" }}>{entry.price_estimate}</span>}
                </div>
                {entry.why && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.5, margin: "0 0 8px", fontStyle: "italic" }}>
                    "{entry.why}"
                  </p>
                )}
                <div style={{ ...mono("0.48rem"), color: "#D4D1CA", marginBottom: 10 }}>
                  {sourceLabel(entry.source).toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                      letterSpacing: "0.08em", color: "#D4D1CA", padding: 0,
                    }}>REMOVE</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
