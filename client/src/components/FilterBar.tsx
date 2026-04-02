import type { Filters, WineColor, PriceRange } from "@/lib/store";

interface FilterBarProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
}

const wineTypeChips: { value: WineColor; label: string }[] = [
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rosé", label: "Rosé" },
  { value: "sparkling", label: "Sparkling" },
  { value: "dessert", label: "Dessert" },
  { value: "fortified", label: "Fortified" },
];

const priceChips: { value: PriceRange; label: string }[] = [
  { value: "budget", label: "$" },
  { value: "mid", label: "$$" },
  { value: "premium", label: "$$$" },
  { value: "luxury", label: "$$$$" },
];

export default function FilterBar({ filters, onUpdateFilter, onReset }: FilterBarProps) {
  const toggleWineType = (type: WineColor) => {
    const current = filters.wineTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdateFilter("wineTypes", next);
  };

  const togglePrice = (price: PriceRange) => {
    const current = filters.priceRanges;
    const next = current.includes(price)
      ? current.filter((p) => p !== price)
      : [...current, price];
    onUpdateFilter("priceRanges", next);
  };

  const toggleNatural = () => {
    onUpdateFilter("isNatural", filters.isNatural === true ? null : true);
  };

  const toggleAward = () => {
    onUpdateFilter("isAwardWinner", filters.isAwardWinner === true ? null : true);
  };

  const hasActiveFilters =
    filters.wineTypes.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.isNatural !== null ||
    filters.isAwardWinner !== null;

  return (
    <div className="filter-bar" data-testid="filter-bar">
      {/* ALL chip */}
      <button
        className={`chip ${!hasActiveFilters ? "active" : ""}`}
        onClick={onReset}
        data-testid="filter-all"
      >
        All
      </button>

      {/* Wine type chips */}
      {wineTypeChips.map((t) => (
        <button
          key={t.value}
          className={`chip ${filters.wineTypes.includes(t.value) ? "active" : ""}`}
          onClick={() => toggleWineType(t.value)}
          data-testid={`filter-type-${t.value}`}
        >
          {t.label}
        </button>
      ))}

      <div className="fb-divider" />

      {/* Price range chips */}
      {priceChips.map((p) => (
        <button
          key={p.value}
          className={`chip ${filters.priceRanges.includes(p.value) ? "active" : ""}`}
          onClick={() => togglePrice(p.value)}
          data-testid={`filter-price-${p.value}`}
        >
          {p.label}
        </button>
      ))}

      <div className="fb-divider" />

      {/* Toggle chips */}
      <button
        className={`chip ${filters.isNatural === true ? "active" : ""}`}
        onClick={toggleNatural}
        data-testid="filter-natural"
        style={filters.isNatural === true ? { background: "var(--sage)", borderColor: "var(--sage)" } : {}}
      >
        Natural
      </button>
      <button
        className={`chip ${filters.isAwardWinner === true ? "active" : ""}`}
        onClick={toggleAward}
        data-testid="filter-award"
        style={filters.isAwardWinner === true ? { background: "var(--plum)", borderColor: "var(--plum)" } : {}}
      >
        Award Winners
      </button>

      {hasActiveFilters && (
        <button
          className="chip"
          onClick={onReset}
          data-testid="filter-clear"
          style={{ borderColor: "var(--wine)", color: "var(--wine)" }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
