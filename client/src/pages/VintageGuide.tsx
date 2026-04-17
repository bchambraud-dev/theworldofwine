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

export default function VintageGuide() {
  const [selectedYear, setSelectedYear] = useState(2020);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [hoveredCell, setHoveredCell] = useState<{ regionId: string; year: number } | null>(null);
  const yearRowRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const handleYearClick = useCallback((year: number) => {
    setSelectedYear(year);
    if (viewMode === "chart") {
      const el = sectionRefs.current.get(year);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [viewMode]);

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

  const containerStyle: React.CSSProperties = {
    minHeight: "calc(100vh - 56px)",
    background: "#F7F4EF",
    padding: "32px 24px 80px",
    maxWidth: 1100,
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: 28,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1A1410",
          margin: 0,
          lineHeight: 1.2,
        }}>Vintage Guide</h1>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 300,
          color: "#5A5248",
          margin: "6px 0 0",
        }}>How each year shaped the wine</p>
      </div>

      {/* Controls: year pills + view toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
      }}>
        {/* Year pills */}
        <div
          ref={yearRowRef}
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            flex: 1,
            paddingBottom: 4,
            scrollbarWidth: "thin",
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
                padding: "4px 10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
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
                padding: "6px 14px",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {chartData.map(({ year, regions }) => (
            <div
              key={year}
              ref={el => { if (el) sectionRefs.current.set(year, el); }}
              style={{
                background: "#fff",
                border: "1px solid #EDEAE3",
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: year === selectedYear ? "0 0 0 2px #8C1C2E" : "none",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1A1410",
                marginBottom: 16,
              }}>{year}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {regions.map(r => (
                  <div key={r.regionId} style={{
                    display: "grid",
                    gridTemplateColumns: "160px 44px 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "6px 0",
                    borderBottom: "1px solid #F0EDE6",
                  }}>
                    {/* Region name */}
                    <span style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#5A5248",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>{r.regionLabel}</span>

                    {/* Score pill */}
                    <span style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: scorePillFg(r.score),
                      background: scorePillBg(r.score),
                      borderRadius: 10,
                      padding: "2px 8px",
                      textAlign: "center",
                      minWidth: 36,
                    }}>
                      {r.score !== null ? r.score : "–"}
                    </span>

                    {/* Quality bar */}
                    <div style={{
                      height: 6,
                      background: "#F0EDE6",
                      borderRadius: 3,
                      overflow: "hidden",
                      minWidth: 60,
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
                        title={maturityLabel(r.maturity)}
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: "9px",
                          fontWeight: 600,
                          color: maturityBadgeFg(r.maturity),
                          background: maturityBadgeBg(r.maturity),
                          borderRadius: 8,
                          padding: "2px 8px",
                          whiteSpace: "nowrap",
                        }}
                      >{maturityShort(r.maturity)}</span>
                    ) : <span />}

                    {/* Commentary — spans full row below */}
                    {r.note && (
                      <div style={{
                        gridColumn: "1 / -1",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#8A8580",
                        lineHeight: 1.5,
                        paddingLeft: 4,
                        paddingBottom: 2,
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
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              minWidth: 800,
            }}>
              <thead>
                <tr>
                  <th style={{
                    position: "sticky",
                    left: 0,
                    background: "#F7F4EF",
                    zIndex: 2,
                    padding: "10px 12px",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#5A5248",
                    borderBottom: "2px solid #EDEAE3",
                    minWidth: 140,
                  }}>Region</th>
                  {YEARS.map(year => (
                    <th
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: year === selectedYear ? 700 : 500,
                        fontSize: "10px",
                        color: year === selectedYear ? "#8C1C2E" : "#5A5248",
                        borderBottom: "2px solid #EDEAE3",
                        cursor: "pointer",
                        background: year === selectedYear ? "rgba(140,28,46,0.06)" : "transparent",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease",
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
                      padding: "8px 12px",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#5A5248",
                      borderBottom: "1px solid #F0EDE6",
                      whiteSpace: "nowrap",
                    }}>{rv.regionLabel}</td>
                    {YEARS.map(year => {
                      const v = rv.vintages.find(v => v.year === year);
                      const score = v?.score ?? null;
                      const note = notesMap.get(`${rv.regionId}:${year}`) || null;
                      const isHovered = hoveredCell?.regionId === rv.regionId && hoveredCell?.year === year;
                      return (
                        <td
                          key={year}
                          onMouseEnter={() => setHoveredCell({ regionId: rv.regionId, year })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            padding: "6px 4px",
                            textAlign: "center",
                            borderBottom: "1px solid #F0EDE6",
                            background: year === selectedYear
                              ? "rgba(140,28,46,0.04)"
                              : "transparent",
                            position: "relative",
                          }}
                        >
                          <span style={{
                            display: "inline-block",
                            fontWeight: 700,
                            fontSize: "11px",
                            color: scorePillFg(score),
                            background: scorePillBg(score),
                            borderRadius: 6,
                            padding: "2px 6px",
                            minWidth: 28,
                            lineHeight: "18px",
                          }}>
                            {score !== null ? score : "–"}
                          </span>
                          {/* Tooltip on hover */}
                          {isHovered && note && (
                            <div style={{
                              position: "absolute",
                              bottom: "100%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "rgba(26,20,16,0.95)",
                              color: "#F7F4EF",
                              fontFamily: "'Jost', sans-serif",
                              fontSize: "11px",
                              fontStyle: "italic",
                              lineHeight: 1.5,
                              padding: "8px 12px",
                              borderRadius: 8,
                              maxWidth: 260,
                              whiteSpace: "normal",
                              textAlign: "left",
                              zIndex: 10,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                              pointerEvents: "none",
                            }}>
                              <div style={{
                                fontFamily: "'Geist Mono', monospace",
                                fontSize: "9px",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: 4,
                                opacity: 0.7,
                              }}>{rv.regionLabel} {year}</div>
                              {note}
                              {v?.maturity && (
                                <div style={{ marginTop: 4, opacity: 0.7, fontSize: "10px" }}>
                                  {maturityLabel(v.maturity)}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
