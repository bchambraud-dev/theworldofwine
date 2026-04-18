import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useTrack } from "@/hooks/use-track";
import { useSEO, useStructuredData } from "@/lib/useSEO";

export default function Landing() {
  const [, setLocation] = useLocation();
  const track = useTrack();
  const { user } = useAuth();

  useSEO({
    title: "The World of Wine",
    description: "Your pocket sommelier, personal cellar, and wine education platform. Explore 280+ producers across 24 countries, guided tasting mode, vintage charts, and more.",
    path: "/",
  });
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The World of Wine",
    url: "https://theworldofwine.org",
    description: "An interactive wine exploration platform with a personal sommelier, cellar tracking, tasting mode, and vintage guides.",
    potentialAction: { "@type": "SearchAction", target: "https://theworldofwine.org/explore?q={search_term_string}", "query-input": "required name=search_term_string" },
  });

  return (
    <div className="page-scroll" data-testid="landing-page">
      <style>{`
        .lp-root { scroll-behavior: smooth; }

        /* ── HERO ── */
        .lp-hero {
          position: relative;
          min-height: calc(100vh - var(--topbar));
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; overflow: hidden;
          background-image: url('/hero-bg.webp'); background-size: cover; background-position: center top;
        }
        .lp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(20,8,12,0.88) 0%, rgba(40,12,20,0.55) 40%, rgba(0,0,0,0.18) 100%);
          z-index: 1;
        }
        .lp-hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 0;
          padding: 0 24px; max-width: 680px;
        }
        .lp-hero-logo { margin-bottom: 22px; opacity: 0.92; }
        .lp-hero-title {
          font-family: 'Fraunces', serif; font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 300; line-height: 1.05; letter-spacing: -0.01em;
          color: rgba(255,255,255,0.96); margin-bottom: 14px;
        }
        .lp-hero-title-accent { color: #e8c9b0; }
        .lp-hero-tagline {
          font-family: 'Geist Mono', monospace; font-size: 0.58rem;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.52); margin-bottom: 52px;
          max-width: 440px; line-height: 1.6;
        }
        .lp-scroll-cue { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: default; user-select: none; }
        .lp-scroll-cue-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          animation: lp-scroll-pulse 2s ease-in-out infinite;
        }
        .lp-scroll-cue-label { font-family: 'Geist Mono', monospace; font-size: 0.5rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
        @keyframes lp-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.12); }
        }

        /* ── STATS BAR ── */
        .lp-stats-bar {
          background: #8C1C2E; padding: 18px 24px;
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap;
        }
        .lp-stats-bar-item {
          font-family: 'Geist Mono', monospace; font-size: 0.64rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.92);
          white-space: nowrap;
        }
        .lp-stats-bar-sep {
          width: 1px; height: 14px; background: rgba(255,255,255,0.25); flex-shrink: 0;
        }

        /* ── SHARED ── */
        .lp-section { padding: 88px 24px; max-width: 1100px; margin: 0 auto; }
        .lp-section-cream { background: #F7F4EF; }
        .lp-section-white { background: #FFFFFF; }
        .lp-section-title {
          font-family: 'Fraunces', serif; font-size: clamp(1.55rem, 3vw, 2.1rem);
          font-weight: 400; color: #1A1410; margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .lp-section-sub {
          font-family: 'Jost', sans-serif; font-size: 0.92rem; font-weight: 300;
          color: #5A5248; line-height: 1.55; margin-bottom: 32px;
        }
        .lp-section-desc {
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          color: #5A5248; line-height: 1.7; margin-bottom: 28px; max-width: 540px;
        }
        .lp-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 8px; border: none;
          background: #8C1C2E; color: #F7F4EF;
          font-family: 'Geist Mono', monospace; font-size: 0.7rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer; transition: opacity 0.18s, transform 0.18s;
        }
        .lp-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── MEET SOMMY ── */
        .lp-sommy-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }
        .lp-sommy-features { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 16px; }
        .lp-sommy-feature {
          display: flex; gap: 12px; align-items: flex-start;
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          color: #1A1410; line-height: 1.55;
        }
        .lp-sommy-icon {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: rgba(140,28,46,0.08); display: flex; align-items: center; justify-content: center;
        }
        .lp-wine-card-mock {
          background: #FFFFFF; border: 1px solid #EDEAE3; border-radius: 12px;
          padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .lp-mock-label {
          font-family: 'Geist Mono', monospace; font-size: 0.56rem; text-transform: uppercase;
          letter-spacing: 0.12em; color: #5A5248; margin-bottom: 4px;
        }
        .lp-mock-name {
          font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 500;
          color: #1A1410; margin-bottom: 2px;
        }
        .lp-mock-region {
          font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 300;
          color: #5A5248; margin-bottom: 16px;
        }
        .lp-mock-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .lp-mock-pill {
          font-family: 'Geist Mono', monospace; font-size: 0.54rem; letter-spacing: 0.04em;
          padding: 4px 10px; border-radius: 100px; border: 1px solid #EDEAE3; color: #5A5248;
        }
        .lp-mock-notes {
          font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 300;
          color: #5A5248; line-height: 1.6; border-top: 1px solid #EDEAE3; padding-top: 12px;
        }

        /* ── TASTING MODE ── */
        .lp-tasting-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }
        .lp-steps { display: flex; gap: 0; align-items: center; margin-bottom: 28px; }
        .lp-step-pill {
          font-family: 'Geist Mono', monospace; font-size: 0.58rem; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 6px 14px; border-radius: 100px;
          background: rgba(140,28,46,0.06); color: #8C1C2E; white-space: nowrap;
        }
        .lp-step-arrow {
          font-family: 'Geist Mono', monospace; font-size: 0.7rem; color: #EDEAE3;
          padding: 0 6px;
        }
        .lp-tasting-visual {
          background: #F7F4EF; border-radius: 12px; padding: 32px;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .lp-tasting-circle {
          width: 120px; height: 120px; border-radius: 50%;
          border: 2px solid #8C1C2E; display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .lp-tasting-ring {
          position: absolute; inset: -8px; border-radius: 50%;
          border: 1px solid rgba(140,28,46,0.15);
        }
        .lp-tasting-label {
          font-family: 'Geist Mono', monospace; font-size: 0.56rem; text-transform: uppercase;
          letter-spacing: 0.14em; color: #5A5248;
        }

        /* ── CELLAR ── */
        .lp-cellar-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .lp-cellar-features { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 14px; }
        .lp-cellar-feature {
          display: flex; gap: 12px; align-items: flex-start;
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          color: #1A1410; line-height: 1.55;
        }
        .lp-cellar-mock {
          background: #FFFFFF; border: 1px solid #EDEAE3; border-radius: 12px;
          padding: 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .lp-cellar-mock-header {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          background: #FAFAF7; border-bottom: 1px solid #EDEAE3; padding: 0;
        }
        .lp-cellar-mock-th {
          font-family: 'Geist Mono', monospace; font-size: 0.46rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em; color: #5A5248;
          padding: 10px 12px; white-space: nowrap;
        }
        .lp-cellar-mock-row {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          border-bottom: 1px solid #F2EFE9;
        }
        .lp-cellar-mock-row:last-child { border-bottom: none; }
        .lp-cellar-mock-td {
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 300;
          color: #1A1410; padding: 10px 12px; display: flex; align-items: center;
        }
        .lp-cellar-mock-name { font-weight: 400; }
        .lp-cellar-mock-mono {
          font-family: 'Geist Mono', monospace; font-size: 0.6rem; font-weight: 500;
        }
        .lp-cellar-readiness {
          display: inline-block; padding: 2px 8px; border-radius: 100px;
          font-family: 'Geist Mono', monospace; font-size: 0.5rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em;
        }

        /* ── MAP ── */
        .lp-map-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .lp-map-desc {
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          color: #5A5248; line-height: 1.7; margin-bottom: 28px; max-width: 600px;
        }
        .lp-map-mock {
          background: #1A1410; border-radius: 12px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12); position: relative;
          padding: 24px; min-height: 280px;
        }
        .lp-map-dot {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: #8C1C2E; box-shadow: 0 0 8px rgba(140,28,46,0.5);
        }
        .lp-map-dot::after {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid rgba(140,28,46,0.3);
        }
        .lp-map-label {
          font-family: 'Geist Mono', monospace; font-size: 0.48rem; font-weight: 500;
          color: rgba(247,244,239,0.5); text-transform: uppercase; letter-spacing: 0.08em;
          position: absolute;
        }
        .lp-map-region-line {
          position: absolute; height: 1px; background: rgba(247,244,239,0.08);
        }

        /* ── VINTAGE ── */
        .lp-vintage-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: center; }
        .lp-vintage-grid {
          display: grid; grid-template-columns: auto repeat(5, 1fr); gap: 4px;
          margin-bottom: 0; font-family: 'Geist Mono', monospace; width: 100%;
        }
        .lp-vintage-header {
          font-size: 0.56rem; text-transform: uppercase; letter-spacing: 0.06em;
          color: #5A5248; text-align: center; padding: 6px 0;
        }
        .lp-vintage-region {
          font-size: 0.62rem; color: #1A1410; padding: 8px 14px 8px 0;
          text-align: right; white-space: nowrap;
        }
        .lp-vintage-cell {
          height: 34px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.62rem; font-weight: 500; color: #fff;
        }

        @media (max-width: 768px) {
          .lp-cellar-layout, .lp-map-layout, .lp-vintage-layout { grid-template-columns: 1fr; }
          .lp-cellar-mock, .lp-map-mock { margin-top: 24px; }
        }

        /* ── LEARN ── */
        .lp-learn-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;
        }
        .lp-learn-card {
          background: #F7F4EF; border: 1px solid #EDEAE3; border-radius: 10px;
          padding: 24px 20px; text-align: center;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .lp-learn-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
        .lp-learn-num {
          font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 300;
          color: #8C1C2E; line-height: 1; margin-bottom: 4px;
        }
        .lp-learn-label {
          font-family: 'Geist Mono', monospace; font-size: 0.56rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: #5A5248; margin-bottom: 8px;
        }
        .lp-learn-desc {
          font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 300;
          color: #5A5248; line-height: 1.5;
        }

        /* ── FINAL CTA ── */
        .lp-final-cta {
          background: #8C1C2E; padding: 88px 24px; text-align: center;
        }
        .lp-final-title {
          font-family: 'Fraunces', serif; font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 400; color: #fff; margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .lp-final-sub {
          font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 300;
          color: rgba(247,244,239,0.8); margin-bottom: 28px;
        }
        .lp-final-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 36px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.3);
          background: #fff; color: #8C1C2E;
          font-family: 'Geist Mono', monospace; font-size: 0.74rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer; transition: opacity 0.18s, transform 0.18s;
        }
        .lp-final-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .lp-final-note {
          font-family: 'Geist Mono', monospace; font-size: 0.54rem;
          color: rgba(255,255,255,0.45); letter-spacing: 0.08em;
          margin-top: 14px; text-transform: uppercase;
        }

        /* ── FOOTER ── */
        .lp-footer {
          border-top: 3px solid #8C1C2E; background: #FFFFFF; padding: 52px 32px 40px;
        }
        .lp-footer-inner { max-width: 960px; margin: 0 auto; }
        .lp-footer-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 32px; margin-bottom: 40px; flex-wrap: wrap;
        }
        .lp-footer-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .lp-footer-wordmark {
          font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 400;
          line-height: 1.15; color: #1A1410;
        }
        .lp-footer-tagline {
          font-family: 'Geist Mono', monospace; font-size: 0.54rem;
          text-transform: uppercase; letter-spacing: 0.16em; color: #5A5248;
        }
        .lp-footer-nav { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
        .lp-footer-link {
          font-family: 'Geist Mono', monospace; font-size: 0.58rem;
          text-transform: uppercase; letter-spacing: 0.1em; color: #5A5248;
          background: none; border: none; cursor: pointer; padding: 0;
          transition: color 0.15s;
        }
        .lp-footer-link:hover { color: #8C1C2E; }
        .lp-footer-bottom {
          border-top: 1px solid #EDEAE3; padding-top: 20px;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .lp-footer-copy {
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 300;
          color: #5A5248; letter-spacing: 0.02em;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 720px) {
          .lp-sommy-layout,
          .lp-tasting-layout { grid-template-columns: 1fr; }
          .lp-tasting-layout > :first-child { order: 2; }
          .lp-tasting-layout > :last-child { order: 1; }
          .lp-learn-grid { grid-template-columns: 1fr; }
          .lp-steps { flex-wrap: wrap; gap: 4px; }
          .lp-footer-top { flex-direction: column; }
          .lp-footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          1. CINEMATIC HERO (UNTOUCHED)
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

          <p className="lp-hero-tagline">Your pocket sommelier, personal cellar, and wine passport — in one place.</p>

          {/* Scroll cue */}
          <div className="lp-scroll-cue">
            <div className="lp-scroll-cue-line" />
            <span className="lp-scroll-cue-label">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════ */}
      <div className="lp-stats-bar">
        <span className="lp-stats-bar-item">280+ Producers</span>
        <div className="lp-stats-bar-sep" />
        <span className="lp-stats-bar-item">59 Regions</span>
        <div className="lp-stats-bar-sep" />
        <span className="lp-stats-bar-item">24 Countries</span>
        <div className="lp-stats-bar-sep" />
        <span className="lp-stats-bar-item">60 Vintage Charts</span>
      </div>

      {/* ══════════════════════════════════════
          3. MEET SOMMY
      ══════════════════════════════════════ */}
      <div className="lp-section-cream">
        <div className="lp-section">
          <div className="lp-sommy-layout">
            <div>
              <h2 className="lp-section-title">Meet Sommy</h2>
              <p className="lp-section-sub">Your personal wine companion who learns your taste</p>
              <ul className="lp-sommy-features">
                <li className="lp-sommy-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                  <span>Scan any label and know what you're drinking in seconds</span>
                </li>
                <li className="lp-sommy-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                  </div>
                  <span>Get nose, palate, and texture breakdowns with breathing guidance</span>
                </li>
                <li className="lp-sommy-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <span>Sommy remembers your preferences and gets smarter over time</span>
                </li>
              </ul>
              <button className="lp-cta" onClick={() => { track("cta_ask_sommy"); setLocation("/explore"); }}>
                Ask Sommy
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Stylised wine card mockup */}
            <div className="lp-wine-card-mock">
              <div className="lp-mock-label">Sommy's analysis</div>
              <div className="lp-mock-name">Domaine de la Romanee-Conti</div>
              <div className="lp-mock-region">Burgundy, France — 2019</div>
              <div className="lp-mock-pills">
                <span className="lp-mock-pill">Cherry</span>
                <span className="lp-mock-pill">Rose petal</span>
                <span className="lp-mock-pill">Earth</span>
                <span className="lp-mock-pill">Silk</span>
                <span className="lp-mock-pill">Spice</span>
              </div>
              <div className="lp-mock-notes">
                Ethereal Pinot Noir with layers of red fruit, dried flowers, and a mineral backbone that lingers for minutes. Decant 2 hours before serving at 16-18C.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          4. TASTING MODE
      ══════════════════════════════════════ */}
      <div className="lp-section-white">
        <div className="lp-section">
          <div className="lp-tasting-layout">
            {/* Visual */}
            <div className="lp-tasting-visual">
              <div className="lp-tasting-circle">
                <div className="lp-tasting-ring" />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 22h8"/><path d="M12 11v11"/><path d="M5 3l1 7c0 2.8 2.7 5 6 5s6-2.2 6-5l1-7"/>
                </svg>
              </div>
              <div className="lp-tasting-label">Guided tasting experience</div>
            </div>

            {/* Text */}
            <div>
              <h2 className="lp-section-title">Taste Along with Sommy</h2>
              <p className="lp-section-sub">A guided companion for wine tastings</p>
              <p className="lp-section-desc">
                Take a photo of the label. Follow the steps: Look, Smell, Taste, Reflect.
                Then see how your notes compare to Sommy's — not as a test, but as a conversation
                about what you experienced.
              </p>
              <div className="lp-steps">
                <span className="lp-step-pill">Look</span>
                <span className="lp-step-arrow">&rarr;</span>
                <span className="lp-step-pill">Smell</span>
                <span className="lp-step-arrow">&rarr;</span>
                <span className="lp-step-pill">Taste</span>
                <span className="lp-step-arrow">&rarr;</span>
                <span className="lp-step-pill">Compare</span>
              </div>
              <button className="lp-cta" onClick={() => { track("cta_tasting_mode"); setLocation("/journey/journal?log=1"); }}>
                Try Tasting Mode
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          5. YOUR CELLAR
      ══════════════════════════════════════ */}
      <div className="lp-section-cream">
        <div className="lp-section">
          <div className="lp-cellar-layout">
            <div>
              <h2 className="lp-section-title">Track Your Collection</h2>
              <p className="lp-section-sub">Every bottle, every vintage, every drinking window</p>
              <ul className="lp-cellar-features">
                <li className="lp-cellar-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </div>
                  <span>Know when each wine hits its peak with visual drinking timelines</span>
                </li>
                <li className="lp-cellar-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <span>Track your collection's estimated market value</span>
                </li>
                <li className="lp-cellar-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </div>
                  <span>Log what you bought, where, and what you paid</span>
                </li>
                <li className="lp-cellar-feature">
                  <div className="lp-sommy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span>When you open a bottle, Sommy helps you log the experience</span>
                </li>
              </ul>
              <button className="lp-cta" onClick={() => { track("cta_cellar"); setLocation("/journey/cellar"); }}>
                Start Your Cellar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            {/* Cellar table mockup */}
            <div className="lp-cellar-mock">
              <div className="lp-cellar-mock-header">
                <div className="lp-cellar-mock-th">Wine</div>
                <div className="lp-cellar-mock-th">Paid</div>
                <div className="lp-cellar-mock-th">Value</div>
                <div className="lp-cellar-mock-th">Window</div>
                <div className="lp-cellar-mock-th">Status</div>
              </div>
              {[
                { name: "Penfolds Grange 2018", region: "Barossa Valley", paid: "$380", value: "$520", window: "2026-2040", status: "Ready", color: "#4A7A52", bg: "rgba(74,122,82,0.1)" },
                { name: "Opus One 2019", region: "Napa Valley", paid: "$420", value: "$480", window: "2027-2042", status: "Hold", color: "#B8963E", bg: "rgba(184,150,62,0.1)" },
                { name: "Dom Perignon 2012", region: "Champagne", paid: "$290", value: "$340", window: "2024-2035", status: "Ready", color: "#4A7A52", bg: "rgba(74,122,82,0.1)" },
                { name: "Sassicaia 2018", region: "Bolgheri", paid: "$260", value: "$310", window: "2028-2045", status: "Hold", color: "#B8963E", bg: "rgba(184,150,62,0.1)" },
                { name: "Cloudy Bay SB 2023", region: "Marlborough", paid: "$28", value: "$28", window: "Now", status: "Drink", color: "#8C1C2E", bg: "rgba(140,28,46,0.08)" },
              ].map((w, i) => (
                <div key={i} className="lp-cellar-mock-row">
                  <div className="lp-cellar-mock-td" style={{ flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                    <span className="lp-cellar-mock-name">{w.name}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", fontWeight: 300, color: "#5A5248" }}>{w.region}</span>
                  </div>
                  <div className="lp-cellar-mock-td lp-cellar-mock-mono">{w.paid}</div>
                  <div className="lp-cellar-mock-td lp-cellar-mock-mono" style={{ color: "#4A7A52" }}>{w.value}</div>
                  <div className="lp-cellar-mock-td lp-cellar-mock-mono">{w.window}</div>
                  <div className="lp-cellar-mock-td">
                    <span className="lp-cellar-readiness" style={{ background: w.bg, color: w.color }}>{w.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          6. EXPLORE THE MAP
      ══════════════════════════════════════ */}
      <div className="lp-section-white">
        <div className="lp-section">
          <div className="lp-map-layout">
            <div>
              <h2 className="lp-section-title">280 Producers Across 24 Countries</h2>
              <p className="lp-section-sub">From Bordeaux to Barossa, Champagne to Cappadocia</p>
              <p className="lp-map-desc">
                An interactive map with every producer pinned, vintage heatmaps overlaid by year,
                and village-level labels. Filter by grape, style, price, or flavour profile.
                Tap a pin to see the full story.
              </p>
              <button className="lp-cta" onClick={() => { track("cta_explore_map"); setLocation("/explore"); }}>
                Explore the Map
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            {/* Map mockup */}
            <div className="lp-map-mock">
              {/* Decorative region lines */}
              <div className="lp-map-region-line" style={{ top: "30%", left: "10%", width: "80%" }} />
              <div className="lp-map-region-line" style={{ top: "55%", left: "15%", width: "70%" }} />
              <div className="lp-map-region-line" style={{ top: "75%", left: "5%", width: "90%" }} />
              {/* Producer dots */}
              {[
                { top: "22%", left: "35%", label: "Bordeaux", lx: "-2%", ly: "-18px" },
                { top: "18%", left: "42%", label: "Burgundy", lx: "4%", ly: "-18px" },
                { top: "15%", left: "38%", label: "Champagne", lx: "0", ly: "-18px" },
                { top: "28%", left: "44%", label: "Piedmont", lx: "4%", ly: "4px" },
                { top: "32%", left: "46%", label: "Tuscany", lx: "4%", ly: "4px" },
                { top: "26%", left: "40%", label: "Rhone", lx: "-8%", ly: "4px" },
                { top: "35%", left: "38%", label: "Rioja", lx: "-8%", ly: "0" },
                { top: "20%", left: "48%", label: "Mosel", lx: "4%", ly: "-18px" },
                { top: "65%", left: "70%", label: "Barossa", lx: "4%", ly: "-18px" },
                { top: "60%", left: "72%", label: "Margaret River", lx: "-14%", ly: "4px" },
                { top: "45%", left: "18%", label: "Napa Valley", lx: "-10%", ly: "4px" },
                { top: "55%", left: "25%", label: "Mendoza", lx: "4%", ly: "-18px" },
                { top: "70%", left: "62%", label: "Stellenbosch", lx: "-12%", ly: "4px" },
                { top: "48%", left: "68%", label: "Marlborough", lx: "4%", ly: "4px" },
              ].map((p, i) => (
                <div key={i}>
                  <div className="lp-map-dot" style={{ top: p.top, left: p.left }} />
                  <div className="lp-map-label" style={{ top: p.top, left: `calc(${p.left} + ${p.lx})`, marginTop: p.ly }}>{p.label}</div>
                </div>
              ))}
              {/* Corner badge */}
              <div style={{ position: "absolute", bottom: 14, right: 16, fontFamily: "'Geist Mono', monospace", fontSize: "0.46rem", fontWeight: 600, color: "rgba(247,244,239,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                24 countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          7. VINTAGE GUIDE
      ══════════════════════════════════════ */}
      <div className="lp-section-cream">
        <div className="lp-section">
          <div className="lp-vintage-layout">
            <div>
              <h2 className="lp-section-title">Every Vintage, Rated</h2>
              <p className="lp-section-sub">How each year shaped the wine — across 60 regions</p>
              <p className="lp-map-desc">
                See how weather, harvest conditions, and winemaking shaped every year.
                Colour-coded scores make it easy to spot the standout vintages at a glance.
              </p>
              <button className="lp-cta" onClick={() => { track("cta_vintage"); setLocation("/guides/vintages/table"); }}>
                View Vintage Guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            {/* Wider vintage table */}
            <div className="lp-vintage-grid">
              <div />
              {["2019", "2020", "2021", "2022", "2023"].map(y => (
                <div key={y} className="lp-vintage-header">{y}</div>
              ))}
              <div className="lp-vintage-region">Bordeaux</div>
              {[{s:96,c:"#2E8B3C"},{s:93,c:"#5DA65E"},{s:87,c:"#D48A30"},{s:92,c:"#5DA65E"},{s:94,c:"#5DA65E"}].map((v,i) => (
                <div key={i} className="lp-vintage-cell" style={{ background: v.c }}>{v.s}</div>
              ))}
              <div className="lp-vintage-region">Burgundy</div>
              {[{s:97,c:"#2E8B3C"},{s:95,c:"#5DA65E"},{s:89,c:"#C5B830"},{s:93,c:"#5DA65E"},{s:91,c:"#5DA65E"}].map((v,i) => (
                <div key={i} className="lp-vintage-cell" style={{ background: v.c }}>{v.s}</div>
              ))}
              <div className="lp-vintage-region">Napa Valley</div>
              {[{s:95,c:"#5DA65E"},{s:84,c:"#C03838"},{s:92,c:"#5DA65E"},{s:94,c:"#5DA65E"},{s:90,c:"#5DA65E"}].map((v,i) => (
                <div key={i} className="lp-vintage-cell" style={{ background: v.c }}>{v.s}</div>
              ))}
              <div className="lp-vintage-region">Barossa</div>
              {[{s:94,c:"#5DA65E"},{s:91,c:"#5DA65E"},{s:88,c:"#C5B830"},{s:95,c:"#5DA65E"},{s:93,c:"#5DA65E"}].map((v,i) => (
                <div key={i} className="lp-vintage-cell" style={{ background: v.c }}>{v.s}</div>
              ))}
              <div className="lp-vintage-region">Rioja</div>
              {[{s:93,c:"#5DA65E"},{s:96,c:"#2E8B3C"},{s:90,c:"#5DA65E"},{s:91,c:"#5DA65E"},{s:89,c:"#C5B830"}].map((v,i) => (
                <div key={i} className="lp-vintage-cell" style={{ background: v.c }}>{v.s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          8. LEARN & GROW
      ══════════════════════════════════════ */}
      <div className="lp-section-white">
        <div className="lp-section">
          <h2 className="lp-section-title">Build Your Knowledge</h2>
          <p className="lp-section-sub">Guides, quizzes, and a flavour map to sharpen your palate</p>

          <div className="lp-learn-grid">
            <div className="lp-learn-card" onClick={() => setLocation("/guides")} style={{ cursor: "pointer" }}>
              <div className="lp-learn-num">18</div>
              <div className="lp-learn-label">Guides</div>
              <div className="lp-learn-desc">From grape basics to terroir deep-dives</div>
            </div>
            <div className="lp-learn-card" onClick={() => setLocation("/guides/flavourmap")} style={{ cursor: "pointer" }}>
              <div className="lp-learn-num">50</div>
              <div className="lp-learn-label">Grapes</div>
              <div className="lp-learn-desc">Interactive flavour map comparing profiles</div>
            </div>
            <div className="lp-learn-card" onClick={() => setLocation("/guides")} style={{ cursor: "pointer" }}>
              <div className="lp-learn-num">12</div>
              <div className="lp-learn-label">Quizzes</div>
              <div className="lp-learn-desc">Test your knowledge after each guide</div>
            </div>
          </div>

          <button className="lp-cta" onClick={() => { track("cta_learn"); setLocation("/guides"); }}>
            Start Learning
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          9. FINAL CTA
      ══════════════════════════════════════ */}
      <section className="lp-final-cta">
        <h2 className="lp-final-title">Start your wine journey</h2>
        <p className="lp-final-sub">Create a free account and meet Sommy</p>
        <button className="lp-final-btn" onClick={() => { track("cta_get_started"); setLocation("/sign-in"); }}>
          Get Started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
        <div className="lp-final-note">No credit card required</div>
      </section>

      {/* ══════════════════════════════════════
          10. FOOTER
      ══════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div>
              <div className="lp-footer-brand">
                <svg
                  viewBox="0 0 80 100"
                  style={{ width: 22, height: 28, color: "#8C1C2E", flexShrink: 0 }}
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
                  <span style={{ color: "#1A1410" }}>The World of </span>
                  <span style={{ color: "#8C1C2E" }}>Wine</span>
                </div>
              </div>
              <div className="lp-footer-tagline">Your Journey Through Wine</div>
            </div>

            <nav className="lp-footer-nav">
              {[
                { label: "Explore", href: "/explore" },
                { label: "Guides", href: "/guides" },
                { label: "Vintage Guide", href: "/guides/vintages/table" },
                { label: "News", href: "/news" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ].map((link) => (
                <button key={link.href} className="lp-footer-link" onClick={() => setLocation(link.href)}>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">Crafted for curious drinkers everywhere</p>
            <p className="lp-footer-copy">&copy; {new Date().getFullYear()} The World of Wine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
