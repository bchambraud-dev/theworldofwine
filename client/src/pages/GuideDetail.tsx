import { useRoute, useLocation } from "wouter";
import { guides } from "@/data/guides";
import { journeys } from "@/data/journeys";
import { grapes } from "@/data/grapes";
import { useTrack } from "@/hooks/use-track";

const categoryColors: Record<string, string> = {
  fundamentals: "var(--wine)",
  tasting: "var(--gold)",
  regions: "var(--sage)",
  culture: "var(--plum)",
};

export default function GuideDetail() {
  const [, params] = useRoute("/academy/:guideId");
  const [, setLocation] = useLocation();
  const track = useTrack();

  const guide = guides.find((g) => g.id === params?.guideId);

  if (!guide) {
    return (
      <div className="page-scroll" style={{ padding: 60, textAlign: "center" }}>
        <div className="lv-empty-icon">📖</div>
        <div className="lv-empty-title">Guide not found</div>
        <button className="chip" onClick={() => setLocation("/academy")} style={{ marginTop: 16 }}>
          Back to Academy
        </button>
      </div>
    );
  }

  const relatedJourneys = journeys.filter((j) => guide.relatedJourneyIds.includes(j.id));
  const relatedGrapes = grapes.filter((g) => guide.relatedGrapeIds.includes(g.id));
  const catColor = categoryColors[guide.category] || "var(--wine)";

  track("guide_view", { id: guide.id });

  return (
    <div className="page-scroll" data-testid="guide-detail">
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Back */}
        <button
          onClick={() => setLocation("/academy")}
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
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.54rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "3px 8px",
                borderRadius: 100,
                background: `${catColor}15`,
                color: catColor,
                border: `1px solid ${catColor}30`,
              }}
            >
              {guide.category}
            </span>
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.54rem",
                color: "var(--text3)",
              }}
            >
              {guide.readTimeMinutes} min read
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {guide.title}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 300,
              color: "var(--text2)",
              lineHeight: 1.6,
            }}
          >
            {guide.subtitle}
          </p>
        </div>

        {/* Sections */}
        {guide.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.25rem",
                fontWeight: 500,
                color: "var(--text)",
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              {section.heading}
            </h2>
            {section.content.split("\n\n").map((paragraph, pi) => (
              <p
                key={pi}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--text2)",
                  lineHeight: 1.8,
                  marginBottom: 16,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        {/* Related */}
        {(relatedJourneys.length > 0 || relatedGrapes.length > 0) && (
          <div
            style={{
              borderTop: "1px solid var(--border-c)",
              paddingTop: 28,
              marginTop: 20,
            }}
          >
            {relatedJourneys.length > 0 && (
              <div style={{ marginBottom: 20 }}>
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
                  Related Journeys
                </h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {relatedJourneys.map((j) => (
                    <button
                      key={j.id}
                      className="chip"
                      onClick={() => setLocation(`/journey/${j.id}`)}
                      style={{ borderColor: "var(--wine)", color: "var(--wine)" }}
                    >
                      {j.icon} {j.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {relatedGrapes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
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
                  Related Grapes
                </h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {relatedGrapes.map((g) => (
                    <button
                      key={g.id}
                      className="chip"
                      onClick={() => setLocation(`/academy/grapes/${g.id}`)}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz CTA */}
        {guide.quizId && (
          <div
            style={{
              marginTop: 24,
              padding: "20px 24px",
              background: "var(--wine-pale)",
              borderRadius: "var(--r)",
              border: "1px solid rgba(140,28,46,0.15)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1rem",
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              Think you've got it?
            </p>
            <button
              onClick={() => setLocation(`/quiz/${guide.quizId}`)}
              data-testid="take-quiz-cta"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 24px",
                borderRadius: 100,
                border: "none",
                background: "var(--wine)",
                color: "white",
                cursor: "pointer",
              }}
            >
              Take the Quiz
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
