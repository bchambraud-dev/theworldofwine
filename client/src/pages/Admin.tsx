import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { getAccessToken, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  experience_level: string | null;
  base_country: string | null;
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
interface ConversationEntry { id: string; user_id: string; created_at: string; has_image: boolean | null }
interface ActivityEntry {
  id?: string;
  user_id: string;
  activity_type: string;
  item_id: string | null;
  created_at: string;
}
interface CellarEntry {
  id: string;
  user_id: string;
  wine_name: string | null;
  producer: string | null;
  region: string | null;
  quantity: number;
  purchase_price: number | null;
  market_value_estimate: number | null;
  status: string | null;
  created_at: string;
}

interface AdminData {
  users: UserProfile[];
  wines: WineEntry[];
  wishlist: WishlistEntry[];
  conversations: ConversationEntry[];
  activities: ActivityEntry[];
  cellar: CellarEntry[];
}

type Period = "7" | "30" | "90" | "all";

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F4EF",
  card: "#FFFFFF",
  cardBorder: "#EDEAE3",
  text: "#1A1410",
  muted: "#5A5248",
  accent: "#8C1C2E",
  accentLight: "rgba(140,28,46,0.08)",
  green: "#4A7A52",
  greenBg: "rgba(74,122,82,0.10)",
  red: "#C03838",
  gold: "#B8963E",
  goldBg: "rgba(184,150,62,0.10)",
  purple: "#6B4C8A",
  purpleBg: "rgba(107,76,138,0.10)",
  border: "#EDEAE3",
  trackBg: "rgba(0,0,0,0.04)",
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Jost', -apple-system, sans-serif",
  fontMono: "'Geist Mono', 'SF Mono', monospace",
  radius: 12,
} as const;

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
    cellar: raw.cellar || [],
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

function fmtUsd(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtNum(n: number): string {
  return n.toLocaleString();
}

// ─── Shared styles ───────────────────────────────────────────────────────────
const mono = (size = "0.6rem"): React.CSSProperties => ({
  fontFamily: C.fontMono, fontSize: size, fontWeight: 600,
  letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted,
});

function SectionLabel({ children }: { children: string }) {
  return <div style={{ ...mono("0.62rem"), marginBottom: 12 }}>{children}</div>;
}

function Avatar({ name, url, size = 28 }: { name: string; url?: string | null; size?: number }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (url) return <img src={url} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
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
        <button key={p.val} onClick={() => onChange(p.val)} style={{
          padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
          fontFamily: C.fontMono, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
          background: value === p.val ? C.card : "transparent",
          color: value === p.val ? C.text : C.muted,
          boxShadow: value === p.val ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          transition: "all 0.15s ease",
        }}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, delta, periodLabel }: {
  label: string; value: string; sub?: string; delta?: { current: number; previous: number }; periodLabel: string;
}) {
  const d = delta ? delta.current - delta.previous : 0;
  const deltaColor = d > 0 ? C.green : d < 0 ? C.red : C.muted;
  const deltaPrefix = d > 0 ? "+" : "";

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius,
      padding: "18px 20px", minWidth: 0,
    }}>
      <div style={{ ...mono("0.52rem"), marginBottom: 8 }}>{label}</div>
      <div style={{
        fontFamily: C.fontDisplay, fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em",
        color: C.text, lineHeight: 1.1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: C.fontBody, fontSize: "0.72rem", fontWeight: 300, color: C.muted, marginTop: 4 }}>
          {sub}
        </div>
      )}
      {delta && (
        <div style={{ marginTop: 6, fontFamily: C.fontMono, fontSize: "0.58rem", fontWeight: 500, color: deltaColor }}>
          {deltaPrefix}{d} vs prev {periodLabel}
        </div>
      )}
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
      ...data.cellar.map(c => c.created_at),
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
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: C.text, marginBottom: 20 }}>
        Daily Activity
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 140 }}>
        {days.map((d, i) => (
          <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
            <div
              title={`${labels[i]}: ${d.count} actions`}
              style={{
                width: "100%", maxWidth: 10,
                height: d.count > 0 ? `${Math.max(4, (d.count / maxVal) * 100)}%` : "0%",
                background: C.accent, borderRadius: 2, transition: "height 0.3s ease",
              }}
            />
            {i % labelEvery === 0 && (
              <div style={{ fontSize: 8, color: C.muted, marginTop: 6, whiteSpace: "nowrap", fontFamily: C.fontMono }}>
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
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: C.text, marginBottom: 20 }}>
        Top Regions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map(([region, count]) => (
          <div key={region} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              flex: "0 0 110px", fontSize: "0.72rem", color: C.muted, fontFamily: C.fontBody,
              textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {region}
            </span>
            <div style={{ flex: 1, height: 6, background: C.trackBg, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(count / maxVal) * 100}%`, background: C.accent, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <span style={{ flex: "0 0 28px", fontFamily: C.fontMono, fontSize: "0.6rem", fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>
              {count}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: "0.78rem" }}>No wine logs yet</div>
        )}
      </div>
    </div>
  );
}

// ─── User Table ──────────────────────────────────────────────────────────────
function UserTable({ data }: { data: AdminData }) {
  const { users, wines, wishlist, conversations, activities, cellar } = data;

  const stats = useMemo(() => {
    const winesByUser: Record<string, number> = {};
    const tastingsByUser: Record<string, number> = {};
    const scansByUser: Record<string, number> = {};
    wines.forEach(w => {
      winesByUser[w.user_id] = (winesByUser[w.user_id] || 0) + 1;
      if (w.has_tasting) tastingsByUser[w.user_id] = (tastingsByUser[w.user_id] || 0) + 1;
    });

    const wishlistByUser: Record<string, number> = {};
    wishlist.forEach(w => { wishlistByUser[w.user_id] = (wishlistByUser[w.user_id] || 0) + 1; });

    const chatsByUser: Record<string, number> = {};
    conversations.forEach(c => {
      chatsByUser[c.user_id] = (chatsByUser[c.user_id] || 0) + 1;
      if (c.has_image) scansByUser[c.user_id] = (scansByUser[c.user_id] || 0) + 1;
    });

    const cellarByUser: Record<string, { bottles: number; value: number }> = {};
    cellar.filter(c => c.status === "active").forEach(c => {
      if (!cellarByUser[c.user_id]) cellarByUser[c.user_id] = { bottles: 0, value: 0 };
      cellarByUser[c.user_id].bottles += c.quantity || 0;
      cellarByUser[c.user_id].value += (c.market_value_estimate || 0) * (c.quantity || 0);
    });

    return { winesByUser, tastingsByUser, wishlistByUser, chatsByUser, scansByUser, cellarByUser };
  }, [wines, wishlist, conversations, cellar]);

  const sorted = useMemo(() =>
    [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  [users]);

  const thStyle: React.CSSProperties = {
    fontFamily: C.fontMono, fontSize: "0.48rem", fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: C.muted, textAlign: "left", padding: "10px 10px",
    borderBottom: `1px solid ${C.cardBorder}`, whiteSpace: "nowrap", background: C.card,
    position: "sticky", top: 0, zIndex: 1,
  };
  const tdStyle: React.CSSProperties = {
    padding: "8px 10px", borderBottom: `1px solid ${C.cardBorder}`,
    color: C.muted, verticalAlign: "middle", whiteSpace: "nowrap", fontSize: "0.75rem",
  };
  const numStyle: React.CSSProperties = {
    ...tdStyle, fontFamily: C.fontMono, fontVariantNumeric: "tabular-nums", fontWeight: 500, color: C.text, fontSize: "0.68rem",
  };

  const levelBadge = (level: string | null) => {
    const l = (level || "").toLowerCase();
    let bg = "rgba(0,0,0,0.04)", color = C.muted, label = level || "—";
    if (l === "beginner") { bg = C.greenBg; color = C.green; label = "Beginner"; }
    else if (l === "intermediate") { bg = C.goldBg; color = C.gold; label = "Intermediate"; }
    else if (l === "expert") { bg = C.purpleBg; color = C.purple; label = "Expert"; }
    return (
      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: "0.55rem", fontWeight: 600, fontFamily: C.fontMono, background: bg, color, letterSpacing: "0.04em" }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Joined</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Level</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Wines</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Tastings</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Cellar</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Cellar Value</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Wishlist</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Chats</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Scans</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={11} style={{ ...tdStyle, textAlign: "center", padding: 32 }}>No users yet</td></tr>
          )}
          {sorted.map(u => {
            const cs = stats.cellarByUser[u.id];
            return (
              <tr key={u.id}>
                <td style={{ ...tdStyle, color: C.text, fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={u.display_name || "?"} url={u.avatar_url} size={24} />
                    <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{u.display_name || "Anonymous"}</span>
                  </div>
                </td>
                <td style={tdStyle}>{relativeTime(u.created_at)}</td>
                <td style={tdStyle}>{u.base_country || "—"}</td>
                <td style={tdStyle}>{levelBadge(u.experience_level)}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{stats.winesByUser[u.id] || 0}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{stats.tastingsByUser[u.id] || 0}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{cs?.bottles || 0}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{cs && cs.value > 0 ? fmtUsd(cs.value) : "—"}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{stats.wishlistByUser[u.id] || 0}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{stats.chatsByUser[u.id] || 0}</td>
                <td style={{ ...numStyle, textAlign: "right" }}>{stats.scansByUser[u.id] || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Cellar Insights ────────────────────────────────────────────────────────
function CellarInsights({ data }: { data: AdminData }) {
  const active = useMemo(() => data.cellar.filter(c => c.status === "active"), [data.cellar]);

  const totalValue = useMemo(() =>
    active.reduce((s, c) => s + (c.market_value_estimate || 0) * (c.quantity || 0), 0),
  [active]);

  const totalBottles = useMemo(() => active.reduce((s, c) => s + (c.quantity || 0), 0), [active]);

  const usersWithCellar = useMemo(() => new Set(active.map(c => c.user_id)).size, [active]);
  const avgSize = usersWithCellar > 0 ? Math.round(totalBottles / usersWithCellar) : 0;

  const topWines = useMemo(() => {
    const userMap: Record<string, string> = {};
    data.users.forEach(u => { userMap[u.id] = u.display_name || "Anonymous"; });
    return [...active]
      .filter(c => c.market_value_estimate && c.market_value_estimate > 0)
      .sort((a, b) => ((b.market_value_estimate || 0) * b.quantity) - ((a.market_value_estimate || 0) * a.quantity))
      .slice(0, 5)
      .map(c => ({
        name: c.wine_name || "Unknown",
        owner: userMap[c.user_id] || "Unknown",
        qty: c.quantity,
        value: (c.market_value_estimate || 0) * c.quantity,
      }));
  }, [active, data.users]);

  const topRegions = useMemo(() => {
    const counts: Record<string, number> = {};
    active.forEach(c => { const r = c.region || "Unknown"; counts[r] = (counts[r] || 0) + (c.quantity || 0); });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [active]);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: C.text, marginBottom: 20 }}>
        Cellar Insights
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "TOTAL VALUE", val: fmtUsd(totalValue) },
          { label: "TOTAL BOTTLES", val: fmtNum(totalBottles) },
          { label: "AVG PER USER", val: `${avgSize} bottles` },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", padding: "12px 8px", background: C.bg, borderRadius: 8 }}>
            <div style={{ ...mono("0.48rem"), marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: C.fontDisplay, fontSize: "1.1rem", fontWeight: 400, color: C.text }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Top wines by value */}
      {topWines.length > 0 && (
        <>
          <div style={{ ...mono("0.48rem"), marginBottom: 8 }}>TOP WINES BY VALUE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {topWines.map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: C.fontMono, fontSize: "0.55rem", fontWeight: 600, color: C.accent, width: 16 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: C.fontBody, fontSize: "0.78rem", fontWeight: 400, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                  <div style={{ fontFamily: C.fontBody, fontSize: "0.68rem", fontWeight: 300, color: C.muted }}>{w.owner} · x{w.qty}</div>
                </div>
                <span style={{ fontFamily: C.fontMono, fontSize: "0.62rem", fontWeight: 600, color: C.green, flexShrink: 0 }}>{fmtUsd(w.value)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Top cellar regions */}
      {topRegions.length > 0 && (
        <>
          <div style={{ ...mono("0.48rem"), marginBottom: 8 }}>MOST TRACKED REGIONS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {topRegions.map(([r, count]) => (
              <span key={r} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: "0.62rem",
                fontFamily: C.fontMono, fontWeight: 500, background: C.accentLight, color: C.accent,
              }}>
                {r} ({count})
              </span>
            ))}
          </div>
        </>
      )}

      {active.length === 0 && (
        <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: "0.78rem" }}>No cellar data yet</div>
      )}
    </div>
  );
}

// ─── Feature Adoption ────────────────────────────────────────────────────────
function FeatureAdoption({ data }: { data: AdminData }) {
  const total = data.users.length || 1;

  const features = useMemo(() => {
    const usersLogged = new Set(data.wines.map(w => w.user_id));
    const usersTasting = new Set(data.wines.filter(w => w.has_tasting).map(w => w.user_id));
    const usersCellar = new Set(data.cellar.filter(c => c.status === "active").map(c => c.user_id));
    const usersWishlist = new Set(data.wishlist.map(w => w.user_id));
    const usersGuide = new Set(data.activities.filter(a => a.activity_type === "guide_read").map(a => a.user_id));
    const usersSommy = new Set(data.conversations.map(c => c.user_id));
    const usersScanned = new Set(data.conversations.filter(c => c.has_image).map(c => c.user_id));
    return [
      { label: "Logged a wine", count: usersLogged.size },
      { label: "Used tasting mode", count: usersTasting.size },
      { label: "Created a cellar", count: usersCellar.size },
      { label: "Added to wishlist", count: usersWishlist.size },
      { label: "Completed a guide", count: usersGuide.size },
      { label: "Chatted with Sommy", count: usersSommy.size },
      { label: "Scanned a label", count: usersScanned.size },
    ];
  }, [data]);

  const [animated, setAnimated] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setAnimated(true)); }, []);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: C.text, marginBottom: 20 }}>
        Feature Adoption
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {features.map(f => {
          const pct = Math.round((f.count / total) * 100);
          return (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                flex: "0 0 130px", fontSize: "0.72rem", color: C.muted, textAlign: "right",
                whiteSpace: "nowrap", fontFamily: C.fontBody, fontWeight: 300,
              }}>
                {f.label}
              </span>
              <div style={{ flex: 1, height: 6, background: C.trackBg, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, background: C.accent, opacity: 0.7,
                  width: animated ? `${pct}%` : "0%",
                  transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
              <span style={{ flex: "0 0 65px", fontFamily: C.fontMono, fontSize: "0.58rem", fontWeight: 500, color: C.text }}>
                {f.count}/{total} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Public Stats Preview ───────────────────────────────────────────────────
function PublicStats({ data }: { data: AdminData }) {
  const active = data.cellar.filter(c => c.status === "active");
  const totalBottles = active.reduce((s, c) => s + (c.quantity || 0), 0);
  const uniqueCountries = new Set(data.wines.map(w => w.region?.split(",").pop()?.trim()).filter(Boolean)).size;
  const totalConversations = new Set(data.conversations.map(c => `${c.user_id}-${c.created_at.slice(0, 10)}`)).size;
  const uniqueGrapes = new Set<string>();
  // Count unique region entries as a proxy for diversity
  data.wines.forEach(w => { if (w.region) uniqueGrapes.add(w.region); });

  const stats = [
    { num: totalBottles, text: "bottles tracked in cellars" },
    { num: data.wines.length, text: `wines tasted across ${uniqueCountries} countries` },
    { num: totalConversations, text: "conversations with Sommy" },
    { num: uniqueGrapes.size, text: "unique regions explored" },
  ];

  return (
    <div style={{
      background: "#1A1410", borderRadius: C.radius, padding: "28px 28px 24px",
    }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: "#F7F4EF", marginBottom: 20, opacity: 0.9 }}>
        The World of Wine in Numbers
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: C.fontDisplay, fontSize: "1.5rem", fontWeight: 400, color: "#8C1C2E", lineHeight: 1.1 }}>
              {fmtNum(s.num)}
            </div>
            <div style={{ fontFamily: C.fontBody, fontSize: "0.78rem", fontWeight: 300, color: "rgba(247,244,239,0.6)", marginTop: 4 }}>
              {s.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity Feed ───────────────────────────────────────────────────
function RecentActivity({ data }: { data: AdminData }) {
  const userMap = useMemo(() => {
    const m: Record<string, UserProfile> = {};
    data.users.forEach(u => { m[u.id] = u; });
    return m;
  }, [data.users]);

  const feed = useMemo(() => {
    const items: { key: string; userId: string; text: string; time: string }[] = [];

    data.users.forEach(u => {
      items.push({ key: `signup-${u.id}`, userId: u.id, text: "signed up", time: u.created_at });
    });
    data.wines.forEach(w => {
      items.push({ key: `wine-${w.id}`, userId: w.user_id, text: `logged ${w.wine_name || "a wine"}`, time: w.created_at });
    });
    data.conversations.filter(c => c.has_image).forEach(c => {
      items.push({ key: `scan-${c.id}`, userId: c.user_id, text: "scanned a label with Sommy", time: c.created_at });
    });
    data.cellar.forEach(c => {
      items.push({ key: `cellar-${c.id}`, userId: c.user_id, text: `added ${c.wine_name || "a wine"} to cellar`, time: c.created_at });
    });
    data.wishlist.forEach(w => {
      items.push({ key: `wish-${w.id}`, userId: w.user_id, text: "added to wishlist", time: w.created_at });
    });

    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return items.slice(0, 20);
  }, [data]);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: 24 }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: "1rem", fontWeight: 400, color: C.text, marginBottom: 16 }}>
        Recent Activity
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {feed.length === 0 && (
          <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: "0.78rem" }}>No activity yet</div>
        )}
        {feed.map(item => {
          const u = userMap[item.userId];
          const name = u?.display_name || "Someone";
          return (
            <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
              <Avatar name={name} url={u?.avatar_url} size={22} />
              <div style={{ flex: 1, fontSize: "0.75rem", color: C.text, lineHeight: 1.4, minWidth: 0 }}>
                <span style={{ fontWeight: 500 }}>{name}</span>{" "}
                <span style={{ color: C.muted, fontWeight: 300 }}>{item.text}</span>
              </div>
              <span style={{ fontFamily: C.fontMono, fontSize: "0.52rem", color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                {relativeTime(item.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────
function Skeleton({ width, height }: { width: number | string; height: number }) {
  return (
    <div style={{
      width, height, borderRadius: 8,
      background: "linear-gradient(90deg, #EDEAE3 25%, #F7F4EF 50%, #EDEAE3 75%)",
      backgroundSize: "200% 100%", animation: "admin-shimmer 1.5s infinite",
    }} />
  );
}

// ─── Access Denied ──────────────────────────────────────────────────────────
function AccessDenied() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const t = setTimeout(() => setLocation("/explore"), 2000);
    return () => clearTimeout(t);
  }, [setLocation]);
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: C.fontBody, fontSize: "0.82rem", color: C.muted }}>Not authorized. Redirecting...</p>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────
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

  // ── KPI computations ──
  const kpis = useMemo(() => {
    if (!data) return null;
    const now = Date.now();
    const days = periodDays(period);
    const periodLabel = period === "all" ? "all time" : `${period}d`;

    const activeCellar = data.cellar.filter(c => c.status === "active");
    const totalBottles = activeCellar.reduce((s, c) => s + (c.quantity || 0), 0);
    const cellarValue = activeCellar.reduce((s, c) => s + (c.market_value_estimate || 0) * (c.quantity || 0), 0);
    const totalScans = data.conversations.filter(c => c.has_image).length;
    const totalTastings = data.wines.filter(w => w.has_tasting).length;

    // Weekly active: unique users with any activity in last 7 days
    const weekAgo = now - 7 * 86400000;
    const activeUserIds = new Set<string>();
    data.wines.filter(w => new Date(w.created_at).getTime() >= weekAgo).forEach(w => activeUserIds.add(w.user_id));
    data.conversations.filter(c => new Date(c.created_at).getTime() >= weekAgo).forEach(c => activeUserIds.add(c.user_id));
    data.cellar.filter(c => new Date(c.created_at).getTime() >= weekAgo).forEach(c => activeUserIds.add(c.user_id));
    data.activities.filter(a => new Date(a.created_at).getTime() >= weekAgo).forEach(a => activeUserIds.add(a.user_id));
    const weeklyActive = activeUserIds.size;

    // Retention: % of users active last 7d who were also active 7-14d ago
    const prevWeekAgo = now - 14 * 86400000;
    const prevWeekUserIds = new Set<string>();
    data.wines.filter(w => { const t = new Date(w.created_at).getTime(); return t >= prevWeekAgo && t < weekAgo; }).forEach(w => prevWeekUserIds.add(w.user_id));
    data.conversations.filter(c => { const t = new Date(c.created_at).getTime(); return t >= prevWeekAgo && t < weekAgo; }).forEach(c => prevWeekUserIds.add(c.user_id));
    data.cellar.filter(c => { const t = new Date(c.created_at).getTime(); return t >= prevWeekAgo && t < weekAgo; }).forEach(c => prevWeekUserIds.add(c.user_id));
    data.activities.filter(a => { const t = new Date(a.created_at).getTime(); return t >= prevWeekAgo && t < weekAgo; }).forEach(a => prevWeekUserIds.add(a.user_id));
    let retention = 0;
    if (activeUserIds.size > 0) {
      const retained = [...activeUserIds].filter(id => prevWeekUserIds.has(id)).length;
      retention = Math.round((retained / activeUserIds.size) * 100);
    }

    const avgChatsPerUser = data.users.length > 0 ? Math.round(data.conversations.length / data.users.length * 10) / 10 : 0;
    const avgWinesPerUser = data.users.length > 0 ? Math.round(data.wines.length / data.users.length * 10) / 10 : 0;

    if (!days) {
      return {
        periodLabel,
        users: { total: data.users.length },
        weeklyActive, retention,
        chats: { total: data.conversations.length, avgPerUser: avgChatsPerUser },
        scans: { total: totalScans },
        wines: { total: data.wines.length, avgPerUser: avgWinesPerUser },
        tastings: { total: totalTastings },
        cellarBottles: totalBottles,
        cellarValue,
        wishlist: { total: data.wishlist.length },
        deltas: null,
      };
    }

    const thisStart = now - days * 86400000;
    const prevStart = thisStart - days * 86400000;

    return {
      periodLabel,
      users: { total: data.users.length },
      weeklyActive, retention,
      chats: { total: data.conversations.length, avgPerUser: avgChatsPerUser },
      scans: { total: totalScans },
      wines: { total: data.wines.length, avgPerUser: avgWinesPerUser },
      tastings: { total: totalTastings },
      cellarBottles: totalBottles,
      cellarValue,
      wishlist: { total: data.wishlist.length },
      deltas: {
        users: { current: countInRange(data.users, thisStart, now), previous: countInRange(data.users, prevStart, thisStart) },
        wines: { current: countInRange(data.wines, thisStart, now), previous: countInRange(data.wines, prevStart, thisStart) },
        chats: { current: countInRange(data.conversations, thisStart, now), previous: countInRange(data.conversations, prevStart, thisStart) },
        wishlist: { current: countInRange(data.wishlist, thisStart, now), previous: countInRange(data.wishlist, prevStart, thisStart) },
        cellar: { current: countInRange(data.cellar, thisStart, now), previous: countInRange(data.cellar, prevStart, thisStart) },
        scans: { current: data.conversations.filter(c => c.has_image && inRange(c.created_at, thisStart, now)).length, previous: data.conversations.filter(c => c.has_image && inRange(c.created_at, prevStart, thisStart)).length },
      },
    };
  }, [data, period]);

  // ── Access control ──
  if (authLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: C.fontBody, fontSize: "0.82rem", color: C.muted }}>Loading...</div>
      </div>
    );
  }
  if (!user || user.email !== ADMIN_EMAIL) return <AccessDenied />;

  return (
    <div className="page-scroll" style={{ fontFamily: C.fontBody, color: C.text }}>
      <style>{`
        @keyframes admin-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes admin-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: C.fontDisplay, fontSize: "1.5rem", fontWeight: 400, color: C.text, margin: 0 }}>
              Admin Dashboard
            </h1>
            {lastRefresh && (
              <div style={{ fontFamily: C.fontMono, fontSize: "0.52rem", color: C.muted, marginTop: 4 }}>
                Last updated: {lastRefresh}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <PeriodSelector value={period} onChange={setPeriod} />
            <button
              onClick={loadData}
              disabled={refreshing}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
                border: `1px solid ${C.cardBorder}`, borderRadius: 8, background: C.card,
                color: C.muted, fontFamily: C.fontMono, fontSize: "0.58rem", fontWeight: 500,
                cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.5 : 1,
                letterSpacing: "0.04em",
              }}
            >
              <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                style={refreshing ? { animation: "admin-spin 0.8s linear infinite" } : {}}>
                <path d="M2.5 8a5.5 5.5 0 019.3-3.95M13.5 8a5.5 5.5 0 01-9.3 3.95" />
                <path d="M12 1.5V4.5H9M4 14.5V11.5H7" />
              </svg>
              REFRESH
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            background: "rgba(140,28,46,0.06)", border: "1px solid rgba(140,28,46,0.2)",
            color: C.accent, borderRadius: 10, padding: "12px 16px", fontSize: "0.78rem", marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* ── KPI Grid ── */}
        <SectionLabel>Growth</SectionLabel>
        {loading || !kpis ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: C.radius, padding: "18px 20px" }}>
                <Skeleton width={60} height={10} />
                <div style={{ height: 10 }} />
                <Skeleton width={70} height={28} />
                <div style={{ height: 8 }} />
                <Skeleton width={90} height={12} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
              <KpiCard label="USERS" value={fmtNum(kpis.users.total)} delta={kpis.deltas?.users} periodLabel={kpis.periodLabel} />
              <KpiCard label="WEEKLY ACTIVE" value={fmtNum(kpis.weeklyActive)} sub={`of ${kpis.users.total} total`} periodLabel={kpis.periodLabel} />
              <KpiCard label="SOMMY CONVERSATIONS" value={fmtNum(kpis.chats.total)} sub={`${kpis.chats.avgPerUser} avg/user`} delta={kpis.deltas?.chats} periodLabel={kpis.periodLabel} />
              <KpiCard label="LABEL SCANS" value={fmtNum(kpis.scans.total)} delta={kpis.deltas?.scans} periodLabel={kpis.periodLabel} />
              <KpiCard label="RETENTION" value={`${kpis.retention}%`} sub="7d vs 7-14d" periodLabel={kpis.periodLabel} />
            </div>

            <SectionLabel>Engagement</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
              <KpiCard label="WINES LOGGED" value={fmtNum(kpis.wines.total)} sub={`${kpis.wines.avgPerUser} avg/user`} delta={kpis.deltas?.wines} periodLabel={kpis.periodLabel} />
              <KpiCard label="TASTING SESSIONS" value={fmtNum(kpis.tastings)} periodLabel={kpis.periodLabel} />
              <KpiCard label="CELLAR BOTTLES" value={fmtNum(kpis.cellarBottles)} delta={kpis.deltas?.cellar} periodLabel={kpis.periodLabel} />
              <KpiCard label="CELLAR VALUE" value={fmtUsd(kpis.cellarValue)} periodLabel={kpis.periodLabel} />
              <KpiCard label="WISHLIST ITEMS" value={fmtNum(kpis.wishlist.total)} delta={kpis.deltas?.wishlist} periodLabel={kpis.periodLabel} />
            </div>
          </>
        )}

        {/* ── User Table ── */}
        {data && (
          <>
            <SectionLabel>Users</SectionLabel>
            <div style={{ marginBottom: 28 }}>
              <UserTable data={data} />
            </div>
          </>
        )}

        {/* ── Cellar Insights + Activity Chart ── */}
        {data && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              <div>
                <SectionLabel>Cellar Insights</SectionLabel>
                <CellarInsights data={data} />
              </div>
              <div>
                <SectionLabel>Daily Activity</SectionLabel>
                <ActivityChart data={data} period={period} />
              </div>
            </div>
          </>
        )}

        {/* ── Top Regions + Feature Adoption ── */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            <div>
              <SectionLabel>Top Regions</SectionLabel>
              <TopRegions wines={data.wines} />
            </div>
            <div>
              <SectionLabel>Feature Adoption</SectionLabel>
              <FeatureAdoption data={data} />
            </div>
          </div>
        )}

        {/* ── Public Stats Preview ── */}
        {data && (
          <>
            <SectionLabel>Public Stats Preview</SectionLabel>
            <div style={{ marginBottom: 28 }}>
              <PublicStats data={data} />
            </div>
          </>
        )}

        {/* ── Recent Activity Feed ── */}
        {data && (
          <>
            <SectionLabel>Recent Activity</SectionLabel>
            <div style={{ marginBottom: 28 }}>
              <RecentActivity data={data} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
