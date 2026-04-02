import NewsFeed from "@/components/NewsFeed";
import { newsItems } from "@/data/news";
import { useLocation } from "wouter";

export default function News() {
  const [, setLocation] = useLocation();

  return (
    <NewsFeed
      news={newsItems.slice(0, 12)}
      onSelectRegion={(id) => {
        setLocation("/explore");
      }}
      onSelectProducer={(id) => {
        setLocation("/explore");
      }}
    />
  );
}
