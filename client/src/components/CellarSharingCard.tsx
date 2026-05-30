/**
 * CellarSharingCard — opt-in cellar sharing controls.
 *
 * Lives in My World (ProfilePage). Default state is OFF (private). When
 * the user toggles sharing on, we generate a slug from their display name
 * (collision-safe) and surface a copy-link affordance.
 *
 * Privacy controls (separate toggles):
 *   - cellar_visibility: private | link | public
 *   - share_purchase_prices: bool (default false — financial data sensitive)
 *
 * Phase 1: no follow-back, no comments, no notifications beyond in-app.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { directSelect, directUpdate } from "@/lib/supabaseDirectFetch";

type Settings = {
  public_cellar_slug: string | null;
  cellar_visibility: "private" | "link" | "public";
  share_purchase_prices: boolean;
  followers_count: number;
  display_name: string | null;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "drinker";
}

export default function CellarSharingCard() {
  const { user } = useAuth();
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rows = await directSelect<Settings>(
          "user_profiles",
          `select=public_cellar_slug,cellar_visibility,share_purchase_prices,followers_count,display_name&id=eq.${user.id}&limit=1`,
        );
        if (rows && rows[0]) setS(rows[0]);
      } catch {}
    })();
  }, [user]);

  const update = async (patch: Partial<Settings>) => {
    if (!user || !s) return;
    setBusy(true);
    setError(null);
    try {
      await directUpdate("user_profiles", user.id, patch);
      setS({ ...s, ...patch });
    } catch (e: any) {
      setError(e?.message || "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const enableSharing = async () => {
    if (!user || !s) return;
    setBusy(true);
    setError(null);
    try {
      // Generate a slug from display_name (or "drinker" fallback). Loop with
      // suffixes if the slug already exists. Tries up to 10 variants before
      // giving up.
      let base = slugify(s.display_name || "drinker");
      let candidate = base;
      for (let i = 0; i < 10; i++) {
        const taken = await directSelect<any>(
          "user_profiles",
          `select=id&public_cellar_slug=eq.${encodeURIComponent(candidate)}&limit=1`,
        );
        if (!taken || taken.length === 0) break;
        const suffix = Math.floor(1000 + Math.random() * 9000);
        candidate = `${base}-${suffix}`;
      }
      await directUpdate("user_profiles", user.id, {
        public_cellar_slug: candidate,
        cellar_visibility: "link",
      });
      setS({ ...s, public_cellar_slug: candidate, cellar_visibility: "link" });
    } catch (e: any) {
      setError(e?.message || "Could not enable sharing");
    } finally {
      setBusy(false);
    }
  };

  const disableSharing = () => update({ cellar_visibility: "private" });
  const copyLink = () => {
    if (!s?.public_cellar_slug) return;
    const url = `${window.location.origin}/cellar/${s.public_cellar_slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!s) return null;

  const sharing = s.cellar_visibility !== "private";
  const shareUrl = s.public_cellar_slug ? `${window.location.origin}/cellar/${s.public_cellar_slug}` : "";

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
        letterSpacing: "0.12em", color: "#8C1C2E", marginBottom: 14,
      }}>SHARE YOUR CELLAR</div>

      <div style={{
        background: "white", border: "1px solid #EDEAE3", borderRadius: 12,
        padding: "16px 18px",
      }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: sharing ? 14 : 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#1A1410",
              marginBottom: 4,
            }}>
              {sharing ? "Your cellar is shareable" : "Let friends follow your cellar"}
            </div>
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300,
              color: "#5A5248", lineHeight: 1.5,
            }}>
              {sharing
                ? `Anyone with the link can see your collection. ${s.followers_count} ${s.followers_count === 1 ? "person follows" : "people follow"} you.`
                : "Generate a link to share your cellar with friends. You can turn this off anytime."}
            </div>
          </div>
          <Toggle on={sharing} onChange={(on) => on ? enableSharing() : disableSharing()} busy={busy} />
        </div>

        {sharing && s.public_cellar_slug && (
          <>
            {/* Link + copy */}
            <div style={{
              background: "#F7F4EF", border: "1px solid #EDEAE3", borderRadius: 8,
              padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
              marginBottom: 14,
            }}>
              <div style={{
                flex: 1, minWidth: 0, fontFamily: "'Geist Mono', monospace",
                fontSize: "0.7rem", color: "#5A5248",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {shareUrl}
              </div>
              <button
                onClick={copyLink}
                style={{
                  background: copied ? "#1F6B35" : "#8C1C2E", color: "#F7F4EF",
                  border: "none", borderRadius: 6, padding: "6px 12px",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                  letterSpacing: "0.1em", cursor: "pointer", flexShrink: 0,
                }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>

            {/* Sub-toggles */}
            <SubToggle
              label="Show purchase prices"
              hint="Off by default. Friends won't see what you paid."
              on={s.share_purchase_prices}
              onChange={(on) => update({ share_purchase_prices: on })}
              busy={busy}
            />
          </>
        )}

        {error && (
          <div style={{
            marginTop: 12, fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "#8C1C2E",
          }}>{error}</div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onChange, busy }: { on: boolean; onChange: (on: boolean) => void; busy: boolean }) {
  return (
    <button
      onClick={() => !busy && onChange(!on)}
      disabled={busy}
      style={{
        width: 44, height: 26, borderRadius: 13, border: "none",
        background: on ? "#8C1C2E" : "#D4D1CA",
        position: "relative", cursor: busy ? "default" : "pointer",
        transition: "background 0.18s ease",
        flexShrink: 0, padding: 0,
      }}
      aria-label={on ? "Sharing on" : "Sharing off"}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "white",
        transition: "left 0.18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
      }} />
    </button>
  );
}

function SubToggle({
  label, hint, on, onChange, busy,
}: { label: string; hint: string; on: boolean; onChange: (on: boolean) => void; busy: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1A1410" }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#5A5248", marginTop: 2, lineHeight: 1.4 }}>
          {hint}
        </div>
      </div>
      <Toggle on={on} onChange={onChange} busy={busy} />
    </div>
  );
}
