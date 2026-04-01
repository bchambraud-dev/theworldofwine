import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar, ExternalLink } from "lucide-react";
import type { NewsItem } from "@/data/news";

interface NewsFeedProps {
  news: NewsItem[];
  onSelectRegion: (id: string) => void;
  onSelectProducer: (id: string) => void;
}

export default function NewsFeed({
  news,
  onSelectRegion,
  onSelectProducer,
}: NewsFeedProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full" data-testid="news-feed">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-border/50">
        <Newspaper className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Wine News</span>
        <Badge variant="secondary" className="text-[10px] ml-auto">
          {news.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {news.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No news matching your filters</p>
            </div>
          ) : (
            news.map((item) => (
              <article
                key={item.id}
                className="p-3 rounded-md hover:bg-accent/50 transition-colors cursor-default group"
                data-testid={`news-item-${item.id}`}
              >
                <h3 className="text-xs font-semibold leading-snug text-foreground mb-1.5 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 line-clamp-3">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground/70">
                      {item.source}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[9px] h-4 px-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Related links */}
                <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.regionIds.slice(0, 2).map((rId) => (
                    <button
                      key={rId}
                      onClick={() => onSelectRegion(rId)}
                      className="text-[9px] text-primary hover:underline"
                    >
                      #{rId}
                    </button>
                  ))}
                  {item.producerIds.slice(0, 2).map((pId) => (
                    <button
                      key={pId}
                      onClick={() => onSelectProducer(pId)}
                      className="text-[9px] text-primary hover:underline"
                    >
                      @{pId}
                    </button>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
