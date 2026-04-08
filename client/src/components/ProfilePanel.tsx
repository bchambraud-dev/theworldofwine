import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

interface Stats {
  journalCount: number;
  goalsCompleted: number;
  regionsExplored: number;
  guidesRead: number;
}

interface Goal {
  id: string;
  title: string;
  current_count: number;
  target_count: number;
  completed: boolean;
}

interface JournalEntry {
  id: string;
  wine_name: string;
  region: string | null;
  personal_rating: number | null;
  date_tasted: string;
}

interface ActivityItem {
  id: string;
  activity_type: string;
  item_title: string | null;
  created_at: string;
}

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: Props) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Stats>({ journalCount: 0, goalsCompleted: 0, regionsExplored: 0, guidesRead: 0 });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [preferences, setPreferences] = useState<any>({});
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    setLoading(true);

    // Load preferences
    supabase.from("user_preferences").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setPreferences(data);
        setSelectedTypes(data.preferred_types || []);
      }
    });
    setSelectedLevel(profile?.experience_level || "");

    Promise.all([
      supabase.from("wine_journal").select("id", { count: "exact" }).eq("user_id", user.id),
      supabase.from("user_goals").select("id", { count: "exact" }).eq("user_id", user.id).eq("completed", true),
      supabase.from("user_activity").select("id", { count: "exact" }).eq("user_id", user.id).eq("activity_type", "region_view"),
      supabase.from("user_activity").select("id", { count: "exact" }).eq("user_id", user.id).eq("activity_type", "guide_read"),
      supabase.from("user_goals").select("*").eq("user_id", user.id).eq("completed", false).order("created_at", { ascending: false }),
      supabase.from("wine_journal").select("id, wine_name, region, personal_rating, date_tasted").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("user_activity").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
    ]).then(([j, gc, rv, gr, goalRes, journalRes, actRes]) => {
      setStats({
        journalCount: j.count || 0,
        goalsCompleted: gc.count || 0,
        regionsExplored: rv.count || 0,
        guidesRead: gr.count || 0,
      });
      setGoals((goalRes.data || []) as Goal[]);
      setJournal((journalRes.data || []) as JournalEntry[]);
      setActivity((actRes.data || []) as ActivityItem[]);
      setLoading(false);
    });
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    onClose();
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setLocation("/");
    }
  };

  const WINE_TYPES = ["red", "white", "sparkling", "rosé", "fortified"];
  const LEVELS = [
    { key: "beginner", label: "Beginner", desc: "Still finding my feet" },
    { key: "intermediate", label: "Intermediate", desc: "I know what I like" },
    { key: "expert", label: "Expert", desc: "Serious about wine" },
  ];

  const savePreferences = async () => {
    if (!user) return;
    setSavingPrefs(true);
    await supabase.from("user_profiles").update({ experience_level: selectedLevel }).eq("id", user.id);
    await supabase.from("user_preferences").upsert({ user_id: user.id, preferred_types: selectedTypes });
    await refreshProfile();
    setSavingPrefs(false);
    setEditingPrefs(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 980, backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(380px, 100vw)", height: "100vh",
        background: "#F7F4EF", zIndex: 981, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.12)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #EDEAE3", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#D4D1CA" }}>
              YOUR JOURNEY
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#5A5248", fontSize: 18, padding: 4 }}>&#x2715;</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #EDEAE3" }} />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#8C1C2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F7F4EF", fontSize: "1.2rem", fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
                {(profile?.display_name || user.email || "?")[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410" }}>
                {profile?.display_name?.split(" ")[0] ||
                  (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
                  (user?.user_metadata?.name as string | undefined)?.split(" ")[0] ||
                  "You"}
              </div>
              {profile?.experience_level && (
                <span style={{
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em",
                  color: LEVEL_COLOR[profile.experience_level] || "#5A5248",
                  background: `${LEVEL_COLOR[profile.experience_level]}15`,
                  padding: "2px 8px", borderRadius: 8, display: "inline-block", marginTop: 4,
                }}>
                  {LEVEL_LABEL[profile.experience_level]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid #EDEAE3", flexShrink: 0 }}>
          {[
            { label: "Wines", value: stats.journalCount },
            { label: "Regions", value: stats.regionsExplored },
            { label: "Guides", value: stats.guidesRead },
            { label: "Goals", value: stats.goalsCompleted },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: "14px 8px", textAlign: "center", borderRight: "1px solid #EDEAE3" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 400, color: "#8C1C2E" }}>{value}</div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#D4D1CA", marginTop: 2 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Preferences editor */}
        {editingPrefs ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 16 }}>YOUR PREFERENCES</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 400, color: "#1A1410", marginBottom: 10 }}>Experience level</div>
              {LEVELS.map(l => (
                <button key={l.key} onClick={() => setSelectedLevel(l.key)} style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 6, border: `1.5px solid ${selectedLevel === l.key ? "#8C1C2E" : "#EDEAE3"}`, borderRadius: 10, background: selectedLevel === l.key ? "rgba(140,28,46,0.05)" : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: selectedLevel === l.key ? 500 : 400, color: "#1A1410" }}>{l.label}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>{l.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 400, color: "#1A1410", marginBottom: 10 }}>What do you usually drink?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {WINE_TYPES.map(t => (
                  <button key={t} onClick={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${selectedTypes.includes(t) ? "#8C1C2E" : "#EDEAE3"}`, background: selectedTypes.includes(t) ? "#8C1C2E" : "white", color: selectedTypes.includes(t) ? "#F7F4EF" : "#1A1410", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", cursor: "pointer", textTransform: "capitalize" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditingPrefs(false)} style={{ flex: 1, padding: "11px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer" }}>Cancel</button>
              <button onClick={savePreferences} disabled={savingPrefs} style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, cursor: "pointer" }}>{savingPrefs ? "Saving..." : "Save"}</button>
            </div>
          </div>
        ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {loading ? (
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#D4D1CA", textAlign: "center", paddingTop: 40 }}>Loading your journey...</div>
          ) : (
            <>
              {/* Active goals */}
              {goals.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>ACTIVE GOALS</div>
                  {goals.map(g => {
                    const pct = Math.min(100, Math.round((g.current_count / g.target_count) * 100));
                    return (
                      <div key={g.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#1A1410" }}>{g.title}</span>
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "#5A5248" }}>{g.current_count}/{g.target_count}</span>
                        </div>
                        <div style={{ height: 4, background: "#EDEAE3", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#4A7A52" : "#8C1C2E", borderRadius: 2, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Wine journal */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248" }}>RECENT WINES</div>
                  <button
                    onClick={() => { onClose(); setLocation("/journal"); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#8C1C2E" }}
                  >
                    + LOG WINE
                  </button>
                </div>
                {journal.length === 0 ? (
                  <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", marginBottom: 10, lineHeight: 1.5 }}>
                      Start logging wines you try and Sommy will remember what you like.
                    </p>
                    <button
                      onClick={() => { onClose(); setLocation("/journal"); }}
                      style={{ background: "#8C1C2E", color: "#F7F4EF", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                    >
                      Log your first wine
                    </button>
                  </div>
                ) : (
                  journal.map(e => (
                    <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #EDEAE3" }}>
                      <div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 400, color: "#1A1410" }}>{e.wine_name}</div>
                        {e.region && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248" }}>{e.region}</div>}
                      </div>
                      {e.personal_rating && (
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#8C1C2E" }}>{e.personal_rating}</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Recent activity */}
              {activity.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>RECENT ACTIVITY</div>
                  {activity.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #EDEAE3" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.activity_type === "guide_read" ? "#B8860B" : "#8C1C2E", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#1A1410" }}>{a.item_title || a.item_id}</div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 300, color: "#D4D1CA" }}>
                          {a.activity_type === "guide_read" ? "Read guide" : a.activity_type === "region_view" ? "Explored region" : a.activity_type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state for new users */}
              {goals.length === 0 && journal.length === 0 && activity.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 20 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>Your journey starts here</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6, marginBottom: 20 }}>
                    Explore a region, read a guide, or ask Sommy where to start.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Explore the map", href: "/explore" },
                      { label: "Start a guided journey", href: "/journeys" },
                      { label: "Read a beginner guide", href: "/guides" },
                    ].map(({ label, href }) => (
                      <button
                        key={href}
                        onClick={() => { onClose(); setLocation(href); }}
                        style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 10, padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#1A1410", cursor: "pointer", textAlign: "left" }}
                      >
                        {label} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        )}

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #EDEAE3", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {!editingPrefs && (
            <button
              onClick={() => setEditingPrefs(true)}
              style={{ width: "100%", padding: "11px", border: "1.5px solid #8C1C2E", borderRadius: 10, background: "transparent", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#8C1C2E", cursor: "pointer" }}
            >
              Edit my preferences
            </button>
          )}
          <button
            onClick={handleSignOut}
            style={{ width: "100%", padding: "11px", border: "1px solid #EDEAE3", borderRadius: 10, background: "white", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
