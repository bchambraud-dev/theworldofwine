import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

interface Wine {
  id: string;
  wine_name: string;
  region: string | null;
  personal_rating: number | null;
  date_tasted: string | null;
  created_at: string;
}

const OFFSET = "calc(52px + 36px)"; // topbar + filterbar

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          style={{
            background: "none", border: "none", cursor: onChange ? "pointer" : "default",
            padding: 0, fontSize: "1.1rem",
            color: n <= value ? "#8C1C2E" : "#EDEAE3",
          }}
        >
          ●
        </button>
      ))}
    </div>
  );
}

function formatDate(str: string | null): string {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Journal() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wine_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("date_tasted", { ascending: false, nullsFirst: false });
    setWines(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const save = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await supabase.from("wine_journal").insert({
        user_id: user.id,
        wine_name: name.trim(),
        region: region.trim() || null,
        personal_rating: rating || null,
        date_tasted: date || null,
      });
      setName(""); setRegion(""); setRating(0);
      setDate(new Date().toISOString().split("T")[0]);
      setAdding(false);
      await load();
    } catch (e) {
      console.error("Save wine error:", e);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    await supabase.from("wine_journal").delete().eq("id", id);
    setWines(prev => prev.filter(w => w.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid #EDEAE3", borderRadius: 10,
    background: "white", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      paddingTop: OFFSET,
      overflowY: "auto",
      background: "#F7F4EF",
      zIndex: 5,
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#D4D1CA", marginBottom: 4 }}>
              YOUR COLLECTION
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1A1410", margin: 0 }}>
              Wine Journal
            </h1>
          </div>
          {!adding && user && (
            <button
              onClick={() => setAdding(true)}
              style={{
                padding: "9px 18px", border: "none", borderRadius: 20,
                background: "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              + Log a wine
            </button>
          )}
        </div>

        {/* Sign-in prompt */}
        {!user && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 20 }}>
              Sign in to start logging wines.
            </p>
            <button
              onClick={() => setLocation("/sign-in")}
              style={{ padding: "10px 24px", border: "none", borderRadius: 20, background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Sign in
            </button>
          </div>
        )}

        {/* Add wine form */}
        {adding && (
          <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 16 }}>
              LOG A WINE
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input
                placeholder="Wine name *"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Region or producer (optional)"
                value={region}
                onChange={e => setRegion(e.target.value)}
                style={inputStyle}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>

              <div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginBottom: 8 }}>
                  Your rating
                </div>
                <Stars value={rating} onChange={setRating} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setAdding(false); setName(""); setRegion(""); setRating(0); }}
                style={{ flex: 1, padding: "10px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !name.trim()}
                style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, background: saving || !name.trim() ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, cursor: saving || !name.trim() ? "default" : "pointer" }}
              >
                {saving ? "Saving..." : "Log wine"}
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && user && (
          <div style={{ textAlign: "center", padding: 40, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#D4D1CA" }}>
            Loading...
          </div>
        )}

        {/* Empty state */}
        {!loading && user && wines.length === 0 && !adding && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16, opacity: 0.3 }}>🍷</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
              Your cellar is empty
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6 }}>
              Start logging wines you've tasted — track what you loved, where it was from, and how you'd rate it.
            </p>
          </div>
        )}

        {/* Wine list */}
        {!loading && wines.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wines.map(wine => (
              <div
                key={wine.id}
                style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400, color: "#1A1410", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {wine.wine_name}
                  </div>
                  {wine.region && (
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248", marginBottom: 6 }}>
                      {wine.region}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {wine.personal_rating !== null && (
                      <Stars value={wine.personal_rating} />
                    )}
                    {wine.date_tasted && (
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", color: "#D4D1CA", letterSpacing: "0.05em" }}>
                        {formatDate(wine.date_tasted)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => del(wine.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#D4D1CA", fontSize: "1rem", padding: "2px 4px", flexShrink: 0 }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
