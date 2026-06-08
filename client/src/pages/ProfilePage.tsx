import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/useUserData";
import { useLocation } from "wouter";
import { guides } from "@/data/guides";
import { WINE_COUNTRIES, COUNTRY_SUGGESTIONS, countryCode } from "@/lib/countryFlags";
import { CURRENCIES } from "@/lib/currencies";
import { directUpdate, directSelect } from "@/lib/supabaseDirectFetch";
import LoginPrompt from "@/components/LoginPrompt";
import { isPremiumExperience, TWOW_GOLD, TWOW_GOLD_DEEP } from "@/lib/supabase";
import PalateIntakeSheet, { type ExistingPalate } from "@/components/PalateIntakeSheet";
import WinePersonaCard from "@/components/WinePersonaCard";
import MyWorldToday from "@/components/MyWorldToday";
import CellarSharingCard from "@/components/CellarSharingCard";
import FollowingList from "@/components/FollowingList";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "#4A7A52",
  intermediate: "#B8860B",
  expert: "#4A1A6E",
};

const WINE_TYPES = ["red", "white", "sparkling", "rosé", "fortified"];
const LEVELS = [
  { key: "beginner",     label: "Beginner",     desc: "Still finding my feet" },
  { key: "intermediate", label: "Intermediate", desc: "I know what I like" },
  { key: "expert",       label: "Expert",       desc: "Serious about wine" },
];

const OFFSET = "52px"; // topbar only (no sub-nav)

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [localCountry, setLocalCountry] = useState<string | null>(null);
  const [localCurrency, setLocalCurrency] = useState<string | null>(null);
  const displayCountry = localCountry ?? profile?.base_country ?? "";
  const displayCurrency = localCurrency ?? profile?.currency_code ?? "USD";
  const { stats, preferences, recentTopics, completedGuideIds, goals, countriesExplored, dataLoading, savePreferences, refresh, silentRefresh } = useUserData();
  const [, setLocation] = useLocation();

  useEffect(() => { silentRefresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [editingPrefs, setEditingPrefs]   = useState(false);
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [saving, setSaving]               = useState(false);
  const [palateOpen, setPalateOpen]       = useState(false);
  const [palateExisting, setPalateExisting] = useState<ExistingPalate | null>(null);
  const [palateLoading, setPalateLoading] = useState(true);

  // Load existing palate state so we know whether the user is starting fresh,
  // resuming a half-done form, or already complete.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rows = await directSelect<ExistingPalate>(
          "user_preferences",
          `select=preferred_types,body_preference,acidity_preference,tannin_preference,flavour_preferences,regions_of_interest,regions_to_explore,adventurousness,budget_min,budget_max,budget_currency,price_quality_posture,palate_form_step,palate_form_complete&user_id=eq.${user.id}`
        );
        setPalateExisting(Array.isArray(rows) && rows.length > 0 ? rows[0] : null);
      } catch (e) {
        // non-fatal — user just won't see resume state
        setPalateExisting(null);
      } finally {
        setPalateLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (editingPrefs) {
      setSelectedLevel(profile?.experience_level ?? "");
      setSelectedTypes(preferences.preferred_types ?? []);
    }
  }, [editingPrefs, profile, preferences]);

  if (!user) {
    return <LoginPrompt title="Your wine profile" description="Log in to track your progress, set preferences, and let Sommy personalise your experience." />;
  }

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences(selectedLevel, selectedTypes);
      setEditingPrefs(false);
      refresh();
    } catch (e) {
      console.error("Save prefs error:", e);
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl =
    profile?.avatar_url ||
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined);

  const firstName =
    profile?.display_name?.split(" ")[0] ||
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
    "You";

  // Full display name — prefer profile.display_name, fall back to user_metadata.
  // Used in the hero header now (per user feedback the firstName-only header
  // felt too informal).
  const displayName =
    profile?.display_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    firstName;

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
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Identity strip — compact anchor at the very top. Avatar + name +
            flags + notable badge. Smaller than before so the TODAY zone
            below has room to breathe. (My World redesign, May 2026.) */}
        <div style={{ marginBottom: 22 }}>
          {(() => {
            const isPremium = isPremiumExperience(profile);
            return (
              <div style={{
                fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: isPremium ? TWOW_GOLD_DEEP : "#8C1C2E",
                marginBottom: 14,
              }}>MY WORLD</div>
            );
          })()}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{
                width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
                border: isPremiumExperience(profile) ? `2px solid ${TWOW_GOLD}` : "2px solid rgba(140,28,46,0.18)",
                boxShadow: isPremiumExperience(profile) ? "0 2px 12px rgba(201,169,97,0.22)" : "0 2px 12px rgba(140,28,46,0.08)",
              }} />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#8C1C2E", color: "#F7F4EF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 400,
                boxShadow: isPremiumExperience(profile) ? "0 0 0 2px #FAF6EE, 0 0 0 4px " + TWOW_GOLD + ", 0 2px 12px rgba(201,169,97,0.22)" : "0 2px 12px rgba(140,28,46,0.18)",
              }}>
                {firstName[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 400,
                color: "#1A1410", lineHeight: 1.2, wordBreak: "break-word",
                display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap",
              }}>
                <span>{displayName}</span>
                {isPremiumExperience(profile) && (
                  <span
                    style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                      letterSpacing: "0.14em", color: TWOW_GOLD_DEEP,
                      padding: "3px 8px", borderRadius: 4,
                      border: `1px solid ${TWOW_GOLD}`,
                      background: "rgba(201,169,97,0.06)",
                      textTransform: "uppercase", whiteSpace: "nowrap",
                      lineHeight: 1,
                    }}
                    data-testid="premium-badge"
                  >
                    Premium
                  </span>
                )}
              </div>
              {/* Identity strip: country flags for regions you've explored +
                  a quiet "notable" badge if you've tried any flagship wines.
                  Replaces the old "Beginner" experience-level badge. */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {countriesExplored.slice(0, 8).map((countryName) => {
                  const cc = countryCode(countryName);
                  if (!cc) return null;
                  return (
                    <img
                      key={countryName}
                      src={`https://flagcdn.com/28x21/${cc.toLowerCase()}.png`}
                      alt={countryName} title={countryName}
                      width={20} height={15}
                      style={{ borderRadius: 2, objectFit: "cover", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
                    />
                  );
                })}
                {countriesExplored.length > 8 && (
                  <span style={{
                    fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                    letterSpacing: "0.08em", color: "#5A5248",
                  }}>+{countriesExplored.length - 8}</span>
                )}
                {stats.notable > 0 && (
                  <span title="You've experienced classified or critically-recognised bottles" style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    padding: "2px 8px", borderRadius: 10,
                    background: "rgba(212,165,106,0.16)",
                    border: "1px solid rgba(212,165,106,0.55)",
                    fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#7A5A20",
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                    {stats.notable} Notable
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TODAY zone — Sommy prompt, dismissible task cards for setup,
            and a compact cellar pulse when there's something to flag.
            Sits above the persona because action beats reflection on a
            home screen. (My World redesign, May 2026.) */}
        <MyWorldToday
          paletteComplete={!!palateExisting?.palate_form_complete}
          cellarCount={stats.cellar}
          onStartPalate={() => setPalateOpen(true)}
        />

        {/* Following list — hidden when empty so it never feels naggy.
            (Phase 1 social, May 30 2026.) */}
        <FollowingList />

        {/* Wine persona card — Sommy's read on the user's identity.
            Placed below TODAY so action takes priority over reflection. */}
        {user && (
          <WinePersonaCard
            userId={user.id}
            onStartPalate={() => setPalateOpen(true)}
          />
        )}

        {/* Cellar sharing controls — opt-in by default. Generates a public
            slug URL the user can copy/share. (Phase 1 social.) */}
        <CellarSharingCard />

        {/* Stats strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          background: "white", border: "1px solid #EDEAE3", borderRadius: 12,
          marginBottom: 24, overflow: "hidden",
        }}>
          {[
            { label: "CELLAR",      value: stats.cellar },
            { label: "WISHLIST",    value: stats.wishlist },
            { label: "EXPERIENCES", value: stats.wines },
            { label: "GUIDES",      value: stats.guides },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              padding: "14px 6px", textAlign: "center",
              borderRight: i < 3 ? "1px solid #EDEAE3" : "none",
            }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 400, color: "#8C1C2E" }}>
                {dataLoading ? "·" : value}
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.08em", color: "#5A5248", marginTop: 3 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Edit-preferences mode + Wine profile card removed in May 2026 —
            replaced by the WinePersonaCard above (which captures palate +
            archetype) and by guide-driven experience progression (which will
            replace the static "Beginner / Intermediate / Expert" badge with
            a quiz-earned level the user actually moves through). */}
        <>
            {/* Palate card — ONLY shown when the user is mid-form (started but
                not finished). The WinePersonaCard above handles both the
                "not started" CTA ("Start your palate") and the completed state
                (revisit by tapping the persona's refresh affordance).
                Avoids two competing CTAs on the same page. */}
            {!palateLoading && (() => {
              const step      = palateExisting?.palate_form_step ?? 0;
              const isDone    = !!palateExisting?.palate_form_complete;
              const isPartial = step > 0 && !isDone;
              if (!isPartial) return null;
              return (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>
                    YOUR PALATE
                  </div>
                  <div style={{
                    background: "linear-gradient(180deg, rgba(140,28,46,0.04) 0%, rgba(212,165,106,0.05) 100%)",
                    border: "1px solid rgba(140,28,46,0.18)",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.5, margin: "0 0 12px" }}>
                      You started telling Sommy about your palate. Want to keep going?
                    </p>
                    <button onClick={() => setPalateOpen(true)} style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#8C1C2E",
                    }}>{`RESUME · PAGE ${Math.min(step + 1, 5)} OF 5 →`}</button>
                  </div>
                </div>
              );
            })()}

            {/* Wine Passport */}
            {!dataLoading && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248" }}>
                    YOUR WINE PASSPORT
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#D4D1CA" }}>
                    {countriesExplored.length} of {WINE_COUNTRIES.length}
                  </div>
                </div>
                <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: "14px 12px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px 6px" }}>
                    {WINE_COUNTRIES.map(c => {
                      const explored = countriesExplored.includes(c.name);
                      return (
                        <div key={c.code} style={{ textAlign: "center" }}>
                          <div style={{
                            width: 32, height: 24, margin: "0 auto",
                            borderRadius: 3, overflow: "hidden",
                            background: explored ? "white" : "transparent",
                            filter: explored ? "none" : "grayscale(1) opacity(0.3)",
                            transition: "filter 0.3s",
                          }}>
                            <img src={`https://flagcdn.com/64x48/${c.code.toLowerCase()}.png`} alt={c.name} title={c.name}
                              width={32} height={24} style={{ display: "block", objectFit: "cover", borderRadius: 3 }} loading="lazy" />
                          </div>
                          <div style={{
                            fontFamily: "'Geist Mono', monospace", fontSize: "0.44rem",
                            letterSpacing: "0.1em", color: explored ? "#5A5248" : "#D4D1CA", marginTop: 3,
                          }}>{c.code}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 14, borderTop: "1px solid #EDEAE3", paddingTop: 12 }}>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5248" }}>
                      {countriesExplored.length} {countriesExplored.length === 1 ? "country" : "countries"} explored
                    </div>
                    {(() => {
                      const nextCountry = WINE_COUNTRIES.find(c => !countriesExplored.includes(c.name));
                      if (!nextCountry) return null;
                      const suggestion = COUNTRY_SUGGESTIONS[nextCountry.name];
                      if (!suggestion) return null;
                      return (
                        <div style={{
                          fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300,
                          color: "#8C1C2E", marginTop: 6, lineHeight: 1.4, fontStyle: "italic",
                        }}>
                          Sommy says: Try something from {nextCountry.name} — {suggestion.toLowerCase()}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Path */}
            {!dataLoading && (() => {
              const currentLevel = profile?.experience_level || "beginner";
              const levelGuides = guides.filter(g => g.level === currentLevel);
              const done = levelGuides.filter(g => completedGuideIds.includes(g.id));
              const pct = levelGuides.length > 0 ? Math.round((done.length / levelGuides.length) * 100) : 0;
              const allDone = done.length === levelGuides.length && levelGuides.length > 0;
              const ordered = [
                ...levelGuides.filter(g => completedGuideIds.includes(g.id)),
                ...levelGuides.filter(g => !completedGuideIds.includes(g.id)),
              ];
              const displayGuides = showAllGuides ? ordered : ordered.slice(0, 5);
              return (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>
                    LEARNING PATH
                  </div>
                  <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #EDEAE3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", fontWeight: 400, color: "#1A1410" }}>
                          {LEVEL_LABEL[currentLevel]} Journey
                        </div>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", color: "#D4D1CA", marginTop: 2 }}>
                          {done.length} of {levelGuides.length} guides
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: allDone ? "#4A7A52" : "#8C1C2E" }}>
                        {pct}%
                      </div>
                    </div>
                    <div style={{ height: 3, background: "#EDEAE3" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: allDone ? "#4A7A52" : "#8C1C2E", transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ padding: "6px 16px 2px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#D4D1CA" }}>
                      Pass the quiz in each guide to mark it complete
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      {displayGuides.map(g => {
                        const isDone = completedGuideIds.includes(g.id);
                        return (
                          <button key={g.id} onClick={() => setLocation(`/guides/${g.id}`)} style={{
                            display: "flex", alignItems: "center", gap: 10, width: "100%",
                            padding: "8px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                              border: `1.5px solid ${isDone ? "#4A7A52" : "#EDEAE3"}`,
                              background: isDone ? "#4A7A52" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {isDone && <span style={{ color: "white", fontSize: "0.55rem", lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{
                              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
                              color: isDone ? "#D4D1CA" : "#1A1410",
                            }}>{g.title}</span>
                          </button>
                        );
                      })}
                      {levelGuides.length > 5 && (
                        <button onClick={() => setShowAllGuides(s => !s)} style={{
                          display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none",
                          cursor: "pointer", fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                          color: "#8C1C2E", textAlign: "left", letterSpacing: "0.08em",
                        }}>
                          {showAllGuides ? "− Show fewer" : `+ ${levelGuides.length - 5} more guides`}
                        </button>
                      )}
                    </div>
                    {allDone && (
                      <div style={{ padding: "12px 16px", borderTop: "1px solid #EDEAE3", background: "rgba(74,122,82,0.04)" }}>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, color: "#4A7A52", marginBottom: 8 }}>
                          All guides complete — you're ready for the test.
                        </div>
                        <button style={{ background: "#4A7A52", border: "none", borderRadius: 8, padding: "8px 14px", color: "white", fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer" }}>
                          TAKE THE TEST (coming soon)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {dataLoading && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>LEARNING PATH</div>
                <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ height: 12, background: "#EDEAE3", borderRadius: 6, width: "60%", marginBottom: 8 }} />
                  <div style={{ height: 3, background: "#EDEAE3", borderRadius: 2 }} />
                </div>
              </div>
            )}

            {/* Active goals */}
            {goals.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>
                  ACTIVE GOALS
                </div>
                {goals.map(g => {
                  const pct = Math.min(100, Math.round((g.current_count / g.target_count) * 100));
                  return (
                    <div key={g.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
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

            {/* Recent Sommy topics */}
            {recentTopics.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>
                  RECENT WITH SOMMY
                </div>
                {recentTopics.map((topic, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: "1px solid #EDEAE3" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#8C1C2E", marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.83rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.4 }}>
                      {topic.length > 70 ? topic.slice(0, 70) + "..." : topic}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Explore CTAs */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#5A5248", marginBottom: 12 }}>
                {stats.wines === 0 && stats.regions === 0 ? "GET STARTED" : "EXPLORE MORE"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Explore the wine map", href: "/explore" },
                  { label: "Read a guide", href: "/guides" },
                  ...(stats.wines === 0
                    ? [{ label: "Log your first wine", href: "/journey/journal" }]
                    : [{ label: "My wine journal", href: "/journey/journal" }]),
                ].map(item => (
                  <button key={item.href} onClick={() => setLocation(item.href)} style={{
                    background: "white", border: "1px solid #EDEAE3", borderRadius: 10, padding: "12px 16px",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "#1A1410",
                    cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    {item.label}
                    <span style={{ color: "#8C1C2E" }}>→</span>
                  </button>
                ))}
              </div>
            </div>

        {/* Settings */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5248", marginBottom: 12 }}>SETTINGS</div>
          <div style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5248", display: "block", marginBottom: 6 }}>LOCATION</label>
              <select
                value={displayCountry}
                onChange={async (e) => {
                  if (!user) return;
                  const val = e.target.value;
                  setLocalCountry(val || null);
                  try {
                    await directUpdate("user_profiles", user.id, { base_country: val || null });
                    await refreshProfile();
                  } catch {}
                }}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #EDEAE3", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1A1410", background: "#F7F4EF", cursor: "pointer" }}
              >
                <option value="">Select your country</option>
                {CURRENCIES.map(c => <option key={c.code} value={c.country}>{c.country}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5248", display: "block", marginBottom: 6 }}>CURRENCY</label>
              <select
                value={displayCurrency}
                onChange={async (e) => {
                  if (!user) return;
                  const val = e.target.value;
                  setLocalCurrency(val);
                  try {
                    await directUpdate("user_profiles", user.id, { currency_code: val });
                    await refreshProfile();
                  } catch {}
                }}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #EDEAE3", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1A1410", background: "#F7F4EF", cursor: "pointer" }}
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} style={{
          width: "100%", padding: "11px", border: "1px solid #EDEAE3", borderRadius: 10,
          background: "white", cursor: "pointer",
          fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#5A5248",
        }}>
          Sign out
        </button>
        </>
      </div>

      {/* Palate intake bottom sheet — mounted when user opens the entry card. */}
      {palateOpen && user && (
        <PalateIntakeSheet
          userId={user.id}
          currency={displayCurrency}
          existing={palateExisting}
          onClose={() => setPalateOpen(false)}
          onComplete={async () => {
            setPalateOpen(false);
            // Reload palate state so the card flips to "already done".
            try {
              const rows = await directSelect<ExistingPalate>(
                "user_preferences",
                `select=preferred_types,body_preference,acidity_preference,tannin_preference,flavour_preferences,regions_of_interest,regions_to_explore,adventurousness,budget_min,budget_max,budget_currency,price_quality_posture,palate_form_step,palate_form_complete&user_id=eq.${user.id}`
              );
              setPalateExisting(Array.isArray(rows) && rows.length > 0 ? rows[0] : null);
            } catch {}
            // The rescore orchestrator (4a.5) will pick up the new version on next cellar load.
          }}
        />
      )}
    </div>
  );
}
