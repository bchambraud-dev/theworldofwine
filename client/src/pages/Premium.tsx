import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { getAccessToken } from "@/lib/supabaseDirectFetch";
import { useSEO } from "@/lib/useSEO";

type Interval = "month" | "year";

// Display-only price table. Stripe Checkout will pick the actual local currency
// from the customer's location via the price's currency_options.
const PRICES: Record<string, { symbol: string; monthly: string; yearly: string }> = {
  SGD: { symbol: "S$", monthly: "4.99", yearly: "29.99" },
  USD: { symbol: "$",  monthly: "3.99", yearly: "23.99" },
  GBP: { symbol: "£",  monthly: "2.99", yearly: "17.99" },
  EUR: { symbol: "€",  monthly: "3.49", yearly: "19.99" },
  AUD: { symbol: "A$", monthly: "5.99", yearly: "35.99" },
  NZD: { symbol: "NZ$", monthly: "6.49", yearly: "38.99" },
  CAD: { symbol: "C$", monthly: "4.99", yearly: "29.99" },
};

function getDisplayPrice(currencyCode: string | null | undefined) {
  const code = (currencyCode || "SGD").toUpperCase();
  return PRICES[code] || PRICES.SGD;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function Premium() {
  const [, setLocation] = useLocation();
  const { user, profile, loading: authLoading } = useAuth();
  const [interval, setInterval] = useState<Interval>("month");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Premium — The World of Wine",
    description: "Your pocket sommelier on always. Match scores, drinking-window alerts, and a deeper relationship with your wine.",
    path: "/premium",
  });

  const price = getDisplayPrice(profile?.currency_code);
  const tier = profile?.tier;
  const grandfathered = profile?.grandfathered === true;
  const trialDaysLeft = daysUntil(profile?.trial_ends_at ?? null);

  // ── State machine ────────────────────────────────────────────────────────
  const state = useMemo<
    "loading" | "logged_out" | "trial" | "free" | "premium_paid" | "premium_grandfathered" | "cancelled"
  >(() => {
    if (authLoading) return "loading";
    if (!user) return "logged_out";
    if (grandfathered) return "premium_grandfathered";
    if (tier === "premium") return "premium_paid";
    if (tier === "trial") return "trial";
    if (tier === "cancelled") return "cancelled";
    return "free";
  }, [authLoading, user, tier, grandfathered]);

  async function startCheckout() {
    if (!user) {
      setLocation("/sign-in?return=/premium");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) {
        setError("You need to be signed in.");
        setSubmitting(false);
        return;
      }
      const r = await fetch("/api/stripe-create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interval }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.message || data.error || "Could not start Checkout");
        setSubmitting(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
      setSubmitting(false);
    }
  }

  async function openPortal() {
    setSubmitting(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) {
        setError("You need to be signed in.");
        setSubmitting(false);
        return;
      }
      const r = await fetch("/api/stripe-create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.message || data.error || "Could not open portal");
        setSubmitting(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
      setSubmitting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="prem-page" data-testid="premium-page">
      <style>{`
        .prem-page {
          min-height: calc(100vh - var(--topbar));
          background: var(--bg);
          color: var(--text);
          padding: 48px 20px 80px;
          display: flex; flex-direction: column; align-items: center;
        }
        .prem-wrap { width: 100%; max-width: 640px; }
        .prem-eyebrow {
          font-family: Inter, system-ui, sans-serif;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text3); margin-bottom: 14px; text-align: center;
        }
        .prem-h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: 38px; line-height: 1.1;
          text-align: center; color: var(--wine); margin: 0 0 14px;
        }
        .prem-sub {
          text-align: center; color: var(--text2);
          font-size: 16px; line-height: 1.55; max-width: 520px;
          margin: 0 auto 36px;
        }
        .prem-pillars {
          display: grid; grid-template-columns: 1fr; gap: 0;
          border-top: 1px solid var(--border2-c);
          margin: 0 0 36px;
        }
        .prem-pillar {
          padding: 22px 4px; border-bottom: 1px solid var(--border2-c);
        }
        .prem-pillar-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: 22px; color: var(--wine); margin: 0 0 6px;
        }
        .prem-pillar-body {
          font-size: 14.5px; line-height: 1.55; color: var(--text2);
          margin: 0;
        }
        .prem-pricing-card {
          background: var(--wh); border: 1px solid var(--border2-c);
          border-radius: 16px; padding: 24px 20px; margin: 0 0 18px;
        }
        .prem-toggle {
          display: flex; gap: 6px; padding: 4px;
          background: var(--bg2); border-radius: 999px; margin: 0 0 18px;
        }
        .prem-toggle-btn {
          flex: 1; padding: 9px 14px; border: none; border-radius: 999px;
          background: transparent; color: var(--text2); cursor: pointer;
          font-family: inherit; font-size: 13.5px; font-weight: 500;
          transition: background 120ms, color 120ms;
        }
        .prem-toggle-btn.active {
          background: var(--wh); color: var(--wine);
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .prem-price-row {
          display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
          margin: 0 0 4px;
        }
        .prem-price-amt {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: 34px; color: var(--text);
        }
        .prem-price-unit { color: var(--text3); font-size: 14px; }
        .prem-price-note { font-size: 13px; color: var(--text3); margin: 4px 0 0; }
        .prem-savings {
          display: inline-block; font-size: 11.5px;
          padding: 2px 8px; border-radius: 999px;
          background: rgba(140,28,46,0.08); color: var(--wine);
          margin-left: 6px; letter-spacing: 0.04em;
        }
        .prem-cta {
          width: 100%; padding: 14px 16px; border: none; border-radius: 12px;
          background: var(--wine); color: white; font-size: 15px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: opacity 120ms;
        }
        .prem-cta:disabled { opacity: 0.55; cursor: not-allowed; }
        .prem-cta-secondary {
          width: 100%; padding: 13px 16px; border: 1px solid var(--wine);
          background: transparent; color: var(--wine);
          border-radius: 12px; font-size: 14.5px; font-weight: 500;
          font-family: inherit; cursor: pointer;
        }
        .prem-trust {
          font-size: 12.5px; color: var(--text3); text-align: center;
          line-height: 1.55; margin: 14px 0 0;
        }
        .prem-status-card {
          background: var(--wh); border: 1px solid var(--border2-c);
          border-radius: 16px; padding: 24px 20px; margin: 0 0 18px;
          text-align: center;
        }
        .prem-status-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: 26px; color: var(--wine); margin: 0 0 10px;
        }
        .prem-status-body {
          color: var(--text2); font-size: 14.5px; line-height: 1.55;
          margin: 0 0 18px;
        }
        .prem-error {
          background: rgba(140,28,46,0.08); color: var(--wine);
          border: 1px solid rgba(140,28,46,0.18); border-radius: 10px;
          padding: 10px 12px; font-size: 13.5px; margin: 12px 0 0;
        }
        .prem-back {
          margin-top: 28px; font-size: 13px; color: var(--text3);
          background: transparent; border: none; cursor: pointer;
          font-family: inherit; padding: 6px 12px;
        }
      `}</style>

      <div className="prem-wrap">
        <div className="prem-eyebrow">Premium</div>
        <h1 className="prem-h1">Wine, taken personally.</h1>
        <p className="prem-sub">
          Premium puts your pocket sommelier on always, and gives you the tools to grow your palate
          at your own pace.
        </p>

        <div className="prem-pillars">
          <div className="prem-pillar">
            <h3 className="prem-pillar-title">Sommy, unlocked</h3>
            <p className="prem-pillar-body">
              Ask me anything, any time. I'll know your palate, your cellar, and what you're working on.
            </p>
          </div>
          <div className="prem-pillar">
            <h3 className="prem-pillar-title">Match scores</h3>
            <p className="prem-pillar-body">
              See how every wine fits your taste. The more you log, the sharper the reads.
            </p>
          </div>
          <div className="prem-pillar">
            <h3 className="prem-pillar-title">Drinking-window alerts</h3>
            <p className="prem-pillar-body">
              I'll quietly let you know when your bottles are entering their best phase.
            </p>
          </div>
          <div className="prem-pillar">
            <h3 className="prem-pillar-title">A palate that grows with you</h3>
            <p className="prem-pillar-body">
              Persona insights, unlimited cellar and journal, exports, and proactive coaching from me.
            </p>
          </div>
        </div>

        {/* ── State: loading ── */}
        {state === "loading" && (
          <div className="prem-status-card">
            <p className="prem-status-body">Loading…</p>
          </div>
        )}

        {/* ── State: grandfathered ── */}
        {state === "premium_grandfathered" && (
          <div className="prem-status-card">
            <h2 className="prem-status-title">Founding Premium</h2>
            <p className="prem-status-body">
              You were here before all of this. Premium is yours, on us, for as long as the app exists. Thank you.
            </p>
          </div>
        )}

        {/* ── State: premium_paid ── */}
        {state === "premium_paid" && (
          <div className="prem-status-card">
            <h2 className="prem-status-title">You're Premium</h2>
            <p className="prem-status-body">
              {profile?.subscription_status === "past_due"
                ? "There was an issue with your last payment. Open your billing to fix it."
                : profile?.subscription_cancel_at_period_end
                ? `Your subscription will end on ${profile?.current_period_end ? new Date(profile.current_period_end).toLocaleDateString() : "your next billing date"}.`
                : "Everything is on. Open billing to update your card or change your plan."}
            </p>
            <button className="prem-cta-secondary" onClick={openPortal} disabled={submitting}>
              {submitting ? "Opening…" : "Manage subscription"}
            </button>
            {error && <div className="prem-error">{error}</div>}
          </div>
        )}

        {/* ── State: trial / free / cancelled / logged_out ── all use pricing card */}
        {(state === "trial" || state === "free" || state === "cancelled" || state === "logged_out") && (
          <div className="prem-pricing-card">
            {state === "trial" && trialDaysLeft != null && (
              <div className="prem-eyebrow" style={{ marginBottom: 14, textAlign: "left" }}>
                {trialDaysLeft === 0
                  ? "Trial ending today"
                  : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in your trial`}
              </div>
            )}

            <div className="prem-toggle" role="tablist" aria-label="Billing interval">
              <button
                role="tab"
                aria-selected={interval === "month"}
                className={`prem-toggle-btn ${interval === "month" ? "active" : ""}`}
                onClick={() => setInterval("month")}
              >
                Monthly
              </button>
              <button
                role="tab"
                aria-selected={interval === "year"}
                className={`prem-toggle-btn ${interval === "year" ? "active" : ""}`}
                onClick={() => setInterval("year")}
              >
                Yearly
                <span className="prem-savings">save 50%</span>
              </button>
            </div>

            <div className="prem-price-row">
              <span className="prem-price-amt">
                {price.symbol}{interval === "month" ? price.monthly : price.yearly}
              </span>
              <span className="prem-price-unit">{interval === "month" ? "/ month" : "/ year"}</span>
            </div>
            {interval === "year" && (
              <p className="prem-price-note">
                That's about {price.symbol}{(Number(price.yearly) / 12).toFixed(2)} a month, billed once a year.
              </p>
            )}

            <button
              className="prem-cta"
              onClick={startCheckout}
              disabled={submitting}
              style={{ marginTop: 18 }}
              data-testid="premium-cta"
            >
              {submitting
                ? "Taking you there…"
                : state === "trial"
                ? "Continue with Premium"
                : state === "logged_out"
                ? "Sign in to start Premium"
                : state === "cancelled"
                ? "Resubscribe to Premium"
                : "Start Premium"}
            </button>

            <p className="prem-trust">
              {state === "logged_out"
                ? "No card until you decide. Cancel anytime."
                : state === "trial"
                ? "We'll start your subscription today. Cancel anytime."
                : "Cancel anytime from billing. Renews until you say otherwise."}
            </p>

            {error && <div className="prem-error">{error}</div>}
          </div>
        )}

        <button className="prem-back" onClick={() => setLocation("/journey/profile")}>
          Back to my world
        </button>
      </div>
    </div>
  );
}
