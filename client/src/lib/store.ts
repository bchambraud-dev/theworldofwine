import { useState, useCallback, useMemo } from "react";
import { wineRegions, type WineRegion } from "@/data/regions";
import { producers, type Producer } from "@/data/producers";
import { newsItems, type NewsItem } from "@/data/news";

export type WineColor = "red" | "white" | "rosé" | "sparkling" | "dessert" | "fortified";
export type PriceRange = "budget" | "mid" | "premium" | "luxury";
export type ListSubTab = "regions" | "producers";

export interface Filters {
  wineTypes: WineColor[];
  priceRanges: PriceRange[];
  tasteProfiles: string[];
  isNatural: boolean | null;
  isAwardWinner: boolean | null;
  selectedRegionId: string | null;
  searchQuery: string;
  countries: string[];
}

export const defaultFilters: Filters = {
  wineTypes: [],
  priceRanges: [],
  tasteProfiles: [],
  isNatural: null,
  isAwardWinner: null,
  selectedRegionId: null,
  searchQuery: "",
  countries: [],
};

export function useWineStore() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<"none" | "region" | "producer">("none");
  const [listSubTab, setListSubTab] = useState<ListSubTab>("regions");
  const [showProducers, setShowProducers] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredProducers = useMemo(() => {
    return producers.filter((p) => {
      if (filters.wineTypes.length > 0) {
        if (!p.wineType.some((t) => filters.wineTypes.includes(t))) return false;
      }
      if (filters.priceRanges.length > 0) {
        if (!filters.priceRanges.includes(p.priceRange)) return false;
      }
      if (filters.tasteProfiles.length > 0) {
        if (!filters.tasteProfiles.some((t) => p.tasteProfile.includes(t))) return false;
      }
      if (filters.isNatural !== null) {
        if (p.isNatural !== filters.isNatural) return false;
      }
      if (filters.isAwardWinner !== null) {
        if (p.isAwardWinner !== filters.isAwardWinner) return false;
      }
      if (filters.selectedRegionId) {
        if (p.regionId !== filters.selectedRegionId) return false;
      }
      if (filters.countries.length > 0) {
        if (!filters.countries.includes(p.country)) return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.country.toLowerCase().includes(q) &&
          !p.tasteProfile.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [filters]);

  // Regions: always return all, but scored by relevance to active filters
  // Higher score = more matching producers. Score of -1 = search excluded.
  const filteredRegions = useMemo(() => {
    const hasActiveFilter = filters.wineTypes.length > 0 || filters.priceRanges.length > 0 ||
      filters.tasteProfiles.length > 0 || filters.isNatural !== null || filters.isAwardWinner !== null;

    return wineRegions
      .filter((r) => {
        if (filters.countries.length > 0) {
          if (!filters.countries.includes(r.country)) return false;
        }
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (
            !r.name.toLowerCase().includes(q) &&
            !r.country.toLowerCase().includes(q) &&
            !r.grapes.some((g) => g.toLowerCase().includes(q))
          )
            return false;
        }
        return true;
      })
      .map((r) => {
        if (!hasActiveFilter) return { ...r, _matchCount: 999, _dimmed: false };
        const regionProducers = producers.filter((p) => p.regionId === r.id);
        const matchingProducers = regionProducers.filter((p) => {
          if (filters.wineTypes.length > 0 && !p.wineType.some((t) => filters.wineTypes.includes(t))) return false;
          if (filters.priceRanges.length > 0 && !filters.priceRanges.includes(p.priceRange)) return false;
          if (filters.tasteProfiles.length > 0 && !filters.tasteProfiles.some((t) => p.tasteProfile.includes(t))) return false;
          if (filters.isNatural !== null && p.isNatural !== filters.isNatural) return false;
          if (filters.isAwardWinner !== null && p.isAwardWinner !== filters.isAwardWinner) return false;
          return true;
        });
        return { ...r, _matchCount: matchingProducers.length, _dimmed: matchingProducers.length === 0 };
      })
      .sort((a, b) => (b as any)._matchCount - (a as any)._matchCount);
  }, [filters]);

  const filteredNews = useMemo(() => {
    if (selectedProducerId) {
      const producerNews = newsItems.filter((n) =>
        n.producerIds.includes(selectedProducerId)
      );
      if (producerNews.length > 0) return producerNews;
    }
    const activeRegion = selectedRegionId || filters.selectedRegionId;
    if (activeRegion) {
      const regionNews = newsItems.filter((n) =>
        n.regionIds.includes(activeRegion)
      );
      if (regionNews.length > 0) return regionNews;
    }
    if (filters.wineTypes.length > 0) {
      const typeNews = newsItems.filter((n) =>
        n.tags.some((t) => filters.wineTypes.includes(t as WineColor))
      );
      if (typeNews.length > 0) return typeNews;
    }
    return newsItems.slice(0, 12);
  }, [filters, selectedProducerId, selectedRegionId]);

  const allNews = useMemo(() => newsItems, []);

  const selectedProducer = useMemo(
    () => producers.find((p) => p.id === selectedProducerId) || null,
    [selectedProducerId]
  );

  const selectedRegion = useMemo(
    () => wineRegions.find((r) => r.id === selectedRegionId) || null,
    [selectedRegionId]
  );

  const selectProducer = useCallback((id: string | null) => {
    setSelectedProducerId(id);
    setDetailView(id ? "producer" : "none");
    if (id) setSelectedRegionId(null);
  }, []);

  const selectRegion = useCallback((id: string | null) => {
    setSelectedRegionId(id);
    setDetailView(id ? "region" : "none");
    if (id) setSelectedProducerId(null);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailView("none");
    setSelectedProducerId(null);
    setSelectedRegionId(null);
  }, []);

  const hasActiveFilter = filters.wineTypes.length > 0 || filters.priceRanges.length > 0 ||
    filters.tasteProfiles.length > 0 || filters.isNatural !== null || filters.isAwardWinner !== null ||
    filters.countries.length > 0;

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredProducers,
    filteredRegions,
    filteredNews,
    allNews,
    hasActiveFilter,
    selectedProducer,
    selectedRegion,
    detailView,
    selectProducer,
    selectRegion,
    closeDetail,
    allRegions: wineRegions,
    allProducers: producers,
    listSubTab,
    setListSubTab,
    showProducers,
    setShowProducers,
    showBoundaries,
    setShowBoundaries,
  };
}
