import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { flavourProfiles, type FlavourProfile } from "@/data/flavourProfiles";

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
  rosé: "#D4788C",
  fortified: "#4A1A6E",
  mixed: "#5A5248",
};

export default function FlavourMap() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<ViewMode>("scatter");
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => setLocation("/guides")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#5A5248", marginBottom: 8 }}
          >
            &larr; ACADEMY
          </button>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 1rem + 2vw, 2.4rem)", fontWeight: 400, color: "#1A1410", marginBottom: 8 }}>
            Flavour Map
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 300, color: "#5A5248", maxWidth: 600, lineHeight: 1.6 }}>
            See how wine regions relate to each other based on flavour. Click any region to compare, drag the axes to explore different dimensions.
          </p>
        </div>

        {/* View toggle + filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
          {/* View mode tabs */}
          <div style={{ display: "flex", gap: 2, background: "#EDEAE3", borderRadius: 8, padding: 3 }}>
            {([["scatter", "Scatter"], ["radar", "Compare"], ["proximity", "Clusters"]] as [ViewMode, string][]).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                style={{
                  padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em",
                  background: view === mode ? "#1A1410" : "transparent",
                  color: view === mode ? "#F7F4EF" : "#5A5248",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Type filter chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                style={{
                  padding: "4px 10px", borderRadius: 12,
                  border: `1px solid ${typeFilter === type ? color : "#D4D1CA"}`,
                  background: typeFilter === type ? color : "transparent",
                  color: typeFilter === type ? "#F7F4EF" : color,
                  fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 400,
                  cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Scatter view */}
        {view === "scatter" && (
          <ScatterPlot
            data={filtered}
            xAxis={xAxis}
            yAxis={yAxis}
            onXChange={setXAxis}
            onYChange={setYAxis}
            hovered={hoveredRegion}
            onHover={setHoveredRegion}
            selected={selectedRegions}
            onSelect={toggleRegion}
          />
        )}

        {/* Radar compare view */}
        {view === "radar" && (
          <RadarCompare
            data={flavourProfiles}
            selected={selectedRegions}
            onSelect={toggleRegion}
            onRemove={(id) => setSelectedRegions(prev => prev.filter(r => r !== id))}
          />
        )}

        {/* Proximity/cluster view */}
        {view === "proximity" && (
          <ProximityMap
            data={filtered}
            hovered={hoveredRegion}
            onHover={setHoveredRegion}
            onSelect={toggleRegion}
          />
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   SCATTER PLOT
   ═══════════════════════════════════════════ */
function ScatterPlot({ data, xAxis, yAxis, onXChange, onYChange, hovered, onHover, selected, onSelect }: {
  data: FlavourProfile[]; xAxis: Axis; yAxis: Axis;
  onXChange: (a: Axis) => void; onYChange: (a: Axis) => void;
  hovered: string | null; onHover: (id: string | null) => void;
  selected: string[]; onSelect: (id: string) => void;
}) {
  const W = 800, H = 520, PAD = 60;

  const scaleX = (v: number) => PAD + ((v - 1) / 9) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - ((v - 1) / 9) * (H - PAD * 2);

  return (
    <div>
      {/* Axis selectors */}
      <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "#5A5248", letterSpacing: "0.1em" }}>X-AXIS</span>
          <select value={xAxis} onChange={e => onXChange(e.target.value as Axis)} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "4px 8px", border: "1px solid #D4D1CA", borderRadius: 6, background: "white", color: "#1A1410" }}>
            {AXES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "#5A5248", letterSpacing: "0.1em" }}>Y-AXIS</span>
          <select value={yAxis} onChange={e => onYChange(e.target.value as Axis)} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "4px 8px", border: "1px solid #D4D1CA", borderRadius: 6, background: "white", color: "#1A1410" }}>
            {AXES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid #D4D1CA", padding: 16, overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, height: "auto" }}>
          {/* Grid lines */}
          {[1,2,3,4,5,6,7,8,9,10].map(v => (
            <g key={v}>
              <line x1={scaleX(v)} y1={PAD - 10} x2={scaleX(v)} y2={H - PAD + 10} stroke="#EDEAE3" strokeWidth={0.5} />
              <line x1={PAD - 10} y1={scaleY(v)} x2={W - PAD + 10} y2={scaleY(v)} stroke="#EDEAE3" strokeWidth={0.5} />
              <text x={scaleX(v)} y={H - PAD + 28} textAnchor="middle" fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace">{v}</text>
              <text x={PAD - 18} y={scaleY(v) + 4} textAnchor="end" fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace">{v}</text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.1em">
            {AXES.find(a => a.key === xAxis)?.label.toUpperCase()}
          </text>
          <text x={14} y={H / 2} textAnchor="middle" fontSize={12} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.1em" transform={`rotate(-90, 14, ${H / 2})`}>
            {AXES.find(a => a.key === yAxis)?.label.toUpperCase()}
          </text>

          {/* Region dots */}
          {data.map(r => {
            const cx = scaleX(r[xAxis]);
            const cy = scaleY(r[yAxis]);
            const isHovered = hovered === r.id;
            const isSelected = selected.includes(r.id);
            const radius = isHovered || isSelected ? 8 : 5;

            return (
              <g key={r.id}
                onMouseEnter={() => onHover(r.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(r.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow for selected */}
                {isSelected && <circle cx={cx} cy={cy} r={12} fill={TYPE_COLORS[r.primaryType]} opacity={0.15} />}
                <circle cx={cx} cy={cy} r={radius} fill={TYPE_COLORS[r.primaryType]} opacity={isHovered || isSelected ? 1 : 0.7} stroke="white" strokeWidth={1.5} />
                {/* Label */}
                {(isHovered || isSelected) && (
                  <g>
                    <rect x={cx + 12} y={cy - 18} width={r.name.length * 7 + 16} height={32} rx={6} fill="#1A1410" opacity={0.9} />
                    <text x={cx + 20} y={cy - 2} fontSize={11} fill="#F7F4EF" fontFamily="'Jost', sans-serif" fontWeight={400}>{r.name}</text>
                    <text x={cx + 20} y={cy + 10} fontSize={9} fill="#D4D1CA" fontFamily="'Jost', sans-serif" fontWeight={300}>{r.signatureGrape}</text>
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
   RADAR COMPARE
   ═══════════════════════════════════════════ */
function RadarCompare({ data, selected, onSelect, onRemove }: {
  data: FlavourProfile[]; selected: string[];
  onSelect: (id: string) => void; onRemove: (id: string) => void;
}) {
  const CX = 250, CY = 250, R = 180;
  const axes = AXES;
  const angleStep = (Math.PI * 2) / axes.length;
  const COMPARE_COLORS = ["#8C1C2E", "#B8860B", "#4A7A52"];

  const getPoint = (axisIndex: number, value: number) => {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = (value / 10) * R;
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
  };

  const getPath = (profile: FlavourProfile) => {
    return axes.map((a, i) => {
      const [x, y] = getPoint(i, profile[a.key]);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ") + " Z";
  };

  const selectedProfiles = selected.map(id => data.find(r => r.id === id)).filter(Boolean) as FlavourProfile[];

  return (
    <div>
      {/* Region selector */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#5A5248", marginBottom: 8 }}>
          Select up to 3 regions to compare. {selected.length === 0 && "Click any region below."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selectedProfiles.map((r, i) => (
            <span key={r.id} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 12, fontSize: "0.78rem",
              fontFamily: "'Jost', sans-serif", fontWeight: 400,
              background: COMPARE_COLORS[i], color: "#F7F4EF",
            }}>
              {r.name}
              <button onClick={() => onRemove(r.id)} style={{ background: "none", border: "none", color: "#F7F4EF", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>&times;</button>
            </span>
          ))}
        </div>
        {selected.length < 3 && (
          <select
            onChange={e => { if (e.target.value) onSelect(e.target.value); e.target.value = ""; }}
            style={{ marginTop: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", padding: "6px 10px", border: "1px solid #D4D1CA", borderRadius: 8, background: "white", color: "#1A1410" }}
          >
            <option value="">+ Add region...</option>
            {data.filter(r => !selected.includes(r.id)).sort((a, b) => a.name.localeCompare(b.name)).map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.country})</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid #D4D1CA", padding: 16, overflowX: "auto" }}>
        <svg viewBox={`0 0 ${CX * 2} ${CY * 2}`} style={{ width: "100%", maxWidth: 500, height: "auto", display: "block", margin: "0 auto" }}>
          {/* Grid rings */}
          {[2, 4, 6, 8, 10].map(v => (
            <circle key={v} cx={CX} cy={CY} r={(v / 10) * R} fill="none" stroke="#EDEAE3" strokeWidth={0.5} />
          ))}

          {/* Axis lines + labels */}
          {axes.map((a, i) => {
            const [x, y] = getPoint(i, 10);
            const [lx, ly] = getPoint(i, 11.5);
            return (
              <g key={a.key}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke="#D4D1CA" strokeWidth={0.5} />
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize={11} fill="#5A5248" fontFamily="'Geist Mono', monospace" letterSpacing="0.05em">
                  {a.label}
                </text>
              </g>
            );
          })}

          {/* Region polygons */}
          {selectedProfiles.map((r, i) => (
            <path key={r.id} d={getPath(r)} fill={COMPARE_COLORS[i]} fillOpacity={0.12} stroke={COMPARE_COLORS[i]} strokeWidth={2} />
          ))}

          {/* Value dots */}
          {selectedProfiles.map((r, i) =>
            axes.map((a, ai) => {
              const [x, y] = getPoint(ai, r[a.key]);
              return <circle key={`${r.id}-${a.key}`} cx={x} cy={y} r={4} fill={COMPARE_COLORS[i]} stroke="white" strokeWidth={1.5} />;
            })
          )}
        </svg>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   PROXIMITY MAP (force-directed clusters)
   ═══════════════════════════════════════════ */
function ProximityMap({ data, hovered, onHover, onSelect }: {
  data: FlavourProfile[]; hovered: string | null;
  onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<{ id: string; x: number; y: number; name: string; type: string; grape: string }[]>([]);

  // Calculate similarity and layout using simple force simulation
  useEffect(() => {
    const W = 700, H = 500;

    // Distance function between two profiles
    const dist = (a: FlavourProfile, b: FlavourProfile) => {
      return Math.sqrt(
        (a.body - b.body) ** 2 + (a.acidity - b.acidity) ** 2 + (a.tannin - b.tannin) ** 2 +
        (a.fruit - b.fruit) ** 2 + (a.earthiness - b.earthiness) ** 2 + (a.sweetness - b.sweetness) ** 2
      );
    };

    // Use MDS-like approach: place regions based on first two principal components
    // Simplified: use body+fruit as X, acidity+earthiness as Y
    const simpleNodes = data.map(r => ({
      id: r.id,
      name: r.name,
      type: r.primaryType,
      grape: r.signatureGrape,
      x: 60 + ((r.body * 0.4 + r.fruit * 0.3 + r.tannin * 0.3 - 1) / 9) * (W - 120) + (Math.random() - 0.5) * 30,
      y: 60 + ((10 - (r.acidity * 0.4 + r.earthiness * 0.3 + (10 - r.sweetness) * 0.3) - 1) / 9) * (H - 120) + (Math.random() - 0.5) * 30,
    }));

    setNodes(simpleNodes);
  }, [data]);

  return (
    <div>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#5A5248", marginBottom: 12 }}>
        Regions that taste similar sit closer together. Bold reds cluster bottom-right, crisp whites top-left.
      </p>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #D4D1CA", padding: 16, overflowX: "auto" }}>
        <svg ref={svgRef} viewBox="0 0 700 500" style={{ width: "100%", maxWidth: 700, height: "auto" }}>
          {/* Quadrant labels */}
          <text x={60} y={40} fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em">CRISP &amp; LIGHT</text>
          <text x={550} y={40} fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em">RICH &amp; FRUITY</text>
          <text x={60} y={490} fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em">EARTHY &amp; MINERAL</text>
          <text x={530} y={490} fontSize={10} fill="#D4D1CA" fontFamily="'Geist Mono', monospace" letterSpacing="0.08em">BOLD &amp; POWERFUL</text>

          {/* Region nodes */}
          {nodes.map(n => {
            const isHovered = hovered === n.id;
            return (
              <g key={n.id}
                onMouseEnter={() => onHover(n.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(n.id)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={n.x} cy={n.y} r={isHovered ? 8 : 5} fill={TYPE_COLORS[n.type] || "#5A5248"} opacity={isHovered ? 1 : 0.65} stroke="white" strokeWidth={1.5} />
                {isHovered && (
                  <g>
                    <rect x={n.x + 12} y={n.y - 18} width={n.name.length * 7 + 16} height={32} rx={6} fill="#1A1410" opacity={0.9} />
                    <text x={n.x + 20} y={n.y - 2} fontSize={11} fill="#F7F4EF" fontFamily="'Jost', sans-serif">{n.name}</text>
                    <text x={n.x + 20} y={n.y + 10} fontSize={9} fill="#D4D1CA" fontFamily="'Jost', sans-serif">{n.grape}</text>
                  </g>
                )}
                {!isHovered && (
                  <text x={n.x} y={n.y - 10} textAnchor="middle" fontSize={8} fill="#5A5248" fontFamily="'Jost', sans-serif" opacity={0.6}>
                    {n.name.length > 12 ? n.name.split(" ")[0] : n.name}
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
