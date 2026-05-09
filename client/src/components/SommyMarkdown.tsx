import React from "react";

/**
 * Lightweight markdown renderer for Sommy chat messages.
 * Supports: **bold**, *italic*, `code`, line breaks, bullet lists, numbered lists.
 * Intentionally minimal — keeps Sommy responses easy to read without pulling in
 * a 50KB markdown lib for five features.
 */

// Inline formatting: **bold**, *italic*, `code`, _italic_
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Order matters — match longer patterns first.
  // Use a single regex scan.
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|_([^_]+)_)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      tokens.push(text.slice(lastIndex, m.index));
    }
    const key = `${keyPrefix}-${i++}`;
    if (m[2] !== undefined) {
      tokens.push(<strong key={key} style={{ fontWeight: 600 }}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      tokens.push(<em key={key} style={{ fontStyle: "italic" }}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      tokens.push(<code key={key} style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.9em", background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>{m[4]}</code>);
    } else if (m[5] !== undefined) {
      tokens.push(<em key={key} style={{ fontStyle: "italic" }}>{m[5]}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}

interface Props {
  text: string;
  isUser?: boolean;
}

export default function SommyMarkdown({ text, isUser = false }: Props) {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let blockIndex = 0;

  const flushList = () => {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`list-${blockIndex++}`}
        style={{
          margin: "6px 0 6px 20px",
          paddingLeft: 8,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {listBuffer.items.map((item, idx) => (
          <li key={idx} style={{ lineHeight: 1.55 }}>
            {renderInline(item, `li-${blockIndex}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const bulletMatch = /^[-*•]\s+(.*)$/.exec(line);
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

    // Not a list line
    flushList();
    if (line === "") {
      // Paragraph break — render a small spacer
      blocks.push(<div key={`spacer-${blockIndex++}`} style={{ height: 8 }} />);
    } else {
      blocks.push(
        <p key={`p-${blockIndex++}`} style={{ margin: 0, lineHeight: 1.55 }}>
          {renderInline(line, `p-${blockIndex}`)}
        </p>
      );
    }
  }
  flushList();

  return <div style={{ color: isUser ? "#F7F4EF" : "#1A1410" }}>{blocks}</div>;
}
