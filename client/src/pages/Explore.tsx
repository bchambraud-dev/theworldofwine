import { useState, useMemo, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import WineMap from "@/components/WineMap";
import RegionDetail from "@/components/RegionDetail";
import ProducerDetail from "@/components/ProducerDetail";
import { useWineStore } from "@/lib/store";
import { producers } from "@/data/producers";
import { useToast } from "@/hooks/use-toast";

export default function Explore() {
  const [isListRoute] = useRoute("/explore/list");
  const [, regionParams] = useRoute("/explore/region/:regionId");
  const [, producerParams] = useRoute("/explore/producer/:producerId");
  const [, setLocation] = useLocation();
  const store = useWineStore();
  const { toast } = useToast();

  const [vintageOn, setVintageOn] = useState(false);
  const [vintageYear, setVintageYear] = useState(2020);

  const isListView = isListRoute;

  // Auto-select region or producer from URL params
  useEffect(() => {
    if (regionParams?.regionId) {
      store.selectRegion(regionParams.regionId);
    } else if (producerParams?.producerId) {
      store.selectProducer(producerParams.producerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionParams?.regionId, producerParams?.producerId]);

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
            onSelectProducer={(id) => {
              store.selectProducer(id);
              setLocation("/explore/producer/" + id);
            }}
            onSelectRegion={(id) => {
              store.selectRegion(id);
              setLocation("/explore/region/" + id);
            }}
            selectedRegionId={
              store.detailView === "region"
                ? store.selectedRegion?.id || null
                : store.filters.selectedRegionId
            }
            showProducers={store.showProducers}
            showBoundaries={store.showBoundaries}
            hasActiveFilter={store.hasActiveFilter}
            vintageYear={vintageOn ? vintageYear : null}
          />

          {/* ── Vintage heatmap toggle ── */}
          <div style={{
            position: "absolute",
            top: 10,
            right: 50,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}>
            <button
              onClick={() => setVintageOn(v => !v)}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: vintageOn ? "#F7F4EF" : "#5A5248",
                background: vintageOn ? "#8C1C2E" : "rgba(255,255,255,0.92)",
                border: `1px solid ${vintageOn ? "#8C1C2E" : "#EDEAE3"}`,
                borderRadius: 14,
                padding: "5px 12px",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              Vintages
            </button>
            {vintageOn && (
              <div style={{
                background: "rgba(255,255,255,0.94)",
                border: "1px solid #EDEAE3",
                borderRadius: 10,
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1A1410",
                  minWidth: 36,
                }}>{vintageYear}</span>
                <input
                  type="range"
                  min={2005}
                  max={2023}
                  value={vintageYear}
                  onChange={e => setVintageYear(Number(e.target.value))}
                  style={{ width: 130, accentColor: "#8C1C2E" }}
                />
              </div>
            )}
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
                  <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg></div>
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
                        setLocation("/explore/region/" + region.id);
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
                  <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l-1 9a4 4 0 0 1-3 3.5A4 4 0 0 1 9 11L8 2z"/><line x1="12" y1="14.5" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg></div>
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
                          setLocation("/explore/producer/" + producer.id);
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
            onClose={() => {
              store.closeDetail();
              setLocation("/explore");
            }}
            onSelectProducer={(id) => {
              store.selectProducer(id);
              setLocation("/explore/producer/" + id);
            }}
          />
        ) : store.detailView === "producer" && store.selectedProducer ? (
          <ProducerDetail
            producer={store.selectedProducer}
            onClose={() => {
              store.closeDetail();
              setLocation("/explore");
            }}
            onSelectRegion={(id) => {
              store.selectRegion(id);
              setLocation("/explore/region/" + id);
            }}
          />
        ) : null}
      </div>
    </>
  );
}
