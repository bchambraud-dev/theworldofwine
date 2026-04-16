import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { SUPABASE_URL, ANON_KEY, getAccessToken } from "@/lib/supabaseDirectFetch";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  experience_level: string | null;
}
interface WineEntry {
  id: string;
  user_id: string;
  wine_name: string | null;
  region: string | null;
  created_at: string;
  has_tasting: boolean | null;
}
interface WishlistEntry { id: string; user_id: string; created_at: string }
interface ConversationEntry { id: string; user_id: string; created_at: string }
interface ActivityEntry {
  id?: string;
  user_id: string;
  activity_type: string;
  item_id: string | null;
  created_at: string;
}

interface AdminData {
  users: UserProfile[];
  wines: WineEntry[];
  wishlist: WishlistEntry[];
  conversations: ConversationEntry[];
  activities: ActivityEntry[];
}

type Period = "7" | "30" | "90" | "all";

// ─── Palette (cream / light — matches site) ─────────────────────────────────
const C = {
  bg: "#F7F4EF",
  card: "#FFFFFF",
  cardBorder: "#EDEAE3",
  text: "#1A1410",
  muted: "#5A5248",
  accent: "#8C1C2E",
  accentLight: "rgba(140, 28, 46, 0.08)",
  green: "#4A7A52",
  greenBg: "rgba(74, 122, 82, 0.10)",
  gold: "#B8963E",
  goldBg: "rgba(184, 150, 62, 0.10)",
  purple: "#6B4C8A",
  purpleBg: "rgba(107, 76, 138, 0.10)",
  border: "#EDEAE3",
  trackBg: "rgba(0,0,0,0.04)",
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Jost', -apple-system, sans-serif",
  fontMono: "'Geist Mono', 'SF Mono', monospace",
  radius: 14,
} as const;

// ─── Access control ──────────────────────────────────────────────────────────
const ADMIN_EMAIL = "bchambraud@gmail.com";

// ─── RPC fetch ───────────────────────────────────────────────────────────────
async function fetchAdminStats(userId: string): Promise<AdminData> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: ANON_KEY,
      },
      body: JSON.stringify({ admin_uid: userId }),
    }),
    new Promise<Response>((_, rej) =>
      setTimeout(() => rej(new Error("Request timed out")), 20000),
    ),
  ]);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `RPC failed (${res.status})`);
  }

  const raw = await res.json();
  return {
    users: raw.users || [],
    wines: raw.wines || [],
    wishlist: raw.wishlist || [],
    conversations: raw.conversations || [],
    activities: raw.activities || [],
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function periodDays(p: Period): number | null {
  if (p === "7") return 7;
  if (p === "30") return 30;
  if (p === "90") return 90;
  return null;
}

function inRange(iso: string, startMs: number, endMs: number): boolean {
  const t = new Date(iso).getTime();
  return t >= startMs && t < endMs;
}

function countInRange<T extends { created_at: string }>(items: T[], startMs: number, endMs: number): number {
  return items.filter(i => inRange(i.created_at, startMs, endMs)).length;
}

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: C.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
      textTransform: "uppercase" as const, color: C.muted, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, url, size = 28 }: { name: string; url?: string | null; size?: number }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (url) {
    return (
      <img
        src={url}
        alt=""
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: C.accentLight, color: C.accent,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontFamily: C.fontBody, fontWeight: 600,
    }}>
      {initials}
    </div>
  );
}

// ─── Period Selector ─────────────────────────────────────────────────────────
function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const pills: { label: string; val: Period }[] = [
    { label: "7D", val: "7" },
    { label: "30D", val: "30" },
    { label: "90D", val: "90" },
    { label: "ALL", val: "all" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, background: C.trackBg, borderRadius: 8, padding: 3 }}>
      {pills.map(p => (
        <button
          key={p.val}
          onClick={() => onChange(p.val)}
          style={{
            padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: C.fontMono, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
            background: value === p.val ? C.card : "transparent",
            color: value === p.val ? C.text : C.muted,
            boxShadow: value === p.val ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, total, thisPeriod, prevPeriod, periodLabel }: {
  label: string; total: number; thisPeriod: number; prevPeriod: number; periodLabel: string;
}) {
  const delta = thisPeriod - prevPeriod;
  const deltaColor = delta > 0 ? C.green : delta < 0 ? C.accent : C.muted;
  const deltaPrefix = delta > 0 ? "+" : "";

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius,
      padding: "22px 24px",
    }}>
      <div style={{
        fontFamily: C.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase" as const, color: C.muted, marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: C.fontDisplay, fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em",
        color: C.text, lineHeight: 1.1,
      }}>
        {total.toLocaleString()}
      </div>
      <div style={{
        marginTop: 8, fontFamily: C.fontMono, fontSize: 11.5, fontWeight: 500, color: deltaColor,
      }}>
        {deltaPrefix}{delta} vs prev {periodLabel}
      </div>
    </div>
  );
}

// ─── Activity Chart (pure CSS bars) ──────────────────────────────────────────
function ActivityChart({ data, period }: { data: AdminData; period: Period }) {
  const numDays = periodDays(period);

  const { days, labels, maxVal } = useMemo(() => {
    const now = Date.now();
    const d: string[] = [];
    const l: string[] = [];
    const span = numDays || Math.ceil((now - Math.min(
      ...data.users.map(u => new Date(u.created_at).getTime()),
      ...data.wines.map(w => new Date(w.created_at).getTime()),
      now,
    )) / 86400000) + 1;
    const actualDays = Math.min(span, 365);

    for (let i = actualDays - 1; i >= 0; i--) {
      const dt = new Date(now - i * 86400000);
      d.push(dt.toISOString().slice(0, 10));
      l.push(dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    }

    const counts: Record<string, number> = {};
    const allItems = [
      ...data.wines.map(w => w.created_at),
      ...data.conversations.map(c => c.created_at),
      ...data.wishlist.map(w => w.created_at),
    ];
    allItems.forEach(iso => {
      const k = iso?.slice(0, 10);
      if (k) counts[k] = (counts[k] || 0) + 1;
    });

    const mv = Math.max(1, ...d.map(day => counts[day] || 0));
    return { days: d.map(day => ({ key: day, count: counts[day] || 0 })), labels: l, maxVal: mv };
  }, [data, numDays]);

  const labelEvery = Math.max(1, Math.floor(days.length / 7));

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>
        Daily Activity
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 160 }}>
        {days.map((d, i) => (
          <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
            <div
              title={`${labels[i]}: ${d.count} actions`}
              style={{
                width: "100%", maxWidth: 12,
                height: d.count > 0 ? `${Math.max(4, (d.count / maxVal) * 100)}%` : "0%",
                background: C.accent, borderRadius: 2, transition: "height 0.3s ease",
              }}
            />
            {i % labelEvery === 0 && (
              <div style={{ fontSize: 9, color: C.muted, marginTop: 6, whiteSpace: "nowrap", fontFamily: C.fontMono }}>
                {labels[i]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Top Regions ─────────────────────────────────────────────────────────────
function TopRegions({ wines }: { wines: WineEntry[] }) {
  const sorted = useMemo(() => {
    const counts: Record<string, number> = {};
    wines.forEach(w => { const r = w.region || "Unknown"; counts[r] = (counts[r] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [wines]);
  const maxVal = sorted[0]?.[1] || 1;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>
        Top Regions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(([region, count]) => (
          <div key={region} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              flex: "0 0 120px", fontSize: 12, color: C.muted, fontFamily: C.fontBody,
              textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {region}
            </span>
            <div style={{ flex: 1, height: 8, background: C.trackBg, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(count / maxVal) * 100}%`, background: C.accent, borderRadius: 4, transition: "width 0.5s ease" }} />
            </div>
            <span style={{ flex: "0 0 32px", fontFamily: C.fontMono, fontSize: 12, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>
              {count}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>No wine logs yet</div>
        )}
      </div>
    </div>
  );
}

// ─── User Table ──────────────────────────────────────────────────────────────
function UserTable({ data }: { data: AdminData }) {
  const { users, wines, wishlist, conversations, activities } = data;

  const stats = useMemo(() => {
    const winesByUser: Record<string, number> = {};
    const tastingsByUser: Record<string, number> = {};
    wines.forEach(w => {
      winesByUser[w.user_id] = (winesByUser[w.user_id] || 0) + 1;
      if (w.has_tasting) tastingsByUser[w.user_id] = (tastingsByUser[w.user_id] || 0) + 1;
    });

    const wishlistByUser: Record<string, number> = {};
    wishlist.forEach(w => { wishlistByUser[w.user_id] = (wishlistByUser[w.user_id] || 0) + 1; });

    const chatsByUser: Record<string, number> = {};
    conversations.forEach(c => { chatsByUser[c.user_id] = (chatsByUser[c.user_id] || 0) + 1; });

    const guidesByUser: Record<string, Set<string>> = {};
    activities.filter(a => a.activity_type === "guide_read").forEach(a => {
      if (!guidesByUser[a.user_id]) guidesByUser[a.user_id] = new Set();
      if (a.item_id) guidesByUser[a.user_id].add(a.item_id);
    });

    return { winesByUser, tastingsByUser, wishlistByUser, chatsByUser, guidesByUser };
  }, [wines, wishlist, conversations, activities]);

  const sorted = useMemo(() =>
    [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  [users]);

  const thStyle: React.CSSProperties = {
    fontFamily: C.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: C.muted, textAlign: "left", padding: "10px 14px",
    borderBottom: `1px solid ${C.cardBorder}`, whiteSpace: "nowrap", background: C.card,
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 14px", borderBottom: `1px solid ${C.cardBorder}`,
    color: C.muted, verticalAlign: "middle", whiteSpace: "nowrap", fontSize: 13,
  };
  const numStyle: React.CSSProperties = {
    ...tdStyle, fontFamily: C.fontMono, fontVariantNumeric: "tabular-nums", fontWeight: 500, color: C.text,
  };

  const levelBadge = (level: string | null) => {
    const l = (level || "").toLowerCase();
    let bg = "rgba(0,0,0,0.04)";
    let color = C.muted;
    let label = level || "Not set";
    if (l === "beginner") { bg = C.greenBg; color = C.green; label = "Beginner"; }
    else if (l === "intermediate") { bg = C.goldBg; color = C.gold; label = "Intermediate"; }
    else if (l === "advanced" || l === "expert") { bg = C.purpleBg; color = C.purple; label = l === "expert" ? "Expert" : "Advanced"; }
    return (
      <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 0, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Joined</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Wines</th>
            <th style={thStyle}>Wishlist</th>
            <th style={thStyle}>Chats</th>
            <th style={thStyle}>Guides</th>
            <th style={thStyle}>Tastings</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", padding: 32, color: C.muted }}>No users yet</td></tr>
          )}
          {sorted.map(user => (
            <tr key={user.id}>
              <td style={{ ...tdStyle, color: C.text, fontWeight: 500 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={user.display_name || "?"} url={user.avatar_url} size={28} />
                  {user.display_name || "Anonymous"}
                </div>
              </td>
              <td style={tdStyle}>{relativeTime(user.created_at)}</td>
              <td style={tdStyle}>{levelBadge(user.experience_level)}</td>
              <td style={numStyle}>{stats.winesByUser[user.id] || 0}</td>
              <td style={numStyle}>{stats.wishlistByUser[user.id] || 0}</td>
              <td style={numStyle}>{stats.chatsByUser[user.id] || 0}</td>
              <td style={numStyle}>{stats.guidesByUser[user.id]?.size || 0}</td>
              <td style={numStyle}>{stats.tastingsByUser[user.id] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Feature Adoption ────────────────────────────────────────────────────────
function FeatureAdoption({ data }: { data: AdminData }) {
  const total = data.users.length || 1;

  const features = useMemo(() => {
    const usersLogged = new Set(data.wines.map(w => w.user_id));
    const usersTasting = new Set(data.wines.filter(w => w.has_tasting).map(w => w.user_id));
    const usersWishlist = new Set(data.wishlist.map(w => w.user_id));
    const usersGuide = new Set(data.activities.filter(a => a.activity_type === "guide_read").map(a => a.user_id));
    const usersSommy = new Set(data.conversations.map(c => c.user_id));
    return [
      { label: "Wine logging", count: usersLogged.size },
      { label: "Tasting mode", count: usersTasting.size },
      { label: "Wishlist", count: usersWishlist.size },
      { label: "Guides", count: usersGuide.size },
      { label: "Sommy", count: usersSommy.size },
    ];
  }, [data]);

  const [animated, setAnimated] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimated(true)); }, []);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>
        Feature Adoption
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {features.map(f => {
          const pct = Math.round((f.count / total) * 100);
          return (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ flex: "0 0 130px", fontSize: 13, color: C.muted, textAlign: "right", whiteSpace: "nowrap", fontFamily: C.fontBody }}>
                {f.label}
              </span>
              <div style={{ flex: 1, height: 8, background: C.trackBg, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, background: C.accent,
                  opacity: 0.7,
                  width: animated ? `${pct}%` : "0%",
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }} />
              </div>
              <span style={{ flex: "0 0 70px", fontFamily: C.fontMono, fontSize: 12, fontWeight: 500, color: C.text }}>
                {f.count}/{total} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recent Activity Feed ────────────────────────────────────────────────────
function RecentActivity({ data }: { data: AdminData }) {
  const userMap = useMemo(() => {
    const m: Record<string, UserProfile> = {};
    data.users.forEach(u => { m[u.id] = u; });
    return m;
  }, [data.users]);

  const wineMap = useMemo(() => {
    const m: Record<string, WineEntry> = {};
    data.wines.forEach(w => { m[w.id] = w; });
    return m;
  }, [data.wines]);

  const feed = useMemo(() => {
    const items: { key: string; userId: string; text: string; time: string }[] = [];

    // Sign-ups
    data.users.forEach(u => {
      items.push({ key: `signup-${u.id}`, userId: u.id, text: "signed up", time: u.created_at });
    });

    // Wine logs
    data.wines.forEach(w => {
      const name = w.wine_name || "a wine";
      items.push({ key: `wine-${w.id}`, userId: w.user_id, text: `logged ${name}`, time: w.created_at });
    });

    // Sommy conversations
    data.conversations.forEach(c => {
      items.push({ key: `chat-${c.id}`, userId: c.user_id, text: "started a Sommy conversation", time: c.created_at });
    });

    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return items.slice(0, 20);
  }, [data]);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 16 }}>
        Recent Activity
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {feed.length === 0 && (
          <div style={{ textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>No activity yet</div>
        )}
        {feed.map(item => {
          const user = userMap[item.userId];
          const name = user?.display_name || "Someone";
          return (
            <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <Avatar name={name} url={user?.avatar_url} size={24} />
              <div style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600 }}>{name}</span>{" "}
                <span style={{ color: C.muted }}>{item.text}</span>
              </div>
              <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                {relativeTime(item.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function Skeleton({ width, height }: { width: number | string; height: number }) {
  return (
    <div style={{
      width, height, borderRadius: 8,
      background: `linear-gradient(90deg, #EDEAE3 25%, #F7F4EF 50%, #EDEAE3 75%)`,
      backgroundSize: "200% 100%",
      animation: "admin-shimmer 1.5s infinite",
    }} />
  );
}

// ─── Access Denied ───────────────────────────────────────────────────────────
function AccessDenied() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const t = setTimeout(() => setLocation("/explore"), 2000);
    return () => clearTimeout(t);
  }, [setLocation]);
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: C.fontBody, fontSize: 14, color: C.muted }}>Not authorized. Redirecting...</p>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>("30");
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    setError(null);
    try {
      const result = await fetchAdminStats(user.id);
      if (!mountedRef.current) return;
      setData(result);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (e: any) {
      if (!mountedRef.current) return;
      setError(e.message || "Failed to load data");
    } finally {
      if (mountedRef.current) { setLoading(false); setRefreshing(false); }
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && user?.email === ADMIN_EMAIL) loadData();
  }, [authLoading, user, loadData]);

  // ─── Period computation ──
  const kpis = useMemo(() => {
    if (!data) return null;
    const now = Date.now();
    const days = periodDays(period);

    if (!days) {
      return {
        users: { total: data.users.length, thisPeriod: data.users.length, prevPeriod: 0 },
        wines: { total: data.wines.length, thisPeriod: data.wines.length, prevPeriod: 0 },
        chats: { total: data.conversations.length, thisPeriod: data.conversations.length, prevPeriod: 0 },
        wishlist: { total: data.wishlist.length, thisPeriod: data.wishlist.length, prevPeriod: 0 },
      };
    }

    const thisStart = now - days * 86400000;
    const prevStart = thisStart - days * 86400000;

    return {
      users: {
        total: data.users.length,
        thisPeriod: countInRange(data.users, thisStart, now),
        prevPeriod: countInRange(data.users, prevStart, thisStart),
      },
      wines: {
        total: data.wines.length,
        thisPeriod: countInRange(data.wines, thisStart, now),
        prevPeriod: countInRange(data.wines, prevStart, thisStart),
      },
      chats: {
        total: data.conversations.length,
        thisPeriod: countInRange(data.conversations, thisStart, now),
        prevPeriod: countInRange(data.conversations, prevStart, thisStart),
      },
      wishlist: {
        total: data.wishlist.length,
        thisPeriod: countInRange(data.wishlist, thisStart, now),
        prevPeriod: countInRange(data.wishlist, prevStart, thisStart),
      },
    };
  }, [data, period]);

  const periodLabel = period === "all" ? "all time" : `${period}d`;

  // ─── Access control ──
  if (authLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: C.fontBody, fontSize: 14, color: C.muted }}>Loading...</div>
      </div>
    );
  }
  if (!user || user.email !== ADMIN_EMAIL) return <AccessDenied />;

  return (
    <div style={{ fontFamily: C.fontBody, color: C.text, height: "calc(100vh - 56px)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <style>{`
        @keyframes admin-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes admin-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>
        {/* Breadcrumb + period selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: C.fontMono, fontSize: 11, fontWeight: 500, color: C.muted, letterSpacing: "0.04em" }}>
            Admin
          </span>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: "rgba(140, 28, 46, 0.06)", border: "1px solid rgba(140, 28, 46, 0.2)",
            color: C.accent, borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <SectionLabel>Key Metrics</SectionLabel>
        {loading || !kpis ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: "22px 24px" }}>
                <Skeleton width={60} height={12} />
                <div style={{ height: 12 }} />
                <Skeleton width={80} height={36} />
                <div style={{ height: 10 }} />
                <Skeleton width={100} height={14} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
            <KpiCard label="Users" total={kpis.users.total} thisPeriod={kpis.users.thisPeriod} prevPeriod={kpis.users.prevPeriod} periodLabel={periodLabel} />
            <KpiCard label="Wines Logged" total={kpis.wines.total} thisPeriod={kpis.wines.thisPeriod} prevPeriod={kpis.wines.prevPeriod} periodLabel={periodLabel} />
            <KpiCard label="Sommy Chats" total={kpis.chats.total} thisPeriod={kpis.chats.thisPeriod} prevPeriod={kpis.chats.prevPeriod} periodLabel={periodLabel} />
            <KpiCard label="Wishlist" total={kpis.wishlist.total} thisPeriod={kpis.wishlist.thisPeriod} prevPeriod={kpis.wishlist.prevPeriod} periodLabel={periodLabel} />
          </div>
        )}

        {/* Charts row */}
        {data && (
          <>
            <SectionLabel>Activity & Regions</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 32 }}>
              <ActivityChart data={data} period={period} />
              <TopRegions wines={data.wines} />
            </div>
          </>
        )}

        {/* User Table */}
        {data && (
          <>
            <SectionLabel>Users</SectionLabel>
            <div style={{ marginBottom: 32 }}>
              <UserTable data={data} />
            </div>
          </>
        )}

        {/* Feature Adoption + Recent Activity side by side */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
            <div>
              <SectionLabel>Feature Adoption</SectionLabel>
              <FeatureAdoption data={data} />
            </div>
            <div>
              <SectionLabel>Recent Activity</SectionLabel>
              <RecentActivity data={data} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, paddingTop: 16 }}>
          {lastRefresh && (
            <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.muted }}>
              Last updated: {lastRefresh}
            </span>
          )}
          <button
            onClick={loadData}
            disabled={refreshing}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
              border: `1px solid ${C.cardBorder}`, borderRadius: 8, background: C.card,
              color: C.muted, fontFamily: C.fontBody, fontSize: 12, fontWeight: 500,
              cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.5 : 1,
            }}
          >
            <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              style={refreshing ? { animation: "admin-spin 0.8s linear infinite" } : {}}>
              <path d="M2.5 8a5.5 5.5 0 019.3-3.95M13.5 8a5.5 5.5 0 01-9.3 3.95" />
              <path d="M12 1.5V4.5H9M4 14.5V11.5H7" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
