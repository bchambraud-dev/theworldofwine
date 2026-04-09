import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/useUserData";
import { useLocation } from "wouter";

// ProfilePanel — thin view layer.
// All data comes from useUserData context (no local queries).
// Mutations go through useUserData.savePreferences().

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "#4A7A52",
  intermediate: "#B8860B",
  expert: "#8C1C2E",
};

const WINE_TYPES = ["red", "white", "sparkling", "rosé", "fortified"];
const LEVELS = [
  { key: "beginner",     label: "Beginner",     desc: "Still finding my feet" },
  { key: "intermediate", label: "Intermediate", desc: "I know what I like" },
  { key: "expert",       label: "Expert",       desc: "Serious about wine" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: Props) {
  const { user, profile, signOut } = useAuth();
  const { stats, preferences, recentTopics, goals, dataLoading, savePreferences, refresh } = useUserData();
  const [, setLocation] = useLocation();

  // Local edit state only
  const [editingPrefs, setEditingPrefs]   = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [saving, setSaving]               = useState(false);

  // Sync edit form from profile when opening edit mode
  useEffect(() => {
    if (editingPrefs) {
      setSelectedLevel(profile?.experience_level ?? "");
      setSelectedTypes(preferences.preferred_types ?? []);
    }
  }, [editingPrefs, profile, preferences]);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    onClose();
    await signOut();
    setLocation("/");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences(selectedLevel, selectedTypes);
      setEditingPrefs(false);
      refresh(); // re-load stats/topics in background
    } catch (e) {
      console.error("Save prefs error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPrefs(false);
  };

  // Derived display values — fall back to Google OAuth metadata
  const avatarUrl =
    profile?.avatar_url ||
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined);

  const firstName =
    profile?.display_name?.split(" ")[0] ||
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
    "You";

  const wineTypesLabel = (preferences.preferred_types ?? [])
    .map(t => t.charAt(0).toUpperCase() + t.slice(1))
    .join(", ");

  const levelLabel = profile?.experience_level
    ? LEVEL_LABEL[profile.experience_level]
    : null;

  const profileSummary = [levelLabel, wineTypesLabel ? `prefers ${wineTypesLabel}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(2px)",
          zIndex: 980,
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "min(380px, 100vw)", height: "100vh",
        background: "#F7F4EF", zIndex: 981,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #EDEAE3",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 16,
          }}>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.65rem", letterSpacing: "0.15em", color: "#D4D1CA",
            }}>
              YOUR JOURNEY
            </span>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#5A5248", fontSize: 18, padding: 4 }}
            >
              &#x2715;
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl} alt=""
                style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #EDEAE3" }}
              />
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "#8C1C2E", color: "#F7F4EF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Jost', sans-serif", fontSize: "1.2rem", fontWeight: 500,
              }}>
                {firstName[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: "1.1rem",
                fontWeight: 400, color: "#1A1410",
              }}>
                {firstName}
              </div>
              {profile?.experience_level && (
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.6rem", letterSpacing: "0.1em",
                  color: LEVEL_COLOR[profile.experience_level] || "#5A5248",
                  background: `${LEVEL_COLOR[profile.experience_level]}18`,
                  padding: "2px 8px", borderRadius: 8,
                  display: "inline-block", marginTop: 4,
                }}>
                  {LEVEL_LABEL[profile.experience_level]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          borderBottom: "1px solid #EDEAE3", flexShrink: 0,
        }}>
          {[
            { label: "CHATS",   value: stats.chats },
            { label: "REGIONS", value: stats.regions },
            { label: "GUIDES",  value: stats.guides },
            { label: "WINES",   value: stats.wines },
          ].map(({ label, value }) => (
            <div key={label} style={{
              padding: "14px 8px", textAlign: "center",
              borderRight: "1px solid #EDEAE3",
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.4rem", fontWeight: 400, color: "#8C1C2E",
              }}>
                {dataLoading ? "·" : value}
              </div>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.58rem", letterSpacing: "0.1em", color: "#D4D1CA", marginTop: 2,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Scrollable content ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {editingPrefs ? (
            /* ── Edit preferences ── */
            <div style={{ padding: "20px" }}>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 16,
              }}>
                EDIT PREFERENCES
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.78rem", fontWeight: 400, color: "#1A1410", marginBottom: 10,
                }}>
                  Experience level
                </div>
                {LEVELS.map(l => (
                  <button
                    key={l.key}
                    onClick={() => setSelectedLevel(l.key)}
                    style={{
                      display: "block", width: "100%", padding: "10px 14px", marginBottom: 6,
                      border: `1.5px solid ${selectedLevel === l.key ? "#8C1C2E" : "#EDEAE3"}`,
                      borderRadius: 10,
                      background: selectedLevel === l.key ? "rgba(140,28,46,0.05)" : "white",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <div style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: selectedLevel === l.key ? 500 : 400,
                      color: "#1A1410",
                    }}>
                      {l.label}
                    </div>
                    <div style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginTop: 2,
                    }}>
                      {l.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.78rem", fontWeight: 400, color: "#1A1410", marginBottom: 10,
                }}>
                  What do you usually drink?
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {WINE_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() =>
                        setSelectedTypes(prev =>
                          prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                        )
                      }
                      style={{
                        padding: "6px 14px", borderRadius: 20,
                        border: `1.5px solid ${selectedTypes.includes(t) ? "#8C1C2E" : "#EDEAE3"}`,
                        background: selectedTypes.includes(t) ? "#8C1C2E" : "white",
                        color: selectedTypes.includes(t) ? "#F7F4EF" : "#1A1410",
                        fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
                        cursor: "pointer", textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1, padding: "11px",
                    border: "1px solid #EDEAE3", borderRadius: 10,
                    background: "white", cursor: "pointer",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
                    fontWeight: 300, color: "#5A5248",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1, padding: "11px", border: "none", borderRadius: 10,
                    background: saving ? "#D4D1CA" : "#8C1C2E",
                    color: "#F7F4EF", cursor: saving ? "default" : "pointer",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400,
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

          ) : (
            /* ── Main view ── */
            <div style={{ padding: "20px" }}>

              {/* Wine profile card */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12,
                }}>
                  WINE PROFILE
                </div>
                <div style={{
                  background: "white", border: "1px solid #EDEAE3",
                  borderRadius: 12, padding: "14px 16px",
                }}>
                  <p style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.88rem", fontWeight: 300, color: "#1A1410",
                    lineHeight: 1.5, margin: "0 0 12px",
                  }}>
                    {profileSummary || "Tell Sommy about your taste and I'll remember it for you."}
                  </p>
                  <button
                    onClick={() => setEditingPrefs(true)}
                    style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "0.6rem", letterSpacing: "0.1em", color: "#8C1C2E",
                    }}
                  >
                    EDIT PREFERENCES →
                  </button>
                </div>
              </div>

              {/* Active goals */}
              {goals.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12,
                  }}>
                    ACTIVE GOALS
                  </div>
                  {goals.map(g => {
                    const pct = Math.min(100, Math.round((g.current_count / g.target_count) * 100));
                    return (
                      <div key={g.id} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{
                            fontFamily: "'Jost', sans-serif",
                            fontSize: "0.85rem", fontWeight: 400, color: "#1A1410",
                          }}>
                            {g.title}
                          </span>
                          <span style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "0.7rem", color: "#5A5248",
                          }}>
                            {g.current_count}/{g.target_count}
                          </span>
                        </div>
                        <div style={{ height: 4, background: "#EDEAE3", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${pct}%`,
                            background: pct === 100 ? "#4A7A52" : "#8C1C2E",
                            borderRadius: 2, transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent Sommy topics */}
              {recentTopics.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12,
                  }}>
                    RECENT WITH SOMMY
                  </div>
                  {recentTopics.map((topic, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      padding: "8px 0", borderBottom: "1px solid #EDEAE3",
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: "#8C1C2E", marginTop: 6, flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.83rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.4,
                      }}>
                        {topic.length > 70 ? topic.slice(0, 70) + "…" : topic}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Explore CTAs */}
              <div>
                <div style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12,
                }}>
                  {stats.wines === 0 && stats.regions === 0 ? "GET STARTED" : "EXPLORE MORE"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Explore the wine map", href: "/explore" },
                    { label: "Read a guide", href: "/guides" },
                    ...(stats.wines === 0
                      ? [{ label: "Log your first wine", href: "/journal" }]
                      : [{ label: "My wine journal", href: "/journal" }]),
                  ].map(item => (
                    <button
                      key={item.href}
                      onClick={() => { onClose(); setLocation(item.href); }}
                      style={{
                        background: "white", border: "1px solid #EDEAE3",
                        borderRadius: 10, padding: "12px 16px",
                        fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
                        fontWeight: 400, color: "#1A1410",
                        cursor: "pointer", textAlign: "left",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      {item.label}
                      <span style={{ color: "#8C1C2E" }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #EDEAE3", flexShrink: 0 }}>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%", padding: "11px",
              border: "1px solid #EDEAE3", borderRadius: 10,
              background: "white", cursor: "pointer",
              fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
              fontWeight: 300, color: "#5A5248",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
