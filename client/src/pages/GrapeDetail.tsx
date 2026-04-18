import { useRoute, useLocation } from "wouter";
import { grapes } from "@/data/grapes";
import { wineRegions } from "@/data/regions";
import { useTrack } from "@/hooks/use-track";
import { useSEO } from "@/lib/useSEO";

export default function GrapeDetail() {
  const [, params] = useRoute("/guides/grapes/:id");
  const [, setLocation] = useLocation();
  const track = useTrack();

  const grape = grapes.find((g) => g.id === params?.id);

  useSEO({
    title: grape ? `${grape.name} Wine Guide — Flavour Profile & Regions` : "Grape Guide",
    description: grape ? `Everything about ${grape.name}: flavour profile, best regions, food pairings, and notable producers.` : "Grape variety not found.",
    path: grape ? `/guides/grapes/${grape.id}` : "/guides",
    type: "article",
  });

  if (!grape) {
    return (
      <div className="page-scroll" style={{ padding: 60, textAlign: "center" }}>
        <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="12" cy="15" r="2"/></svg></div>
        <div className="lv-empty-title">Grape not found</div>
        <button className="chip" onClick={() => setLocation("/guides")} style={{ marginTop: 16 }}>
          Back to Academy
        </button>
      </div>
    );
  }

  track("grape_view", { id: grape.id });

  const regions = grape.regionIds
    .map((rid) => wineRegions.find((r) => r.id === rid))
    .filter(Boolean) as typeof wineRegions;

  const levelDots = (value: "low" | "medium" | "high") => {
    const filled = value === "low" ? 1 : value === "medium" ? 2 : 3;
    return (
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dot <= filled ? "var(--wine)" : "var(--border2-c)",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="page-scroll" data-testid="grape-detail">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Back */}
        <button
          onClick={() => setLocation("/guides")}
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.58rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text3)",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 20,
          }}
          data-testid="back-to-academy"
        >
          ← Academy
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "2rem",
                fontWeight: 400,
                color: "var(--text)",
                lineHeight: 1.1,
              }}
            >
              {grape.name}
            </h1>
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.54rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "3px 10px",
                borderRadius: 100,
                background: grape.color === "red" ? "var(--wine-pale)" : "var(--gold-pale)",
                color: grape.color === "red" ? "var(--wine)" : "var(--gold)",
                border: `1px solid ${grape.color === "red" ? "rgba(140,28,46,0.2)" : "rgba(184,134,11,0.2)"}`,
              }}
            >
              {grape.color}
            </span>
          </div>
          {grape.aliases.length > 0 && (
            <p
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                color: "var(--text3)",
                letterSpacing: "0.04em",
              }}
            >
              Also known as: {grape.aliases.join(", ")}
            </p>
          )}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.92rem",
            fontWeight: 300,
            color: "var(--text2)",
            lineHeight: 1.8,
            marginBottom: 28,
          }}
        >
          {grape.description}
        </p>

        {/* Visual indicators */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 28,
            padding: "18px 20px",
            background: "var(--wh)",
            border: "1px solid var(--border-c)",
            borderRadius: "var(--r)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.56rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text3)",
                marginBottom: 6,
              }}
            >
              Body
            </div>
            {levelDots(grape.bodyLevel)}
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", marginTop: 3, textTransform: "capitalize" }}>
              {grape.bodyLevel}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.56rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text3)",
                marginBottom: 6,
              }}
            >
              Acidity
            </div>
            {levelDots(grape.acidityLevel)}
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", marginTop: 3, textTransform: "capitalize" }}>
              {grape.acidityLevel}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.56rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text3)",
                marginBottom: 6,
              }}
            >
              Tannin
            </div>
            {levelDots(grape.tanninLevel)}
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", marginTop: 3, textTransform: "capitalize" }}>
              {grape.tanninLevel}
            </div>
          </div>
        </div>

        {/* Flavor profile */}
        <div style={{ marginBottom: 28 }}>
          <h3
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text3)",
              marginBottom: 10,
            }}
          >
            Flavor Profile
          </h3>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {grape.flavorProfile.map((f) => (
              <span
                key={f}
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.6rem",
                  padding: "4px 10px",
                  borderRadius: 100,
                  border: "1px solid var(--border2-c)",
                  color: "var(--text2)",
                  background: "var(--wh)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Where it grows */}
        {regions.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text3)",
                marginBottom: 10,
              }}
            >
              Where It Grows
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {regions.map((r) => (
                <button
                  key={r.id}
                  className="chip"
                  onClick={() => setLocation("/explore")}
                  style={{ borderColor: "var(--wine)", color: "var(--wine)" }}
                  data-testid={`grape-region-${r.id}`}
                >
                  {r.name}, {r.country}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food pairings */}
        <div style={{ marginBottom: 28 }}>
          <h3
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text3)",
              marginBottom: 10,
            }}
          >
            Food Pairings
          </h3>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {grape.foodPairings.map((f) => (
              <span
                key={f}
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.6rem",
                  padding: "4px 10px",
                  borderRadius: 100,
                  border: "1px solid var(--border2-c)",
                  color: "var(--text2)",
                  background: "var(--wh)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div
          style={{
            padding: "18px 22px",
            background: "var(--wine-pale)",
            borderRadius: "var(--r)",
            border: "1px solid rgba(140,28,46,0.12)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.56rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--wine)",
              marginBottom: 6,
            }}
          >
            Fun Fact
          </div>
          <p
            style={{
              fontSize: "0.88rem",
              fontWeight: 300,
              color: "var(--text)",
              lineHeight: 1.7,
            }}
          >
            {grape.funFact}
          </p>
        </div>

        {/* Serving temp */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            background: "var(--wh)",
            border: "1px solid var(--border-c)",
            borderRadius: "var(--r)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
          <div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.56rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text3)",
              }}
            >
              Serving Temperature
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1rem",
                color: "var(--text)",
              }}
            >
              {grape.servingTemp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
