import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useSEO } from "@/lib/useSEO";

// /premium/welcome?session_id=cs_test_...
// This page is shown after a successful Checkout. Stripe sends the webhook
// asynchronously, so we poll the user's profile briefly waiting for tier=premium.
// Either way we eventually move the user to their profile.

export default function PremiumWelcome() {
  const [, setLocation] = useLocation();
  const { profile, refreshProfile } = useAuth();
  const [phase, setPhase] = useState<"verifying" | "ready" | "stalled">("verifying");

  useSEO({
    title: "Welcome to Premium — The World of Wine",
    description: "Welcome to The World of Wine Premium.",
    path: "/premium/welcome",
  });

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      if (cancelled) return;
      try {
        await refreshProfile();
      } catch {
        // ignore
      }
      attempts += 1;
      if (cancelled) return;
      if (profile?.tier === "premium") {
        setPhase("ready");
        return;
      }
      if (attempts >= 12) {
        // ~30s elapsed; the webhook should have arrived. If not, show a softer message.
        setPhase("stalled");
        return;
      }
      setTimeout(tick, 2500);
    };
    tick();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once tier flips to premium, hold for a moment so the welcome reads, then go home.
  useEffect(() => {
    if (phase === "ready") {
      const t = setTimeout(() => setLocation("/journey/profile"), 3200);
      return () => clearTimeout(t);
    }
  }, [phase, setLocation]);

  return (
    <div className="pw-page" data-testid="premium-welcome">
      <style>{`
        .pw-page {
          min-height: calc(100vh - var(--topbar));
          background: var(--bg);
          color: var(--text);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .pw-wrap {
          max-width: 480px; text-align: center;
        }
        .pw-seal {
          width: 96px; height: 96px; margin: 0 auto 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #C9A961 0%, #A88947 70%, #8B6E33 100%);
          display: flex; align-items: center; justify-content: center;
          color: #2A1006; font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 42px; font-weight: 500;
          box-shadow: 0 8px 28px rgba(140,28,46,0.18);
          animation: pw-seal-in 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pw-seal-in {
          from { transform: scale(0.6) rotate(-6deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);    opacity: 1; }
        }
        .pw-eyebrow {
          font-family: Inter, system-ui, sans-serif;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text3); margin-bottom: 14px;
        }
        .pw-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: 36px; line-height: 1.1;
          color: var(--wine); margin: 0 0 14px;
        }
        .pw-body {
          color: var(--text2); font-size: 15px; line-height: 1.6;
          margin: 0 0 24px;
        }
        .pw-cta {
          display: inline-block; padding: 12px 22px;
          background: var(--wine); color: white;
          border: none; border-radius: 12px;
          font-family: inherit; font-size: 14.5px; cursor: pointer;
        }
        .pw-loading {
          color: var(--text3); font-size: 13px;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="pw-wrap">
        <div className="pw-seal" aria-hidden="true">W</div>
        <div className="pw-eyebrow">Premium</div>

        {phase === "verifying" && (
          <>
            <h1 className="pw-title">Just a moment.</h1>
            <p className="pw-body">Finalising your subscription.</p>
            <p className="pw-loading">This usually takes a few seconds.</p>
          </>
        )}

        {phase === "ready" && (
          <>
            <h1 className="pw-title">Welcome to Premium.</h1>
            <p className="pw-body">
              Your pocket sommelier is on. Match scores, drinking-window alerts, and proactive coaching are unlocked across your cellar and journal.
            </p>
            <p className="pw-loading">Taking you home…</p>
          </>
        )}

        {phase === "stalled" && (
          <>
            <h1 className="pw-title">Almost there.</h1>
            <p className="pw-body">
              Stripe has confirmed your payment, and your account will switch to Premium within a minute. If anything looks off, refresh in a moment.
            </p>
            <button className="pw-cta" onClick={() => setLocation("/journey/profile")}>
              Go to my world
            </button>
          </>
        )}
      </div>
    </div>
  );
}
