import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import type { WineRegion } from "@/data/regions";
import { wineRegions } from "@/data/regions";
import type { Producer } from "@/data/producers";
import { newsItems } from "@/data/news";
import { quizzes } from "@/data/quizzes";
import { guides } from "@/data/guides";
import { journeys } from "@/data/journeys";
import ExpandableNewsCard from "@/components/ExpandableNewsCard";

interface RegionDetailProps {
  region: WineRegion;
  producers: Producer[];
  onClose: () => void;
  onSelectProducer: (id: string) => void;
}

const flavorCategories: Record<string, string> = {
  blackcurrant: "fruit", cassis: "fruit", cherry: "fruit", raspberry: "fruit",
  plum: "fruit", strawberry: "fruit", citrus: "fruit", lemon: "fruit",
  apple: "fruit", pear: "fruit", peach: "fruit", apricot: "fruit",
  melon: "fruit", tropical: "fruit", berry: "fruit", fig: "fruit",
  grape: "fruit", mango: "fruit", pineapple: "fruit", passion: "fruit",
  earth: "earth", mushroom: "earth", truffle: "earth", soil: "earth",
  forest: "earth", tobacco: "earth", leather: "earth", hay: "earth",
  graphite: "mineral", mineral: "mineral", flint: "mineral", chalk: "mineral",
  slate: "mineral", stone: "mineral", salt: "mineral", wet: "mineral",
  cedar: "oak", oak: "oak", vanilla: "oak", butter: "oak",
  toast: "oak", smoke: "oak", caramel: "oak", spice: "oak",
  cinnamon: "spice", pepper: "spice", clove: "spice", nutmeg: "spice",
  violet: "floral", rose: "floral", floral: "floral", lavender: "floral",
  jasmine: "floral", blossom: "floral", honeysuckle: "floral",
};

function classifyFlavor(flavor: string): string {
  const lower = flavor.toLowerCase();
  for (const [keyword, cat] of Object.entries(flavorCategories)) {
    if (lower.includes(keyword)) return cat;
  }
  return "earth";
}

function extractFlavors(profile: string): string[] {
  const flavorWords = [
    "blackcurrant", "cassis", "cherry", "raspberry", "plum", "strawberry",
    "citrus", "lemon", "apple", "pear", "peach", "apricot", "melon",
    "tropical", "berry", "fig", "mango", "pineapple",
    "earth", "mushroom", "truffle", "soil", "tobacco", "leather", "hay",
    "graphite", "mineral", "flint", "chalk", "slate", "stone",
    "cedar", "oak", "vanilla", "butter", "toast", "smoke", "caramel",
    "cinnamon", "pepper", "clove", "nutmeg", "spice",
    "violet", "rose", "floral", "lavender", "jasmine", "blossom", "honeysuckle",
    "honey", "almond", "hazelnut", "brioche", "yeast", "cream",
    "licorice", "anise", "herbs", "thyme", "rosemary",
  ];
  const lower = profile.toLowerCase();
  const found: string[] = [];
  for (const word of flavorWords) {
    if (lower.includes(word) && !found.some((f) => f.toLowerCase() === word)) {
      found.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
  }
  return found.slice(0, 8);
}

export default function RegionDetail({
  region,
  producers,
  onClose,
  onSelectProducer,
}: RegionDetailProps) {
  const [, setLocation] = useLocation();
  const regionProducers = producers.filter((p) => p.regionId === region.id);
  const regionNews = useMemo(
    () => newsItems.filter((n) => n.regionIds.includes(region.id)).slice(0, 5),
    [region.id]
  );
  const [activeTab, setActiveTab] = useState<"producers" | "news">("producers");

  // CTAs computed values
  const regionQuiz = useMemo(
    () => quizzes.find((q) => q.regionId === region.id),
    [region.id]
  );
  const relatedJourneys = useMemo(
    () => journeys.filter((j) =>
      j.stops.some((s) => s.type === "region" && s.targetId === region.id)
    ).slice(0, 2),
    [region.id]
  );
  const relatedGuides = useMemo(() => {
    // Find guides relevant by country/region
    const countryKeywords: Record<string, string[]> = {
      France: ["classifications", "sub-appellations", "what-is-terroir"],
      Italy: ["classifications", "sub-appellations"],
      Germany: ["classifications"],
      Spain: ["classifications"],
      "United States": ["sub-appellations"],
    };
    const ids = countryKeywords[region.country] || ["what-is-terroir"];
    return guides.filter((g) => ids.includes(g.id)).slice(0, 2);
  }, [region.country]);
  const similarRegions = useMemo(() => {
    return wineRegions
      .filter((r) => r.id !== region.id)
      .map((r) => ({
        region: r,
        shared: r.grapes.filter((g) => region.grapes.includes(g)).length,
      }))
      .filter((r) => r.shared > 0)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 3)
      .map((r) => r.region);
  }, [region.id, region.grapes]);

  const flavors = extractFlavors(region.flavorProfile);

  return (
    <>
      {/* Accent bar */}
      <div className="sp-bar" />

      {/* Header */}
      <div className="sp-header">
        <div className="sp-eyebrow">{region.name} · {region.country}</div>
        <div className="sp-title" data-testid="region-detail-title">{region.name}</div>
        <button
          className="sp-close"
          onClick={onClose}
          data-testid="close-region-detail"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="sp-body" data-testid="region-detail">
        {/* Hero image */}
        {region.image && (
          <img
            src={region.image}
            alt={`${region.name} wine region`}
            className="region-hero-img"
            data-testid="region-hero-image"
          />
        )}

        {/* Description */}
        <div className="sp-desc" dangerouslySetInnerHTML={{ __html: region.description }} />

        {/* Stats */}
        <div className="sp-stats">
          <div className="sp-stat">
            <span className="sp-stat-num">{regionProducers.length}</span>
            <span className="sp-stat-lbl">Producers</span>
          </div>
          <div className="sp-stat">
            <span className="sp-stat-num">{region.grapes.length}</span>
            <span className="sp-stat-lbl">Key Grapes</span>
          </div>
          <div className="sp-stat">
            <span className="sp-stat-num">{region.notableStyles.length}</span>
            <span className="sp-stat-lbl">Styles</span>
          </div>
        </div>

        {/* Flavor tags */}
        <div className="sp-flavors">
          {flavors.map((f, i) => (
            <span key={i} className={`ftag ${classifyFlavor(f)}`}>
              {f}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="sp-tabs">
          <button
            className={`sp-tab ${activeTab === "producers" ? "active" : ""}`}
            onClick={() => setActiveTab("producers")}
            data-testid="region-tab-producers"
          >
            Producers ({regionProducers.length})
          </button>
          <button
            className={`sp-tab ${activeTab === "news" ? "active" : ""}`}
            onClick={() => setActiveTab("news")}
            data-testid="region-tab-news"
          >
            News ({regionNews.length})
          </button>
        </div>

        {/* Tab content */}
        <div className="sp-content">
          {activeTab === "producers" ? (
            regionProducers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)" }}>
                <div style={{ marginBottom: 8, opacity: 0.4 }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l-1 9a4 4 0 0 1-3 3.5A4 4 0 0 1 9 11L8 2z"/><line x1="12" y1="14.5" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg></div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem" }}>
                  No producers listed yet
                </div>
              </div>
            ) : (
              regionProducers.map((producer) => (
                <div
                  key={producer.id}
                  className="producer-card"
                  onClick={() => onSelectProducer(producer.id)}
                  data-testid={`region-producer-${producer.id}`}
                >
                  <div className="producer-card-icon">
                    {producer.name.charAt(0)}
                  </div>
                  <div className="producer-card-info">
                    <div className="producer-card-name">{producer.name}</div>
                    <div className="producer-card-sub">
                      Est. {producer.founded} · {producer.priceRange}
                    </div>
                    <div className="producer-card-pills">
                      {producer.wineType.map((t) => (
                        <span key={t} className="p-pill">{t}</span>
                      ))}
                      {producer.isAwardWinner && (
                        <span className="p-pill" style={{ background: "var(--gold-pale)", color: "var(--gold)", borderColor: "rgba(184,134,11,0.2)" }}>
                          ★ Award
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="producer-card-arrow">›</span>
                </div>
              ))
            )
          ) : (
            regionNews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)" }}>
                <div style={{ marginBottom: 8, opacity: 0.4 }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg></div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem" }}>
                  No news for this region
                </div>
              </div>
            ) : (
              regionNews.map((item) => (
                <ExpandableNewsCard key={item.id} item={item} testId={`sp-news-${item.id}`} />
              ))
            )
          )}
        </div>

        {/* Continue Your Journey CTAs */}
        {(regionQuiz || relatedJourneys.length > 0 || relatedGuides.length > 0 || similarRegions.length > 0) && (
          <div style={{ padding: "24px 20px 32px", borderTop: "1px solid var(--border-c)" }}>
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.1rem",
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 16,
              }}
            >
              Continue Your Journey
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Take the Quiz */}
              {regionQuiz && (
                <button
                  onClick={() => setLocation(`/quiz/${regionQuiz.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    background: "var(--wine-pale)",
                    border: "1px solid rgba(140,28,46,0.2)",
                    borderRadius: "var(--r)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📝</span>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.88rem", color: "var(--wine)", fontWeight: 500 }}>
                      Take the Quiz
                    </div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {regionQuiz.title} · {regionQuiz.questions.length} questions
                    </div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--wine)" }}>›</span>
                </button>
              )}

              {/* Similar Regions */}
              {similarRegions.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
                    Similar Regions
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {similarRegions.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setLocation(`/map?region=${r.id}`)}
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: "0.62rem",
                          padding: "6px 12px",
                          borderRadius: "var(--r)",
                          border: "1px solid var(--border-c)",
                          background: "var(--wh)",
                          color: "var(--text2)",
                          cursor: "pointer",
                        }}
                      >
                        {r.name} · {r.country}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Journeys */}
              {relatedJourneys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => setLocation(`/journeys/${journey.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    background: "rgba(74,26,110,0.05)",
                    border: "1px solid rgba(74,26,110,0.15)",
                    borderRadius: "var(--r)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>🗺</span>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.88rem", color: "var(--plum)", fontWeight: 500 }}>
                      Related Journey
                    </div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {journey.title}
                    </div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--plum)" }}>›</span>
                </button>
              ))}

              {/* Read the Guide */}
              {relatedGuides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setLocation(`/guides/${guide.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    background: "rgba(74,122,82,0.05)",
                    border: "1px solid rgba(74,122,82,0.15)",
                    borderRadius: "var(--r)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📖</span>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.88rem", color: "var(--sage)", fontWeight: 500 }}>
                      Read the Guide
                    </div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {guide.title}
                    </div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--sage)" }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
