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
      <style>{`
        /* ── Landing-page scoped styles ── */

        /* Smooth scroll */
        .lp-root {
          scroll-behavior: smooth;
        }

        /* ── HERO ── */
        .lp-hero {
          position: relative;
          min-height: calc(100vh - var(--topbar));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background-image: url('./hero-bg.webp');
          background-size: cover;
          background-position: center top;
        }
        .lp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(20, 8, 12, 0.88) 0%,
            rgba(40, 12, 20, 0.55) 40%,
            rgba(0, 0, 0, 0.18) 100%
          );
          z-index: 1;
        }
        .lp-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          padding: 0 24px;
          max-width: 680px;
        }
        .lp-hero-logo {
          margin-bottom: 22px;
          opacity: 0.92;
        }
        .lp-hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
          margin-bottom: 14px;
        }
        .lp-hero-title-accent {
          color: #e8c9b0;
        }
        .lp-hero-tagline {
          font-family: 'Geist Mono', monospace;
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.52);
          margin-bottom: 52px;
        }
        /* Scroll indicator */
        .lp-scroll-cue {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: default;
          user-select: none;
        }
        .lp-scroll-cue-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          animation: lp-scroll-pulse 2s ease-in-out infinite;
        }
        .lp-scroll-cue-label {
          font-family: 'Geist Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        @keyframes lp-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.12); }
        }

        /* ── EDITORIAL INTRO ── */
        .lp-intro {
          max-width: 680px;
          margin: 0 auto;
          padding: 88px 32px 72px;
          text-align: center;
        }
        .lp-intro-text {
          font-family: 'Jost', sans-serif;
          font-size: clamp(1rem, 1.8vw, 1.08rem);
          font-weight: 300;
          line-height: 1.85;
          color: var(--text2);
          margin-bottom: 52px;
        }
        .lp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin-bottom: 52px;
        }
        .lp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0 16px;
        }
        .lp-stat:not(:last-child) {
          border-right: 1px solid var(--border-c);
        }
        .lp-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 2.8rem;
          font-weight: 300;
          line-height: 1;
          color: var(--wine);
          letter-spacing: -0.02em;
        }
        .lp-stat-label {
          font-family: 'Geist Mono', monospace;
          font-size: 0.52rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text3);
        }
        .lp-divider {
          width: 100%;
          height: 1px;
          background: var(--border-c);
        }

        /* ── JOURNEYS ── */
        .lp-journeys {
          padding: 80px 24px;
          background: linear-gradient(180deg, rgba(247,244,239,0) 0%, rgba(237,234,227,0.55) 100%);
        }
        .lp-section-inner {
          max-width: 1160px;
          margin: 0 auto;
        }
        .lp-section-head {
          margin-bottom: 36px;
        }
        .lp-section-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(1.55rem, 3vw, 2rem);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .lp-section-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: var(--text3);
          line-height: 1.5;
        }
        .lp-journey-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }
        .lp-journey-card {
          border-radius: var(--r);
          padding: 26px 22px;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          min-height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .lp-journey-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp-journey-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--sh-lg);
        }
        .lp-journey-icon {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        .lp-journey-title {
          font-family: 'Fraunces', serif;
          font-size: 1.08rem;
          font-weight: 500;
          color: white;
          line-height: 1.25;
          margin-bottom: 5px;
        }
        .lp-journey-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.78);
          font-weight: 300;
          line-height: 1.45;
        }
        .lp-journey-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 16px;
        }
        .lp-journey-badge {
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 9px;
          border-radius: 100px;
          background: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.95);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .lp-journey-stops {
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          color: rgba(255,255,255,0.62);
          letter-spacing: 0.04em;
        }
        .lp-view-all {
          font-family: 'Geist Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--wine);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .lp-view-all:hover {
          opacity: 0.72;
        }

        /* ── IMAGE INTERLUDE ── */
        .lp-interlude {
          width: 100%;
          height: 220px;
          background-image: url('./editorial-wine.webp');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .lp-interlude-overlay {
          position: absolute;
          inset: 0;
          background: rgba(140, 28, 46, 0.62);
        }
        .lp-interlude-quote {
          position: relative;
          z-index: 2;
          font-family: 'Fraunces', serif;
          font-size: clamp(0.95rem, 2.2vw, 1.22rem);
          font-style: italic;
          font-weight: 300;
          color: rgba(255,255,255,0.93);
          text-align: center;
          max-width: 600px;
          padding: 0 32px;
          line-height: 1.6;
          letter-spacing: 0.01em;
        }

        /* ── REGIONS ── */
        .lp-regions {
          padding: 80px 0;
        }
        .lp-regions-head {
          padding: 0 24px;
          max-width: 1160px;
          margin: 0 auto 36px;
        }
        .lp-regions-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 4px 24px 16px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .lp-regions-scroll::-webkit-scrollbar {
          display: none;
        }
        .lp-region-card {
          flex-shrink: 0;
          width: 260px;
          border-radius: var(--r);
          overflow: hidden;
          background: var(--wh);
          border: 1px solid var(--border-c);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: var(--sh-sm);
        }
        .lp-region-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--sh-md);
        }
        .lp-region-img-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .lp-region-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }
        .lp-region-card:hover .lp-region-img {
          transform: scale(1.04);
        }
        .lp-region-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20,8,12,0.72) 0%, transparent 55%);
        }
        .lp-region-img-name {
          position: absolute;
          bottom: 12px;
          left: 14px;
          font-family: 'Fraunces', serif;
          font-size: 1rem;
          font-weight: 500;
          color: white;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .lp-region-body {
          padding: 11px 14px 13px;
        }
        .lp-region-country {
          font-family: 'Geist Mono', monospace;
          font-size: 0.52rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text3);
        }

        /* ── CELLAR ── */
        .lp-cellar {
          padding: 80px 24px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .lp-guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .lp-guide-card {
          background: var(--wh);
          border: 1px solid var(--border-c);
          border-radius: var(--r);
          padding: 22px 22px 18px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .lp-guide-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: var(--wine);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .lp-guide-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--sh-md);
        }
        .lp-guide-card:hover::before {
          opacity: 1;
        }
        .lp-guide-icon {
          font-size: 1.4rem;
          margin-bottom: 12px;
        }
        .lp-guide-title {
          font-family: 'Fraunces', serif;
          font-size: 0.98rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1.25;
        }
        .lp-guide-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--text2);
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .lp-guide-meta {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .lp-guide-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 0.52rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 9px;
          border-radius: 100px;
          border: 1px solid var(--border2-c);
          color: var(--text3);
        }
        .lp-guide-time {
          font-family: 'Geist Mono', monospace;
          font-size: 0.52rem;
          color: var(--text3);
        }

        /* ── NEWS ── */
        .lp-news {
          border-top: 1px solid var(--border-c);
          padding: 80px 24px 64px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .lp-news-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .lp-news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 16px;
        }

        /* ── FOOTER ── */
        .lp-footer {
          border-top: 3px solid var(--wine);
          background: var(--wh);
          padding: 52px 32px 40px;
        }
        .lp-footer-inner {
          max-width: 1160px;
          margin: 0 auto;
        }
        .lp-footer-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .lp-footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .lp-footer-wordmark {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
        }
        .lp-footer-tagline {
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text3);
        }
        .lp-footer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
        .lp-footer-nav-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .lp-footer-link {
          font-family: 'Geist Mono', monospace;
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .lp-footer-link:hover {
          color: var(--wine);
        }
        .lp-footer-bottom {
          border-top: 1px solid var(--border-c);
          padding-top: 20px;
          text-align: center;
        }
        .lp-footer-copy {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          color: var(--text3);
          letter-spacing: 0.02em;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .lp-stats {
            grid-template-columns: repeat(3, 1fr);
          }
          .lp-stat-num {
            font-size: 2rem;
          }
          .lp-footer-top {
            flex-direction: column;
          }
          .lp-footer-nav {
            align-items: flex-start;
          }
          .lp-footer-nav-row {
            justify-content: flex-start;
          }
          .lp-interlude {
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════
          1. CINEMATIC HERO
      ══════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-overlay" />
        <div className="lp-hero-content">
          {/* The Drop logo */}
          <div className="lp-hero-logo">
            <svg
              viewBox="0 0 80 100"
              style={{ width: 40, height: 50, color: "rgba(255,255,255,0.9)" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-label="The Drop"
            >
              <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
              <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
              <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
            </svg>
          </div>

          <h1 className="lp-hero-title">
            The World of <span className="lp-hero-title-accent">Wine</span>
          </h1>

          <p className="lp-hero-tagline">Your Journey Through Wine</p>

          {/* Scroll cue */}
          <div className="lp-scroll-cue">
            <div className="lp-scroll-cue-line" />
            <span className="lp-scroll-cue-label">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. EDITORIAL INTRO
      ══════════════════════════════════════ */}
      <section className="lp-intro">
        <p className="lp-intro-text">
          Wine is one of the oldest stories on earth — eight thousand years of soil, sun, and human
          obsession, distilled into something you can hold in a glass. We built this to help you
          explore that story. Fifty regions. Seventy-two producers. Ten guided journeys. No
          pretension, no gatekeeping — just the good stuff.
        </p>

        <div className="lp-stats">
          <div className="lp-stat">
            <span className="lp-stat-num">50</span>
            <span className="lp-stat-label">Regions</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat-num">72</span>
            <span className="lp-stat-label">Producers</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat-num">10</span>
            <span className="lp-stat-label">Journeys</span>
          </div>
        </div>

        <div className="lp-divider" />
      </section>

      {/* ══════════════════════════════════════
          3. FEATURED JOURNEYS
      ══════════════════════════════════════ */}
      <section className="lp-journeys">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2 className="lp-section-title">Begin Your Journey</h2>
            <p className="lp-section-sub">Curated paths through the world of wine</p>
          </div>

          <div className="lp-journey-grid">
            {featuredJourneys.map((j) => (
              <div
                key={j.id}
                className="lp-journey-card"
                data-testid={`journey-card-${j.id}`}
                style={{ background: j.coverGradient }}
                onClick={() => {
                  track("journey_card_click", { id: j.id });
                  setLocation(`/journey/${j.id}`);
                }}
              >
                <div>
                  <div className="lp-journey-icon">{j.icon}</div>
                  <div className="lp-journey-title">{j.title}</div>
                  <div className="lp-journey-subtitle">{j.subtitle}</div>
                </div>
                <div className="lp-journey-meta">
                  <span className="lp-journey-badge">{j.difficulty}</span>
                  <span className="lp-journey-stops">
                    {j.stopCount} stops · {j.estimatedMinutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="lp-view-all"
            onClick={() => {
              track("cta_view_all_journeys");
              setLocation("/journeys");
            }}
          >
            View all journeys →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. IMAGE INTERLUDE
      ══════════════════════════════════════ */}
      <div className="lp-interlude">
        <div className="lp-interlude-overlay" />
        <blockquote className="lp-interlude-quote">
          "The first duty of wine is to be red. The second is to be a Burgundy."
        </blockquote>
      </div>

      {/* ══════════════════════════════════════
          5. EXPLORE BY REGION
      ══════════════════════════════════════ */}
      <section className="lp-regions">
        <div className="lp-regions-head">
          <h2 className="lp-section-title">Explore the Map</h2>
          <p className="lp-section-sub">
            From Bordeaux to Barossa, Champagne to Cappadocia
          </p>
        </div>

        <div className="lp-regions-scroll">
          {featuredRegions.map((r) => (
            <div
              key={r.id}
              className="lp-region-card"
              data-testid={`region-card-${r.id}`}
              onClick={() => {
                track("region_card_click", { id: r.id });
                setLocation("/explore");
              }}
            >
              <div className="lp-region-img-wrap">
                {r.image ? (
                  <img src={r.image} alt={r.name} className="lp-region-img" />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, var(--wine-pale), var(--gold-pale))",
                    }}
                  />
                )}
                <div className="lp-region-img-overlay" />
                <div className="lp-region-img-name">{r.name}</div>
              </div>
              <div className="lp-region-body">
                <div className="lp-region-country">{r.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. THE CELLAR (was Academy Picks)
      ══════════════════════════════════════ */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border-c)", borderBottom: "1px solid var(--border-c)" }}>
        <section className="lp-cellar">
          <div className="lp-section-head">
            <h2 className="lp-section-title">The Cellar</h2>
            <p className="lp-section-sub">Where wine knowledge ages to perfection</p>
          </div>

          <div className="lp-guide-grid">
            {featuredGuides.map((g) => (
              <div
                key={g.id}
                className="lp-guide-card"
                data-testid={`guide-card-${g.id}`}
                onClick={() => {
                  track("guide_card_click", { id: g.id });
                  setLocation(`/academy/${g.id}`);
                }}
              >
                <div className="lp-guide-icon">{g.icon}</div>
                <div className="lp-guide-title">{g.title}</div>
                <p className="lp-guide-sub">{g.subtitle}</p>
                <div className="lp-guide-meta">
                  <span className="lp-guide-tag">{g.category}</span>
                  <span className="lp-guide-time">{g.readTimeMinutes} min read</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="lp-view-all"
            onClick={() => {
              track("cta_enter_cellar");
              setLocation("/academy");
            }}
          >
            Enter The Cellar →
          </button>
        </section>
      </div>

      {/* ══════════════════════════════════════
          7. LATEST NEWS
      ══════════════════════════════════════ */}
      <section className="lp-news">
        <div className="lp-news-head">
          <div>
            <h2 className="lp-section-title">Latest News</h2>
            <p className="lp-section-sub">Stories from the wine world</p>
          </div>
          <button
            onClick={() => setLocation("/news")}
            className="lp-view-all"
            data-testid="view-all-news"
          >
            View all →
          </button>
        </div>

        <div className="lp-news-grid">
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

      {/* ══════════════════════════════════════
          8. FOOTER
      ══════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            {/* Brand */}
            <div>
              <div className="lp-footer-brand">
                <svg
                  viewBox="0 0 80 100"
                  style={{ width: 22, height: 28, color: "var(--wine)", flexShrink: 0 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-label="The Drop"
                >
                  <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
                  <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
                  <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
                </svg>
                <div className="lp-footer-wordmark">
                  <span style={{ color: "var(--text)" }}>The World of </span>
                  <span style={{ color: "var(--wine)" }}>Wine</span>
                </div>
              </div>
              <div className="lp-footer-tagline">Your Journey Through Wine</div>
            </div>

            {/* Nav links — 2 rows */}
            <nav className="lp-footer-nav">
              <div className="lp-footer-nav-row">
                {[
                  { label: "Map", href: "/explore" },
                  { label: "Journeys", href: "/journeys" },
                  { label: "The Cellar", href: "/academy" },
                ].map((link) => (
                  <button
                    key={link.href}
                    className="lp-footer-link"
                    onClick={() => setLocation(link.href)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="lp-footer-nav-row">
                {[
                  { label: "List View", href: "/explore/list" },
                  { label: "News", href: "/news" },
                ].map((link) => (
                  <button
                    key={link.href}
                    className="lp-footer-link"
                    onClick={() => setLocation(link.href)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">
              Crafted for curious drinkers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
