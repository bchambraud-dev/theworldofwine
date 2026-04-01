import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  X,
  Wine,
  Grape,
  Sparkles,
  Award,
  Leaf,
  MapPin,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import type { Filters, WineColor, PriceRange } from "@/lib/store";
import { wineRegions } from "@/data/regions";

interface FilterPanelProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  producerCount: number;
}

const wineTypes: { value: WineColor; label: string; color: string }[] = [
  { value: "red", label: "Red", color: "bg-red-900/80 hover:bg-red-900 text-white" },
  { value: "white", label: "White", color: "bg-amber-100 hover:bg-amber-200 text-amber-900" },
  { value: "rosé", label: "Rosé", color: "bg-pink-200 hover:bg-pink-300 text-pink-900" },
  { value: "sparkling", label: "Sparkling", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-900" },
  { value: "dessert", label: "Dessert", color: "bg-orange-200 hover:bg-orange-300 text-orange-900" },
  { value: "fortified", label: "Fortified", color: "bg-stone-700 hover:bg-stone-800 text-white" },
];

const priceRanges: { value: PriceRange; label: string; desc: string }[] = [
  { value: "budget", label: "$", desc: "Under $20" },
  { value: "mid", label: "$$", desc: "$20-50" },
  { value: "premium", label: "$$$", desc: "$50-200" },
  { value: "luxury", label: "$$$$", desc: "$200+" },
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

  const togglePriceRange = (range: PriceRange) => {
    const current = filters.priceRanges;
    const next = current.includes(range)
      ? current.filter((r) => r !== range)
      : [...current, range];
    onUpdateFilter("priceRanges", next);
  };

  const hasActiveFilters =
    filters.wineTypes.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.isNatural !== null ||
    filters.isAwardWinner !== null ||
    filters.selectedRegionId !== null ||
    filters.searchQuery !== "";

  return (
    <div className="flex flex-col h-full" data-testid="filter-panel">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Wine className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground"
            data-testid="reset-filters"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search producers, grapes..."
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilter("searchQuery", e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
              data-testid="search-input"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onUpdateFilter("searchQuery", "")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Wine Type */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Grape className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Wine Type
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {wineTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={filters.wineTypes.includes(type.value) ? "default" : "outline"}
                  className={`cursor-pointer text-[11px] transition-all ${
                    filters.wineTypes.includes(type.value)
                      ? type.color
                      : "hover:bg-accent"
                  }`}
                  onClick={() => toggleWineType(type.value)}
                  data-testid={`filter-type-${type.value}`}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Price Range
              </span>
            </div>
            <div className="flex gap-1.5">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => togglePriceRange(range.value)}
                  className={`flex-1 py-1.5 px-1 rounded-md text-center text-xs transition-all border ${
                    filters.priceRanges.includes(range.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-accent"
                  }`}
                  title={range.desc}
                  data-testid={`filter-price-${range.value}`}
                >
                  <div className="font-semibold">{range.label}</div>
                  <div className="text-[9px] opacity-70 mt-0.5">{range.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Special Attributes */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attributes
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() =>
                  onUpdateFilter(
                    "isNatural",
                    filters.isNatural === true ? null : true
                  )
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all border ${
                  filters.isNatural === true
                    ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300"
                    : "bg-background border-border hover:bg-accent"
                }`}
                data-testid="filter-natural"
              >
                <Leaf className="w-3.5 h-3.5" />
                Natural Wine
              </button>
              <button
                onClick={() =>
                  onUpdateFilter(
                    "isAwardWinner",
                    filters.isAwardWinner === true ? null : true
                  )
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all border ${
                  filters.isAwardWinner === true
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                    : "bg-background border-border hover:bg-accent"
                }`}
                data-testid="filter-awards"
              >
                <Award className="w-3.5 h-3.5" />
                Award Winners
              </button>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Region */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Region
              </span>
            </div>
            <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto">
              {wineRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() =>
                    onUpdateFilter(
                      "selectedRegionId",
                      filters.selectedRegionId === region.id ? null : region.id
                    )
                  }
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-all ${
                    filters.selectedRegionId === region.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent text-foreground"
                  }`}
                  data-testid={`filter-region-${region.id}`}
                >
                  <span>{region.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {region.country}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/50 bg-card/50">
        <p className="text-[11px] text-muted-foreground text-center">
          Showing <span className="font-semibold text-foreground">{producerCount}</span> producers
        </p>
      </div>
    </div>
  );
}
