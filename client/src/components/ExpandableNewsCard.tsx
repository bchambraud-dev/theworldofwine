import { useState } from "react";
import type { NewsItem } from "@/data/news";

interface Props {
  item: NewsItem;
  testId?: string;
}

export default function ExpandableNewsCard({ item, testId }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sp-news-card ${expanded ? "sp-news-expanded" : ""}`}
      data-testid={testId}
      onClick={() => setExpanded(!expanded)}
      style={{ cursor: "pointer" }}
    >
      <div className="sp-news-cat">{item.tags[0] || "Wine"}</div>
      <div className="sp-news-title">{item.title}</div>

      {!expanded ? (
        <>
          <div
            className="sp-news-summary"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.summary}
          </div>
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.55rem",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              color: "var(--wine)",
              marginTop: 6,
            }}
          >
            Read more
          </div>
        </>
      ) : (
        <>
          <div
            className="sp-news-full"
            dangerouslySetInnerHTML={{ __html: item.fullContent || item.summary }}
            style={{
              fontSize: "0.82rem",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "var(--text)",
              marginTop: 8,
            }}
          />
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.55rem",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              color: "var(--text3)",
              marginTop: 8,
            }}
          >
            Read less
          </div>
        </>
      )}

      <div className="sp-news-footer">
        <span className="sp-news-source">{item.source}</span>
        <span className="sp-news-source">
          {new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
