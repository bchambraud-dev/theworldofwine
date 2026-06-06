import React from "react";
import { wineRegions } from "@/data/regions";

/**
 * Sommy chat rich text renderer.
 *
 * Supports:
 *  - Markdown: **bold**, *italic*, _italic_, `code`, blank-line paragraphs, "- " bullets, "1. " ordered lists
 *  - Inline tags emitted by Sommy:
 *      [wine:NAME]                  → tappable wine pill (opens add-to-wishlist sheet)
 *      [region:NAME]                → tappable region link (navigates to /explore/region/:id)
 *      [vintage:YEAR]               → small black year chip
 *      [price:VALUE]                → wine-red monospace pill
 *      [taste:CATEGORY:term]        → coloured taste pill (categories: fruit, floral, earth, spice, oak, mineral, fresh)
 *      [grape:NAME]                 → italic plum text
 *
 * First-mention-only: wines and regions only get pill/link treatment on first appearance per message.
 */

interface Props {
  text: string;
  isUser?: boolean;
  onWineTap?: (wineName: string) => void;
}

const TASTE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  fruit:   { bg: "rgba(184,50,74,0.06)",   color: "rgba(160,30,55,0.9)",   border: "rgba(184,50,74,0.3)" },
  floral:  { bg: "rgba(160,80,160,0.06)",  color: "rgba(140,60,140,0.9)",  border: "rgba(160,80,160,0.3)" },
  earth:   { bg: "rgba(120,85,45,0.08)",   color: "rgba(100,70,30,0.9)",   border: "rgba(120,85,45,0.3)" },
  spice:   { bg: "rgba(200,110,40,0.07)",  color: "rgba(170,90,30,0.9)",   border: "rgba(200,110,40,0.3)" },
  oak:     { bg: "rgba(120,80,30,0.08)",   color: "rgba(100,65,20,0.95)",  border: "rgba(120,80,30,0.3)" },
  mineral: { bg: "rgba(110,130,150,0.08)", color: "rgba(80,100,125,0.9)",  border: "rgba(110,130,150,0.3)" },
  fresh:   { bg: "rgba(74,122,82,0.07)",   color: "rgba(50,100,60,0.9)",   border: "rgba(74,122,82,0.3)" },
};

// Build a name → id map for region lookup. Includes name and aliased simple terms.
function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function findRegionId(name: string): string | null {
  const slug = slugify(name);
  // Try exact id match
  let r = wineRegions.find((x) => x.id === slug);
  if (r) return r.id;
  // Try name match (case-insensitive)
  r = wineRegions.find((x) => slugify(x.name) === slug);
  if (r) return r.id;
  // Try partial match — the tagged region might be a sub-appellation
  r = wineRegions.find((x) => slug.includes(x.id) || x.id.includes(slug));
  return r?.id ?? null;
}

// Strip `**` markers that wrap inline [tag:...] tokens. Without this, lines
// like "**[wine:X] [vintage:Y]**" leak literal asterisks because tokenize()
// splits the line on tags and the opening/closing ** end up in separate
// text segments — the renderInline bold regex needs both markers in the
// same segment to match. The tags already carry their own visual emphasis
// (coloured pills, chips, price tags) so removing the now-redundant bold
// markers is the right semantic move. (Bug fix June 6 2026.)
function stripBoldAroundTags(line: string): string {
  // Match ** …content with at least one [tag]… ** and strip the markers.
  // Repeat until no more matches in case multiple bold-wrapped spans exist.
  let prev = "";
  let out = line;
  while (prev !== out) {
    prev = out;
    out = out.replace(/\*\*([^*]*\[[^\]]+\][^*]*)\*\*/g, "$1");
  }
  return out;
}

// Split a string by inline tags. Returns tokens of either { type:'text', value } or { type:'tag', kind, payload }
type Token =
  | { kind: "text"; value: string }
  | { kind: "tag"; tag: "wine" | "region" | "vintage" | "price" | "grape"; value: string }
  | { kind: "tag"; tag: "taste"; category: string; value: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  // [type:value] or [taste:cat:term] — value can include letters, numbers, spaces, hyphens, slashes, periods, currency, accented chars
  const tagRegex = /\[(wine|region|vintage|price|grape|taste):([^\]]+)\]/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(line)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ kind: "text", value: line.slice(lastIndex, m.index) });
    }
    const tagName = m[1] as "wine" | "region" | "vintage" | "price" | "grape" | "taste";
    const payload = m[2];
    if (tagName === "taste") {
      const colonIdx = payload.indexOf(":");
      if (colonIdx > -1) {
        tokens.push({ kind: "tag", tag: "taste", category: payload.slice(0, colonIdx).trim().toLowerCase(), value: payload.slice(colonIdx + 1).trim() });
      } else {
        tokens.push({ kind: "tag", tag: "taste", category: "fruit", value: payload.trim() });
      }
    } else {
      tokens.push({ kind: "tag", tag: tagName, value: payload.trim() });
    }
    lastIndex = tagRegex.lastIndex;
  }
  if (lastIndex < line.length) {
    tokens.push({ kind: "text", value: line.slice(lastIndex) });
  }
  return tokens;
}

// Render plain markdown inline (** bold **, * italic *, `code`) inside a text segment
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|_([^_]+)_)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) out.push(text.slice(lastIndex, m.index));
    const k = `${keyPrefix}-${i++}`;
    if (m[2] !== undefined) out.push(<strong key={k} style={{ fontWeight: 600 }}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<em key={k} style={{ fontStyle: "italic" }}>{m[3]}</em>);
    else if (m[4] !== undefined) out.push(<code key={k} style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.9em", background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>{m[4]}</code>);
    else if (m[5] !== undefined) out.push(<em key={k} style={{ fontStyle: "italic" }}>{m[5]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

// Render a single tagged token into a styled component
function renderTag(
  token: Token & { kind: "tag" },
  key: string,
  state: { wineSeen: Set<string>; regionSeen: Set<string> },
  onWineTap?: (name: string) => void,
  navigateRegion?: (id: string) => void,
): React.ReactNode {
  if (token.tag === "wine") {
    const wineName = token.value;
    const norm = wineName.toLowerCase().trim();
    const isFirst = !state.wineSeen.has(norm);
    state.wineSeen.add(norm);
    if (!isFirst) {
      return <span key={key} style={{ fontWeight: 600 }}>{wineName}</span>;
    }
    return (
      <span
        key={key}
        role="button"
        tabIndex={0}
        onClick={() => onWineTap?.(wineName)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onWineTap?.(wineName); } }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "#fff",
          border: "1px solid rgba(140,28,46,0.3)",
          borderRadius: 6,
          padding: "1px 8px",
          fontWeight: 500,
          color: "#8C1C2E",
          cursor: "pointer",
          textDecoration: "none",
          lineHeight: 1.4,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8C1C2E", display: "inline-block" }} />
        {wineName}
      </span>
    );
  }
  if (token.tag === "region") {
    const regionName = token.value;
    const norm = regionName.toLowerCase().trim();
    const isFirst = !state.regionSeen.has(norm);
    state.regionSeen.add(norm);
    const regionId = findRegionId(regionName);
    if (!isFirst || !regionId) {
      return <span key={key}>{regionName}</span>;
    }
    return (
      <span
        key={key}
        role="button"
        tabIndex={0}
        onClick={() => navigateRegion?.(regionId)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateRegion?.(regionId); } }}
        style={{
          color: "#1A1410",
          borderBottom: "1px dashed rgba(140,28,46,0.5)",
          cursor: "pointer",
          paddingBottom: 1,
        }}
      >
        {regionName}
      </span>
    );
  }
  if (token.tag === "vintage") {
    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          background: "#1A1410",
          color: "#F7F4EF",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.7em",
          fontWeight: 500,
          letterSpacing: "0.06em",
          padding: "2px 7px",
          borderRadius: 4,
          verticalAlign: "1px",
          marginLeft: 4,
        }}
      >
        {token.value}
      </span>
    );
  }
  if (token.tag === "price") {
    return (
      <span
        key={key}
        style={{
          color: "#8C1C2E",
          fontWeight: 500,
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.92em",
          background: "rgba(140,28,46,0.08)",
          padding: "1px 6px",
          borderRadius: 4,
        }}
      >
        {token.value}
      </span>
    );
  }
  if (token.tag === "grape") {
    return <span key={key} style={{ fontStyle: "italic", color: "#5A1A6E" }}>{token.value}</span>;
  }
  if (token.tag === "taste") {
    const palette = TASTE_COLORS[token.category] ?? TASTE_COLORS.fruit;
    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          padding: "1px 9px",
          borderRadius: 11,
          fontSize: "0.85em",
          fontFamily: "'Geist Mono', monospace",
          textTransform: "lowercase",
          letterSpacing: "0.04em",
          border: `1px solid ${palette.border}`,
          background: palette.bg,
          color: palette.color,
          lineHeight: 1.4,
          verticalAlign: "1px",
        }}
      >
        {token.value}
      </span>
    );
  }
  return null;
}

export default function SommyMarkdown({ text, isUser = false, onWineTap }: Props) {
  // For user messages, treat as plain text — no need for tag rendering
  // (user-supplied text won't have proper tags; rendering them would expose square brackets if a user typed them)
  if (isUser) {
    return <div style={{ color: "#F7F4EF", whiteSpace: "pre-wrap" }}>{text}</div>;
  }

  const navigateRegion = (id: string) => {
    // Use wouter's setLocation via a window-level event so we don't need prop drilling
    window.dispatchEvent(new CustomEvent("navigate-region", { detail: { id } }));
  };

  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let blockIdx = 0;

  // First-mention tracking lives across all blocks in the message
  const state = { wineSeen: new Set<string>(), regionSeen: new Set<string>() };

  const renderLineNodes = (line: string, keyPrefix: string): React.ReactNode[] => {
    // Pre-strip ** markers that wrap inline tags so we don't leak literal
    // asterisks. In-segment **bold** (e.g. **important**, **$120-180**) is
    // still handled by renderInline's regex.
    const tokens = tokenize(stripBoldAroundTags(line));
    return tokens.flatMap((tok, idx) => {
      if (tok.kind === "text") {
        return renderInline(tok.value, `${keyPrefix}-${idx}`);
      }
      const node = renderTag(tok, `${keyPrefix}-${idx}`, state, onWineTap, navigateRegion);
      return node ? [node] : [];
    });
  };

  const flushList = () => {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`list-${blockIdx++}`}
        style={{
          margin: "6px 0 6px 20px",
          paddingLeft: 8,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {listBuffer.items.map((item, idx) => (
          <li key={idx} style={{ lineHeight: 1.55 }}>
            {renderLineNodes(item, `li-${blockIdx}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const bulletMatch = /^[-*\u2022]\s+(.*)$/.exec(line);
    const numberedMatch = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bulletMatch) {
      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(bulletMatch[1]);
      continue;
    }
    if (numberedMatch) {
      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(numberedMatch[1]);
      continue;
    }

    flushList();
    if (line === "") {
      blocks.push(<div key={`spacer-${blockIdx++}`} style={{ height: 8 }} />);
    } else {
      blocks.push(
        <p key={`p-${blockIdx++}`} style={{ margin: 0, lineHeight: 1.55 }}>
          {renderLineNodes(line, `p-${blockIdx}`)}
        </p>
      );
    }
  }
  flushList();

  return <div style={{ color: "#1A1410" }}>{blocks}</div>;
}
