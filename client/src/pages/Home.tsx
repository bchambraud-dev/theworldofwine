import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import WineMap from "@/components/WineMap";
import FilterPanel from "@/components/FilterPanel";
import RegionDetail from "@/components/RegionDetail";
import ProducerDetail from "@/components/ProducerDetail";
import NewsFeed from "@/components/NewsFeed";
import { useWineStore } from "@/lib/store";

export default function Home() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const store = useWineStore();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background" data-testid="app-root">
      {/* Top Bar */}
      <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 text-primary"
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
            <h1 className="text-sm font-bold tracking-tight leading-none">
              The World of Wine
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Explore regions, producers & flavors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftOpen(!leftOpen)}
            className="h-8 w-8 p-0 hidden sm:flex"
            data-testid="toggle-left-panel"
            title={leftOpen ? "Hide filters" : "Show filters"}
          >
            {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightOpen(!rightOpen)}
            className="h-8 w-8 p-0 hidden sm:flex"
            data-testid="toggle-right-panel"
            title={rightOpen ? "Hide news" : "Show news"}
          >
            {rightOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="h-8 w-8 p-0"
            data-testid="theme-toggle"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Filters or Detail */}
        {leftOpen && (
          <aside className="w-72 shrink-0 border-r border-border/50 bg-card flex flex-col overflow-hidden">
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
            ) : (
              <FilterPanel
                filters={store.filters}
                onUpdateFilter={store.updateFilter}
                onReset={store.resetFilters}
                producerCount={store.filteredProducers.length}
              />
            )}
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

          {/* Mobile panel toggles */}
          {!leftOpen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLeftOpen(true)}
              className="absolute top-3 left-3 h-8 z-10 shadow-sm sm:hidden"
              data-testid="open-filters-mobile"
            >
              <PanelLeft className="w-4 h-4 mr-1" />
              Filters
            </Button>
          )}
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
    </div>
  );
}
