import { useEffect, useRef, useCallback } from "react";

// MapLibre GL JS loaded from CDN (global `maplibregl`)
declare const maplibregl: typeof import("maplibre-gl").default;
import type { Producer } from "@/data/producers";
import type { WineRegion } from "@/data/regions";

interface WineMapProps {
  producers: Producer[];
  regions: WineRegion[];
  onSelectProducer: (id: string) => void;
  onSelectRegion: (id: string) => void;
  selectedRegionId: string | null;
  isDark: boolean;
}

export default function WineMap({
  producers,
  regions,
  onSelectProducer,
  onSelectRegion,
  selectedRegionId,
  isDark,
}: WineMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const regionMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const style = isDark
      ? "https://tiles.openfreemap.org/styles/positron"
      : "https://tiles.openfreemap.org/styles/positron";

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [15, 35],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 14,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    // Style map for dark mode using CSS filter
    if (isDark && mapContainer.current) {
      mapContainer.current.style.filter = "invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.15) saturate(0.7)";
    } else if (mapContainer.current) {
      mapContainer.current.style.filter = "none";
    }

    return () => {
      map.current?.remove();
    };
  }, [isDark]);

  // Region markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing region markers
    regionMarkersRef.current.forEach((m) => m.remove());
    regionMarkersRef.current = [];

    regions.forEach((region) => {
      const el = document.createElement("div");
      el.className = "region-marker";
      el.setAttribute("data-testid", `region-marker-${region.id}`);
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${selectedRegionId === region.id ? 'hsl(345, 55%, 38%)' : 'rgba(140, 40, 60, 0.35)'};
          border: 2px solid ${selectedRegionId === region.id ? 'hsl(345, 55%, 30%)' : 'rgba(140, 40, 60, 0.6)'};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 0 ${selectedRegionId === region.id ? '12px' : '8px'} rgba(140, 40, 60, ${selectedRegionId === region.id ? '0.5' : '0.25'});
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M8 22h8M12 2v3M12 5a7 7 0 0 1 7 7c0 4-3.5 7-7 10-3.5-3-7-6-7-10a7 7 0 0 1 7-7Z"/>
          </svg>
        </div>
      `;
      el.addEventListener("click", () => onSelectRegion(region.id));
      el.addEventListener("mouseenter", () => {
        el.querySelector("div")!.style.transform = "scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.querySelector("div")!.style.transform = "scale(1)";
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([region.lng, region.lat])
        .addTo(map.current!);

      regionMarkersRef.current.push(marker);
    });
  }, [regions, onSelectRegion, selectedRegionId]);

  // Producer markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    producers.forEach((producer) => {
      const el = document.createElement("div");
      el.className = "producer-marker";
      el.setAttribute("data-testid", `producer-marker-${producer.id}`);

      const typeColor = producer.wineType.includes("red")
        ? "#7a1e3a"
        : producer.wineType.includes("white")
        ? "#c4a747"
        : producer.wineType.includes("sparkling")
        ? "#d4a853"
        : producer.wineType.includes("fortified")
        ? "#5a2d2d"
        : "#8c3b55";

      el.innerHTML = `
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${typeColor};
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        "></div>
      `;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectProducer(producer.id);
      });
      el.addEventListener("mouseenter", () => {
        el.querySelector("div")!.style.transform = "scale(1.6)";
        el.querySelector("div")!.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.querySelector("div")!.style.transform = "scale(1)";
        el.querySelector("div")!.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      });

      // Add tooltip popup
      const popup = new maplibregl.Popup({
        offset: 12,
        closeButton: false,
        closeOnClick: false,
        className: "producer-popup",
      }).setHTML(
        `<div style="padding: 4px 8px; font-size: 12px; font-weight: 500; white-space: nowrap;">${producer.name}</div>`
      );

      el.addEventListener("mouseenter", () => {
        popup.setLngLat([producer.lng, producer.lat]).addTo(map.current!);
      });
      el.addEventListener("mouseleave", () => {
        popup.remove();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([producer.lng, producer.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [producers, onSelectProducer]);

  // Fly to selected region
  useEffect(() => {
    if (!map.current || !selectedRegionId) return;
    const region = regions.find((r) => r.id === selectedRegionId);
    if (region) {
      map.current.flyTo({
        center: [region.lng, region.lat],
        zoom: region.zoom,
        duration: 1500,
      });
    }
  }, [selectedRegionId, regions]);

  return (
    <div ref={mapContainer} className="w-full h-full" data-testid="wine-map" />
  );
}
