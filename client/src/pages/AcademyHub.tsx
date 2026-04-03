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

export default function AcademyHub() {
  const [, setLocation] = useLocation();
  const track = useTrack();

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
          The Cellar
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
          Where wine knowledge ages to perfection
        </p>
      </div>

      {/* Guides */}
      <section style={{ padding: "24px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Guides
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: 14,
          }}
        >
          {guides.map((g) => (
            <div
              key={g.id}
              data-testid={`guide-card-${g.id}`}
              onClick={() => {
                track("guide_click", { id: g.id });
                setLocation(`/academy/${g.id}`);
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
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                    color: "var(--text3)",
                  }}
                >
                  {g.readTimeMinutes} min read
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
                setLocation(`/academy/grapes/${grape.id}`);
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
