import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Filters, WineColor, PriceRange } from "@/lib/store";
import { wineRegions } from "@/data/regions";
import WineLoader from "@/components/WineLoader";

interface FilterBarProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onSetFilters: (f: Filters) => void;
  onReset: () => void;
}

/* ── Filter option definitions ── */
const wineTypeOptions: { value: WineColor; label: string }[] = [
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rosé", label: "Rosé" },
  { value: "sparkling", label: "Sparkling" },
  { value: "dessert", label: "Dessert" },
  { value: "fortified", label: "Fortified" },
];

const priceOptions: { value: PriceRange; label: string }[] = [
  { value: "budget", label: "$ Under $20" },
  { value: "mid", label: "$$ $20–50" },
  { value: "premium", label: "$$$ $50–200" },
  { value: "luxury", label: "$$$$ $200+" },
];

const worldOptions: { value: "old" | "new"; label: string }[] = [
  { value: "old", label: "Old World" },
  { value: "new", label: "New World" },
];

const topGrapes: string[] = [
  "Pinot Noir",
  "Cabernet Sauvignon",
  "Merlot",
  "Chardonnay",
  "Syrah",
  "Riesling",
  "Sangiovese",
  "Nebbiolo",
  "Tempranillo",
  "Grenache",
  "Sauvignon Blanc",
  "Pinot Grigio",
];

const flavourProfileOptions: string[] = [
  "Dark Fruit",
  "Red Fruit",
  "Floral",
  "Mineral",
  "Earthy / Terroir",
  "Oak / Toast",
  "Spice",
  "Citrus / Fresh",
  "Honey / Rich",
  "Savoury / Umami",
];

const prestigeOptions: { value: string; label: string }[] = [
  { value: "legendary", label: "Legendary" },
  { value: "iconic", label: "Iconic" },
  { value: "rising-star", label: "Rising Star" },
  { value: "established", label: "Established" },
];

const characteristicOptions: { value: string; label: string }[] = [
  { value: "biodynamic", label: "Biodynamic" },
  { value: "family-estate", label: "Family Estate" },
  { value: "old-vines", label: "Old Vines" },
  { value: "grand-cru", label: "Grand Cru" },
  { value: "cult-wine", label: "Cult Wine" },
  { value: "age-worthy", label: "Age-Worthy" },
  { value: "single-vineyard", label: "Single Vineyard" },
  { value: "organic", label: "Organic" },
  { value: "natural", label: "Natural" },
];

const chipLabels: Record<string, string> = {
  budget: "$",
  mid: "$$",
  premium: "$$$",
  luxury: "$$$$",
};

// Extract unique countries from regions data (sorted)
const allCountries: string[] = Array.from(
  new Set(wineRegions.map((r) => r.country))
).sort();

export default function FilterBar({ filters, onUpdateFilter, onSetFilters, onReset }: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Pending state — mirrors filters but not applied until Apply is clicked
  const [pending, setPending] = useState<Filters>(filters);

  // Show loader after apply
  const [showLoader, setShowLoader] = useState(false);

  // Sync pending when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setPending(filters);
    }
  }, [dropdownOpen]);

  // Close dropdown on outside click (check both trigger ref and portal panel ref)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = dropdownRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  /* ── Pending toggle helpers ── */
  const togglePendingWineType = (type: WineColor) => {
    const next = pending.wineTypes.includes(type)
      ? pending.wineTypes.filter((t) => t !== type)
      : [...pending.wineTypes, type];
    setPending((p) => ({ ...p, wineTypes: next }));
  };

  const togglePendingPrice = (price: PriceRange) => {
    const next = pending.priceRanges.includes(price)
      ? pending.priceRanges.filter((p) => p !== price)
      : [...pending.priceRanges, price];
    setPending((p) => ({ ...p, priceRanges: next }));
  };

  const togglePendingCountry = (country: string) => {
    const next = pending.countries.includes(country)
      ? pending.countries.filter((c) => c !== country)
      : [...pending.countries, country];
    setPending((p) => ({ ...p, countries: next }));
  };

  const togglePendingWorld = (value: "old" | "new") => {
    const next = pending.world.includes(value)
      ? pending.world.filter((w) => w !== value)
      : [...pending.world, value];
    setPending((p) => ({ ...p, world: next }));
  };

  const togglePendingGrape = (grape: string) => {
    const next = pending.grapeVarieties.includes(grape)
      ? pending.grapeVarieties.filter((g) => g !== grape)
      : [...pending.grapeVarieties, grape];
    setPending((p) => ({ ...p, grapeVarieties: next }));
  };

  const togglePendingFlavour = (flavour: string) => {
    const next = pending.flavourProfile.includes(flavour)
      ? pending.flavourProfile.filter((f) => f !== flavour)
      : [...pending.flavourProfile, flavour];
    setPending((p) => ({ ...p, flavourProfile: next }));
  };

  const togglePendingPrestige = (value: string) => {
    const next = pending.prestige.includes(value)
      ? pending.prestige.filter((v) => v !== value)
      : [...pending.prestige, value];
    setPending((p) => ({ ...p, prestige: next }));
  };

  const togglePendingCharacteristic = (value: string) => {
    const next = pending.characteristics.includes(value)
      ? pending.characteristics.filter((v) => v !== value)
      : [...pending.characteristics, value];
    setPending((p) => ({ ...p, characteristics: next }));
  };

  const togglePendingNatural = () => {
    setPending((p) => ({ ...p, isNatural: p.isNatural === true ? null : true }));
  };

  const togglePendingAward = () => {
    setPending((p) => ({ ...p, isAwardWinner: p.isAwardWinner === true ? null : true }));
  };

  const applyFilters = () => {
    setDropdownOpen(false);
    onSetFilters(pending);
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 800);
  };

  /* ── Live toggle helpers (chip removal acts directly on live filters) ── */
  const toggleWineType = (type: WineColor) => {
    const next = filters.wineTypes.includes(type)
      ? filters.wineTypes.filter((t) => t !== type)
      : [...filters.wineTypes, type];
    onUpdateFilter("wineTypes", next);
  };

  const togglePrice = (price: PriceRange) => {
    const next = filters.priceRanges.includes(price)
      ? filters.priceRanges.filter((p) => p !== price)
      : [...filters.priceRanges, price];
    onUpdateFilter("priceRanges", next);
  };

  const toggleCountry = (country: string) => {
    const next = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onUpdateFilter("countries", next);
  };

  const toggleWorld = (value: "old" | "new") => {
    const next = filters.world.includes(value)
      ? filters.world.filter((w) => w !== value)
      : [...filters.world, value];
    onUpdateFilter("world", next);
  };

  const toggleGrape = (grape: string) => {
    const next = filters.grapeVarieties.includes(grape)
      ? filters.grapeVarieties.filter((g) => g !== grape)
      : [...filters.grapeVarieties, grape];
    onUpdateFilter("grapeVarieties", next);
  };

  const toggleFlavour = (flavour: string) => {
    const next = filters.flavourProfile.includes(flavour)
      ? filters.flavourProfile.filter((f) => f !== flavour)
      : [...filters.flavourProfile, flavour];
    onUpdateFilter("flavourProfile", next);
  };

  const togglePrestige = (value: string) => {
    const next = filters.prestige.includes(value)
      ? filters.prestige.filter((v) => v !== value)
      : [...filters.prestige, value];
    onUpdateFilter("prestige", next);
  };

  const toggleCharacteristic = (value: string) => {
    const next = filters.characteristics.includes(value)
      ? filters.characteristics.filter((v) => v !== value)
      : [...filters.characteristics, value];
    onUpdateFilter("characteristics", next);
  };

  const toggleNatural = () => {
    onUpdateFilter("isNatural", filters.isNatural === true ? null : true);
  };

  const toggleAward = () => {
    onUpdateFilter("isAwardWinner", filters.isAwardWinner === true ? null : true);
  };

  /* ── Active chips collection ── */
  const activeChips: { key: string; label: string; category: string; onRemove: () => void }[] = [];

  filters.wineTypes.forEach((t) => {
    const opt = wineTypeOptions.find((o) => o.value === t);
    activeChips.push({
      key: `type-${t}`,
      label: opt?.label || t,
      category: "type",
      onRemove: () => toggleWineType(t),
    });
  });

  filters.priceRanges.forEach((p) => {
    activeChips.push({
      key: `price-${p}`,
      label: chipLabels[p] || p,
      category: "price",
      onRemove: () => togglePrice(p),
    });
  });

  filters.countries.forEach((c) => {
    activeChips.push({
      key: `country-${c}`,
      label: c,
      category: "region",
      onRemove: () => toggleCountry(c),
    });
  });

  filters.world.forEach((w) => {
    activeChips.push({
      key: `world-${w}`,
      label: w === "old" ? "Old World" : "New World",
      category: "region",
      onRemove: () => toggleWorld(w),
    });
  });

  filters.grapeVarieties.forEach((g) => {
    activeChips.push({
      key: `grape-${g}`,
      label: g,
      category: "grape",
      onRemove: () => toggleGrape(g),
    });
  });

  filters.flavourProfile.forEach((f) => {
    activeChips.push({
      key: `flavour-${f}`,
      label: f,
      category: "flavour",
      onRemove: () => toggleFlavour(f),
    });
  });

  filters.prestige.forEach((p) => {
    const opt = prestigeOptions.find((o) => o.value === p);
    activeChips.push({
      key: `prestige-${p}`,
      label: opt?.label || p,
      category: "prestige",
      onRemove: () => togglePrestige(p),
    });
  });

  filters.characteristics.forEach((c) => {
    const opt = characteristicOptions.find((o) => o.value === c);
    activeChips.push({
      key: `char-${c}`,
      label: opt?.label || c,
      category: "characteristic",
      onRemove: () => toggleCharacteristic(c),
    });
  });

  if (filters.isNatural) {
    activeChips.push({
      key: "natural",
      label: "Natural",
      category: "characteristic",
      onRemove: toggleNatural,
    });
  }

  if (filters.isAwardWinner) {
    activeChips.push({
      key: "award",
      label: "Award Winner",
      category: "type",
      onRemove: toggleAward,
    });
  }

  const hasActive = activeChips.length > 0;
  const hasPendingChanges = JSON.stringify(pending) !== JSON.stringify(filters);

  return (
    <>
      {/* WineLoader overlay when applying filters */}
      {showLoader && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(247,244,239,0.88)",
            backdropFilter: "blur(4px)",
          }}
          data-testid="filter-loader-overlay"
        >
          <WineLoader size="md" />
        </div>
      )}

      <div className="fb" data-testid="filter-bar">
        {/* Filter button + dropdown */}
        <div className="fb-dropdown-wrap" ref={dropdownRef}>
          <button
            className={`fb-trigger ${dropdownOpen ? "open" : ""} ${hasActive ? "has-active" : ""}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            data-testid="filter-trigger"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters</span>
            {hasActive && <span className="fb-badge">{activeChips.length}</span>}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: dropdownOpen ? "rotate(180deg)" : "", transition: "0.2s" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && createPortal(
            <>
              {/* Mobile backdrop — closes dropdown when tapped */}
              <div
                className="fb-mobile-backdrop"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="fb-dropdown" data-testid="filter-dropdown" ref={panelRef}>
                {/* Drag handle for mobile bottom sheet */}
                <div className="fb-drag-handle" aria-hidden="true" />
              <div className="fb-dd-scroll">

                {/* 1. WINE TYPE */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Wine Type</div>
                  <div className="fb-dd-options">
                    {wineTypeOptions.map((o) => (
                      <button
                        key={o.value}
                        className={`fb-dd-opt ${pending.wineTypes.includes(o.value) ? "selected" : ""}`}
                        onClick={() => togglePendingWineType(o.value)}
                      >
                        <span className="fb-dd-check">{pending.wineTypes.includes(o.value) ? "✓" : ""}</span>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. COUNTRY / REGION */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Country / Region</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {allCountries.map((country) => (
                      <button
                        key={country}
                        className={`fb-dd-opt fb-dd-opt-pill ${pending.countries.includes(country) ? "selected" : ""}`}
                        onClick={() => togglePendingCountry(country)}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. WORLD */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">World</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {worldOptions.map((o) => (
                      <button
                        key={o.value}
                        className={`fb-dd-opt fb-dd-opt-pill ${pending.world.includes(o.value) ? "selected" : ""}`}
                        onClick={() => togglePendingWorld(o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. GRAPE VARIETY */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Grape Variety</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {topGrapes.map((grape) => (
                      <button
                        key={grape}
                        className={`fb-dd-opt fb-dd-opt-pill fb-dd-opt-sage ${pending.grapeVarieties.includes(grape) ? "selected" : ""}`}
                        onClick={() => togglePendingGrape(grape)}
                      >
                        {grape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. FLAVOUR PROFILE */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Flavour Profile</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {flavourProfileOptions.map((flavour) => (
                      <button
                        key={flavour}
                        className={`fb-dd-opt fb-dd-opt-pill fb-dd-opt-gold ${pending.flavourProfile.includes(flavour) ? "selected" : ""}`}
                        onClick={() => togglePendingFlavour(flavour)}
                      >
                        {flavour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. PRICE RANGE */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Price Range</div>
                  <div className="fb-dd-options">
                    {priceOptions.map((o) => (
                      <button
                        key={o.value}
                        className={`fb-dd-opt ${pending.priceRanges.includes(o.value) ? "selected" : ""}`}
                        onClick={() => togglePendingPrice(o.value)}
                      >
                        <span className="fb-dd-check">{pending.priceRanges.includes(o.value) ? "✓" : ""}</span>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. PRESTIGE */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Prestige</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {prestigeOptions.map((o) => (
                      <button
                        key={o.value}
                        className={`fb-dd-opt fb-dd-opt-pill fb-dd-opt-plum ${pending.prestige.includes(o.value) ? "selected" : ""}`}
                        onClick={() => togglePendingPrestige(o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. CHARACTERISTICS */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Characteristics</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {characteristicOptions.map((o) => (
                      <button
                        key={o.value}
                        className={`fb-dd-opt fb-dd-opt-pill ${pending.characteristics.includes(o.value) ? "selected" : ""}`}
                        onClick={() => togglePendingCharacteristic(o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Award Winners toggle */}
                <div className="fb-dd-group">
                  <div className="fb-dd-label">Awards</div>
                  <div className="fb-dd-options">
                    <button
                      className={`fb-dd-opt ${pending.isAwardWinner === true ? "selected" : ""}`}
                      onClick={togglePendingAward}
                    >
                      <span className="fb-dd-check">{pending.isAwardWinner === true ? "✓" : ""}</span>
                      Award Winners
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="fb-dd-footer">
                {hasActive && (
                  <button className="fb-dd-clear" onClick={() => { onReset(); setDropdownOpen(false); }}>
                    Clear all filters
                  </button>
                )}
                <button
                  className="fb-dd-apply"
                  onClick={applyFilters}
                  disabled={!hasPendingChanges}
                  data-testid="apply-filters-btn"
                >
                  APPLY FILTERS
                </button>
              </div>
            </div>
            </>
          , document.body)}
        </div>

        {/* Active filter chips (L-R horizontal scroll) */}
        <div className="fb-chips">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className={`fb-chip fb-chip-${chip.category}`}
              data-testid={`active-filter-${chip.key}`}
            >
              {chip.label}
              <button className="fb-chip-x" onClick={(e) => { e.stopPropagation(); chip.onRemove(); }}>✕</button>
            </span>
          ))}
          {hasActive && (
            <button className="fb-clear-all" onClick={onReset}>
              Clear all
            </button>
          )}
        </div>
      </div>
    </>
  );
}
