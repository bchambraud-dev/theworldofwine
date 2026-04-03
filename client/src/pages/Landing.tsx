import { useLocation } from "wouter";
import { journeys } from "@/data/journeys";
import { wineRegions } from "@/data/regions";
import { guides } from "@/data/guides";
import { newsItems } from "@/data/news";
import { useTrack } from "@/hooks/use-track";

const featuredJourneys = journeys.slice(0, 4);
const featuredRegions = wineRegions.filter((r) =>
  ["bordeaux", "burgundy", "tuscany", "napa-valley", "barossa-valley", "champagne", "rioja", "mosel"].includes(r.id)
);
const featuredGuides = guides.slice(0, 3);
const latestNews = newsItems.slice(0, 3);

const difficultyColors: Record<string, string> = {
  beginner: "var(--sage)",
  intermediate: "var(--gold)",
  advanced: "var(--wine)",
};

export default function Landing() {
  const [, setLocation] = useLocation();
  const track = useTrack();

  return (
    <div className="page-scroll" data-testid="landing-page">
      {/* ── HERO ── */}
      <section
        style={{
          padding: "80px 24px 60px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--wh) 0%, var(--bg) 100%)",
        }}
      >
        <svg
          viewBox="0 0 80 100"
          style={{ width: 48, height: 60, color: "var(--wine)", margin: "0 auto 16px" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-label="The Drop"
        >
          <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
          <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
          <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
          <path d="M40 46 C40 46, 30 56, 30 64" strokeWidth="1" opacity="0.25" />
          <path d="M40 46 C40 46, 50 56, 50 64" strokeWidth="1" opacity="0.25" />
        </svg>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2.4rem",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          <span style={{ color: 'var(--text)' }}>The World of </span><span style={{ color: 'var(--wine)' }}>Wine</span>
        </h1>
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text3)",
            marginBottom: 20,
          }}
        >
          Your Journey Through Wine
        </p>
        <p
          style={{
            maxWidth: 520,
            margin: "0 auto 28px",
            fontSize: "0.95rem",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "var(--text2)",
          }}
        >
          Fifty wine regions, seventy-two producers, and centuries of stories — explored through
          guided journeys, interactive maps, and an academy built for curious drinkers.
        </p>
        <button
          onClick={() => {
            track("cta_start_exploring");
            setLocation("/explore");
          }}
          data-testid="cta-start-exploring"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 32px",
            borderRadius: 100,
            border: "none",
            background: "var(--wine)",
            color: "white",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "var(--wine-l)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "var(--wine)";
          }}
        >
          Start Exploring
        </button>
      </section>

      {/* ── FEATURED JOURNEYS ── */}
      <section style={{ padding: "48px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Featured Journeys
          </h2>
          <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--text3)" }}>
            Guided explorations through the world of wine
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {featuredJourneys.map((j) => (
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
                minHeight: 170,
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
                <span style={{ fontSize: "1.4rem" }}>{j.icon}</span>
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
              <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
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
          ))}
        </div>
      </section>

      {/* ── EXPLORE BY REGION ── */}
      <section style={{ padding: "24px 0 48px" }}>
        <div style={{ padding: "0 24px", maxWidth: 1200, margin: "0 auto", marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Explore by Region
          </h2>
          <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--text3)" }}>
            Discover wine regions across the globe
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 8,
            scrollbarWidth: "none",
          }}
        >
          {featuredRegions.map((r) => (
            <div
              key={r.id}
              data-testid={`region-card-${r.id}`}
              onClick={() => {
                track("region_card_click", { id: r.id });
                setLocation("/explore");
              }}
              style={{
                flexShrink: 0,
                width: 220,
                borderRadius: "var(--r)",
                overflow: "hidden",
                background: "var(--wh)",
                border: "1px solid var(--border-c)",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                />
              )}
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.56rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text3)",
                    marginTop: 2,
                  }}
                >
                  {r.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACADEMY PICKS ── */}
      <section style={{ padding: "24px 24px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Learn the Fundamentals
          </h2>
          <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--text3)" }}>
            Academy guides for every level
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {featuredGuides.map((g) => (
            <div
              key={g.id}
              data-testid={`guide-card-${g.id}`}
              onClick={() => {
                track("guide_card_click", { id: g.id });
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
              <span style={{ fontSize: "1.3rem" }}>{g.icon}</span>
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
                }}
              >
                {g.subtitle}
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.54rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 100,
                    border: "1px solid var(--border2-c)",
                    color: "var(--text3)",
                  }}
                >
                  {g.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.54rem",
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

      {/* ── LATEST NEWS ── */}
      <section style={{ padding: "24px 24px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              Latest News
            </h2>
            <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--text3)" }}>
              Stories from the wine world
            </p>
          </div>
          <button
            onClick={() => setLocation("/news")}
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--wine)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            data-testid="view-all-news"
          >
            View all →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {latestNews.map((n) => (
            <div
              key={n.id}
              className="news-card"
              data-testid={`landing-news-${n.id}`}
            >
              <div className="nc-accent" style={{ background: "var(--wine)" }} />
              <div className="nc-body">
                <div className="nc-cat">{n.tags[0] || "Wine"}</div>
                <div className="nc-title">{n.title}</div>
                <div
                  className="nc-summary"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {n.summary}
                </div>
                <div className="nc-footer">
                  <span className="nc-source">{n.source}</span>
                  <span className="nc-date">
                    {new Date(n.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-c)",
          padding: "36px 24px",
          textAlign: "center",
          background: "var(--wh)",
        }}
      >
        <p
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "0.92rem",
            color: "var(--text2)",
            marginBottom: 14,
          }}
        >
          The World of Wine — Your Journey Through Wine
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Map", href: "/explore" },
            { label: "Journeys", href: "/journeys" },
            { label: "The Cellar", href: "/academy" },
            { label: "List", href: "/explore/list" },
            { label: "News", href: "/news" },
          ].map((link) => (
            <button
              key={link.href}
              onClick={() => setLocation(link.href)}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "var(--wine)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--text3)";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
