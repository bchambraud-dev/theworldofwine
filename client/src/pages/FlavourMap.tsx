import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { flavourProfiles, type FlavourProfile } from "@/data/flavourProfiles";
import { useSEO } from "@/lib/useSEO";

type Axis = "body" | "acidity" | "tannin" | "fruit" | "earthiness" | "sweetness";
type ViewMode = "scatter" | "radar" | "proximity";

const AXES: { key: Axis; label: string }[] = [
  { key: "body", label: "Body" },
  { key: "acidity", label: "Acidity" },
  { key: "tannin", label: "Tannin" },
  { key: "fruit", label: "Fruit" },
  { key: "earthiness", label: "Earthiness" },
  { key: "sweetness", label: "Sweetness" },
];

const TYPE_COLORS: Record<string, string> = {
  red: "#8C1C2E",
  white: "#B8860B",
  sparkling: "#D4A017",
  "rosé": "#D4788C",
  fortified: "#4A1A6E",
  mixed: "#5A5248",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

export default function FlavourMap() {
  useSEO({
    title: "Wine Flavour Map — Compare Grape Profiles",
    description: "Interactive flavour map plotting 50 grape varieties by body, acidity, tannin, fruit, and sweetness. Compare profiles and discover new grapes.",
    path: "/guides/flavourmap/scatter",
  });

  const params = useParams<{ view?: string }>();
  const [, setLocation] = useLocation();
  const validViews: ViewMode[] = ["scatter", "radar", "proximity"];
  const initialView = validViews.includes(params.view as ViewMode) ? (params.view as ViewMode) : "scatter";
  const [view, setViewState] = useState<ViewMode>(initialView);
  const setView = (mode: ViewMode) => {
    setViewState(mode);
    setLocation(`/guides/flavourmap/${mode}`, { replace: true });
  };
  const [xAxis, setXAxis] = useState<Axis>("body");
  const [yAxis, setYAxis] = useState<Axis>("acidity");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!typeFilter) return flavourProfiles;
    return flavourProfiles.filter(r => r.primaryType === typeFilter);
  }, [typeFilter]);

  const toggleRegion = useCallback((id: string) => {
    setSelectedRegions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : prev.length < 3 ? [...prev, id] : [prev[1], prev[2], id]
    );
  }, []);

  return (
    <div style={{ height: "calc(100vh - 52px)", overflow: "auto", background: "var(--bg, #F7F4EF)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setLocation("/guides")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#5A5248", marginBottom: 6 }}
          >
            &larr; ACADEMY
          </button>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 1rem + 2vw, 2.4rem)", fontWeight: 400, color: "#1A1410", marginBottom: 6 }}>
            Flavour Map
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "#5A5248", maxWidth: 600, lineHeight: 1.5 }}>
            See how wine regions relate to each other based on flavour. Tap any region to compare.
          </p>
        </div>

        {/* View toggle + type filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, background: "#EDEAE3", borderRadius: 8, padding: 3 }}>
            {([["scatter", "Scatter"], ["radar", "Compare"], ["proximity", "Clusters"]] as [ViewMode, string][]).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.06em",
                  background: view === mode ? "#1A1410" : "transparent",
                  color: view === mode ? "#F7F4EF" : "#5A5248",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                style={{
                  padding: "3px 9px", borderRadius: 12,
                  border: `1px solid ${typeFilter === type ? color : "#D4D1CA"}`,
                  background: typeFilter === type ? color : "transparent",
                  color: typeFilter === type ? "#F7F4EF" : color,
                  fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 400,
                  cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {view === "scatter" && (
          <ScatterPlot data={filtered} xAxis={xAxis} yAxis={yAxis}
            onXChange={setXAxis} onYChange={setYAxis}
            hovered={hoveredRegion} onHover={setHoveredRegion}
            selected={selectedRegions} onSelect={toggleRegion} />
        )}
        {view === "radar" && (
          <RadarCompare data={flavourProfiles} selected={selectedRegions}
            onSelect={toggleRegion} onRemove={(id) => setSelectedRegions(prev => prev.filter(r => r !== id))} />
        )}
        {view === "proximity" && (
          <ProximityMap data={filtered} hovered={hoveredRegion}
            onHover={setHoveredRegion} onSelect={toggleRegion} />
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   SCATTER PLOT — mobile optimized
   ═══════════════════════════════════════════ */
function ScatterPlot({ data, xAxis, yAxis, onXChange, onYChange, hovered, onHover, selected, onSelect }: {
  data: FlavourProfile[]; xAxis: Axis; yAxis: Axis;
  onXChange: (a: Axis) => void; onYChange: (a: Axis) => void;
  hovered: string | null; onHover: (id: string | null) => void;
  selected: string[]; onSelect: (id: string) => void;
}) {
  const isMobile = useIsMobile();
  const W = isMobile ? 380 : 800;
  const H = isMobile ? 380 : 520;
  const PAD = isMobile ? 40 : 60;
  const DOT_R = isMobile ? 7 : 5;
  const FONT = isMobile ? 12 : 10;
  const LABEL_FONT = isMobile ? 11 : 12;

  const scaleX = (v: number) => PAD + ((v - 1) / 9) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - ((v - 1) / 9) * (H - PAD * 2);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", color: "#5A5248", letterSpacing: "0.1em" }}>X</span>
          <select value={xAxis} onChange={e => onXChange(e.target.value as Axis)} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "5px 8px", border: "1px solid #D4D1CA", borderRadius: 6, background: "white" }}>
            {AXES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", color: "#5A5248", letterSpacing: "0.1em" }}>Y</span>
          <select value={yAxis} onChange={e => onYChange(e.target.value as Axis)} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "5px 8px", border: "1px solid #D4D1CA", borderRadius: 6, background: "white" }}>
            {AXES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #D4D1CA", padding: isMobile ? 8 : 16, overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", touchAction: "manipulation" }}>
          {/* Grid */}
          {[1,3,5,7,9].map(v => (
            <g key={v}>
              <line x1={scaleX(v)} y1={PAD - 5} x2={scaleX(v)} y2={H - PAD + 5} stroke="#EDEAE3" strokeWidth={0.5} />
              <line x1={PAD - 5} y1={scaleY(v)} x2={W - PAD + 5} y2={scaleY(v)} stroke="#EDEAE3" strokeWidth={0.5} />
              <text x={scaleX(v)} y={H - PAD + 18} textAnchor="middle" fontSize={FONT} fill="#D4D1CA" fontFamily="'Geist Mono', monospace">{v}</text>
              <text x={PAD - 12} y={scaleY(v) + 4} textAnchor="end" fontSize={FONT} fill="#D4D1CA" fontFamily="'Geist Mono', monospace">{v}</text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={LABEL_FONT} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em">
            {AXES.find(a => a.key === xAxis)?.label.toUpperCase()}
          </text>
          <text x={8} y={H / 2} textAnchor="middle" fontSize={LABEL_FONT} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em" transform={`rotate(-90, 8, ${H / 2})`}>
            {AXES.find(a => a.key === yAxis)?.label.toUpperCase()}
          </text>

          {/* Dots */}
          {data.map(r => {
            const cx = scaleX(r[xAxis]);
            const cy = scaleY(r[yAxis]);
            const isActive = hovered === r.id || selected.includes(r.id);
            const radius = isActive ? DOT_R + 3 : DOT_R;

            return (
              <g key={r.id}
                onMouseEnter={() => onHover(r.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(r.id)}
                onTouchStart={() => onHover(r.id)}
                style={{ cursor: "pointer" }}
              >
                {isActive && <circle cx={cx} cy={cy} r={radius + 4} fill={TYPE_COLORS[r.primaryType]} opacity={0.12} />}
                <circle cx={cx} cy={cy} r={radius} fill={TYPE_COLORS[r.primaryType]} opacity={isActive ? 1 : 0.65} stroke="white" strokeWidth={1.5} />
                {isActive && (
                  <g>
                    <rect x={cx > W / 2 ? cx - r.name.length * 7 - 20 : cx + 14} y={cy - 20} width={Math.max(r.name.length * 7 + 16, 100)} height={36} rx={6} fill="#1A1410" opacity={0.92} />
                    <text x={cx > W / 2 ? cx - r.name.length * 7 - 12 : cx + 22} y={cy - 4} fontSize={isMobile ? 12 : 11} fill="#F7F4EF" fontFamily="'Jost', sans-serif" fontWeight={400}>{r.name}</text>
                    <text x={cx > W / 2 ? cx - r.name.length * 7 - 12 : cx + 22} y={cy + 10} fontSize={isMobile ? 10 : 9} fill="#D4D1CA" fontFamily="'Jost', sans-serif" fontWeight={300}>{r.signatureGrape} &middot; {r.country}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   RADAR COMPARE — mobile optimized
   ═══════════════════════════════════════════ */
function RadarCompare({ data, selected, onSelect, onRemove }: {
  data: FlavourProfile[]; selected: string[];
  onSelect: (id: string) => void; onRemove: (id: string) => void;
}) {
  const isMobile = useIsMobile();
  const SIZE = isMobile ? 340 : 500;
  const CX = SIZE / 2, CY = SIZE / 2, R = SIZE * 0.36;
  const axes = AXES;
  const angleStep = (Math.PI * 2) / axes.length;
  const COLORS = ["#8C1C2E", "#B8860B", "#4A7A52"];

  const getPoint = (ai: number, val: number) => {
    const angle = ai * angleStep - Math.PI / 2;
    const r = (val / 10) * R;
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
  };

  const getPath = (p: FlavourProfile) =>
    axes.map((a, i) => { const [x, y] = getPoint(i, p[a.key]); return `${i === 0 ? "M" : "L"}${x},${y}`; }).join(" ") + " Z";

  const selectedProfiles = selected.map(id => data.find(r => r.id === id)).filter(Boolean) as FlavourProfile[];

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#5A5248", marginBottom: 8 }}>
          {selected.length === 0 ? "Select regions to compare their flavour profiles." : `Comparing ${selected.length} region${selected.length > 1 ? "s" : ""}:`}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {selectedProfiles.map((r, i) => (
            <span key={r.id} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 14, fontSize: "0.78rem",
              fontFamily: "'Jost', sans-serif", background: COLORS[i], color: "#F7F4EF",
            }}>
              {r.name}
              <button onClick={() => onRemove(r.id)} style={{ background: "none", border: "none", color: "#F7F4EF", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>&times;</button>
            </span>
          ))}
        </div>
        {selected.length < 3 && (
          <select
            onChange={e => { if (e.target.value) onSelect(e.target.value); e.target.value = ""; }}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "6px 10px", border: "1px solid #D4D1CA", borderRadius: 8, background: "white", width: isMobile ? "100%" : "auto" }}
          >
            <option value="">+ Add region...</option>
            {data.filter(r => !selected.includes(r.id)).sort((a, b) => a.name.localeCompare(b.name)).map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.country})</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #D4D1CA", padding: isMobile ? 8 : 16, overflow: "hidden" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", maxWidth: SIZE, height: "auto", display: "block", margin: "0 auto" }}>
          {[2, 4, 6, 8, 10].map(v => (
            <circle key={v} cx={CX} cy={CY} r={(v / 10) * R} fill="none" stroke="#EDEAE3" strokeWidth={0.5} />
          ))}
          {axes.map((a, i) => {
            const [x, y] = getPoint(i, 10);
            const [lx, ly] = getPoint(i, 12);
            return (
              <g key={a.key}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke="#D4D1CA" strokeWidth={0.5} />
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize={isMobile ? 11 : 12} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.04em">{a.label}</text>
              </g>
            );
          })}
          {selectedProfiles.map((r, i) => (
            <path key={r.id} d={getPath(r)} fill={COLORS[i]} fillOpacity={0.12} stroke={COLORS[i]} strokeWidth={2} />
          ))}
          {selectedProfiles.map((r, i) =>
            axes.map((a, ai) => {
              const [x, y] = getPoint(ai, r[a.key]);
              return <circle key={`${r.id}-${a.key}`} cx={x} cy={y} r={isMobile ? 5 : 4} fill={COLORS[i]} stroke="white" strokeWidth={1.5} />;
            })
          )}
        </svg>
      </div>

      {/* Score breakdown table for mobile */}
      {selectedProfiles.length > 0 && (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #EDEAE3", fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", color: "#5A5248", fontWeight: 400 }}>REGION</th>
                {AXES.map(a => (
                  <th key={a.key} style={{ textAlign: "center", padding: "6px 6px", borderBottom: "1px solid #EDEAE3", fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.06em", color: "#5A5248", fontWeight: 400 }}>{a.label.slice(0, 4).toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedProfiles.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid #EDEAE3", color: COLORS[i], fontWeight: 500 }}>{r.name}</td>
                  {AXES.map(a => (
                    <td key={a.key} style={{ textAlign: "center", padding: "6px 6px", borderBottom: "1px solid #EDEAE3", color: "#1A1410" }}>{r[a.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════
   PROXIMITY MAP — mobile optimized
   ═══════════════════════════════════════════ */
function ProximityMap({ data, hovered, onHover, onSelect }: {
  data: FlavourProfile[]; hovered: string | null;
  onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
  const isMobile = useIsMobile();
  const W = isMobile ? 380 : 700;
  const H = isMobile ? 500 : 500;
  const DOT_R = isMobile ? 8 : 5;
  const LABEL_SIZE = isMobile ? 10 : 8;

  const nodes = useMemo(() => {
    return data.map(r => ({
      id: r.id,
      name: r.name,
      type: r.primaryType,
      grape: r.signatureGrape,
      country: r.country,
      x: 50 + ((r.body * 0.4 + r.fruit * 0.3 + r.tannin * 0.3 - 1) / 9) * (W - 100) + (Math.random() - 0.5) * 20,
      y: 50 + ((10 - (r.acidity * 0.4 + r.earthiness * 0.3 + (10 - r.sweetness) * 0.3) - 1) / 9) * (H - 100) + (Math.random() - 0.5) * 20,
    }));
  }, [data, W, H]);

  return (
    <div>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#5A5248", marginBottom: 10 }}>
        Regions that taste similar sit closer together. {isMobile ? "Tap to explore." : "Bold reds cluster bottom-right, crisp whites top-left."}
      </p>
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #D4D1CA", padding: isMobile ? 6 : 16, overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", touchAction: "manipulation" }}>
          {/* Quadrant labels */}
          <text x={40} y={30} fontSize={isMobile ? 9 : 10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.06em">CRISP &amp; LIGHT</text>
          <text x={W - 120} y={30} fontSize={isMobile ? 9 : 10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.06em">RICH &amp; FRUITY</text>
          <text x={40} y={H - 15} fontSize={isMobile ? 9 : 10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.06em">EARTHY</text>
          <text x={W - 80} y={H - 15} fontSize={isMobile ? 9 : 10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.06em">BOLD</text>

          {nodes.map(n => {
            const isActive = hovered === n.id;
            return (
              <g key={n.id}
                onMouseEnter={() => onHover(n.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => { onHover(n.id); onSelect(n.id); }}
                onTouchStart={() => onHover(hovered === n.id ? null : n.id)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={n.x} cy={n.y} r={isActive ? DOT_R + 3 : DOT_R} fill={TYPE_COLORS[n.type] || "#5A5248"} opacity={isActive ? 1 : 0.6} stroke="white" strokeWidth={1.5} />
                {isActive ? (
                  <g>
                    <rect x={n.x > W / 2 ? n.x - 140 : n.x + 14} y={n.y - 22} width={130} height={38} rx={6} fill="#1A1410" opacity={0.92} />
                    <text x={n.x > W / 2 ? n.x - 132 : n.x + 22} y={n.y - 4} fontSize={isMobile ? 12 : 11} fill="#F7F4EF" fontFamily="'Jost', sans-serif" fontWeight={400}>{n.name}</text>
                    <text x={n.x > W / 2 ? n.x - 132 : n.x + 22} y={n.y + 10} fontSize={isMobile ? 10 : 9} fill="#D4D1CA" fontFamily="'Jost', sans-serif" fontWeight={300}>{n.grape} &middot; {n.country}</text>
                  </g>
                ) : !isMobile && (
                  <text x={n.x} y={n.y - 10} textAnchor="middle" fontSize={LABEL_SIZE} fill="#5A5248" fontFamily="'Jost', sans-serif" opacity={0.5}>
                    {n.name.length > 10 ? n.name.split(/[\s&]/)[0] : n.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
