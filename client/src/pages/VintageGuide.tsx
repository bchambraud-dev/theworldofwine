import { useState, useRef, useMemo, useCallback } from "react";
import { vintageData, vintageColor, vintageLabel, maturityLabel } from "@/data/vintages";
import { vintageNotes } from "@/data/vintageCommentary";

const YEARS = Array.from({ length: 14 }, (_, i) => 2023 - i).reverse(); // 2010-2023

// Build a lookup: regionId+year → note
function buildNotesMap() {
  const m = new Map<string, string>();
  for (const n of vintageNotes) m.set(`${n.regionId}:${n.year}`, n.note);
  return m;
}
const notesMap = buildNotesMap();

// Country grouping — map regionId to country for grouping
const REGION_COUNTRY: Record<string, string> = {};
vintageData.forEach(rv => {
  // Infer country from regionLabel or regionId
  const id = rv.regionId;
  const label = rv.regionLabel;
  if (["bordeaux","burgundy","champagne","rhone","southern-rhone","loire","alsace","provence","languedoc-roussillon"].includes(id)) REGION_COUNTRY[id] = "France";
  else if (["piedmont","tuscany","sicily","veneto","campania","alto-adige"].includes(id)) REGION_COUNTRY[id] = "Italy";
  else if (["rioja","ribera-del-duero","priorat","jerez","rias-baixas"].includes(id)) REGION_COUNTRY[id] = "Spain";
  else if (["napa-valley","sonoma","willamette","paso-robles","finger-lakes"].includes(id)) REGION_COUNTRY[id] = "USA";
  else if (["barossa","barossa-valley","margaret-river","yarra-valley","hunter-valley"].includes(id)) REGION_COUNTRY[id] = "Australia";
  else if (["marlborough","central-otago","hawkes-bay"].includes(id)) REGION_COUNTRY[id] = "New Zealand";
  else if (["mosel","rheingau","pfalz"].includes(id)) REGION_COUNTRY[id] = "Germany";
  else if (["douro","vinho-verde","alentejo"].includes(id)) REGION_COUNTRY[id] = "Portugal";
  else if (["stellenbosch","swartland","franschhoek"].includes(id)) REGION_COUNTRY[id] = "South Africa";
  else if (["wachau","burgenland"].includes(id)) REGION_COUNTRY[id] = "Austria";
  else if (["mendoza","patagonia"].includes(id)) REGION_COUNTRY[id] = "Argentina";
  else if (["maipo-colchagua","casablanca-valley"].includes(id)) REGION_COUNTRY[id] = "Chile";
  else if (id === "tokaj") REGION_COUNTRY[id] = "Hungary";
  else if (id === "okanagan-valley") REGION_COUNTRY[id] = "Canada";
  else if (id === "bekaa-valley") REGION_COUNTRY[id] = "Lebanon";
  else if (["santorini","naoussa"].includes(id)) REGION_COUNTRY[id] = "Greece";
  else if (id === "english-sparkling") REGION_COUNTRY[id] = "England";
  else if (id === "kakheti") REGION_COUNTRY[id] = "Georgia";
  else if (id === "istria-dalmatia") REGION_COUNTRY[id] = "Croatia";
  else if (id === "valle-de-guadalupe") REGION_COUNTRY[id] = "Mexico";
  else if (id === "ningxia") REGION_COUNTRY[id] = "China";
  else if (id === "serra-gaucha") REGION_COUNTRY[id] = "Brazil";
  else if (id === "yamanashi") REGION_COUNTRY[id] = "Japan";
  else if (id === "cappadocia") REGION_COUNTRY[id] = "Turkey";
  else REGION_COUNTRY[id] = "Other";
});

// Country display order
const COUNTRY_ORDER = [
  "France", "Italy", "Spain", "Portugal", "Germany", "Austria",
  "Greece", "Hungary", "Georgia", "Croatia", "England",
  "USA", "Argentina", "Chile", "Canada", "Mexico",
  "Australia", "New Zealand", "South Africa",
  "Lebanon", "China", "Japan", "Brazil", "Turkey", "Other"
];

function groupByCountry<T extends { regionId: string }>(items: T[]): { country: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  items.forEach(item => {
    const country = REGION_COUNTRY[item.regionId] || "Other";
    if (!groups.has(country)) groups.set(country, []);
    groups.get(country)!.push(item);
  });
  return COUNTRY_ORDER.filter(c => groups.has(c)).map(c => ({ country: c, items: groups.get(c)! }));
}

// Score → pill background colour (solid, for text readability)
function scorePillBg(score: number | null): string {
  if (score === null) return "#E8E5E0";
  if (score >= 96) return "#2E8B3C";
  if (score >= 93) return "#5DA65E";
  if (score >= 89) return "#C5B830";
  if (score >= 85) return "#D48A30";
  return "#C03838";
}

function scorePillFg(score: number | null): string {
  if (score === null) return "#8A8580";
  if (score >= 96) return "#fff";
  if (score >= 93) return "#fff";
  if (score >= 89) return "#3A3520";
  if (score >= 85) return "#3A2A18";
  return "#fff";
}

function maturityShort(m: string | null): string {
  if (!m) return "";
  const short: Record<string, string> = { T: "Tannic", Y: "Young", E: "Early", R: "Ready", O: "Past peak", U: "Uneven" };
  return short[m] || "";
}

function maturityBadgeBg(m: string | null): string {
  if (!m) return "transparent";
  const bg: Record<string, string> = { T: "rgba(140,28,46,0.08)", Y: "rgba(76,175,80,0.10)", E: "rgba(205,185,50,0.10)", R: "rgba(34,139,34,0.10)", O: "rgba(200,50,50,0.08)", U: "rgba(160,160,160,0.12)" };
  return bg[m] || "rgba(160,160,160,0.08)";
}

function maturityBadgeFg(m: string | null): string {
  if (!m) return "transparent";
  const fg: Record<string, string> = { T: "#8C1C2E", Y: "#3A7A40", E: "#8A7A20", R: "#228B22", O: "#B04040", U: "#888" };
  return fg[m] || "#888";
}

type ViewMode = "chart" | "table";

const SCROLLBAR_STYLE_ID = "vintage-guide-scrollbar-hide";
function ensureScrollbarStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCROLLBAR_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SCROLLBAR_STYLE_ID;
  style.textContent = `.vg-year-row::-webkit-scrollbar { display: none; }`;
  document.head.appendChild(style);
}

const mono = (size = "10px"): React.CSSProperties => ({
  fontFamily: "'Geist Mono', monospace", fontSize: size, fontWeight: 600,
  letterSpacing: "0.04em", textTransform: "uppercase", color: "#5A5248",
});

export default function VintageGuide() {
  const [selectedYear, setSelectedYear] = useState(2020);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [expandedCell, setExpandedCell] = useState<{ regionId: string; year: number } | null>(null);
  const yearRowRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  ensureScrollbarStyle();

  const handleYearClick = useCallback((year: number) => {
    setSelectedYear(year);
    if (viewMode === "chart") {
      const el = sectionRefs.current.get(year);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [viewMode]);

  const handleCellClick = useCallback((regionId: string, year: number) => {
    setExpandedCell(prev =>
      prev?.regionId === regionId && prev?.year === year ? null : { regionId, year }
    );
  }, []);

  // Chart data: group by year, then by country. Exclude regions with no score for that year.
  const chartData = useMemo(() => {
    return YEARS.map(year => {
      const regionRows = vintageData
        .map(rv => {
          const v = rv.vintages.find(v => v.year === year);
          return {
            regionId: rv.regionId,
            regionLabel: rv.regionLabel,
            score: v?.score ?? null,
            maturity: v?.maturity ?? null,
            note: notesMap.get(`${rv.regionId}:${year}`) || null,
          };
        })
        .filter(r => r.score !== null); // Exclude regions with no data for this year

      const grouped = groupByCountry(regionRows);
      return { year, groups: grouped };
    });
  }, []);

  // Table data: group vintageData by country
  const tableGroups = useMemo(() => groupByCountry(vintageData.map(rv => ({ ...rv, regionId: rv.regionId }))), []);

  return (
    <div className="page-scroll" style={{
      background: "#F7F4EF",
      padding: "32px 16px 80px",
      maxWidth: 1100,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 4px" }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 700, color: "#1A1410", margin: 0, lineHeight: 1.2 }}>Vintage Guide</h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248", margin: "6px 0 0" }}>How each year shaped the wine</p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div ref={yearRowRef} className="vg-year-row" style={{
          display: "flex", gap: 6, overflowX: "auto", flex: 1, paddingBottom: 2,
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory",
        }}>
          {YEARS.map(year => (
            <button key={year} onClick={() => handleYearClick(year)} style={{
              fontFamily: "'Geist Mono', monospace", fontSize: "11px",
              fontWeight: selectedYear === year ? 700 : 500,
              color: selectedYear === year ? "#F7F4EF" : "#5A5248",
              background: selectedYear === year ? "#8C1C2E" : "#fff",
              border: `1px solid ${selectedYear === year ? "#8C1C2E" : "#EDEAE3"}`,
              borderRadius: 14, padding: "8px 14px", minHeight: 36, minWidth: 52,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              transition: "all 0.15s ease", scrollSnapAlign: "center",
            }}>{year}</button>
          ))}
        </div>
        <div style={{ display: "flex", background: "#fff", border: "1px solid #EDEAE3", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
          {(["chart", "table"] as ViewMode[]).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              ...mono("10px"), color: viewMode === mode ? "#F7F4EF" : "#5A5248",
              background: viewMode === mode ? "#8C1C2E" : "transparent",
              border: "none", padding: "8px 16px", minHeight: 36, cursor: "pointer", transition: "all 0.15s ease",
            }}>{mode}</button>
          ))}
        </div>
      </div>

      {/* ═══════ CHART VIEW ═══════ */}
      {viewMode === "chart" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {chartData.map(({ year, groups }) => (
            <div key={year} ref={el => { if (el) sectionRefs.current.set(year, el); }}
              style={{
                background: "#fff", border: "1px solid #EDEAE3", borderRadius: 12, padding: "16px",
                boxShadow: year === selectedYear ? "0 0 0 2px #8C1C2E" : "none", transition: "box-shadow 0.2s ease",
              }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1A1410", marginBottom: 12 }}>{year}</div>

              {groups.map(({ country, items }) => (
                <div key={country} style={{ marginBottom: 12 }}>
                  <div style={{ ...mono("9px"), color: "#8C1C2E", marginBottom: 6, paddingLeft: 2 }}>{country}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {items.map(r => (
                      <div key={r.regionId} style={{ padding: "6px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ ...mono("10px"), minWidth: 90, flex: "0 0 auto" }}>{r.regionLabel}</span>
                          <span style={{
                            fontFamily: "'Geist Mono', monospace", fontSize: "11px", fontWeight: 700,
                            color: scorePillFg(r.score), background: scorePillBg(r.score),
                            borderRadius: 10, padding: "3px 10px", textAlign: "center", minWidth: 36, flexShrink: 0,
                          }}>{r.score !== null ? r.score : "\u2013"}</span>
                          <div style={{ height: 6, background: "#F0EDE6", borderRadius: 3, overflow: "hidden", flex: "1 1 60px", minWidth: 40 }}>
                            <div style={{ width: r.score !== null ? `${r.score}%` : "0%", height: "100%", background: scorePillBg(r.score), borderRadius: 3, transition: "width 0.3s ease" }} />
                          </div>
                          {r.maturity && (
                            <span style={{ ...mono("9px"), color: maturityBadgeFg(r.maturity), background: maturityBadgeBg(r.maturity), borderRadius: 8, padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
                              {maturityShort(r.maturity)}
                            </span>
                          )}
                        </div>
                        {r.note && (
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", fontStyle: "italic", color: "#8A8580", lineHeight: 1.5, paddingLeft: 2, paddingTop: 4 }}>{r.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ═══════ TABLE VIEW ═══════ */}
      {viewMode === "table" && (
        <div style={{ background: "#fff", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "hidden", position: "relative" }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Geist Mono', monospace", fontSize: "11px", minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={{
                    position: "sticky", left: 0, background: "#F7F4EF", zIndex: 3,
                    padding: "10px 8px", textAlign: "left", fontWeight: 700, fontSize: "10px",
                    letterSpacing: "0.06em", textTransform: "uppercase", color: "#5A5248",
                    borderBottom: "2px solid #EDEAE3", minWidth: 120,
                  }}>Region</th>
                  {YEARS.map(year => (
                    <th key={year} onClick={() => setSelectedYear(year)} style={{
                      padding: "10px 2px", textAlign: "center", fontWeight: year === selectedYear ? 700 : 500,
                      fontSize: "10px", color: year === selectedYear ? "#8C1C2E" : "#5A5248",
                      borderBottom: "2px solid #EDEAE3", cursor: "pointer",
                      background: year === selectedYear ? "rgba(140,28,46,0.06)" : "transparent",
                      whiteSpace: "nowrap", transition: "all 0.15s ease", minWidth: 38,
                    }}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableGroups.map(({ country, items }) => (
                  <>
                    {/* Country header row */}
                    <tr key={`country-${country}`}>
                      <td colSpan={YEARS.length + 1} style={{
                        position: "sticky", left: 0, background: "rgba(140,28,46,0.04)",
                        padding: "8px 8px 6px", fontFamily: "'Geist Mono', monospace",
                        fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "#8C1C2E", borderBottom: "1px solid #EDEAE3",
                      }}>{country}</td>
                    </tr>
                    {items.map(rv => (
                      <tr key={rv.regionId}>
                        <td style={{
                          position: "sticky", left: 0, background: "#fff", zIndex: 1,
                          padding: "8px 8px", fontWeight: 600, fontSize: "9px",
                          letterSpacing: "0.04em", textTransform: "uppercase", color: "#5A5248",
                          borderBottom: "1px solid #F0EDE6", whiteSpace: "nowrap",
                        }}>{rv.regionLabel}</td>
                        {YEARS.map(year => {
                          const v = rv.vintages.find(v => v.year === year);
                          const score = v?.score ?? null;
                          const isExpanded = expandedCell?.regionId === rv.regionId && expandedCell?.year === year;
                          const cellKey = `${rv.regionId}:${year}`;
                          return (
                            <td key={year} style={{
                              padding: "4px 2px", textAlign: "center", borderBottom: "1px solid #F0EDE6",
                              position: "relative",
                              background: isExpanded ? "rgba(140,28,46,0.10)" : year === selectedYear ? "rgba(140,28,46,0.04)" : "transparent",
                            }}>
                              <button
                                ref={el => { if (el) cellRefs.current.set(cellKey, el); }}
                                onClick={() => handleCellClick(rv.regionId, year)}
                                style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: "11px",
                                  color: scorePillFg(score), background: scorePillBg(score),
                                  borderRadius: 6, padding: "4px 6px", minWidth: 32, minHeight: 28,
                                  lineHeight: "18px", border: isExpanded ? "2px solid #8C1C2E" : "2px solid transparent",
                                  cursor: "pointer", transition: "border-color 0.15s ease",
                                }}>
                                {score !== null ? score : "\u2013"}
                              </button>
                              {/* Inline popup near the button */}
                              {isExpanded && (() => {
                                const note = notesMap.get(`${rv.regionId}:${year}`) || null;
                                return (
                                  <div style={{
                                    position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                                    zIndex: 10, width: 240, background: "#fff", border: "1px solid #EDEAE3",
                                    borderRadius: 10, padding: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    textAlign: "left",
                                  }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                                      <span style={{ ...mono("9px"), color: "#5A5248" }}>{rv.regionLabel}</span>
                                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700, color: "#1A1410" }}>{year}</span>
                                      <span style={{
                                        fontFamily: "'Geist Mono', monospace", fontSize: "11px", fontWeight: 700,
                                        color: scorePillFg(score), background: scorePillBg(score),
                                        borderRadius: 6, padding: "2px 8px",
                                      }}>{score ?? "\u2013"}</span>
                                    </div>
                                    {v?.maturity && (
                                      <div style={{ marginBottom: 6 }}>
                                        <span style={{ ...mono("8px"), color: maturityBadgeFg(v.maturity), background: maturityBadgeBg(v.maturity), borderRadius: 6, padding: "2px 6px" }}>
                                          {maturityShort(v.maturity)} — {maturityLabel(v.maturity)}
                                        </span>
                                      </div>
                                    )}
                                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontStyle: "italic", color: "#5A5248", lineHeight: 1.5, margin: 0 }}>
                                      {note || "No tasting notes available."}
                                    </p>
                                    <button onClick={(e) => { e.stopPropagation(); setExpandedCell(null); }} style={{
                                      marginTop: 8, ...mono("8px"), color: "#8A8580", background: "none",
                                      border: "1px solid #EDEAE3", borderRadius: 4, padding: "4px 8px", cursor: "pointer",
                                    }}>CLOSE</button>
                                  </div>
                                );
                              })()}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
