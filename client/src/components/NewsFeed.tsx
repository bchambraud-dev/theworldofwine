import { useState, useMemo } from "react";
import { newsItems, type NewsItem } from "@/data/news";

interface NewsFeedProps {
  news: NewsItem[];
  onSelectRegion: (id: string) => void;
  onSelectProducer: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  red: "var(--wine)",
  white: "var(--gold)",
  sparkling: "var(--gold)",
  sustainability: "var(--sage)",
  biodynamic: "var(--sage)",
  natural: "var(--sage)",
  luxury: "var(--plum)",
  "award winner": "var(--plum)",
  climate: "var(--sage)",
  rosé: "#d4607a",
  "vintage report": "var(--wine)",
};

function getCategoryColor(tags: string[]): string {
  for (const tag of tags) {
    const c = categoryColors[tag.toLowerCase()];
    if (c) return c;
  }
  return "var(--wine)";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Extract unique topics from all news for filter chips
function getTopics(): string[] {
  const topics = new Set<string>();
  newsItems.forEach((n) => n.tags.forEach((t) => topics.add(t)));
  return Array.from(topics).slice(0, 10);
}

export default function NewsFeed({
  news: _contextualNews,
  onSelectRegion,
  onSelectProducer,
}: NewsFeedProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const topics = useMemo(getTopics, []);

  const filteredNews = useMemo(() => {
    const all = newsItems;
    if (!activeTopic) return all;
    return all.filter((n) =>
      n.tags.some((t) => t.toLowerCase() === activeTopic.toLowerCase())
    );
  }, [activeTopic]);

  const featured = filteredNews[0];
  const rest = filteredNews.slice(1);

  return (
    <div className="news-view" data-testid="news-view">
      {/* Toolbar */}
      <div className="nv-toolbar">
        <span className="nv-title">Wine News</span>
        <span className="nv-subtitle">{filteredNews.length} Stories</span>
      </div>

      {/* Topic filter chips */}
      <div className="nv-topic-row">
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "0.58rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          color: "var(--text3)",
          whiteSpace: "nowrap",
          marginRight: 4,
          flexShrink: 0,
        }}>Topics</span>
        <button
          className={`chip ${!activeTopic ? "active" : ""}`}
          onClick={() => setActiveTopic(null)}
        >
          All
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            className={`chip ${activeTopic === topic ? "active" : ""}`}
            onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
            data-testid={`news-topic-${topic}`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* News body */}
      <div className="nv-body">
        {filteredNews.length === 0 ? (
          <div className="lv-empty">
            <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg></div>
            <div className="lv-empty-title">No stories found</div>
            <div className="lv-empty-sub">Try a different topic filter</div>
          </div>
        ) : (
          <div className="nv-grid">
            {/* Featured card */}
            {featured && (
              <div className="nv-hero">
                <div className="news-card nc-hero">
                  <div className="nc-accent" style={{ background: getCategoryColor(featured.tags) }} />
                  <div className="nc-body">
                    <div className="nc-cat" style={{ color: getCategoryColor(featured.tags) }}>
                      {featured.tags[0] || "Wine"}
                    </div>
                    <div className="nc-title">{featured.title}</div>
                    <div className="nc-summary">{featured.summary}</div>
                    <div className="nc-tags">
                      {featured.tags.map((tag) => (
                        <span key={tag} className="nc-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="nc-footer">
                      <span className="nc-source">{featured.source}</span>
                      <span className="nc-date">{formatDate(featured.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of cards */}
            {rest.map((item) => (
              <div key={item.id} className="news-card" data-testid={`news-card-${item.id}`}>
                <div className="nc-accent" style={{ background: getCategoryColor(item.tags) }} />
                <div className="nc-body">
                  <div className="nc-cat" style={{ color: getCategoryColor(item.tags) }}>
                    {item.tags[0] || "Wine"}
                  </div>
                  <div className="nc-title">{item.title}</div>
                  <div className="nc-summary" style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>{item.summary}</div>
                  <div className="nc-tags">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="nc-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="nc-footer">
                    <span className="nc-source">{item.source}</span>
                    <span className="nc-date">{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
