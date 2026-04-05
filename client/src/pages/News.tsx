import NewsFeed from "@/components/NewsFeed";
import { newsItems } from "@/data/news";
import { useLocation, useRoute } from "wouter";

export default function News() {
  const [, setLocation] = useLocation();
  const [, newsParams] = useRoute("/news/:newsId");

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
