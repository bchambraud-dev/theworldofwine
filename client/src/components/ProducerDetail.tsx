import { useMemo } from "react";
import type { Producer } from "@/data/producers";
import { wineRegions } from "@/data/regions";
import { newsItems } from "@/data/news";

interface ProducerDetailProps {
  producer: Producer;
  onClose: () => void;
  onSelectRegion: (id: string) => void;
}

const priceLabels: Record<string, { label: string; desc: string }> = {
  budget: { label: "$", desc: "Under $20" },
  mid: { label: "$$", desc: "$20–50" },
  premium: { label: "$$$", desc: "$50–200" },
  luxury: { label: "$$$$", desc: "$200+" },
};

const flavorCategories: Record<string, string> = {
  blackcurrant: "fruit", cassis: "fruit", cherry: "fruit", raspberry: "fruit",
  plum: "fruit", strawberry: "fruit", citrus: "fruit", lemon: "fruit",
  berry: "fruit", fig: "fruit", apple: "fruit", pear: "fruit", peach: "fruit",
  earth: "earth", mushroom: "earth", truffle: "earth", soil: "earth",
  tobacco: "earth", leather: "earth",
  graphite: "mineral", mineral: "mineral", flint: "mineral", chalk: "mineral",
  slate: "mineral", stone: "mineral",
  cedar: "oak", oak: "oak", vanilla: "oak", butter: "oak",
  toast: "oak", smoke: "oak",
  violet: "floral", rose: "floral", floral: "floral", lavender: "floral",
  jasmine: "floral", blossom: "floral", silk: "floral",
  pepper: "spice", spice: "spice", cinnamon: "spice",
};

function classifyFlavor(flavor: string): string {
  const lower = flavor.toLowerCase();
  for (const [keyword, cat] of Object.entries(flavorCategories)) {
    if (lower.includes(keyword)) return cat;
  }
  return "earth";
}

export default function ProducerDetail({
  producer,
  onClose,
  onSelectRegion,
}: ProducerDetailProps) {
  const region = wineRegions.find((r) => r.id === producer.regionId);
  const price = priceLabels[producer.priceRange] || { label: "?", desc: "" };
  const producerNews = useMemo(
    () => newsItems.filter((n) => n.producerIds.includes(producer.id)).slice(0, 4),
    [producer.id]
  );

  return (
    <>
      {/* Accent bar */}
      <div className="sp-bar" />

      {/* Back to region */}
      {region && (
        <button
          className="sp-back"
          onClick={() => onSelectRegion(region.id)}
          data-testid="producer-back-to-region"
        >
          <span className="sp-back-arrow">←</span>
          <span className="sp-back-lbl">Back to {region.name}</span>
        </button>
      )}

      {/* Header */}
      <div className="sp-header">
        <div className="sp-eyebrow">
          {region?.name || producer.country} · Est. {producer.founded}
        </div>
        <div className="sp-title" data-testid="producer-detail-title">{producer.name}</div>
        <button
          className="sp-close"
          onClick={onClose}
          data-testid="close-producer-detail"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="sp-body" data-testid="producer-detail">
        {/* Tags row */}
        <div style={{ padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: 5, borderBottom: "1px solid var(--border-c)" }}>
          {producer.wineType.map((t) => (
            <span key={t} className="hero-tag">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
          ))}
          <span className="hero-tag" style={{ color: "var(--gold)", borderColor: "rgba(184,134,11,0.3)", background: "var(--gold-pale)" }}>
            {price.label} {price.desc}
          </span>
          {producer.isNatural && (
            <span className="hero-tag" style={{ color: "var(--sage)", borderColor: "rgba(74,122,82,0.3)", background: "var(--sage-pale)" }}>
              🌿 Natural
            </span>
          )}
          {producer.isAwardWinner && (
            <span className="hero-tag" style={{ color: "var(--plum)", borderColor: "rgba(74,26,110,0.2)", background: "rgba(74,26,110,0.07)" }}>
              ★ Award Winner
            </span>
          )}
        </div>

        {/* Description */}
        <div className="producer-bio">{producer.description}</div>

        {/* Stats */}
        <div className="producer-stats-row">
          <div className="p-stat">
            <span className="p-stat-num">{producer.founded}</span>
            <span className="p-stat-lbl">Founded</span>
          </div>
          <div className="p-stat">
            <span className="p-stat-num">{producer.wineType.length}</span>
            <span className="p-stat-lbl">Wine Types</span>
          </div>
          <div className="p-stat">
            <span className="p-stat-num">{price.label}</span>
            <span className="p-stat-lbl">Price Range</span>
          </div>
          <div className="p-stat">
            <span className="p-stat-num">{producer.keyFacts.length}</span>
            <span className="p-stat-lbl">Key Facts</span>
          </div>
        </div>

        {/* Flagship Wine */}
        <div className="section-head">Flagship Wine</div>
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border-c)",
          background: "linear-gradient(135deg, var(--wine-pale) 0%, transparent 70%)",
        }}>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--text)",
            marginBottom: 2,
          }}>
            {producer.flagshipWine}
          </div>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.58rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "var(--text3)",
          }}>
            {producer.name}
          </div>
        </div>

        {/* Taste Profile */}
        <div className="sp-flavors">
          {producer.tasteProfile.map((taste, i) => (
            <span key={i} className={`ftag ${classifyFlavor(taste)}`}>
              {taste}
            </span>
          ))}
        </div>

        {/* Key Facts */}
        <div className="section-head">Key Facts</div>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-c)" }}>
          {producer.keyFacts.map((fact, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 8,
              fontSize: "0.8rem",
              fontWeight: 300,
              color: "var(--text2)",
              lineHeight: 1.6,
            }}>
              <span style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--wine)",
                marginTop: 7,
                flexShrink: 0,
              }} />
              {fact}
            </div>
          ))}
        </div>

        {/* News about this producer */}
        {producerNews.length > 0 && (
          <>
            <div className="section-head">Recent News</div>
            <div style={{ padding: "12px 14px" }}>
              {producerNews.map((item) => (
                <div key={item.id} className="sp-news-card" data-testid={`producer-news-${item.id}`}>
                  <div className="sp-news-cat">{item.tags[0] || "Wine"}</div>
                  <div className="sp-news-title">{item.title}</div>
                  <div className="sp-news-summary" style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>{item.summary}</div>
                  <div className="sp-news-footer">
                    <span className="sp-news-source">{item.source}</span>
                    <span className="sp-news-source">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
