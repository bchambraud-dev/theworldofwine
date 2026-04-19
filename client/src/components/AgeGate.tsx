import { useState, useEffect } from "react";

const AGE_KEY = "twow_age_verified";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(AGE_KEY) === "true") setVerified(true);
      else setVerified(false);
    } catch {
      setVerified(false);
    }
  }, []);

  const confirm = () => {
    try { localStorage.setItem(AGE_KEY, "true"); } catch {}
    setVerified(true);
  };

  // Still loading from localStorage
  if (verified === null) return null;

  // Verified — render app
  if (verified) return <>{children}</>;

  // Denied
  if (denied) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F7F4EF", padding: 24,
    }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 16px" }}>
          <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" fill="#8C1C2E" />
        </svg>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
          Sorry, you must be of legal drinking age to use this site.
        </h2>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "#5A5248", lineHeight: 1.6 }}>
          Please come back when you're old enough. In the meantime, stay curious about the world.
        </p>
      </div>
    </div>
  );

  // Gate prompt
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" fill="#8C1C2E" />
          </svg>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "#1A1410" }}>
            The World of <span style={{ color: "#8C1C2E" }}>Wine</span>
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 400,
          color: "#1A1410", marginBottom: 12, lineHeight: 1.3,
        }}>
          Welcome
        </h1>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 300,
          color: "#5A5248", lineHeight: 1.6, marginBottom: 32,
        }}>
          This site contains content related to alcoholic beverages.
          By entering, you confirm that you are of legal drinking age in your country.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <button
            onClick={confirm}
            style={{
              width: "100%", maxWidth: 280, padding: "14px 24px",
              background: "#8C1C2E", color: "#F7F4EF", border: "none", borderRadius: 10,
              fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 400,
              cursor: "pointer", letterSpacing: "0.02em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Yes, I am of legal drinking age
          </button>

          <button
            onClick={() => setDenied(true)}
            style={{
              background: "none", border: "none", padding: "8px 16px",
              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
              color: "#B0ADA6", cursor: "pointer",
            }}
          >
            No, I am not
          </button>
        </div>

        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 300,
          color: "#D4D1CA", marginTop: 32, lineHeight: 1.5,
        }}>
          We do not sell alcohol. This site is for wine education and discovery.
        </p>
      </div>
    </div>
  );
}
