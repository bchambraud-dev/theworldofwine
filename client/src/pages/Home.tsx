import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Map,
  SlidersHorizontal,
  Newspaper,
  X,
} from "lucide-react";
import WineMap from "@/components/WineMap";
import FilterPanel from "@/components/FilterPanel";
import RegionDetail from "@/components/RegionDetail";
import ProducerDetail from "@/components/ProducerDetail";
import NewsFeed from "@/components/NewsFeed";
import { useWineStore } from "@/lib/store";

type MobileTab = "map" | "filters" | "news";

export default function Home() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const store = useWineStore();

  // On mobile, when a region/producer is selected, show it
  const hasDetail =
    (store.detailView === "region" && store.selectedRegion) ||
    (store.detailView === "producer" && store.selectedProducer);

  // When detail opens on mobile, switch to map tab so user sees it
  useEffect(() => {
    if (hasDetail) {
      setMobileTab("map");
    }
  }, [hasDetail]);

  const leftContent =
    store.detailView === "region" && store.selectedRegion ? (
      <RegionDetail
        region={store.selectedRegion}
        producers={store.allProducers}
        onClose={store.closeDetail}
        onSelectProducer={store.selectProducer}
      />
    ) : store.detailView === "producer" && store.selectedProducer ? (
      <ProducerDetail
        producer={store.selectedProducer}
        onClose={store.closeDetail}
        onSelectRegion={store.selectRegion}
      />
    ) : (
      <FilterPanel
        filters={store.filters}
        onUpdateFilter={store.updateFilter}
        onReset={store.resetFilters}
        producerCount={store.filteredProducers.length}
      />
    );

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden bg-background"
      data-testid="app-root"
    >
      {/* Top Bar */}
      <header className="h-12 shrink-0 flex items-center justify-between px-3 md:px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Logo */}
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 md:w-7 md:h-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-label="The World of Wine"
          >
            <path d="M16 3C16 3 8 10 8 17a8 8 0 0 0 16 0c0-7-8-14-8-14Z" />
            <path d="M12 17a4 4 0 0 0 8 0" strokeWidth="1" opacity="0.5" />
            <line x1="16" y1="25" x2="16" y2="30" />
            <line x1="12" y1="30" x2="20" y2="30" />
          </svg>
          <div>
            <h1 className="text-xs md:text-sm font-bold tracking-tight leading-none">
              The World of Wine
            </h1>
            <p className="text-[9px] md:text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">
              Explore regions, producers & flavors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Desktop panel toggles */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftOpen(!leftOpen)}
            className="h-8 w-8 p-0 hidden md:flex"
            data-testid="toggle-left-panel"
            title={leftOpen ? "Hide filters" : "Show filters"}
          >
            {leftOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightOpen(!rightOpen)}
            className="h-8 w-8 p-0 hidden md:flex"
            data-testid="toggle-right-panel"
            title={rightOpen ? "Hide news" : "Show news"}
          >
            {rightOpen ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="h-8 w-8 p-0"
            data-testid="theme-toggle"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* ── DESKTOP LAYOUT (md+) ─────────────────────────────────── */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Left Panel: Filters or Detail */}
        {leftOpen && (
          <aside className="w-72 shrink-0 border-r border-border/50 bg-card flex flex-col overflow-hidden">
            {leftContent}
          </aside>
        )}

        {/* Map */}
        <main className="flex-1 relative overflow-hidden">
          <WineMap
            producers={store.filteredProducers}
            regions={store.allRegions}
            onSelectProducer={store.selectProducer}
            onSelectRegion={store.selectRegion}
            selectedRegionId={
              store.detailView === "region"
                ? store.selectedRegion?.id || null
                : store.filters.selectedRegionId
            }
            isDark={isDark}
          />

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-md border border-border/50 px-3 py-2 text-[10px] space-y-1 shadow-sm z-10">
            <div className="font-semibold text-foreground mb-1">Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[rgba(140,40,60,0.35)] border border-[rgba(140,40,60,0.6)]" />
              <span className="text-muted-foreground">Wine Region</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7a1e3a] border-2 border-white" />
              <span className="text-muted-foreground">Red Producer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c4a747] border-2 border-white" />
              <span className="text-muted-foreground">White Producer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4a853] border-2 border-white" />
              <span className="text-muted-foreground">Sparkling Producer</span>
            </div>
          </div>
        </main>

        {/* Right Panel: News */}
        {rightOpen && (
          <aside className="w-72 shrink-0 border-l border-border/50 bg-card flex flex-col overflow-hidden">
            <NewsFeed
              news={store.filteredNews}
              onSelectRegion={store.selectRegion}
              onSelectProducer={store.selectProducer}
            />
          </aside>
        )}
      </div>

      {/* ── MOBILE LAYOUT (<md) ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden relative">
        {/* Map always rendered */}
        <div className="flex-1 relative">
          <WineMap
            producers={store.filteredProducers}
            regions={store.allRegions}
            onSelectProducer={store.selectProducer}
            onSelectRegion={store.selectRegion}
            selectedRegionId={
              store.detailView === "region"
                ? store.selectedRegion?.id || null
                : store.filters.selectedRegionId
            }
            isDark={isDark}
          />

          {/* Compact mobile legend */}
          {mobileTab === "map" && !hasDetail && (
            <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm rounded-md border border-border/50 px-2 py-1.5 text-[9px] space-y-0.5 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[rgba(140,40,60,0.35)] border border-[rgba(140,40,60,0.6)]" />
                  Region
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7a1e3a] border border-white" />
                  Red
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#c4a747] border border-white" />
                  White
                </span>
              </div>
            </div>
          )}

          {/* Producer count badge on map */}
          {mobileTab === "map" && !hasDetail && (
            <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded-full border border-border/50 px-3 py-1 text-[10px] font-medium shadow-sm z-10 text-muted-foreground">
              {store.filteredProducers.length} producers
            </div>
          )}
        </div>

        {/* Mobile overlay panel for Filters */}
        {mobileTab === "filters" && (
          <div className="absolute inset-0 z-30 flex flex-col bg-background/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
              <span className="text-xs font-semibold">Filters</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setMobileTab("map")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <FilterPanel
                filters={store.filters}
                onUpdateFilter={store.updateFilter}
                onReset={store.resetFilters}
                producerCount={store.filteredProducers.length}
              />
            </div>
          </div>
        )}

        {/* Mobile overlay panel for News */}
        {mobileTab === "news" && (
          <div className="absolute inset-0 z-30 flex flex-col bg-background/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
              <span className="text-xs font-semibold">Wine News</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setMobileTab("map")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <NewsFeed
                news={store.filteredNews}
                onSelectRegion={(id) => {
                  store.selectRegion(id);
                  setMobileTab("map");
                }}
                onSelectProducer={(id) => {
                  store.selectProducer(id);
                  setMobileTab("map");
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile detail sheet (slides up from bottom) */}
        {hasDetail && (
          <div className="absolute inset-x-0 bottom-0 z-40 max-h-[70vh] flex flex-col bg-background rounded-t-2xl shadow-2xl border-t border-border/50 overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex-1 overflow-hidden">
              {store.detailView === "region" && store.selectedRegion ? (
                <RegionDetail
                  region={store.selectedRegion}
                  producers={store.allProducers}
                  onClose={store.closeDetail}
                  onSelectProducer={store.selectProducer}
                />
              ) : store.detailView === "producer" && store.selectedProducer ? (
                <ProducerDetail
                  producer={store.selectedProducer}
                  onClose={store.closeDetail}
                  onSelectRegion={store.selectRegion}
                />
              ) : null}
            </div>
          </div>
        )}

        {/* Bottom tab bar */}
        <nav className="shrink-0 h-14 flex items-stretch border-t border-border/50 bg-card/95 backdrop-blur-sm z-50 safe-area-bottom">
          <button
            onClick={() => setMobileTab("map")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              mobileTab === "map"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            data-testid="mobile-tab-map"
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <button
            onClick={() =>
              setMobileTab(mobileTab === "filters" ? "map" : "filters")
            }
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              mobileTab === "filters"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            data-testid="mobile-tab-filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Filters</span>
          </button>
          <button
            onClick={() =>
              setMobileTab(mobileTab === "news" ? "map" : "news")
            }
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
              mobileTab === "news"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            data-testid="mobile-tab-news"
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[10px] font-medium">News</span>
            {store.filteredNews.length > 0 && (
              <span className="absolute top-1.5 right-1/4 w-4 h-4 text-[8px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                {store.filteredNews.length > 9
                  ? "9+"
                  : store.filteredNews.length}
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}
