import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, MapPin, Thermometer, Grape, Info, Star } from "lucide-react";
import type { WineRegion } from "@/data/regions";
import type { Producer } from "@/data/producers";

interface RegionDetailProps {
  region: WineRegion;
  producers: Producer[];
  onClose: () => void;
  onSelectProducer: (id: string) => void;
}

export default function RegionDetail({
  region,
  producers,
  onClose,
  onSelectProducer,
}: RegionDetailProps) {
  const regionProducers = producers.filter((p) => p.regionId === region.id);

  return (
    <div className="flex flex-col h-full" data-testid="region-detail">
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between border-b border-border/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
            <MapPin className="w-3 h-3" />
            {region.country}
          </div>
          <h2 className="text-base font-bold text-foreground leading-tight truncate">
            {region.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0 shrink-0"
          data-testid="close-region-detail"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Description */}
          <p className="text-xs leading-relaxed text-foreground/90">
            {region.description}
          </p>

          {/* Climate */}
          <div className="flex items-start gap-2 p-3 rounded-md bg-accent/50">
            <Thermometer className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Climate
              </span>
              <p className="text-xs text-foreground/90 mt-0.5">{region.climate}</p>
            </div>
          </div>

          {/* Flavor Profile */}
          <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5">
            <Star className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Flavor Profile
              </span>
              <p className="text-xs text-foreground/90 mt-0.5">
                {region.flavorProfile}
              </p>
            </div>
          </div>

          {/* Key Grapes */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Grape className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key Grapes
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {region.grapes.map((grape) => (
                <Badge
                  key={grape}
                  variant="secondary"
                  className="text-[10px] bg-accent/80"
                >
                  {grape}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notable Styles */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Notable Styles
            </span>
            <div className="flex flex-wrap gap-1">
              {region.notableStyles.map((style) => (
                <Badge
                  key={style}
                  variant="outline"
                  className="text-[10px]"
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Facts */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key Facts
              </span>
            </div>
            <ul className="space-y-1.5">
              {region.facts.map((fact, i) => (
                <li
                  key={i}
                  className="text-xs text-foreground/80 flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Producers in this region */}
          {regionProducers.length > 0 && (
            <>
              <Separator className="opacity-50" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Top Producers ({regionProducers.length})
                </span>
                <div className="space-y-1">
                  {regionProducers.map((producer) => (
                    <button
                      key={producer.id}
                      onClick={() => onSelectProducer(producer.id)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left hover:bg-accent transition-colors"
                      data-testid={`region-producer-${producer.id}`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">
                          {producer.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {producer.flagshipWine}
                        </div>
                      </div>
                      <div className="flex gap-0.5 shrink-0 ml-2">
                        {producer.wineType.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className={`w-2 h-2 rounded-full ${
                              t === "red"
                                ? "bg-red-800"
                                : t === "white"
                                ? "bg-amber-300"
                                : t === "sparkling"
                                ? "bg-yellow-300"
                                : t === "rosé"
                                ? "bg-pink-300"
                                : t === "fortified"
                                ? "bg-stone-600"
                                : "bg-orange-300"
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
