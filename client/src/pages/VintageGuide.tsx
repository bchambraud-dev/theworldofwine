import { useState, useRef, useMemo, useCallback } from "react";
import { vintageData, vintageColor, vintageLabel, maturityLabel } from "@/data/vintages";
import { vintageNotes } from "@/data/vintageCommentary";

const YEARS = Array.from({ length: 19 }, (_, i) => 2023 - i).reverse(); // 2005-2023

// Build a lookup: regionId+year → note
function buildNotesMap() {
  const m = new Map<string, string>();
  for (const n of vintageNotes) m.set(`${n.regionId}:${n.year}`, n.note);
  return m;
}
const notesMap = buildNotesMap();

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

// Short maturity badge
function maturityShort(m: string | null): string {
  if (!m) return "";
  const short: Record<string, string> = {
    T: "Tannic",
    Y: "Young",
    E: "Early",
    R: "Ready",
    O: "Past peak",
    U: "Uneven",
  };
  return short[m] || "";
}

function maturityBadgeBg(m: string | null): string {
  if (!m) return "transparent";
  const bg: Record<string, string> = {
    T: "rgba(140,28,46,0.08)",
    Y: "rgba(76,175,80,0.10)",
    E: "rgba(205,185,50,0.10)",
    R: "rgba(34,139,34,0.10)",
    O: "rgba(200,50,50,0.08)",
    U: "rgba(160,160,160,0.12)",
  };
  return bg[m] || "rgba(160,160,160,0.08)";
}

function maturityBadgeFg(m: string | null): string {
  if (!m) return "transparent";
  const fg: Record<string, string> = {
    T: "#8C1C2E",
    Y: "#3A7A40",
    E: "#8A7A20",
    R: "#228B22",
    O: "#B04040",
    U: "#888",
  };
  return fg[m] || "#888";
}

type ViewMode = "chart" | "table";

// Inject global CSS for hiding scrollbar on year pills (once)
const SCROLLBAR_STYLE_ID = "vintage-guide-scrollbar-hide";
function ensureScrollbarStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCROLLBAR_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SCROLLBAR_STYLE_ID;
  style.textContent = `.vg-year-row::-webkit-scrollbar { display: none; }`;
  document.head.appendChild(style);
}

export default function VintageGuide() {
  const [selectedYear, setSelectedYear] = useState(2020);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [expandedCell, setExpandedCell] = useState<{ regionId: string; year: number } | null>(null);
  const yearRowRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Inject scrollbar-hide CSS
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

  // Group vintage data for chart view by year
  const chartData = useMemo(() => {
    return YEARS.map(year => ({
      year,
      regions: vintageData.map(rv => {
        const v = rv.vintages.find(v => v.year === year);
        return {
          regionId: rv.regionId,
          regionLabel: rv.regionLabel,
          score: v?.score ?? null,
          maturity: v?.maturity ?? null,
          note: notesMap.get(`${rv.regionId}:${year}`) || null,
        };
      }),
    }));
  }, []);

  return (
    <div className="page-scroll" style={{
      background: "#F7F4EF",
      padding: "32px 16px 80px",
      maxWidth: 1100,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 4px" }}>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#1A1410",
          margin: 0,
          lineHeight: 1.2,
        }}>Vintage Guide</h1>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 300,
          color: "#5A5248",
          margin: "6px 0 0",
        }}>How each year shaped the wine</p>
      </div>

      {/* Controls: year pills + view toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}>
        {/* Year pills — horizontally scrollable with scroll-snap */}
        <div
          ref={yearRowRef}
          className="vg-year-row"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            flex: 1,
            paddingBottom: 2,
            scrollbarWidth: "none", // Firefox
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {YEARS.map(year => (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                fontWeight: selectedYear === year ? 700 : 500,
                color: selectedYear === year ? "#F7F4EF" : "#5A5248",
                background: selectedYear === year ? "#8C1C2E" : "#fff",
                border: `1px solid ${selectedYear === year ? "#8C1C2E" : "#EDEAE3"}`,
                borderRadius: 14,
                padding: "8px 14px",
                minHeight: 36,
                minWidth: 52,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
                scrollSnapAlign: "center",
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{
          display: "flex",
          background: "#fff",
          border: "1px solid #EDEAE3",
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {(["chart", "table"] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: viewMode === mode ? "#F7F4EF" : "#5A5248",
                background: viewMode === mode ? "#8C1C2E" : "transparent",
                border: "none",
                padding: "8px 16px",
                minHeight: 36,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ CHART VIEW ═══════ */}
      {viewMode === "chart" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {chartData.map(({ year, regions }) => (
            <div
              key={year}
              ref={el => { if (el) sectionRefs.current.set(year, el); }}
              style={{
                background: "#fff",
                border: "1px solid #EDEAE3",
                borderRadius: 12,
                padding: "16px",
                boxShadow: year === selectedYear ? "0 0 0 2px #8C1C2E" : "none",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1A1410",
                marginBottom: 12,
              }}>{year}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {regions.map(r => (
                  <div key={r.regionId} style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #F0EDE6",
                  }}>
                    {/* Region row — responsive flex layout */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}>
                      {/* Region name */}
                      <span style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#5A5248",
                        minWidth: 100,
                        flex: "0 0 auto",
                      }}>{r.regionLabel}</span>

                      {/* Score pill */}
                      <span style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: scorePillFg(r.score),
                        background: scorePillBg(r.score),
                        borderRadius: 10,
                        padding: "3px 10px",
                        textAlign: "center",
                        minWidth: 36,
                        flexShrink: 0,
                      }}>
                        {r.score !== null ? r.score : "–"}
                      </span>

                      {/* Quality bar — fills remaining space */}
                      <div style={{
                        height: 6,
                        background: "#F0EDE6",
                        borderRadius: 3,
                        overflow: "hidden",
                        flex: "1 1 60px",
                        minWidth: 40,
                      }}>
                        <div style={{
                          width: r.score !== null ? `${r.score}%` : "0%",
                          height: "100%",
                          background: scorePillBg(r.score),
                          borderRadius: 3,
                          transition: "width 0.3s ease",
                        }} />
                      </div>

                      {/* Maturity badge */}
                      {r.maturity ? (
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "9px",
                            fontWeight: 600,
                            color: maturityBadgeFg(r.maturity),
                            background: maturityBadgeBg(r.maturity),
                            borderRadius: 8,
                            padding: "3px 8px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >{maturityShort(r.maturity)}</span>
                      ) : null}
                    </div>

                    {/* Commentary below */}
                    {r.note && (
                      <div style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#8A8580",
                        lineHeight: 1.5,
                        paddingLeft: 2,
                        paddingTop: 6,
                      }}>{r.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════ TABLE VIEW ═══════ */}
      {viewMode === "table" && (
        <div style={{
          background: "#fff",
          border: "1px solid #EDEAE3",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              minWidth: 700,
            }}>
              <thead>
                <tr>
                  <th style={{
                    position: "sticky",
                    left: 0,
                    background: "#F7F4EF",
                    zIndex: 2,
                    padding: "10px 8px",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#5A5248",
                    borderBottom: "2px solid #EDEAE3",
                    minWidth: 100,
                  }}>Region</th>
                  {YEARS.map(year => (
                    <th
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      style={{
                        padding: "10px 2px",
                        textAlign: "center",
                        fontWeight: year === selectedYear ? 700 : 500,
                        fontSize: "10px",
                        color: year === selectedYear ? "#8C1C2E" : "#5A5248",
                        borderBottom: "2px solid #EDEAE3",
                        cursor: "pointer",
                        background: year === selectedYear ? "rgba(140,28,46,0.06)" : "transparent",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease",
                        minWidth: 38,
                      }}
                    >{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vintageData.map(rv => (
                  <tr key={rv.regionId}>
                    <td style={{
                      position: "sticky",
                      left: 0,
                      background: "#fff",
                      zIndex: 1,
                      padding: "8px 8px",
                      fontWeight: 600,
                      fontSize: "9px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#5A5248",
                      borderBottom: "1px solid #F0EDE6",
                      whiteSpace: "nowrap",
                    }}>{rv.regionLabel}</td>
                    {YEARS.map(year => {
                      const v = rv.vintages.find(v => v.year === year);
                      const score = v?.score ?? null;
                      const isExpanded = expandedCell?.regionId === rv.regionId && expandedCell?.year === year;
                      return (
                        <td
                          key={year}
                          style={{
                            padding: "4px 2px",
                            textAlign: "center",
                            borderBottom: "1px solid #F0EDE6",
                            background: isExpanded
                              ? "rgba(140,28,46,0.10)"
                              : year === selectedYear
                                ? "rgba(140,28,46,0.04)"
                                : "transparent",
                          }}
                        >
                          <button
                            onClick={() => handleCellClick(rv.regionId, year)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'Geist Mono', monospace",
                              fontWeight: 700,
                              fontSize: "11px",
                              color: scorePillFg(score),
                              background: scorePillBg(score),
                              borderRadius: 6,
                              padding: "4px 6px",
                              minWidth: 32,
                              minHeight: 28,
                              lineHeight: "18px",
                              border: isExpanded ? "2px solid #8C1C2E" : "2px solid transparent",
                              cursor: "pointer",
                              transition: "border-color 0.15s ease",
                            }}
                          >
                            {score !== null ? score : "–"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded detail panel below the table */}
          {expandedCell && (() => {
            const rv = vintageData.find(r => r.regionId === expandedCell.regionId);
            if (!rv) return null;
            const v = rv.vintages.find(v => v.year === expandedCell.year);
            const score = v?.score ?? null;
            const note = notesMap.get(`${rv.regionId}:${expandedCell.year}`) || null;
            return (
              <div style={{
                borderTop: "1px solid #EDEAE3",
                padding: "16px 20px",
                background: "rgba(140,28,46,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#5A5248",
                  }}>{rv.regionLabel}</span>
                  <span style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#1A1410",
                  }}>{expandedCell.year}</span>
                  <span style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: scorePillFg(score),
                    background: scorePillBg(score),
                    borderRadius: 8,
                    padding: "3px 10px",
                  }}>
                    {score !== null ? score : "–"}
                  </span>
                  {v?.maturity && (
                    <span style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: maturityBadgeFg(v.maturity),
                      background: maturityBadgeBg(v.maturity),
                      borderRadius: 8,
                      padding: "3px 10px",
                    }}>
                      {maturityShort(v.maturity)} — {maturityLabel(v.maturity)}
                    </span>
                  )}
                </div>
                {note ? (
                  <p style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                    color: "#5A5248",
                    lineHeight: 1.6,
                    margin: 0,
                  }}>{note}</p>
                ) : (
                  <p style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.82rem",
                    color: "#8A8580",
                    margin: 0,
                  }}>No tasting notes available for this vintage.</p>
                )}
                <button
                  onClick={() => setExpandedCell(null)}
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#8A8580",
                    background: "none",
                    border: "1px solid #EDEAE3",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                    minHeight: 32,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  Close
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
