const OFFSET = "calc(52px + 4px + 42px)"; // topbar + journey sub-nav

export default function Cellar() {
  return (
    <div style={{ position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto", background: "#F7F4EF", zIndex: 5 }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 80px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
          letterSpacing: "0.12em", color: "#D4D1CA", marginBottom: 4,
        }}>YOUR COLLECTION</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: "1.5rem",
          fontWeight: 400, color: "#1A1410", margin: "0 0 24px",
        }}>My Cellar</h1>
        <div style={{
          background: "white", border: "1px solid #EDEAE3", borderRadius: 14,
          padding: "48px 24px",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4D1CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
            <path d="M8 22v-8a4 4 0 0 1 8 0v8" />
            <line x1="4" y1="22" x2="20" y2="22" />
          </svg>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: "1.1rem",
            fontWeight: 400, color: "#1A1410", marginBottom: 8,
          }}>Coming soon</div>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
            fontWeight: 300, color: "#5A5248", lineHeight: 1.6,
            margin: 0,
          }}>
            Track your bottles, drinking windows, and cellar health — all with Sommy's guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
