/**
 * PublicCellar — read-only public view of a user's wine cellar.
 *
 * Route: /cellar/:slug
 *
 * Renders when the cellar owner has cellar_visibility != 'private' and
 * has set a public_cellar_slug. Visitors (logged in or out) see:
 *   - Owner identity strip (avatar, name, persona archetype)
 *   - "Follow Marc's cellar" button (logged-in viewers only)
 *   - Cellar list (purchase prices hidden unless owner opted in)
 *
 * Privacy notes:
 *   - Purchase prices + market values are stripped from the query unless
 *     the owner has share_purchase_prices = true.
 *   - The RLS policies enforce this at the DB layer; the client query
 *     only requests public-safe columns regardless of toggle state.
 *   - We never expose the owner's email or auth.users.id directly in the URL.
 *
 * Phase 1 of social. No comments, no feed, no notifications — just the
 * shareable link + one-way follow primitive.
 */

import { useEffect, useMemo, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  SUPABASE_URL,
  ANON_KEY,
  directSelect,
  directInsert,
  directDelete,
  getValidToken,
} from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode } from "@/lib/countryFlags";

type OwnerProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  base_country: string | null;
  public_cellar_slug: string;
  cellar_visibility: "private" | "link" | "public";
  share_purchase_prices: boolean;
  share_tasting_notes: boolean;
  followers_count: number;
  following_count: number;
  wine_persona_json: any | null;
};

type CellarWine = {
  id: string;
  wine_name: string;
  vintage: number | null;
  producer: string | null;
  region: string | null;
  grapes: string[] | null;
  style: string | null;
  quantity: number | null;
  drink_from: number | null;
  drink_until: number | null;
  drink_peak_start: number | null;
  drink_peak_end: number | null;
  awards_json: any | null;
  thumbnail_url: string | null;
  purchase_price: number | null;
  purchase_currency: string | null;
};

export default function PublicCellar() {
  const [, params] = useRoute<{ slug: string }>("/cellar/:slug");
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [wines, setWines] = useState<CellarWine[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Fetch owner profile by slug + their shared cellar
  useEffect(() => {
    if (!params?.slug) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Public profile read. Anonymous fetch is fine (anon key + RLS
        // policy "Public profiles visible by slug" allows this).
        const profileRes = await fetch(
          `${SUPABASE_URL}/rest/v1/user_profiles?select=id,display_name,avatar_url,base_country,public_cellar_slug,cellar_visibility,share_purchase_prices,share_tasting_notes,followers_count,following_count,wine_persona_json&public_cellar_slug=eq.${encodeURIComponent(params.slug)}&limit=1`,
          { headers: { apikey: ANON_KEY } },
        );
        if (!profileRes.ok) throw new Error("Cellar not found");
        const profiles: OwnerProfile[] = await profileRes.json();
        if (!profiles.length) throw new Error("Cellar not found");
        const p = profiles[0];
        if (!mounted) return;
        setOwner(p);

        // Fetch wines via the public-read RLS path. Purchase price columns
        // requested only if owner opted in; otherwise we don't ask for them
        // so they never appear in the network payload either.
        const baseCols = "id,wine_name,vintage,producer,region,grapes,style,quantity,drink_from,drink_until,drink_peak_start,drink_peak_end,awards_json,thumbnail_url";
        const priceCols = p.share_purchase_prices ? ",purchase_price,purchase_currency" : "";
        const wineRes = await fetch(
          `${SUPABASE_URL}/rest/v1/wine_cellar?select=${baseCols}${priceCols}&user_id=eq.${p.id}&status=eq.active&order=created_at.desc.nullslast`,
          { headers: { apikey: ANON_KEY } },
        );
        if (!wineRes.ok) throw new Error("Could not load cellar");
        const w: CellarWine[] = await wineRes.json();
        if (!mounted) return;
        setWines(w);

        // If viewer is logged in, check whether they already follow this owner
        if (user) {
          const followRes = await directSelect<any>(
            "cellar_follows",
            `select=followed_id&follower_id=eq.${user.id}&followed_id=eq.${p.id}&limit=1`,
            5000,
          );
          if (mounted) setFollowing((followRes || []).length > 0);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Cellar not found");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params?.slug, user]);

  const isSelf = !!(user && owner && user.id === owner.id);

  const handleFollow = async () => {
    if (!user || !owner) {
      // logged-out visitor: route to sign-in with next= back here
      setLocation(`/sign-in?next=${encodeURIComponent(`/cellar/${params!.slug}`)}`);
      return;
    }
    if (isSelf) return;
    setBusy(true);
    try {
      if (following) {
        // unfollow
        await directDelete(
          "cellar_follows",
          `follower_id=eq.${user.id}&followed_id=eq.${owner.id}`,
        );
        setFollowing(false);
        setOwner((o) => o ? { ...o, followers_count: Math.max(0, o.followers_count - 1) } : o);
      } else {
        await directInsert("cellar_follows", {
          follower_id: user.id,
          followed_id: owner.id,
        });
        setFollowing(true);
        setOwner((o) => o ? { ...o, followers_count: o.followers_count + 1 } : o);
      }
    } catch (e) {
      console.error("follow toggle failed", e);
    } finally {
      setBusy(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#5A5248", fontFamily: "'Jost', sans-serif" }}>
        Loading cellar…
      </div>
    );
  }

  if (error || !owner) {
    return (
      <div style={{ padding: 48, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: "#1A1410", marginBottom: 10 }}>
          Cellar not found
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "#5A5248", marginBottom: 20 }}>
          This cellar may be private or the link may be wrong.
        </div>
        <Link href="/" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#8C1C2E" }}>
          ← BACK TO THE WORLD OF WINE
        </Link>
      </div>
    );
  }

  const firstName = (owner.display_name || "").split(" ")[0] || "this drinker";
  const persona = owner.wine_persona_json || null;
  const countryFlag = owner.base_country ? countryCode(owner.base_country) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", paddingBottom: 60 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
        {/* Identity strip */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.16em", color: "#8C1C2E", marginBottom: 14,
          }}>
            {firstName.toUpperCase()}'S CELLAR
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {owner.avatar_url ? (
              <img src={owner.avatar_url} alt="" style={{
                width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                border: "2px solid rgba(140,28,46,0.18)",
              }} />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#8C1C2E", color: "#F7F4EF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fraunces', serif", fontSize: "1.8rem",
              }}>
                {firstName[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", color: "#1A1410" }}>
                {owner.display_name || "Wine drinker"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, color: "#5A5248", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem" }}>
                {countryFlag && <span style={{ fontSize: "0.95rem" }}>{countryFlag}</span>}
                {persona?.archetype && <span>{persona.archetype}</span>}
                <span>·</span>
                <span>{wines.length} {wines.length === 1 ? "wine" : "wines"}</span>
              </div>
            </div>
            {!isSelf && (
              <button
                onClick={handleFollow}
                disabled={busy}
                style={{
                  padding: "8px 16px", borderRadius: 20, border: "none",
                  background: following ? "#FFFFFF" : "#8C1C2E",
                  color: following ? "#1A1410" : "#F7F4EF",
                  boxShadow: following ? "inset 0 0 0 1px #D4D1CA" : "0 2px 8px rgba(140,28,46,0.2)",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em",
                  cursor: busy ? "default" : "pointer", flexShrink: 0,
                }}
              >
                {following ? "FOLLOWING" : "+ FOLLOW"}
              </button>
            )}
          </div>
          {persona?.headline && (
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: "0.95rem", fontStyle: "italic",
              color: "#5A5248", marginTop: 14, lineHeight: 1.4,
            }}>
              "{persona.headline}"
            </div>
          )}
        </div>

        {/* Privacy notice for anonymous link visitors */}
        {!user && (
          <div style={{
            background: "rgba(140,28,46,0.05)",
            border: "1px dashed rgba(140,28,46,0.25)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1, fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#1A1410", lineHeight: 1.4 }}>
              Sign in to follow {firstName}'s cellar and get notified of new additions.
            </div>
            <button
              onClick={() => setLocation(`/sign-in?next=${encodeURIComponent(`/cellar/${params!.slug}`)}`)}
              style={{
                padding: "7px 14px", borderRadius: 8, border: "none", background: "#8C1C2E",
                color: "#F7F4EF", fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                letterSpacing: "0.1em", cursor: "pointer",
              }}
            >
              SIGN IN
            </button>
          </div>
        )}

        {/* Cellar list */}
        {wines.length === 0 ? (
          <div style={{
            background: "white", border: "1px solid #EDEAE3", borderRadius: 14,
            padding: "36px 24px", textAlign: "center", color: "#5A5248",
            fontFamily: "'Jost', sans-serif",
          }}>
            {firstName} hasn't added any wines to their cellar yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wines.map((w) => <WineRow key={w.id} w={w} showPrice={owner.share_purchase_prices} />)}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/" style={{
            fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.14em", color: "#8C7468",
          }}>
            POWERED BY THE WORLD OF WINE
          </Link>
        </div>
      </div>
    </div>
  );
}

function WineRow({ w, showPrice }: { w: CellarWine; showPrice: boolean }) {
  const country = w.region ? regionToCountry(w.region) : null;
  const flag = country ? countryCode(country) : null;
  const phase = useMemo(() => {
    if (!w.drink_from || !w.drink_until) return null;
    const y = new Date().getFullYear();
    if (y > w.drink_until) return { label: "PAST PEAK", color: "#A67055" };
    if (w.drink_peak_start && w.drink_peak_end && y >= w.drink_peak_start && y <= w.drink_peak_end) return { label: "AT PEAK", color: "#1F6B35" };
    if (y >= w.drink_from) return { label: "DRINK SOON", color: "#8C7468" };
    return { label: "AGING", color: "#5A5248" };
  }, [w.drink_from, w.drink_until, w.drink_peak_start, w.drink_peak_end]);

  return (
    <div style={{
      background: "white", border: "1px solid #EDEAE3", borderRadius: 12,
      padding: 12, display: "flex", gap: 12, alignItems: "stretch",
    }}>
      {w.thumbnail_url ? (
        <img src={w.thumbnail_url} alt="" style={{
          width: 44, height: 64, objectFit: "cover", objectPosition: "center 35%",
          borderRadius: 4, flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: 44, height: 64, background: "#F2EFE8", borderRadius: 4, flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: "0.96rem", color: "#1A1410",
          lineHeight: 1.25, marginBottom: 2,
        }}>
          {w.wine_name}{w.vintage ? ` ${w.vintage}` : ""}
        </div>
        {w.producer && (
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", color: "#5A5248", marginBottom: 4 }}>
            {w.producer}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {flag && <span style={{ fontSize: "0.85rem" }}>{flag}</span>}
          {w.region && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", color: "#5A5248" }}>
              {w.region}
            </span>
          )}
          {(w.quantity || 0) > 1 && (
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.08em", color: "#8C7468" }}>
              ×{w.quantity}
            </span>
          )}
          {phase && (
            <span style={{
              fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em",
              color: phase.color, padding: "2px 6px", borderRadius: 4,
              background: `${phase.color}10`,
            }}>
              {phase.label}
            </span>
          )}
          {showPrice && w.purchase_price && (
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "#5A5248", marginLeft: "auto" }}>
              {w.purchase_currency || "SGD"} {Number(w.purchase_price).toFixed(0)}
            </span>
          )}
        </div>
        {Array.isArray(w.awards_json?.awards) && w.awards_json.awards.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {w.awards_json.awards.slice(0, 3).map((a: any, i: number) => (
              <span key={i} style={{
                fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem",
                letterSpacing: "0.08em", padding: "2px 6px", borderRadius: 4,
                background: "rgba(140,28,46,0.08)", color: "#8C1C2E",
              }}>
                {a.label || a.name || ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
