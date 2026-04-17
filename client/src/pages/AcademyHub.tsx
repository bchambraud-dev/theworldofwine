import { useState } from "react";
import { useLocation } from "wouter";
import { guides } from "@/data/guides";
import { grapes } from "@/data/grapes";
import { quizzes } from "@/data/quizzes";
import { useTrack } from "@/hooks/use-track";
import GuideIcon from "@/components/GuideIcon";

const categoryColors: Record<string, string> = {
  fundamentals: "var(--wine)",
  tasting: "var(--gold)",
  regions: "var(--sage)",
  culture: "var(--plum)",
};

type LevelFilter = "all" | "beginner" | "intermediate" | "expert";

export default function AcademyHub() {
  const [, setLocation] = useLocation();
  const track = useTrack();
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  return (
    <div className="page-scroll" data-testid="academy-hub">
      {/* Hero */}
      <div
        style={{
          padding: "48px 24px 36px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--wh) 0%, var(--bg) 100%)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          Guides
        </h1>
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text3)",
          }}
        >
          Everything you need to know about wine
        </p>
      </div>

      {/* Tool CTAs: Flavour Map + Vintage Guide */}
      <section style={{ padding: "0 24px 24px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={() => setLocation("/guides/flavourmap")}
          data-testid="flavour-map-cta"
          style={{
            width: "100%",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #8C1C2E 0%, #6B1524 100%)",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 400, color: "#F7F4EF", marginBottom: 4 }}>
              Flavour Map
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(247,244,239,0.7)" }}>
              See how 50 wine regions relate by taste &mdash; scatter, compare, and cluster
            </div>
          </div>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "rgba(247,244,239,0.5)", letterSpacing: "0.1em", flexShrink: 0 }}>EXPLORE &rarr;</span>
        </button>
        <button
          onClick={() => setLocation("/guides/vintages")}
          data-testid="vintage-guide-cta"
          style={{
            width: "100%",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #2E6B3A 0%, #1A4D28 100%)",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 400, color: "#F7F4EF", marginBottom: 4 }}>
              Vintage Guide
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(247,244,239,0.7)" }}>
              How each year shaped the wine &mdash; scores, maturity, and commentary for 60 regions
            </div>
          </div>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "rgba(247,244,239,0.5)", letterSpacing: "0.1em", flexShrink: 0 }}>EXPLORE &rarr;</span>
        </button>
        <button
          onClick={() => setLocation("/journeys")}
          data-testid="journeys-cta"
          style={{
            width: "100%",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #5A3E7A 0%, #3D2A56 100%)",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 400, color: "#F7F4EF", marginBottom: 4 }}>
              Wine Journeys
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(247,244,239,0.7)" }}>
              Curated wine journeys through the world's greatest regions
            </div>
          </div>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", color: "rgba(247,244,239,0.5)", letterSpacing: "0.1em", flexShrink: 0 }}>EXPLORE &rarr;</span>
        </button>
      </section>

      {/* Guides */}
      <section style={{ padding: "24px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          Guides
        </h2>

        {/* Level filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {(["all", "beginner", "intermediate", "expert"] as LevelFilter[]).map((level) => {
            const count = level === "all"
              ? guides.length
              : guides.filter((g) => g.level === level).length;
            const isActive = levelFilter === level;
            return (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.58rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "5px 12px",
                  borderRadius: 100,
                  border: `1px solid ${isActive ? "var(--wine)" : "var(--border-c)"}`,
                  background: isActive ? "var(--wine)" : "var(--wh)",
                  color: isActive ? "#fff" : "var(--text3)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {level === "all" ? "ALL" : level.toUpperCase()} ({count})
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: 14,
          }}
        >
          {guides.filter((g) => levelFilter === "all" || g.level === levelFilter).map((g) => (
            <div
              key={g.id}
              data-testid={`guide-card-${g.id}`}
              onClick={() => {
                track("guide_click", { id: g.id });
                setLocation(`/guides/${g.id}`);
              }}
              style={{
                background: "var(--wh)",
                border: "1px solid var(--border-c)",
                borderRadius: "var(--r)",
                padding: "18px 20px",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-md)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <GuideIcon icon={g.icon} size={22} />
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  marginTop: 8,
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                {g.title}
              </h3>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 300,
                  color: "var(--text2)",
                  lineHeight: 1.5,
                  marginBottom: 10,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {g.subtitle}
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.52rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: `${categoryColors[g.category] || "var(--wine)"}15`,
                    color: categoryColors[g.category] || "var(--wine)",
                    border: `1px solid ${categoryColors[g.category] || "var(--wine)"}30`,
                  }}
                >
                  {g.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.52rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: g.level === "expert" ? "rgba(74,26,110,0.08)" : g.level === "intermediate" ? "rgba(184,134,11,0.08)" : "rgba(74,122,82,0.08)",
                    color: g.level === "expert" ? "var(--plum)" : g.level === "intermediate" ? "var(--gold)" : "var(--sage)",
                    border: `1px solid ${g.level === "expert" ? "rgba(74,26,110,0.2)" : g.level === "intermediate" ? "rgba(184,134,11,0.2)" : "rgba(74,122,82,0.2)"}`,
                  }}
                >
                  {g.level}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.52rem",
                    color: "var(--text3)",
                  }}
                >
                  {g.readTimeMinutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grape Varieties */}
      <section style={{ padding: "0 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          The Grapes
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          {grapes.map((grape) => (
            <div
              key={grape.id}
              data-testid={`grape-card-${grape.id}`}
              onClick={() => {
                track("grape_click", { id: grape.id });
                setLocation(`/guides/grapes/${grape.id}`);
              }}
              style={{
                background: "var(--wh)",
                border: "1px solid var(--border-c)",
                borderRadius: "var(--r)",
                padding: "16px 18px",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-sm)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,28,46,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-c)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {grape.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 7px",
                    borderRadius: 100,
                    background: grape.color === "red" ? "var(--wine-pale)" : "var(--gold-pale)",
                    color: grape.color === "red" ? "var(--wine)" : "var(--gold)",
                    border: `1px solid ${grape.color === "red" ? "rgba(140,28,46,0.2)" : "rgba(184,134,11,0.2)"}`,
                  }}
                >
                  {grape.color}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {grape.flavorProfile.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "0.52rem",
                      padding: "2px 6px",
                      borderRadius: 3,
                      border: "1px solid var(--border2-c)",
                      color: "var(--text3)",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Body", value: grape.bodyLevel },
                  { label: "Acidity", value: grape.acidityLevel },
                ].map((attr) => (
                  <div key={attr.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "0.48rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text3)",
                      }}
                    >
                      {attr.label}
                    </span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background:
                              (attr.value === "low" && dot <= 1) ||
                              (attr.value === "medium" && dot <= 2) ||
                              attr.value === "high"
                                ? "var(--wine)"
                                : "var(--border2-c)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quizzes */}
      <section style={{ padding: "0 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Test Your Knowledge
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              data-testid={`quiz-card-${quiz.id}`}
              onClick={() => {
                track("quiz_click", { id: quiz.id });
                setLocation(`/quiz/${quiz.id}`);
              }}
              style={{
                background: "var(--wh)",
                border: "1px solid var(--border-c)",
                borderRadius: "var(--r)",
                padding: "18px 20px",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-md)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: 6 }}><GuideIcon icon="quiz" size={22} /></div>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                {quiz.title}
              </h3>
              <p
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 300,
                  color: "var(--text2)",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {quiz.description}
              </p>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.52rem",
                  color: "var(--text3)",
                }}
              >
                {quiz.questions.length} questions
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
