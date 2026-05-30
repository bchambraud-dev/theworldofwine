/**
 * FollowingList — shows people whose cellars the user follows + recent
 * additions to their cellars.
 *
 * Phase 1 of social. Read-only summary; tapping a card deep-links to that
 * person's public cellar at /cellar/:slug.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { SUPABASE_URL, ANON_KEY, directSelect } from "@/lib/supabaseDirectFetch";

type FollowedPerson = {
  followed_id: string;
  display_name: string | null;
  avatar_url: string | null;
  public_cellar_slug: string | null;
  cellar_visibility: string;
  followers_count: number;
  recent_wine_name?: string | null;
  recent_vintage?: number | null;
  recent_added_at?: string | null;
};

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const day = 86400000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 30 * day) return `${Math.floor(diff / (7 * day))}w ago`;
  return `${Math.floor(diff / (30 * day))}mo ago`;
}

export default function FollowingList() {
  const { user } = useAuth();
  const [list, setList] = useState<FollowedPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        // Get IDs being followed
        const follows = await directSelect<any>(
          "cellar_follows",
          `select=followed_id,created_at&follower_id=eq.${user.id}&order=created_at.desc&limit=50`,
        );
        if (!follows || follows.length === 0) {
          if (mounted) { setList([]); setLoading(false); }
          return;
        }
        const ids = follows.map((f: any) => f.followed_id);
        const idList = ids.map((id: string) => `"${id}"`).join(",");

        // Pull the followed users' public profiles (anonymous fetch is fine —
        // public-profile RLS policy gates this).
        const pres = await fetch(
          `${SUPABASE_URL}/rest/v1/user_profiles?select=id,display_name,avatar_url,public_cellar_slug,cellar_visibility,followers_count&id=in.(${idList})`,
          { headers: { apikey: ANON_KEY } },
        );
        const profiles: any[] = pres.ok ? await pres.json() : [];

        // Pull the most recently-added wine for each (also via public read).
        const wres = await fetch(
          `${SUPABASE_URL}/rest/v1/wine_cellar?select=user_id,wine_name,vintage,created_at&user_id=in.(${idList})&status=eq.active&order=created_at.desc&limit=200`,
          { headers: { apikey: ANON_KEY } },
        );
        const wines: any[] = wres.ok ? await wres.json() : [];
        const recentByUser: Record<string, any> = {};
        for (const w of wines) {
          if (!recentByUser[w.user_id]) recentByUser[w.user_id] = w;
        }

        const merged: FollowedPerson[] = ids.map((id: string) => {
          const p = profiles.find((x) => x.id === id);
          const r = recentByUser[id];
          return {
            followed_id: id,
            display_name: p?.display_name || null,
            avatar_url: p?.avatar_url || null,
            public_cellar_slug: p?.public_cellar_slug || null,
            cellar_visibility: p?.cellar_visibility || "private",
            followers_count: p?.followers_count || 0,
            recent_wine_name: r?.wine_name || null,
            recent_vintage: r?.vintage || null,
            recent_added_at: r?.created_at || null,
          };
        }).filter((p: FollowedPerson) => p.cellar_visibility !== "private");

        if (mounted) {
          setList(merged);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  if (loading) return null;
  if (list.length === 0) return null; // hidden when empty — no nag

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
        letterSpacing: "0.12em", color: "#8C1C2E", marginBottom: 14,
      }}>FOLLOWING</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((p) => (
          <Link
            key={p.followed_id}
            href={p.public_cellar_slug ? `/cellar/${p.public_cellar_slug}` : "#"}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "white", border: "1px solid #EDEAE3", borderRadius: 10,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer",
            }}>
              {p.avatar_url ? (
                <img src={p.avatar_url} alt="" style={{
                  width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: "#8C1C2E",
                  color: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Fraunces', serif", fontSize: "1.05rem", flexShrink: 0,
                }}>
                  {(p.display_name || "?")[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontSize: "0.92rem", color: "#1A1410",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {p.display_name || "Wine drinker"}
                </div>
                {p.recent_wine_name && (
                  <div style={{
                    fontFamily: "'Jost', sans-serif", fontSize: "0.72rem",
                    color: "#5A5248", marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    Added {p.recent_wine_name}{p.recent_vintage ? ` ${p.recent_vintage}` : ""} {timeAgo(p.recent_added_at)}
                  </div>
                )}
              </div>
              <span style={{ color: "#8C7468", fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem" }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
