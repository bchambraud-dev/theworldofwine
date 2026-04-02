import type { Filters, WineColor } from "@/lib/store";

interface FilterPanelProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  producerCount: number;
}

const wineTypeChips: { value: WineColor; label: string; colorClass?: string }[] = [
  { value: "red", label: "Red" },
  { value: "white", label: "White", colorClass: "gold" },
  { value: "rosé", label: "Rosé" },
  { value: "sparkling", label: "Sparkling", colorClass: "gold" },
  { value: "dessert", label: "Dessert" },
  { value: "fortified", label: "Fortified" },
];

export default function FilterPanel({
  filters,
  onUpdateFilter,
  onReset,
  producerCount,
}: FilterPanelProps) {
  const toggleWineType = (type: WineColor) => {
    const current = filters.wineTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdateFilter("wineTypes", next);
  };

  const hasActiveFilters =
    filters.wineTypes.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.isNatural !== null ||
    filters.isAwardWinner !== null;

  return (
    <div className="chips" data-testid="filter-chips">
      <button
        className={`chip ${!hasActiveFilters ? "active" : ""}`}
        onClick={onReset}
        data-testid="filter-all"
      >
        All
      </button>
      {wineTypeChips.map((t) => (
        <button
          key={t.value}
          className={`chip ${t.colorClass || ""} ${
            filters.wineTypes.includes(t.value) ? "active" : ""
          }`}
          onClick={() => toggleWineType(t.value)}
          data-testid={`filter-type-${t.value}`}
        >
          {t.label}
        </button>
      ))}
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
