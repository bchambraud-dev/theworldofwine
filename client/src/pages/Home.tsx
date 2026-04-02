import { useState, useEffect, useMemo } from "react";
import WineMap from "@/components/WineMap";
import FilterPanel from "@/components/FilterPanel";
import RegionDetail from "@/components/RegionDetail";
import ProducerDetail from "@/components/ProducerDetail";
import NewsFeed from "@/components/NewsFeed";
import { useWineStore, type AppView } from "@/lib/store";
import { producers } from "@/data/producers";

export default function Home() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const store = useWineStore();

  // Determine if side panel should be open
  const panelOpen =
    (store.detailView === "region" && store.selectedRegion !== null) ||
    (store.detailView === "producer" && store.selectedProducer !== null);

  // When region/producer selected, switch to map view
  useEffect(() => {
    if (panelOpen && store.activeView !== "map") {
      store.setActiveView("map");
    }
  }, [panelOpen]);

  // List view filtered regions and producers
  const listRegions = store.filteredRegions;
  const listProducers = store.filteredProducers;

  // Count producers per region for list view
  const producerCountByRegion = useMemo(() => {
    const counts: Record<string, number> = {};
    producers.forEach((p) => {
      counts[p.regionId] = (counts[p.regionId] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }} data-testid="app-root">

      {/* ══════ TOP BAR ══════ */}
      <header className="topbar" data-testid="topbar">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <svg
            viewBox="0 0 32 32"
            style={{ width: 24, height: 24, color: "var(--wine)" }}
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
          <span className="logo-text">The World of Wine</span>
        </div>

        <div className="topbar-divider desktop-only" />

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search regions, producers..."
            value={store.filters.searchQuery}
            onChange={(e) => store.updateFilter("searchQuery", e.target.value)}
            data-testid="search-input"
          />
        </div>

        {/* Filter chips */}
        <FilterPanel
          filters={store.filters}
          onUpdateFilter={store.updateFilter}
          onReset={store.resetFilters}
          producerCount={store.filteredProducers.length}
        />

        <div className="topbar-divider desktop-only" />

        {/* View switcher + dark mode */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {(["map", "list", "news"] as AppView[]).map((v) => (
            <button
              key={v}
              className={`nav-btn ${store.activeView === v ? "active" : ""}`}
              onClick={() => store.setActiveView(v)}
              data-testid={`nav-${v}`}
            >
              {v}
            </button>
          ))}
          <div className="topbar-divider" />
          <button
            className="nav-btn"
            onClick={() => setIsDark(!isDark)}
            data-testid="theme-toggle"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀" : "☾"}
          </button>
        </div>
      </header>

      {/* ══════ MAP VIEW ══════ */}
      {store.activeView === "map" && (
        <div style={{ position: "fixed", top: "var(--topbar)", left: 0, right: 0, bottom: 0, zIndex: 1 }}>
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
            showProducers={store.showProducers}
            showBoundaries={store.showBoundaries}
          />

          {/* Progress badge */}
          <div className="progress-badge" data-testid="progress-badge">
            <div className="pb-title">Your Journey</div>
            <div className="pb-stats">
              <div className="pb-stat">
                <span className="pb-num">{store.allRegions.length}</span>
                <span className="pb-lbl">Regions</span>
              </div>
              <div className="pb-stat">
                <span className="pb-num">{store.filteredProducers.length}</span>
                <span className="pb-lbl">Producers</span>
              </div>
              <div className="pb-stat">
                <span className="pb-num">{store.allNews.length}</span>
                <span className="pb-lbl">Stories</span>
              </div>
            </div>
          </div>

          {/* Layers panel */}
          <div className="layers-panel" data-testid="layers-panel">
            <div className="layer-title">Map Layers</div>
            <div className="layer-row" onClick={() => store.setShowProducers(!store.showProducers)}>
              <button
                className={`toggle-switch ${store.showProducers ? "on" : ""}`}
                data-testid="toggle-producers"
              />
              <span className="layer-lbl">Producers</span>
              <span className="layer-dot" style={{ background: "var(--wine)" }} />
            </div>
            <div className="layer-row" onClick={() => store.setShowBoundaries(!store.showBoundaries)}>
              <button
                className={`toggle-switch ${store.showBoundaries ? "on" : ""}`}
                data-testid="toggle-boundaries"
              />
              <span className="layer-lbl">Region Boundaries</span>
              <span className="layer-dot" style={{ background: "rgba(140,28,46,0.4)" }} />
            </div>
          </div>
        </div>
      )}

      {/* ══════ LIST VIEW ══════ */}
      {store.activeView === "list" && (
        <div className="list-view" data-testid="list-view">
          {/* Toolbar */}
          <div className="lv-toolbar">
            <div className="lv-tab-group">
              <button
                className={`lv-tab ${store.listSubTab === "regions" ? "active" : ""}`}
                onClick={() => store.setListSubTab("regions")}
                data-testid="list-tab-regions"
              >
                Regions
              </button>
              <button
                className={`lv-tab ${store.listSubTab === "producers" ? "active" : ""}`}
                onClick={() => store.setListSubTab("producers")}
                data-testid="list-tab-producers"
              >
                Producers
              </button>
            </div>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.62rem",
              color: "var(--text3)",
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}>
              {store.listSubTab === "regions"
                ? `${listRegions.length} regions`
                : `${listProducers.length} producers`}
            </span>
          </div>

          {/* Body */}
          <div className="lv-body">
            {store.listSubTab === "regions" ? (
              listRegions.length === 0 ? (
                <div className="lv-empty">
                  <div className="lv-empty-icon">🗺️</div>
                  <div className="lv-empty-title">No regions found</div>
                  <div className="lv-empty-sub">Try adjusting your search</div>
                </div>
              ) : (
                <div className="lv-regions-list">
                  {listRegions.map((region) => (
                    <div
                      key={region.id}
                      className="lv-region-card"
                      onClick={() => {
                        store.selectRegion(region.id);
                        store.setActiveView("map");
                      }}
                      data-testid={`list-region-${region.id}`}
                    >
                      <div className="lv-rc-accent" />
                      <div className="lv-rc-body">
                        <div className="lv-rc-title">{region.name}</div>
                        <div className="lv-rc-sub">{region.country}</div>
                        <div className="lv-rc-desc">{region.description}</div>
                        <div className="lv-rc-meta">
                          <span className="lv-rc-stat">
                            <b>{producerCountByRegion[region.id] || 0}</b> producers
                          </span>
                          <span className="lv-rc-stat">
                            <b>{region.grapes.length}</b> grapes
                          </span>
                        </div>
                        <div className="lv-rc-grapes">
                          {region.grapes.slice(0, 4).map((g) => (
                            <span key={g} className="lv-rc-grape">{g}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              listProducers.length === 0 ? (
                <div className="lv-empty">
                  <div className="lv-empty-icon">🍷</div>
                  <div className="lv-empty-title">No producers found</div>
                  <div className="lv-empty-sub">Try adjusting your filters</div>
                </div>
              ) : (
                <div className="lv-producers-grid">
                  {listProducers.map((producer) => {
                    const region = store.allRegions.find((r) => r.id === producer.regionId);
                    return (
                      <div
                        key={producer.id}
                        className="lv-producer-card"
                        onClick={() => {
                          store.selectProducer(producer.id);
                          store.setActiveView("map");
                        }}
                        data-testid={`list-producer-${producer.id}`}
                      >
                        <div className="lv-pc-icon">{producer.name.charAt(0)}</div>
                        <div className="lv-pc-info">
                          <div className="lv-pc-name">{producer.name}</div>
                          <div className="lv-pc-sub">
                            {region?.name || producer.country} · Est. {producer.founded}
                          </div>
                          <div className="lv-pc-bio">{producer.description}</div>
                          <div className="lv-pc-pills">
                            {producer.wineType.map((t) => (
                              <span key={t} className="lv-pc-pill">{t}</span>
                            ))}
                            {producer.isAwardWinner && (
                              <span className="lv-pc-pill" style={{
                                background: "rgba(74,26,110,0.07)",
                                color: "var(--plum)",
                                borderColor: "rgba(74,26,110,0.2)",
                              }}>★ award</span>
                            )}
                            {producer.isNatural && (
                              <span className="lv-pc-pill" style={{
                                background: "var(--sage-pale)",
                                color: "var(--sage)",
                                borderColor: "rgba(74,122,82,0.2)",
                              }}>natural</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ══════ NEWS VIEW ══════ */}
      {store.activeView === "news" && (
        <NewsFeed
          news={store.filteredNews}
          onSelectRegion={(id) => {
            store.selectRegion(id);
            store.setActiveView("map");
          }}
          onSelectProducer={(id) => {
            store.selectProducer(id);
            store.setActiveView("map");
          }}
        />
      )}

      {/* ══════ SLIDE PANEL ══════ */}
      <div className={`side-panel ${panelOpen ? "open" : ""}`} data-testid="side-panel">
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
  );
}
