import { useState, useMemo, useCallback, createContext, useContext } from "react";
import { wineRegions } from "@/data/regions";
import { producers } from "@/data/producers";
import { newsItems as newsArticles } from "@/data/news";

export type WineColor = "red" | "white" | "rosé" | "sparkling" | "dessert" | "fortified";
export type PriceRange = "budget" | "mid" | "premium" | "luxury";
export type ListSubTab = "regions" | "producers";

export interface Filters {
  wineTypes: WineColor[];
  priceRanges: PriceRange[];
  tasteProfiles: string[];
  countries: string[];
  isNatural: boolean | null;
  isAwardWinner: boolean | null;
  selectedRegionId: string | null;
  searchQuery: string;
}

export const defaultFilters: Filters = {
  wineTypes: [],
  priceRanges: [],
  tasteProfiles: [],
  countries: [],
  isNatural: null,
  isAwardWinner: null,
  selectedRegionId: null,
  searchQuery: "",
};

// Singleton state — shared across all components
let _filters: Filters = { ...defaultFilters };
let _listeners: Set<() => void> = new Set();

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

export function useWineStore() {
  const [, forceUpdate] = useState(0);

  // Subscribe to global state changes
  useMemo(() => {
    const listener = () => forceUpdate((n) => n + 1);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const filters = _filters;

  const setFilters = useCallback((f: Filters) => {
    _filters = f;
    notifyListeners();
  }, []);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    _filters = { ..._filters, [key]: value };
    notifyListeners();
  }, []);

  const resetFilters = useCallback(() => {
    _filters = { ...defaultFilters };
    notifyListeners();
  }, []);

  // Local UI state (not shared)
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<"none" | "region" | "producer">("none");
  const [listSubTab, setListSubTab] = useState<ListSubTab>("regions");
  const [showProducers, setShowProducers] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);

  // Filter producers
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
      if (filters.countries.length > 0) {
        const region = wineRegions.find((r) => r.id === p.regionId);
        if (region && !filters.countries.includes(region.country)) return false;
      }
      if (filters.isNatural !== null) {
        if (p.isNatural !== filters.isNatural) return false;
      }
      if (filters.isAwardWinner !== null) {
        if (p.isAwardWinner !== filters.isAwardWinner) return false;
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

  // Filter regions — always return all, scored by relevance
  const filteredRegions = useMemo(() => {
    const hasActiveProducerFilter = filters.wineTypes.length > 0 || filters.priceRanges.length > 0 ||
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
        if (!hasActiveProducerFilter) return { ...r, _matchCount: 999, _dimmed: false };
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
      const producer = producers.find((p) => p.id === selectedProducerId);
      if (producer) {
        return newsArticles.filter((n) =>
          n.tags.some((t) => t.toLowerCase().includes(producer.name.toLowerCase().split(" ")[0]))
        );
      }
    }
    if (filters.selectedRegionId || selectedRegionId) {
      const rId = filters.selectedRegionId || selectedRegionId;
      const region = wineRegions.find((r) => r.id === rId);
      if (region) {
        return newsArticles.filter((n) =>
          n.tags.some((t) => t.toLowerCase().includes(region.name.toLowerCase().split(" ")[0]))
        );
      }
    }
    return newsArticles;
  }, [filters, selectedProducerId, selectedRegionId]);

  // Derived
  const selectedProducer = useMemo(
    () => (selectedProducerId ? producers.find((p) => p.id === selectedProducerId) || null : null),
    [selectedProducerId]
  );
  const selectedRegion = useMemo(
    () => (selectedRegionId ? wineRegions.find((r) => r.id === selectedRegionId) || null : null),
    [selectedRegionId]
  );

  const selectProducer = useCallback((id: string) => {
    setSelectedProducerId(id);
    setDetailView("producer");
  }, []);

  const selectRegion = useCallback((id: string) => {
    setSelectedRegionId(id);
    setDetailView("region");
    updateFilter("selectedRegionId", id);
  }, [updateFilter]);

  const closeDetail = useCallback(() => {
    setDetailView("none");
    setSelectedProducerId(null);
    setSelectedRegionId(null);
  }, []);

  const hasActiveFilter = filters.wineTypes.length > 0 || filters.priceRanges.length > 0 ||
    filters.tasteProfiles.length > 0 || filters.countries.length > 0 ||
    filters.isNatural !== null || filters.isAwardWinner !== null;

  return {
    filters,
    updateFilter,
    setFilters,
    resetFilters,
    filteredProducers,
    filteredRegions,
    filteredNews,
    allNews: newsArticles,
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
