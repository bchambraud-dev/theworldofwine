import NewsFeed from "@/components/NewsFeed";
import { newsItems } from "@/data/news";
import { useLocation, useRoute } from "wouter";
import { useSEO } from "@/lib/useSEO";

export default function News() {
  const [, setLocation] = useLocation();
  const [, newsParams] = useRoute("/news/:newsId");

  useSEO({
    title: "Wine News & Stories",
    description: "Latest wine news, region spotlights, and stories from the world of wine.",
    path: "/news",
  });

  return (
    <NewsFeed
      news={newsItems.slice(0, 12)}
      autoExpandId={newsParams?.newsId || null}
      onSelectRegion={(id) => {
        setLocation("/explore/region/" + id);
      }}
      onSelectProducer={(id) => {
        setLocation("/explore/producer/" + id);
      }}
    />
  );
}
