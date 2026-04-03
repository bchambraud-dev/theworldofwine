import { useState } from "react";
import { useLocation } from "wouter";
import { journeys } from "@/data/journeys";
import { useTrack } from "@/hooks/use-track";
import JourneyIcon from "@/components/JourneyIcon";

type CategoryFilter = "all" | "region" | "grape" | "style" | "theme";
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

export default function JourneysBrowse() {
  const [, setLocation] = useLocation();
  const track = useTrack();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");

  const filtered = journeys.filter((j) => {
    if (category !== "all" && j.category !== category) return false;
    if (difficulty !== "all" && j.difficulty !== difficulty) return false;
    return true;
  });

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "region", label: "Region" },
    { value: "grape", label: "Grape" },
    { value: "style", label: "Style" },
    { value: "theme", label: "Theme" },
  ];

  const difficulties: { value: DifficultyFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="page-scroll" data-testid="journeys-browse">
      {/* Header */}
      <div style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.8rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Journeys
        </h1>
        <p
          style={{
            fontSize: "0.88rem",
            fontWeight: 300,
            color: "var(--text2)",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Guided explorations through wine regions, grapes, styles, and ideas.
        </p>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.56rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text3)",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Category
          </span>
          {categories.map((c) => (
            <button
              key={c.value}
              className={`chip ${category === c.value ? "active" : ""}`}
              onClick={() => setCategory(c.value)}
              data-testid={`filter-cat-${c.value}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.56rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text3)",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Difficulty
          </span>
          {difficulties.map((d) => (
            <button
              key={d.value}
              className={`chip ${difficulty === d.value ? "active" : ""}`}
              onClick={() => setDifficulty(d.value)}
              data-testid={`filter-diff-${d.value}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "0 24px 48px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.length === 0 ? (
          <div className="lv-empty" style={{ gridColumn: "1/-1" }}>
            <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg></div>
            <div className="lv-empty-title">No journeys match</div>
            <div className="lv-empty-sub">Try different filters</div>
          </div>
        ) : (
          filtered.map((j) => (
            <div
              key={j.id}
              data-testid={`journey-card-${j.id}`}
              onClick={() => {
                track("journey_card_click", { id: j.id });
                setLocation(`/journey/${j.id}`);
              }}
              style={{
                background: j.coverGradient,
                borderRadius: "var(--r)",
                padding: "22px 20px",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s",
                minHeight: 190,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div>
                <JourneyIcon icon={j.icon} size={28} />
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    color: "white",
                    marginTop: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {j.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 300,
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {j.subtitle}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 14,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.54rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {j.difficulty}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.54rem",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {j.stopCount} stops · {j.estimatedMinutes} min
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
