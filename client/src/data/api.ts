/**
 * Data API wrapper — Phase 2/3 skeleton.
 * Currently wraps static data imports. Later swaps to Supabase queries.
 * Components should use this module instead of importing data directly.
 */
import { wineRegions, type WineRegion } from "./regions";
import { producers, type Producer } from "./producers";
import { newsItems, type NewsItem } from "./news";
import { journeys, type Journey } from "./journeys";
import { grapes, type GrapeVariety } from "./grapes";
import { guides, type Guide } from "./guides";
import { quizzes, type Quiz } from "./quizzes";
import { regionBoundaries } from "./regionBoundaries";

export const api = {
  // Regions
  getRegions: (): WineRegion[] => wineRegions,
  getRegion: (id: string): WineRegion | undefined => wineRegions.find((r) => r.id === id),
  getRegionsByCountry: (): Record<string, WineRegion[]> => {
    const grouped: Record<string, WineRegion[]> = {};
    wineRegions.forEach((r) => {
      if (!grouped[r.country]) grouped[r.country] = [];
      grouped[r.country].push(r);
    });
    return grouped;
  },

  // Producers
  getProducers: (): Producer[] => producers,
  getProducer: (id: string): Producer | undefined => producers.find((p) => p.id === id),
  getProducersByRegion: (regionId: string): Producer[] =>
    producers.filter((p) => p.regionId === regionId),

  // News
  getNews: (): NewsItem[] => newsItems,
  getNewsItem: (id: string): NewsItem | undefined => newsItems.find((n) => n.id === id),

  // Journeys
  getJourneys: (): Journey[] => journeys,
  getJourney: (id: string): Journey | undefined => journeys.find((j) => j.id === id),

  // Grapes
  getGrapes: (): GrapeVariety[] => grapes,
  getGrape: (id: string): GrapeVariety | undefined => grapes.find((g) => g.id === id),

  // Guides
  getGuides: (): Guide[] => guides,
  getGuide: (id: string): Guide | undefined => guides.find((g) => g.id === id),

  // Quizzes
  getQuizzes: (): Quiz[] => quizzes,
  getQuiz: (id: string): Quiz | undefined => quizzes.find((q) => q.id === id),

  // Boundaries
  getBoundaries: () => regionBoundaries,
};

export type { WineRegion, Producer, NewsItem, Journey, GrapeVariety, Guide, Quiz };
