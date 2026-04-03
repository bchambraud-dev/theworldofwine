import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import WineMap from "@/components/WineMap";
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

          {/* Zoom controls handled by MapLibre */}
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
                <div className="lv-regions-grid" style={{ padding: "12px 0 16px" }}>
                  {listRegions.map((region) => (
                    <div
                      key={region.id}
                      className={`lv-region-card${(region as any)._dimmed ? ' lv-rc-dimmed' : ''}`}
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
                        <p className="lv-rc-desc" dangerouslySetInnerHTML={{ __html: region.description }} />
                        <div className="lv-rc-footer">
                          <div className="lv-rc-stats">
                            {store.hasActiveFilter && (region as any)._matchCount !== 999 ? (
                              <span className="lv-rc-match"><strong>{(region as any)._matchCount}</strong> match{(region as any)._matchCount !== 1 ? 'es' : ''}</span>
                            ) : null}
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
                          <div className="lv-pc-bio" dangerouslySetInnerHTML={{ __html: producer.description }} />
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
