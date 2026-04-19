import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import type { Producer } from "@/data/producers";
import { producers as allProducers } from "@/data/producers";
import { wineRegions } from "@/data/regions";
import { newsItems } from "@/data/news";
import ExpandableNewsCard from "@/components/ExpandableNewsCard";
import { useSEO, useStructuredData } from "@/lib/useSEO";

// ── Fun Facts ──────────────────────────────────────────────────────
function FunFacts({ name }: { name: string }) {
  const [facts, setFacts] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const load = async () => {
    if (facts) { setOpen(!open); return; }
    setLoading(true); setOpen(true);
    try {
      const res = await fetch(`/api/region-content?type=fun_facts&name=${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(20000) });
      const data = await res.json();
      setFacts(data.content || []);
    } catch { setFacts([]); }
    setLoading(false);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={load} style={{
        display: "inline-flex", alignItems: "center", gap: 7, background: "none",
        border: "none", cursor: "pointer", padding: 0,
        fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", fontWeight: 500,
        letterSpacing: "0.06em", color: "#8C1C2E", textTransform: "uppercase" as const,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8C1C2E", display: "inline-block" }} />
        {loading ? "Loading..." : open ? "Hide Facts" : "Interesting Facts"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && facts && facts.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {facts.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8C1C2E", marginTop: 7, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6 }}>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Read More (inline continuation) ───────────────────────────────
function ReadMore({ name, context }: { name: string; context: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const load = async () => {
    if (expanded) { setOpen(true); return; }
    setLoading(true); setOpen(true);
    try {
      const res = await fetch(`/api/region-content?type=read_more&name=${encodeURIComponent(name)}&context=${encodeURIComponent(context)}`, { signal: AbortSignal.timeout(25000) });
      const data = await res.json();
      setExpanded(data.content || null);
    } catch { setExpanded(null); }
    setLoading(false);
  };
  const linkStyle = {
    background: "none" as const, border: "none" as const, padding: 0, cursor: "pointer" as const,
    fontFamily: "inherit" as const, fontSize: "inherit" as const, fontWeight: 300 as const,
    color: "#8C1C2E", display: "inline-flex" as const, alignItems: "center" as const, gap: 3,
  };
  const chevron = (up: boolean) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9" /></svg>
  );
  return (
    <>
      {!open && !loading && <button onClick={load} style={linkStyle}>...read more {chevron(false)}</button>}
      {loading && <span style={{ ...linkStyle, cursor: "default" }}>expanding...</span>}
      {open && expanded && (
        <div style={{ marginTop: 14 }}>
          {expanded.split(/\n\n+/).filter((p: string) => p.trim()).map((p: string, i: number) => (
            <p key={i} style={{ margin: i === 0 ? "0" : "14px 0 0" }}>{p.trim()}</p>
          ))}
        </div>
      )}
      {open && !loading && <button onClick={() => setOpen(false)} style={{ ...linkStyle, marginTop: 10 }}>Show less {chevron(true)}</button>}
    </>
  );
}

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
  const [, setLocation] = useLocation();
  const region = wineRegions.find((r) => r.id === producer.regionId);

  useSEO({
    title: `${producer.name} — ${producer.country} Wine Producer`,
    description: `${producer.name} in ${producer.regionId}. Known for: ${producer.flagshipWine}. ${producer.description?.replace(/<[^>]+>/g, "").slice(0, 150)}`,
    path: `/explore/producer/${producer.id}`,
  });
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Winery",
    name: producer.name,
    description: producer.description?.replace(/<[^>]+>/g, "").slice(0, 300),
    geo: { "@type": "GeoCoordinates", latitude: producer.lat, longitude: producer.lng },
    address: { "@type": "PostalAddress", addressCountry: producer.country },
    foundingDate: producer.founded,
  });
  const price = priceLabels[producer.priceRange] || { label: "?", desc: "" };
  const producerNews = useMemo(
    () => newsItems.filter((n) => n.producerIds.includes(producer.id)).slice(0, 4),
    [producer.id]
  );

  // CTAs computed values
  const otherRegionProducers = useMemo(
    () => allProducers
      .filter((p) => p.id !== producer.id && p.regionId === producer.regionId)
      .slice(0, 3),
    [producer.id, producer.regionId]
  );
  const similarStyleProducers = useMemo(() => {
    return allProducers
      .filter((p) =>
        p.id !== producer.id &&
        p.regionId !== producer.regionId &&
        p.wineType.some((t) => producer.wineType.includes(t)) &&
        p.priceRange === producer.priceRange
      )
      .slice(0, 3);
  }, [producer.id, producer.regionId, producer.wineType, producer.priceRange]);

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
              Natural
            </span>
          )}
          {producer.isAwardWinner && (
            <span className="hero-tag" style={{ color: "var(--plum)", borderColor: "rgba(74,26,110,0.2)", background: "rgba(74,26,110,0.07)" }}>
              ★ Award Winner
            </span>
          )}
        </div>

        {/* Description + Read More + Fun Facts */}
        <div className="producer-bio" style={{ borderBottom: "none", paddingBottom: 4 }} dangerouslySetInnerHTML={{ __html: producer.description }} />
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border-c)", fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.72, color: "var(--text2)", overflowWrap: "break-word" as const, wordBreak: "break-word" as const }}>
          <ReadMore key={`rm-${producer.id}`} name={producer.name} context={`${producer.name} is a wine producer in ${region?.name || producer.country}, established in ${producer.founded}. Known for ${producer.flagshipWine}.`} />
          <FunFacts key={`ff-${producer.id}`} name={`${producer.name} winery in ${region?.name || producer.country}`} />
        </div>

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
                <ExpandableNewsCard key={item.id} item={item} testId={`producer-news-${item.id}`} />
              ))}
            </div>
          </>
        )}

        {/* Continue Exploring CTAs */}
        {(region || otherRegionProducers.length > 0 || similarStyleProducers.length > 0) && (
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
              Continue Exploring
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Explore the Region */}
              {region && (
                <button
                  onClick={() => onSelectRegion(region.id)}
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
                  <span style={{ fontSize: "1.1rem" }}>🗺</span>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.88rem", color: "var(--wine)", fontWeight: 500 }}>
                      Explore {region.name}
                    </div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {region.country} · {region.grapes.slice(0, 3).join(", ")}
                    </div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--wine)" }}>›</span>
                </button>
              )}

              {/* Other Producers in Region */}
              {otherRegionProducers.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
                    Other Producers in {region?.name || "this region"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {otherRegionProducers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setLocation(`/producers/${p.id}`)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: "var(--r)",
                          border: "1px solid var(--border-c)",
                          background: "var(--wh)",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--wine-pale)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Fraunces', serif",
                          fontSize: "0.78rem",
                          color: "var(--wine)",
                          flexShrink: 0,
                        }}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>
                            {p.name}
                          </div>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", color: "var(--text3)", textTransform: "uppercase" }}>
                            Est. {p.founded} · {p.priceRange}
                          </div>
                        </div>
                        <span style={{ marginLeft: "auto", color: "var(--text3)" }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Styles */}
              {similarStyleProducers.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
                    Similar Styles
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {similarStyleProducers.map((p) => {
                      const pRegion = wineRegions.find((r) => r.id === p.regionId);
                      return (
                        <button
                          key={p.id}
                          onClick={() => setLocation(`/producers/${p.id}`)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: "var(--r)",
                            border: "1px solid var(--border-c)",
                            background: "var(--wh)",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "rgba(74,122,82,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Fraunces', serif",
                            fontSize: "0.78rem",
                            color: "var(--sage)",
                            flexShrink: 0,
                          }}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>
                              {p.name}
                            </div>
                            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", color: "var(--text3)", textTransform: "uppercase" }}>
                              {pRegion?.name || p.regionId} · {p.wineType.slice(0, 2).join(", ")}
                            </div>
                          </div>
                          <span style={{ marginLeft: "auto", color: "var(--text3)" }}>›</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
