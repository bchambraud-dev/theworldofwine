import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

/**
 * Sign-in landing — sells the benefits of joining before asking for a sign-in.
 *
 * Reached when:
 *  - User taps a personal nav tab (MY WORLD, CELLAR, etc.) while logged out.
 *    NavBar appends ?next=/intended/path so AuthCallback can land them there.
 *  - User taps "Get Started" / footer sign-in links anywhere on the public site.
 *
 * Honours ?next= via sessionStorage (OAuth strips query params on round-trip).
 */
export default function SignIn() {
  const { signInWithGoogle, signOut, user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Persist ?next= across the OAuth redirect.
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const next = qs.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      try { sessionStorage.setItem("signin_next", next); } catch {}
    }
  }, [location]);

  const benefits = [
    {
      icon: "cellar",
      title: "Track every bottle you own",
      body: "Drinking windows, estimated market value, who gave it to you, what you paid. Sommy keeps the receipts.",
    },
    {
      icon: "sommy",
      title: "A pocket sommelier that learns you",
      body: "Tell us what you enjoy once. From then on, every match score, every recommendation, every tasting note is calibrated to your palate — not anyone else's.",
    },
    {
      icon: "journal",
      title: "Log experiences, learn from them",
      body: "Capture the bottle, the moment, the food, your rating. Over time your journal becomes the wine memoir you never thought to write.",
    },
    {
      icon: "wishlist",
      title: "Curate the bottles you want next",
      body: "Save wines from anywhere — scan a label, chat with Sommy, browse the map. Your wishlist syncs across every device you sign in on.",
    },
    {
      icon: "learn",
      title: "Build your knowledge at your pace",
      body: "18 hand-written guides, 12 quizzes, an interactive flavour map. Earn a passport stamp for every country you've tasted from.",
    },
    {
      icon: "private",
      title: "Your data, your collection",
      body: "Stored securely. Never sold. Export or delete anytime. You're the owner.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F4EF",
        padding: "24px 20px 48px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Big wordmark + tagline removed May 2026 — the topbar already
            shows the brand, and the red CTA card greets the user faster. */}

        {/* Already signed in — keep the recovery flow */}
        {!loading && user ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
              border: "1px solid #EDEAE3",
            }}
          >
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
              You're signed in
            </h1>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 24, lineHeight: 1.6 }}>
              Having trouble? Sign out and sign back in to reset your session.
            </p>
            <button
              onClick={() => setLocation("/")}
              style={{
                width: "100%", padding: "14px 20px", border: "1.5px solid #D4D1CA",
                borderRadius: 12, background: "white", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 400, color: "#1A1410",
                marginBottom: 10,
              }}
            >
              Go to My World
            </button>
            <button
              onClick={async () => { await signOut(); }}
              style={{
                width: "100%", padding: "14px 20px", border: "none",
                borderRadius: 12, background: "#8C1C2E", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 400, color: "#F7F4EF",
              }}
            >
              Sign out and start fresh
            </button>
          </div>
        ) : (
          <>
            {/* Hero pitch */}
            <div
              style={{
                background: "linear-gradient(135deg, #8C1C2E 0%, #6B1422 100%)",
                borderRadius: 16,
                padding: "28px 24px",
                color: "#F7F4EF",
                marginBottom: 18,
                boxShadow: "0 6px 28px rgba(140,28,46,0.22)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "rgba(247,244,239,0.72)",
                  marginBottom: 10,
                }}
              >
                CREATE YOUR ACCOUNT — FREE
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                Start tracking your wine journey
              </h1>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 300,
                  lineHeight: 1.55,
                  color: "rgba(247,244,239,0.92)",
                  margin: 0,
                  marginBottom: 18,
                }}
              >
                Build your cellar, log your experiences, and unlock a pocket sommelier that learns your taste. Takes 30 seconds to start.
              </p>
              <button
                onClick={signInWithGoogle}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "13px 20px",
                  border: "none",
                  borderRadius: 12,
                  background: "white",
                  cursor: "pointer",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 500,
                  color: "#1A1410",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.6-11.3-8.4l-6.6 5.1C9.4 39.2 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C42 35.3 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
                </svg>
                Continue with Google
              </button>
              <p
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.14em",
                  color: "rgba(247,244,239,0.6)",
                  textAlign: "center",
                  marginTop: 14,
                  marginBottom: 0,
                }}
              >
                NO CREDIT CARD · TAKES 30 SECONDS
              </p>
            </div>

            {/* Benefits list */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "22px 22px 18px",
                border: "1px solid #EDEAE3",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  color: "#8C1C2E",
                  marginBottom: 18,
                }}
              >
                WHAT YOU GET
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {benefits.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <BenefitIcon kind={b.icon} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: "0.98rem",
                          fontWeight: 500,
                          color: "#1A1410",
                          lineHeight: 1.25,
                          marginBottom: 4,
                        }}
                      >
                        {b.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 300,
                          color: "#5A5248",
                          lineHeight: 1.5,
                        }}
                      >
                        {b.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary CTA — bottom restated */}
            <button
              onClick={signInWithGoogle}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "13px 20px",
                border: "1.5px solid #D4D1CA",
                borderRadius: 12,
                background: "white",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "#1A1410",
                marginBottom: 12,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.6-11.3-8.4l-6.6 5.1C9.4 39.2 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C42 35.3 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              Continue with Google
            </button>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 300,
                color: "#8C7468",
                textAlign: "center",
                margin: "12px 0 18px",
                lineHeight: 1.5,
              }}
            >
              By signing in you agree to your journey data being stored securely. We never sell your personal information.
            </p>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setLocation("/about")}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 300,
                  color: "#5A5248",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: "#D4D1CA",
                }}
              >
                Browse without an account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BenefitIcon({ kind }: { kind: string }) {
  const wrap = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(140,28,46,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as const;
  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {kind === "cellar" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </>
      )}
      {kind === "sommy" && (
        <>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </>
      )}
      {kind === "journal" && (
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </>
      )}
      {kind === "wishlist" && (
        <>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </>
      )}
      {kind === "learn" && (
        <>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </>
      )}
      {kind === "private" && (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )}
    </svg>
  );
  return <div style={wrap}>{icon}</div>;
}
