import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import WineMap from "@/components/WineMap";
import FilterBar from "@/components/FilterBar";
import RegionDetail from "@/components/RegionDetail";
import ProducerDetail from "@/components/ProducerDetail";
import { useWineStore } from "@/lib/store";
import { producers } from "@/data/producers";
import { useToast } from "@/hooks/use-toast";

export default function Explore() {
  const [isListRoute] = useRoute("/explore/list");
  const [, setLocation] = useLocation();
  const store = useWineStore();
  const { toast } = useToast();

  const isListView = isListRoute;

  // Determine if side panel should be open
  const panelOpen =
    (store.detailView === "region" && store.selectedRegion !== null) ||
    (store.detailView === "producer" && store.selectedProducer !== null);

  // List view data
  const listRegions = store.filteredRegions;
  const listProducers = store.filteredProducers;

  // Count producers per region
  const producerCountByRegion = useMemo(() => {
    const counts: Record<string, number> = {};
    producers.forEach((p) => {
      counts[p.regionId] = (counts[p.regionId] || 0) + 1;
    });
    return counts;
  }, []);

  // Country grouping for regions
  const regionsByCountry = useMemo(() => {
    const grouped: Record<string, typeof listRegions> = {};
    listRegions.forEach((r) => {
      if (!grouped[r.country]) grouped[r.country] = [];
      grouped[r.country].push(r);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [listRegions]);

  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  // Start with all expanded
  useEffect(() => {
    setExpandedCountries(new Set(regionsByCountry.map(([c]) => c)));
  }, [regionsByCountry]);

  const toggleCountry = (country: string) => {
    setExpandedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(country)) next.delete(country);
      else next.add(country);
      return next;
    });
  };

  // Favorite placeholder handler
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Save to your journey",
      description: "Coming soon!",
    });
  };

  return (
    <>
      {/* Filter bar (shared between map and list) */}
      <FilterBar
        filters={store.filters}
        onUpdateFilter={store.updateFilter}
        onReset={store.resetFilters}
      />

      {/* ══════ MAP VIEW ══════ */}
      {!isListView && (
        <div
          style={{
            position: "fixed",
            top: "calc(var(--topbar) + var(--filterbar))",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
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
      {isListView && (
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
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                color: "var(--text3)",
                whiteSpace: "nowrap",
                marginLeft: "auto",
              }}
            >
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
                <div style={{ padding: "0 0 16px" }}>
                  {regionsByCountry.map(([country, regions]) => (
                    <div key={country}>
                      <div
                        className="country-group-header"
                        onClick={() => toggleCountry(country)}
                      >
                        <span
                          className={`country-group-chevron ${expandedCountries.has(country) ? "open" : ""}`}
                        >
                          ›
                        </span>
                        {country} ({regions.length})
                      </div>
                      {expandedCountries.has(country) && (
                        <div className="lv-regions-grid">
                          {regions.map((region) => (
                            <div
                              key={region.id}
                              className="lv-region-card"
                              onClick={() => {
                                store.selectRegion(region.id);
                                setLocation("/explore");
                              }}
                              data-testid={`list-region-${region.id}`}
                            >
                              {/* Hero image */}
                              <div className="lv-rc-img">
                                {region.image && (
                                  <img
                                    src={region.image}
                                    alt={region.name}
                                    loading="lazy"
                                  />
                                )}
                                <div className="lv-rc-img-overlay" />
                                <button
                                  className="lv-rc-fav"
                                  onClick={handleFavorite}
                                  title="Save to your journey — coming soon!"
                                  data-testid={`fav-region-${region.id}`}
                                >
                                  ♡
                                </button>
                                <div className="lv-rc-img-label">
                                  <span className="lv-rc-country">{region.country}</span>
                                </div>
                              </div>
                              {/* Content */}
                              <div className="lv-rc-content">
                                <h3 className="lv-rc-title">{region.name}</h3>
                                <p className="lv-rc-desc">{region.description}</p>
                                <div className="lv-rc-footer">
                                  <div className="lv-rc-stats">
                                    <span><strong>{producerCountByRegion[region.id] || 0}</strong> producers</span>
                                    <span><strong>{region.grapes.length}</strong> grapes</span>
                                    <span><strong>{region.notableStyles.length}</strong> styles</span>
                                  </div>
                                  <div className="lv-rc-grapes">
                                    {region.grapes.slice(0, 3).map((g) => (
                                      <span key={g} className="lv-rc-grape">{g}</span>
                                    ))}
                                    {region.grapes.length > 3 && (
                                      <span className="lv-rc-grape lv-rc-grape-more">+{region.grapes.length - 3}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                          setLocation("/explore");
                        }}
                        data-testid={`list-producer-${producer.id}`}
                      >
                        <div className="lv-pc-icon">{producer.name.charAt(0)}</div>
                        <div className="lv-pc-info">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="lv-pc-name" style={{ flex: 1 }}>{producer.name}</div>
                            <button
                              className="fav-btn"
                              onClick={handleFavorite}
                              title="Save to your journey — coming soon!"
                              data-testid={`fav-producer-${producer.id}`}
                            >
                              ♡
                            </button>
                          </div>
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
    </>
  );
}
