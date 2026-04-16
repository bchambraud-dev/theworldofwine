import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";

// ─── Admin-only fetch using service_role key (bypasses RLS) ──────────────────
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc3NjEzMSwiZXhwIjoyMDg3MzUyMTMxfQ.JEXkuSX8vPCTMf8v5w1Wm5t-vIGMgYRLvPSQBgp5Vlk";

async function adminFetch<T = any>(
  table: string,
  queryParams: string,
  timeoutMs = 15000,
): Promise<T[]> {
  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
      method: "GET",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs),
    ),
  ]);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Query failed (${res.status})`);
  }
  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  display_name: string | null;
  created_at: string;
  experience_level: string | null;
}
interface WineEntry {
  id: string;
  user_id: string;
  wine_name: string | null;
  region: string | null;
  created_at: string;
  tasting_data: any;
}
interface WishlistEntry { id: string; user_id: string; created_at: string }
interface SommyMsg { id: string; user_id: string; role: string; created_at: string }
interface ActivityEntry { user_id: string; activity_type: string; item_id: string | null; created_at: string }

interface DashData {
  users: UserProfile[];
  wines: WineEntry[];
  wishlist: WishlistEntry[];
  sommyMsgs: SommyMsg[];
  activity: ActivityEntry[];
  guideReads: ActivityEntry[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return d >= weekAgo;
}

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function hasTastingData(w: WineEntry): boolean {
  if (!w.tasting_data || w.tasting_data === "{}" || w.tasting_data === "null") return false;
  if (typeof w.tasting_data === "string") {
    try {
      const p = JSON.parse(w.tasting_data);
      return p && Object.keys(p).length > 0;
    } catch { return false; }
  }
  if (typeof w.tasting_data === "object") return Object.keys(w.tasting_data).length > 0;
  return false;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  bg: "#1A1410",
  card: "#1E1915",
  cardBorder: "#2A231D",
  cream: "#F7F4EF",
  creamMuted: "#B8B0A4",
  creamFaint: "#7A7268",
  wine: "#8C1C2E",
  wineLight: "#A8364A",
  wineGlow: "rgba(140, 28, 46, 0.15)",
  gold: "#C9A84C",
  green: "#4CAF7D",
  greenBg: "rgba(76, 175, 125, 0.12)",
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Jost', -apple-system, sans-serif",
  fontMono: "'Geist Mono', 'SF Mono', monospace",
  radius: 10,
  radiusSm: 6,
} as const;

// ─── Access Gate ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "bchambraud@gmail.com";

function AccessDenied() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const t = setTimeout(() => setLocation("/explore"), 2000);
    return () => clearTimeout(t);
  }, [setLocation]);
  return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: S.fontDisplay, fontSize: "1.4rem", color: S.cream, marginBottom: 8 }}>Access Denied</div>
        <p style={{ fontFamily: S.fontBody, fontSize: "0.85rem", color: S.creamFaint }}>Redirecting to explore...</p>
      </div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, icon }: { label: string; value: number; delta?: number; icon: React.ReactNode }) {
  return (
    <div style={{
      background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius,
      padding: "20px 22px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 12, background: S.wineGlow,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const,
        color: S.creamFaint, marginBottom: 10, fontFamily: S.fontBody,
      }}>{label}</div>
      <div style={{
        fontFamily: S.fontMono, fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em",
        color: S.cream, lineHeight: 1.1, fontVariantNumeric: "tabular-nums lining-nums",
      }}>{value.toLocaleString()}</div>
      {delta !== undefined && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8,
          fontFamily: S.fontMono, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
          color: delta > 0 ? S.green : S.creamFaint,
          background: delta > 0 ? S.greenBg : "rgba(122, 114, 104, 0.12)",
        }}>
          +{delta} this week
        </span>
      )}
    </div>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const iconColor = S.wineLight;
const IconUsers = <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="5" r="3"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/></svg>;
const IconWine = <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"><path d="M8 2C8 2 9.5 6 12 7.5L8 14L4 7.5C6.5 6 8 2 8 2z"/></svg>;
const IconSommy = <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10v7a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"/><path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/><path d="M6 7h4"/></svg>;
const IconStar = <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"><path d="M8 3l1.5 3.5L13 7l-2.5 2.5L11 13l-3-1.8L5 13l.5-3.5L3 7l3.5-.5z"/></svg>;

// ─── Activity Timeline (CSS bars, no chart library) ─────────────────────────
function ActivityTimeline({ users, wines, sommyMsgs }: { users: UserProfile[]; wines: WineEntry[]; sommyMsgs: SommyMsg[] }) {
  const days: string[] = [];
  const labels: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }

  const bucket = (items: { created_at: string }[]) => {
    const m: Record<string, number> = {};
    items.forEach(it => { const k = it.created_at?.slice(0, 10); if (k) m[k] = (m[k] || 0) + 1; });
    return m;
  };

  const signups = bucket(users);
  const wineLogs = bucket(wines);
  const sommyAct = bucket(sommyMsgs);

  const maxVal = Math.max(1, ...days.map(d => (signups[d] || 0) + (wineLogs[d] || 0) + (sommyAct[d] || 0)));

  // Show labels for every ~5th bar
  const labelEvery = Math.max(1, Math.floor(days.length / 6));

  return (
    <div style={{ background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: 24 }}>
      <div style={{ fontFamily: S.fontDisplay, fontSize: 16, fontWeight: 600, color: S.cream, marginBottom: 20 }}>
        Activity (Last 30 Days)
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[{ label: "Sign-ups", color: S.wine }, { label: "Wine Logs", color: S.gold }, { label: "Sommy Messages", color: "rgba(184,176,164,0.35)" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            <span style={{ fontFamily: S.fontBody, fontSize: 11, color: S.creamFaint }}>{l.label}</span>
          </div>
        ))}
      </div>
      {/* Bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 200 }}>
        {days.map((d, i) => {
          const s = signups[d] || 0;
          const w = wineLogs[d] || 0;
          const m = sommyAct[d] || 0;
          const total = s + w + m;
          const pct = (total / maxVal) * 100;
          return (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} title={`${labels[i]}: ${s} signups, ${w} wines, ${m} messages`}>
                {m > 0 && <div style={{ width: "100%", height: `${(m / maxVal) * 100}%`, background: "rgba(184,176,164,0.35)", borderRadius: "2px 2px 0 0", minHeight: m > 0 ? 2 : 0 }} />}
                {w > 0 && <div style={{ width: "100%", height: `${(w / maxVal) * 100}%`, background: S.gold, minHeight: w > 0 ? 2 : 0 }} />}
                {s > 0 && <div style={{ width: "100%", height: `${(s / maxVal) * 100}%`, background: S.wine, borderRadius: "0 0 2px 2px", minHeight: s > 0 ? 2 : 0 }} />}
              </div>
              {i % labelEvery === 0 && (
                <div style={{ fontSize: 9, color: S.creamFaint, marginTop: 4, whiteSpace: "nowrap", fontFamily: S.fontBody }}>
                  {labels[i]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Top Regions (horizontal bars) ──────────────────────────────────────────
function TopRegions({ wines }: { wines: WineEntry[] }) {
  const regionCounts: Record<string, number> = {};
  wines.forEach(w => { const r = w.region || "Unknown"; regionCounts[r] = (regionCounts[r] || 0) + 1; });
  const sorted = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxVal = sorted[0]?.[1] || 1;
  const colors = ["#8C1C2E", "#A8364A", "#C9A84C", "#8B6D3E", "#6B8C5A", "#5A7C8C", "#9C7B6C", "#7A5C6C", "#6C5C4C", "#5C4C3C"];

  return (
    <div style={{ background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: 24 }}>
      <div style={{ fontFamily: S.fontDisplay, fontSize: 16, fontWeight: 600, color: S.cream, marginBottom: 20 }}>
        Top Regions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(([region, count], i) => (
          <div key={region} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ flex: "0 0 120px", fontSize: 12, color: S.creamMuted, fontFamily: S.fontBody, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {region}
            </span>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(count / maxVal) * 100}%`, background: colors[i] || S.wine, borderRadius: 4 }} />
            </div>
            <span style={{ flex: "0 0 36px", fontFamily: S.fontMono, fontSize: 12, fontWeight: 600, color: S.cream, fontVariantNumeric: "tabular-nums" }}>
              {count}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: S.creamFaint, fontSize: 13 }}>No wine logs yet</div>
        )}
      </div>
    </div>
  );
}

// ─── User Table ──────────────────────────────────────────────────────────────
function UserTable({ data }: { data: DashData }) {
  const { users, wines, wishlist, sommyMsgs, guideReads } = data;

  const winesByUser: Record<string, number> = {};
  wines.forEach(w => { winesByUser[w.user_id] = (winesByUser[w.user_id] || 0) + 1; });

  const wishlistByUser: Record<string, number> = {};
  wishlist.forEach(w => { wishlistByUser[w.user_id] = (wishlistByUser[w.user_id] || 0) + 1; });

  const sommyByUser: Record<string, number> = {};
  sommyMsgs.forEach(m => { sommyByUser[m.user_id] = (sommyByUser[m.user_id] || 0) + 1; });

  const guidesByUser: Record<string, Set<string>> = {};
  guideReads.forEach(g => {
    if (!guidesByUser[g.user_id]) guidesByUser[g.user_id] = new Set();
    if (g.item_id) guidesByUser[g.user_id].add(g.item_id);
  });

  const tastingsByUser: Record<string, number> = {};
  wines.forEach(w => {
    if (hasTastingData(w)) tastingsByUser[w.user_id] = (tastingsByUser[w.user_id] || 0) + 1;
  });

  const sorted = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const thStyle: React.CSSProperties = {
    fontFamily: S.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
    textTransform: "uppercase", color: S.creamFaint, textAlign: "left", padding: "10px 14px",
    borderBottom: `1px solid ${S.cardBorder}`, whiteSpace: "nowrap", background: S.card,
  };
  const tdStyle: React.CSSProperties = {
    padding: "12px 14px", borderBottom: "1px solid rgba(42, 35, 29, 0.5)",
    color: S.creamMuted, verticalAlign: "middle", whiteSpace: "nowrap", fontSize: 13,
  };
  const numStyle: React.CSSProperties = {
    ...tdStyle, fontFamily: S.fontMono, fontVariantNumeric: "tabular-nums lining-nums", fontWeight: 500,
  };

  const levelBadge = (level: string) => {
    const l = (level || "beginner").toLowerCase();
    const bg = l === "advanced" ? S.wineGlow : l === "intermediate" ? "rgba(201, 168, 76, 0.12)" : S.greenBg;
    const color = l === "advanced" ? S.wineLight : l === "intermediate" ? S.gold : "#6CC9A0";
    return (
      <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em", background: bg, color }}>
        {l.charAt(0).toUpperCase() + l.slice(1)}
      </span>
    );
  };

  return (
    <div style={{ background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: 0, overflowX: "auto", marginBottom: 36 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Joined</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Wines</th>
            <th style={thStyle}>Wishlist</th>
            <th style={thStyle}>Sommy</th>
            <th style={thStyle}>Guides</th>
            <th style={thStyle}>Tastings</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", padding: 32, color: S.creamFaint }}>No users yet</td></tr>
          )}
          {sorted.map(user => (
            <tr key={user.id} style={{ transition: "background 0.15s ease" }}>
              <td style={{ ...tdStyle, color: S.cream, fontWeight: 500 }}>{user.display_name || "Anonymous"}</td>
              <td style={tdStyle}>{relativeDate(user.created_at)}</td>
              <td style={tdStyle}>{levelBadge(user.experience_level || "beginner")}</td>
              <td style={numStyle}>{winesByUser[user.id] || 0}</td>
              <td style={numStyle}>{wishlistByUser[user.id] || 0}</td>
              <td style={numStyle}>{sommyByUser[user.id] || 0}</td>
              <td style={numStyle}>{guidesByUser[user.id]?.size || 0}</td>
              <td style={numStyle}>{tastingsByUser[user.id] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Feature Adoption ────────────────────────────────────────────────────────
function FeatureAdoption({ data }: { data: DashData }) {
  const { users, wines, wishlist, sommyMsgs, guideReads } = data;
  const total = users.length || 1;

  const usersWhoLoggedWine = new Set(wines.map(w => w.user_id));
  const usersWhoUsedTasting = new Set(wines.filter(hasTastingData).map(w => w.user_id));
  const usersWithWishlist = new Set(wishlist.map(w => w.user_id));
  const usersWithGuide = new Set(guideReads.map(g => g.user_id));
  const usersWithSommy = new Set(sommyMsgs.map(m => m.user_id));

  const features = [
    { label: "Logged a wine", pct: Math.round((usersWhoLoggedWine.size / total) * 100) },
    { label: "Used tasting mode", pct: Math.round((usersWhoUsedTasting.size / total) * 100) },
    { label: "Created a wishlist", pct: Math.round((usersWithWishlist.size / total) * 100) },
    { label: "Completed a guide", pct: Math.round((usersWithGuide.size / total) * 100) },
    { label: "Chatted with Sommy", pct: Math.round((usersWithSommy.size / total) * 100) },
  ];

  const [animated, setAnimated] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimated(true)); }, []);

  return (
    <div style={{ background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: 24, marginBottom: 36 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {features.map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ flex: "0 0 180px", fontSize: 13, color: S.creamMuted, textAlign: "right", whiteSpace: "nowrap", fontFamily: S.fontBody }}>
              {f.label}
            </span>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4, background: S.wine,
                width: animated ? `${f.pct}%` : "0%",
                transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }} />
            </div>
            <span style={{ flex: "0 0 50px", fontFamily: S.fontMono, fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: S.cream }}>
              {f.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function Skeleton({ width, height }: { width: number | string; height: number }) {
  return (
    <div style={{
      width, height, borderRadius: S.radiusSm,
      background: `linear-gradient(90deg, ${S.card} 25%, #252019 50%, ${S.card} 75%)`,
      backgroundSize: "200% 100%",
      animation: "admin-shimmer 1.5s infinite",
    }} />
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [users, wines, wishlist, sommyMsgs, activity, guideReads] = await Promise.all([
        adminFetch<UserProfile>("user_profiles", "select=id,display_name,created_at,experience_level"),
        adminFetch<WineEntry>("wine_journal", "select=id,user_id,wine_name,region,created_at,tasting_data"),
        adminFetch<WishlistEntry>("wine_wishlist", "select=id,user_id,created_at"),
        adminFetch<SommyMsg>("sommy_conversations", "select=id,user_id,role,created_at&role=eq.user"),
        adminFetch<ActivityEntry>("user_activity", "select=user_id,activity_type,item_id,created_at"),
        adminFetch<ActivityEntry>("user_activity", "select=user_id,item_id,created_at&activity_type=eq.guide_read"),
      ]);
      if (!mountedRef.current) return;
      setData({ users, wines, wishlist, sommyMsgs, activity, guideReads });
      setLastRefresh(new Date().toLocaleString());
    } catch (e: any) {
      if (!mountedRef.current) return;
      setError(e.message || "Failed to load data");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.email === ADMIN_EMAIL) loadData();
  }, [authLoading, user, loadData]);

  // ─── Access control ──
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: S.fontBody, fontSize: 14, color: S.creamFaint }}>Loading...</div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) return <AccessDenied />;

  // ─── Dashboard ──
  const usersThisWeek = data ? data.users.filter(u => isThisWeek(u.created_at)).length : 0;
  const winesThisWeek = data ? data.wines.filter(w => isThisWeek(w.created_at)).length : 0;
  const sommyThisWeek = data ? data.sommyMsgs.filter(m => isThisWeek(m.created_at)).length : 0;
  const wishlistThisWeek = data ? data.wishlist.filter(w => isThisWeek(w.created_at)).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.cream, fontFamily: S.fontBody, overflowY: "auto" }}>
      {/* Shimmer keyframes */}
      <style>{`@keyframes admin-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px 48px" }}>
        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
              <rect width={36} height={36} rx={8} fill={S.wine} />
              <path d="M12 10C12 10 13.5 18 18 20C22.5 18 24 10 24 10" stroke={S.cream} strokeWidth={2} strokeLinecap="round" />
              <line x1={18} y1={20} x2={18} y2={27} stroke={S.cream} strokeWidth={2} strokeLinecap="round" />
              <line x1={14} y1={27} x2={22} y2={27} stroke={S.cream} strokeWidth={2} strokeLinecap="round" />
              <circle cx={18} cy={14} r={1.5} fill={S.cream} opacity={0.4} />
            </svg>
            <div>
              <h1 style={{ fontFamily: S.fontDisplay, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: S.cream, margin: 0 }}>
                The World of Wine
              </h1>
              <p style={{ fontSize: 13, color: S.creamFaint, margin: "1px 0 0" }}>Admin Dashboard</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: error ? S.wineLight : refreshing ? S.gold : S.green,
              }} />
              <span style={{ fontSize: 12, color: S.creamFaint, fontVariantNumeric: "tabular-nums" }}>
                {error ? "Error" : refreshing ? "Fetching..." : "Live"}
              </span>
            </div>
            <button
              onClick={loadData}
              disabled={refreshing}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px",
                border: `1px solid ${S.cardBorder}`, borderRadius: S.radiusSm, background: S.card,
                color: S.creamMuted, fontFamily: S.fontBody, fontSize: 13, fontWeight: 500,
                cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={refreshing ? { animation: "admin-spin 0.8s linear infinite" } : {}}>
                <path d="M2.5 8a5.5 5.5 0 019.3-3.95M13.5 8a5.5 5.5 0 01-9.3 3.95" />
                <path d="M12 1.5V4.5H9M4 14.5V11.5H7" />
              </svg>
              Refresh
            </button>
          </div>
        </header>
        <style>{`@keyframes admin-spin { to { transform: rotate(360deg); } }`}</style>

        {/* Error banner */}
        {error && (
          <div style={{
            background: "rgba(140, 28, 46, 0.1)", border: "1px solid rgba(140, 28, 46, 0.3)",
            color: S.wineLight, borderRadius: S.radiusSm, padding: "12px 16px", fontSize: 13, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><line x1="8" y1="5" x2="8" y2="8.5" /><circle cx="8" cy="11" r="0.5" fill="currentColor" /></svg>
            {error}
          </div>
        )}

        {/* KPIs */}
        <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: S.creamFaint, marginBottom: 14 }}>
          Key Metrics
        </div>
        {loading || !data ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: "20px 22px" }}>
                <Skeleton width={32} height={32} />
                <div style={{ height: 10 }} />
                <Skeleton width={80} height={36} />
                <div style={{ height: 8 }} />
                <Skeleton width={60} height={20} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
            <KpiCard label="Total Users" value={data.users.length} delta={usersThisWeek} icon={IconUsers} />
            <KpiCard label="Wines Logged" value={data.wines.length} delta={winesThisWeek} icon={IconWine} />
            <KpiCard label="Sommy Conversations" value={data.sommyMsgs.length} delta={sommyThisWeek} icon={IconSommy} />
            <KpiCard label="Wishlist Items" value={data.wishlist.length} delta={wishlistThisWeek} icon={IconStar} />
          </div>
        )}

        {/* Charts */}
        {data && (
          <>
            <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: S.creamFaint, marginBottom: 14 }}>
              Activity & Regions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 36 }}>
              <ActivityTimeline users={data.users} wines={data.wines} sommyMsgs={data.sommyMsgs} />
              <TopRegions wines={data.wines} />
            </div>
          </>
        )}

        {/* User Table */}
        {data && (
          <>
            <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: S.creamFaint, marginBottom: 14 }}>
              Users
            </div>
            <UserTable data={data} />
          </>
        )}

        {/* Feature Adoption */}
        {data && (
          <>
            <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: S.creamFaint, marginBottom: 14 }}>
              Feature Adoption
            </div>
            <FeatureAdoption data={data} />
          </>
        )}

        {/* Footer */}
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24, borderTop: `1px solid ${S.cardBorder}`, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, color: S.creamFaint, fontVariantNumeric: "tabular-nums" }}>
            {lastRefresh ? `Last refreshed: ${lastRefresh}` : "Loading..."}
          </span>
          <button
            onClick={loadData}
            disabled={refreshing}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px",
              border: `1px solid ${S.cardBorder}`, borderRadius: S.radiusSm, background: S.card,
              color: S.creamMuted, fontFamily: S.fontBody, fontSize: 13, fontWeight: 500,
              cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.6 : 1,
            }}
          >
            <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2.5 8a5.5 5.5 0 019.3-3.95M13.5 8a5.5 5.5 0 01-9.3 3.95" />
              <path d="M12 1.5V4.5H9M4 14.5V11.5H7" />
            </svg>
            Refresh
          </button>
        </footer>
      </div>
    </div>
  );
}
