import { useState } from "react";
import { useLocation } from "wouter";
import { journeys } from "@/data/journeys";
import { wineRegions } from "@/data/regions";
import { guides } from "@/data/guides";
import GuideIcon from "@/components/GuideIcon";
import JourneyIcon from "@/components/JourneyIcon";

// ── Quiz data ──────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  multi: boolean;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "level",
    text: "How much do you know about wine?",
    multi: false,
    options: [
      "Just getting started",
      "I know the basics",
      "I'm fairly knowledgeable",
      "I'm a serious enthusiast",
    ],
  },
  {
    id: "type",
    text: "What do you reach for most?",
    multi: true,
    options: [
      "Bold reds",
      "Elegant reds",
      "Crisp whites",
      "Rich whites",
      "Rosé",
      "Sparkling",
      "Dessert wine",
      "I try everything",
    ],
  },
  {
    id: "flavor",
    text: "What flavors do you love?",
    multi: true,
    options: [
      "Dark fruit & berries",
      "Citrus & tropical",
      "Earthy & mineral",
      "Spice & pepper",
      "Vanilla & oak",
      "Floral & delicate",
    ],
  },
  {
    id: "region",
    text: "Where are you most curious about?",
    multi: true,
    options: [
      "France",
      "Italy",
      "Spain",
      "New World (Americas)",
      "Southern Hemisphere",
      "Eastern Europe & Mediterranean",
      "Asia",
    ],
  },
  {
    id: "goal",
    text: "What's your goal?",
    multi: false,
    options: [
      "Learn the fundamentals",
      "Discover new regions",
      "Find wines to buy",
      "Impress at a dinner party",
      "Explore natural & organic",
      "All of the above",
    ],
  },
];

// ── Recommendation logic ───────────────────────────────────────────────────────

type Answers = Record<string, string[]>;

function getRecommendedJourneyIds(answers: Answers): string[] {
  const level = answers.level?.[0] ?? "";
  const types = answers.type ?? [];
  const goal = answers.goal?.[0] ?? "";

  const result: string[] = [];

  // Level-based
  if (level === "Just getting started" || level === "I know the basics") {
    result.push("six-grapes-that-changed-everything", "old-world-vs-new-world");
  } else {
    result.push("how-terroir-works", "hidden-gems-uncommon-regions");
  }

  // Type-based
  if (types.includes("Bold reds") || types.includes("Elegant reds")) {
    result.push("big-reds-world-tour");
  }
  if (types.includes("Crisp whites") || types.includes("Rich whites")) {
    result.push("white-wine-deep-dive");
  }
  if (types.includes("Sparkling")) {
    result.push("sparkling-around-the-world");
  }
  if (types.includes("I try everything")) {
    result.push("france-in-five-regions", "italy-north-to-south");
  }

  // Goal-based
  if (goal === "Learn the fundamentals") {
    result.push("six-grapes-that-changed-everything", "how-terroir-works");
  }
  if (goal === "Discover new regions") {
    result.push("hidden-gems-uncommon-regions", "france-in-five-regions");
  }
  if (goal === "Explore natural & organic") {
    result.push("natural-wine-movement");
  }
  if (goal === "All of the above") {
    result.push("six-grapes-that-changed-everything", "how-terroir-works", "natural-wine-movement");
  }

  // Deduplicate and take top 3
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const id of result) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }
  return unique.slice(0, 3);
}

function getRecommendedRegionIds(answers: Answers): string[] {
  const regionPref = answers.region ?? [];
  const types = answers.type ?? [];
  const flavors = answers.flavor ?? [];

  const result: string[] = [];

  // Region curiosity
  if (regionPref.includes("France")) result.push("bordeaux", "burgundy", "champagne");
  if (regionPref.includes("Italy")) result.push("tuscany", "piedmont");
  if (regionPref.includes("Spain")) result.push("rioja", "priorat");
  if (regionPref.includes("New World (Americas)")) result.push("napa-valley", "mendoza");
  if (regionPref.includes("Southern Hemisphere")) result.push("barossa-valley", "marlborough");
  if (regionPref.includes("Eastern Europe & Mediterranean")) result.push("kakheti", "santorini");
  if (regionPref.includes("Asia")) result.push("ningxia", "yamanashi");

  // Wine type preferences
  if (types.includes("Bold reds")) result.push("barossa-valley", "napa-valley", "priorat");
  if (types.includes("Elegant reds")) result.push("burgundy", "willamette");
  if (types.includes("Crisp whites")) result.push("mosel", "marlborough", "loire");
  if (types.includes("Rich whites")) result.push("burgundy", "alsace");
  if (types.includes("Sparkling")) result.push("champagne", "english-sparkling");
  if (types.includes("Dessert wine")) result.push("tokaj", "douro");

  // Flavor-based
  if (flavors.includes("Earthy & mineral")) result.push("burgundy", "mosel", "santorini");
  if (flavors.includes("Dark fruit & berries")) result.push("napa-valley", "bordeaux", "barossa-valley");
  if (flavors.includes("Floral & delicate")) result.push("alsace", "mosel");
  if (flavors.includes("Spice & pepper")) result.push("rhone", "barossa-valley");

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const id of result) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }
  return unique.slice(0, 4);
}

function getRecommendedGuideIds(answers: Answers): string[] {
  const goal = answers.goal?.[0] ?? "";
  const level = answers.level?.[0] ?? "";

  const result: string[] = [];

  if (goal === "Learn the fundamentals" || level === "Just getting started") {
    result.push("what-is-terroir", "how-to-taste-wine", "reading-wine-labels");
  }
  if (goal === "Discover new regions") {
    result.push("understanding-wine-styles", "what-is-terroir");
  }
  if (goal === "Find wines to buy") {
    result.push("understanding-wine-scores", "reading-wine-labels");
  }
  if (goal === "Impress at a dinner party") {
    result.push("wine-and-food-pairing", "how-to-taste-wine");
  }
  if (goal === "Explore natural & organic") {
    result.push("natural-organic-biodynamic", "what-is-terroir");
  }
  if (goal === "All of the above") {
    result.push("what-is-terroir", "how-to-taste-wine", "understanding-wine-scores");
  }
  if (result.length === 0) {
    result.push("what-is-terroir", "how-to-taste-wine");
  }

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const id of result) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }
  return unique.slice(0, 3);
}

function getProfileHeadline(answers: Answers): string {
  const level = answers.level?.[0] ?? "";
  const types = answers.type ?? [];
  const goal = answers.goal?.[0] ?? "";

  if (goal === "Explore natural & organic") return "The Mindful Explorer";
  if (level === "I'm a serious enthusiast") return "The Connoisseur";
  if (types.includes("Sparkling") && !types.includes("Bold reds")) return "The Celebrator";
  if (types.includes("Bold reds") && types.includes("Elegant reds")) return "The Red Wine Devotee";
  if (types.includes("Crisp whites") || types.includes("Rich whites")) return "The White Wine Lover";
  if (types.includes("I try everything") || goal === "All of the above") return "The Curious Explorer";
  if (level === "Just getting started") return "The Enthusiastic Beginner";
  if (goal === "Discover new regions") return "The Globe-Trotter";
  return "The Wine Adventurer";
}

function getQuote(answers: Answers): string {
  const type = answers.type?.[0] ?? "";
  const quotes: Record<string, string> = {
    "Bold reds": "Wine is bottled poetry. — Robert Louis Stevenson",
    "Sparkling": "In victory, you deserve Champagne. In defeat, you need it. — Napoleon Bonaparte",
    "Elegant reds": "Wine is the most civilized thing in the world. — Ernest Hemingway",
    "Crisp whites": "Wine makes every meal an occasion, every table more elegant. — André Simon",
    "Rosé": "Wine is sunlight held together by water. — Galileo Galilei",
  };
  return quotes[type] || "Wine is one of the most civilized things in the world — and one of the most natural. — Ernest Hemingway";
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text3)" }}>
          Question {current} of {total}
        </span>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", color: "var(--text3)" }}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 3, background: "var(--border-c)", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${(current / total) * 100}%`,
            background: "var(--wine)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

interface OptionCardProps {
  label: string;
  selected: boolean;
  multi: boolean;
  onClick: () => void;
}

function OptionCard({ label, selected, multi, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 18px",
        border: selected ? "1.5px solid var(--wine)" : "1.5px solid var(--border-c)",
        borderRadius: "var(--r)",
        background: selected ? "var(--wine-pale)" : "var(--wh)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        transition: "all 0.16s",
        color: selected ? "var(--wine)" : "var(--text2)",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,28,46,0.4)";
          (e.currentTarget as HTMLElement).style.background = "var(--wine-pale)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-c)";
          (e.currentTarget as HTMLElement).style.background = "var(--wh)";
        }
      }}
    >
      {multi ? (
        <div
          style={{
            width: 18,
            height: 18,
            border: selected ? "2px solid var(--wine)" : "2px solid var(--border2-c)",
            borderRadius: 4,
            background: selected ? "var(--wine)" : "transparent",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.16s",
          }}
        >
          {selected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      ) : (
        <div
          style={{
            width: 18,
            height: 18,
            border: selected ? "2px solid var(--wine)" : "2px solid var(--border2-c)",
            borderRadius: "50%",
            background: selected ? "var(--wine)" : "transparent",
            flexShrink: 0,
            transition: "all 0.16s",
          }}
        />
      )}
      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem", fontWeight: 400 }}>
        {label}
      </span>
    </button>
  );
}

// ── Results page ───────────────────────────────────────────────────────────────

function ResultsPage({ answers }: { answers: Answers }) {
  const [, setLocation] = useLocation();

  const journeyIds = getRecommendedJourneyIds(answers);
  const regionIds = getRecommendedRegionIds(answers);
  const guideIds = getRecommendedGuideIds(answers);

  const recommendedJourneys = journeyIds
    .map((id) => journeys.find((j) => j.id === id))
    .filter(Boolean) as typeof journeys;

  const recommendedRegions = regionIds
    .map((id) => wineRegions.find((r) => r.id === id))
    .filter(Boolean) as typeof wineRegions;

  const recommendedGuides = guideIds
    .map((id) => guides.find((g) => g.id === id))
    .filter(Boolean) as typeof guides;

  const headline = getProfileHeadline(answers);
  const quote = getQuote(answers);

  return (
    <div style={{ animation: "dq-fadein 0.5s ease" }}>
      {/* Profile headline */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 80 100" fill="none" stroke="var(--wine)" strokeWidth="2.5" aria-hidden="true">
            <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
            <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text3)", marginBottom: 8 }}>
          Your Wine Profile
        </p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 400, color: "var(--wine)", marginBottom: 12 }}>
          {headline}
        </h2>
        <p style={{ fontSize: "0.84rem", color: "var(--text3)", fontStyle: "italic", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
          "{quote}"
        </p>
      </div>

      {/* Journeys */}
      {recommendedJourneys.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--text)", marginBottom: 14 }}>
            Journeys for You
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recommendedJourneys.map((j) => (
              <button
                key={j.id}
                onClick={() => setLocation(`/journey/${j.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: "var(--wh)",
                  border: "1px solid var(--border-c)",
                  borderRadius: "var(--r)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.16s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-sm)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,28,46,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-c)";
                }}
              >
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: j.coverGradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <JourneyIcon icon={j.icon} size={18} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>
                    {j.title}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {j.difficulty} · {j.stopCount} stops · {j.estimatedMinutes} min
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Regions */}
      {recommendedRegions.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--text)", marginBottom: 14 }}>
            Regions to Explore
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {recommendedRegions.map((r) => (
              <button
                key={r.id}
                onClick={() => setLocation("/explore")}
                style={{
                  position: "relative",
                  padding: 0,
                  border: "1px solid var(--border-c)",
                  borderRadius: "var(--r)",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "var(--wh)",
                  transition: "all 0.16s",
                  textAlign: "left",
                  aspectRatio: "4/3",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
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
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div
                  style={{
                    position: "relative",
                    padding: "8px 10px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                  }}
                >
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.82rem", fontWeight: 500, color: "#fff" }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {r.country}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Guides */}
      {recommendedGuides.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--text)", marginBottom: 14 }}>
            Recommended Guides
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recommendedGuides.map((g) => (
              <button
                key={g.id}
                onClick={() => setLocation(`/academy/${g.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: "var(--wh)",
                  border: "1px solid var(--border-c)",
                  borderRadius: "var(--r)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.16s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-sm)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,28,46,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-c)";
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <GuideIcon icon={g.icon} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>
                    {g.title}
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {g.readTimeMinutes} min read
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => setLocation("/explore")}
          style={{
            width: "100%",
            padding: "13px 24px",
            background: "var(--wine)",
            border: "none",
            borderRadius: "var(--r)",
            color: "#fff",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.16s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          Start Exploring the Map
        </button>
        <button
          onClick={() => setLocation("/journeys")}
          style={{
            width: "100%",
            padding: "13px 24px",
            background: "transparent",
            border: "1.5px solid var(--wine)",
            borderRadius: "var(--r)",
            color: "var(--wine)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.16s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--wine)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--wine)";
          }}
        >
          Browse All Journeys
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DiscoverQuiz() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // 0-based index into QUESTIONS
  const [answers, setAnswers] = useState<Answers>({});
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[currentStep];
  const selectedForCurrent = answers[question?.id] ?? [];

  function toggleOption(opt: string) {
    const q = question;
    if (!q) return;
    if (q.multi) {
      const current = answers[q.id] ?? [];
      const next = current.includes(opt)
        ? current.filter((o) => o !== opt)
        : [...current, opt];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      setAnswers({ ...answers, [q.id]: [opt] });
    }
  }

  function goNext() {
    if (currentStep < QUESTIONS.length - 1) {
      setAnimDir("forward");
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setAnimDir("back");
      setCurrentStep(currentStep - 1);
    }
  }

  const canAdvance = selectedForCurrent.length > 0;

  return (
    <div className="page-scroll" data-testid="discover-quiz">
      <style>{`
        @keyframes dq-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dq-step {
          animation: dq-fadein 0.32s ease;
        }
      `}</style>

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "40px 24px 60px",
        }}
      >
        {/* Back to home */}
        <button
          onClick={() => setLocation("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
            padding: "6px 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text3)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        {showResults ? (
          <div className="dq-step">
            <ResultsPage answers={answers} />
          </div>
        ) : (
          <div key={currentStep} className="dq-step">
            <ProgressBar current={currentStep + 1} total={QUESTIONS.length} />

            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              {question.text}
            </h1>

            {question.multi && (
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", color: "var(--text3)", marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Select all that apply
              </p>
            )}
            {!question.multi && (
              <p style={{ height: 0, marginBottom: 24 }} />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {question.options.map((opt) => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={selectedForCurrent.includes(opt)}
                  multi={question.multi}
                  onClick={() => toggleOption(opt)}
                />
              ))}
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  style={{
                    padding: "12px 20px",
                    border: "1.5px solid var(--border-c)",
                    borderRadius: "var(--r)",
                    background: "transparent",
                    color: "var(--text2)",
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all 0.16s",
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={goNext}
                disabled={!canAdvance}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "var(--r)",
                  background: canAdvance ? "var(--wine)" : "var(--border-c)",
                  color: canAdvance ? "#fff" : "var(--text3)",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: canAdvance ? "pointer" : "not-allowed",
                  transition: "all 0.16s",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (canAdvance) (e.currentTarget as HTMLElement).style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
              >
                {currentStep === QUESTIONS.length - 1 ? "See My Profile" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
