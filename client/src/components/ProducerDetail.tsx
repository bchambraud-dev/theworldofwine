import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  X,
  MapPin,
  Calendar,
  Wine,
  Award,
  Leaf,
  DollarSign,
  Info,
  Star,
} from "lucide-react";
import type { Producer } from "@/data/producers";
import { wineRegions } from "@/data/regions";

interface ProducerDetailProps {
  producer: Producer;
  onClose: () => void;
  onSelectRegion: (id: string) => void;
}

const priceLabels = {
  budget: { label: "$", desc: "Under $20" },
  mid: { label: "$$", desc: "$20-50" },
  premium: { label: "$$$", desc: "$50-200" },
  luxury: { label: "$$$$", desc: "$200+" },
};

const typeColors: Record<string, string> = {
  red: "bg-red-900/80 text-white",
  white: "bg-amber-100 text-amber-900",
  rosé: "bg-pink-200 text-pink-900",
  sparkling: "bg-yellow-100 text-yellow-900",
  dessert: "bg-orange-200 text-orange-900",
  fortified: "bg-stone-700 text-white",
};

export default function ProducerDetail({
  producer,
  onClose,
  onSelectRegion,
}: ProducerDetailProps) {
  const region = wineRegions.find((r) => r.id === producer.regionId);
  const price = priceLabels[producer.priceRange];

  return (
    <div className="flex flex-col h-full" data-testid="producer-detail">
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between border-b border-border/50">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => region && onSelectRegion(region.id)}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5 hover:underline"
            data-testid="producer-region-link"
          >
            <MapPin className="w-3 h-3" />
            {region?.name}, {producer.country}
          </button>
          <h2 className="text-base font-bold text-foreground leading-tight">
            {producer.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0 shrink-0"
          data-testid="close-producer-detail"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {producer.wineType.map((t) => (
              <Badge key={t} className={`text-[10px] ${typeColors[t]}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Badge>
            ))}
            <Badge variant="outline" className="text-[10px] gap-1">
              <DollarSign className="w-2.5 h-2.5" />
              {price.label}
              <span className="text-muted-foreground ml-0.5">{price.desc}</span>
            </Badge>
            {producer.isNatural && (
              <Badge className="text-[10px] bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300">
                <Leaf className="w-2.5 h-2.5 mr-0.5" />
                Natural
              </Badge>
            )}
            {producer.isAwardWinner && (
              <Badge className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <Award className="w-2.5 h-2.5 mr-0.5" />
                Award Winner
              </Badge>
            )}
          </div>

          {/* Founded */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            Founded {producer.founded}
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed text-foreground/90">
            {producer.description}
          </p>

          {/* Flagship Wine */}
          <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Wine className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Flagship Wine
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {producer.flagshipWine}
            </p>
          </div>

          {/* Taste Profile */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Taste Profile
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {producer.tasteProfile.map((taste) => (
                <span
                  key={taste}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-accent text-[10px] font-medium"
                >
                  {taste}
                </span>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Key Facts */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key Facts
              </span>
            </div>
            <ul className="space-y-1.5">
              {producer.keyFacts.map((fact, i) => (
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
        </div>
      </ScrollArea>
    </div>
  );
}
