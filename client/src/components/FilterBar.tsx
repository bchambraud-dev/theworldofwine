import { useState, useRef, useEffect } from "react";
import type { Filters, WineColor, PriceRange } from "@/lib/store";

interface FilterBarProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
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

const tasteCategories: { category: string; options: string[] }[] = [
  {
    category: "Fruit",
    options: [
      "Cherry", "Plum", "Blackberry", "Blackcurrant", "Raspberry",
      "Strawberry", "Dark Cherry", "Dark Plum", "Peach", "Apricot",
      "Apple", "Pear", "Citrus", "Grapefruit", "Lemon",
      "Passion Fruit", "Gooseberry", "Stone Fruit",
    ],
  },
  {
    category: "Floral",
    options: [
      "Violet", "Rose", "Rose Petal", "White Flowers",
      "Floral", "Chamomile", "Flowers", "Delicate Floral",
    ],
  },
  {
    category: "Earth & Mineral",
    options: [
      "Earth", "Mineral", "Minerality", "Slate", "Graphite",
      "Flint", "Granite", "Iron", "Chalk Minerality", "Volcanic Ash",
      "Wet Stone", "Forest Floor", "Mushroom", "Truffle",
    ],
  },
  {
    category: "Spice & Herb",
    options: [
      "Spice", "Black Pepper", "White Pepper", "Pepper",
      "Thyme", "Garrigue", "Herbal", "Dried Herbs",
      "Eucalyptus", "Mint", "Saffron", "Ginger", "Licorice",
    ],
  },
  {
    category: "Oak & Richness",
    options: [
      "Vanilla", "Cedar", "Toast", "Toasted Oak", "Brioche",
      "Chocolate", "Dark Chocolate", "Mocha", "Espresso",
      "Tobacco", "Leather", "Smoke", "Caramel",
    ],
  },
  {
    category: "Nutty & Savory",
    options: [
      "Almond", "Hazelnut", "Walnut", "Cashew",
      "Butter", "Cream", "Honey", "Beeswax",
      "Savory", "Olive", "Bacon Fat", "Marzipan",
    ],
  },
];

const chipLabels: Record<string, string> = {
  budget: "$",
  mid: "$$",
  premium: "$$$",
  luxury: "$$$$",
};

export default function FilterBar({ filters, onUpdateFilter, onReset }: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

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

  const toggleTaste = (taste: string) => {
    const next = filters.tasteProfiles.includes(taste)
      ? filters.tasteProfiles.filter((t) => t !== taste)
      : [...filters.tasteProfiles, taste];
    onUpdateFilter("tasteProfiles", next);
  };

  const toggleNatural = () => {
    onUpdateFilter("isNatural", filters.isNatural === true ? null : true);
  };

  const toggleAward = () => {
    onUpdateFilter("isAwardWinner", filters.isAwardWinner === true ? null : true);
  };

  // Collect all active filter chips
  const activeChips: { key: string; label: string; category: string; onRemove: () => void }[] = [];

  filters.wineTypes.forEach((t) => {
    const opt = wineTypeOptions.find((o) => o.value === t);
    activeChips.push({
      key: `type-${t}`,
      label: opt?.label || t,
      category: "Type",
      onRemove: () => toggleWineType(t),
    });
  });

  filters.priceRanges.forEach((p) => {
    activeChips.push({
      key: `price-${p}`,
      label: chipLabels[p] || p,
      category: "Price",
      onRemove: () => togglePrice(p),
    });
  });

  filters.tasteProfiles.forEach((t) => {
    activeChips.push({
      key: `taste-${t}`,
      label: t,
      category: "Taste",
      onRemove: () => toggleTaste(t),
    });
  });

  if (filters.isNatural) {
    activeChips.push({
      key: "natural",
      label: "Natural",
      category: "Style",
      onRemove: toggleNatural,
    });
  }

  if (filters.isAwardWinner) {
    activeChips.push({
      key: "award",
      label: "Award Winner",
      category: "Style",
      onRemove: toggleAward,
    });
  }

  const hasActive = activeChips.length > 0;

  return (
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

        {dropdownOpen && (
          <div className="fb-dropdown" data-testid="filter-dropdown">
            <div className="fb-dd-scroll">
              {/* Wine Type */}
              <div className="fb-dd-group">
                <div className="fb-dd-label">Wine Type</div>
                <div className="fb-dd-options">
                  {wineTypeOptions.map((o) => (
                    <button
                      key={o.value}
                      className={`fb-dd-opt ${filters.wineTypes.includes(o.value) ? "selected" : ""}`}
                      onClick={() => toggleWineType(o.value)}
                    >
                      <span className="fb-dd-check">{filters.wineTypes.includes(o.value) ? "✓" : ""}</span>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="fb-dd-group">
                <div className="fb-dd-label">Price Range</div>
                <div className="fb-dd-options">
                  {priceOptions.map((o) => (
                    <button
                      key={o.value}
                      className={`fb-dd-opt ${filters.priceRanges.includes(o.value) ? "selected" : ""}`}
                      onClick={() => togglePrice(o.value)}
                    >
                      <span className="fb-dd-check">{filters.priceRanges.includes(o.value) ? "✓" : ""}</span>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="fb-dd-group">
                <div className="fb-dd-label">Style</div>
                <div className="fb-dd-options">
                  <button
                    className={`fb-dd-opt ${filters.isNatural === true ? "selected" : ""}`}
                    onClick={toggleNatural}
                  >
                    <span className="fb-dd-check">{filters.isNatural === true ? "✓" : ""}</span>
                    Natural Wine
                  </button>
                  <button
                    className={`fb-dd-opt ${filters.isAwardWinner === true ? "selected" : ""}`}
                    onClick={toggleAward}
                  >
                    <span className="fb-dd-check">{filters.isAwardWinner === true ? "✓" : ""}</span>
                    Award Winners
                  </button>
                </div>
              </div>

              {/* Taste Profile categories */}
              {tasteCategories.map((cat) => (
                <div key={cat.category} className="fb-dd-group">
                  <div className="fb-dd-label">{cat.category}</div>
                  <div className="fb-dd-options fb-dd-options-wrap">
                    {cat.options.map((o) => (
                      <button
                        key={o}
                        className={`fb-dd-opt fb-dd-opt-pill ${filters.tasteProfiles.includes(o) ? "selected" : ""}`}
                        onClick={() => toggleTaste(o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {hasActive && (
              <div className="fb-dd-footer">
                <button className="fb-dd-clear" onClick={() => { onReset(); setDropdownOpen(false); }}>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active filter chips (L-R horizontal scroll) */}
      <div className="fb-chips">
        {activeChips.map((chip) => (
          <span
            key={chip.key}
            className={`fb-chip fb-chip-${chip.category.toLowerCase()}`}
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
  );
}
