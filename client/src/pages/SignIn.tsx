import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function SignIn() {
  const { signInWithGoogle, signOut, user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // NO auto-redirect. If the user came here, they want to be here.
  // Show sign-out option if they have a stale/broken session.

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F4EF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" style={{ marginBottom: 16 }}>
          <path d="M20 2C20 2 6 18 6 28C6 36.8 12.3 44 20 44C27.7 44 34 36.8 34 28C34 18 20 2 20 2Z" fill="#8C1C2E"/>
          <ellipse cx="16" cy="26" rx="5" ry="3" fill="rgba(255,255,255,0.2)"/>
        </svg>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.1 }}>
          The World of <span style={{ color: "#8C1C2E" }}>Wine</span>
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#D4D1CA", marginTop: 8 }}>
          YOUR JOURNEY THROUGH WINE
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "40px 36px",
          maxWidth: 380,
          width: "100%",
          boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
          border: "1px solid #EDEAE3",
        }}
      >
        {!loading && user ? (
          /* Already signed in — offer to go home or sign out */
          <>
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
              Go to home
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
          </>
        ) : (
          /* Not signed in — show sign-in */
          <>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 400, color: "#1A1410", marginBottom: 8, lineHeight: 1.2 }}>
              Welcome
            </h1>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", marginBottom: 32, lineHeight: 1.6 }}>
              Sign in to track your wine journey, log bottles, and get personalised recommendations from Sommy.
            </p>
            <button
              onClick={signInWithGoogle}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                padding: "14px 20px", border: "1.5px solid #D4D1CA", borderRadius: 12,
                background: "white", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 400, color: "#1A1410",
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
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#D4D1CA", textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
              By signing in you agree to your journey data being stored securely. We never share your personal information.
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => setLocation("/")}
        style={{
          marginTop: 20, background: "none", border: "none",
          fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
          color: "#5A5248", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#D4D1CA",
        }}
      >
        Continue without an account
      </button>
    </div>
  );
}
