import { useEffect, useRef } from "react";
import { regionBoundaries } from "@/data/regionBoundaries";

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
  showProducers: boolean;
  showBoundaries: boolean;
  hasActiveFilter?: boolean;
}

const BOUNDARY_SOURCE = "region-boundaries";
const BOUNDARY_FILL_LAYER = "region-fill";
const BOUNDARY_LINE_LAYER = "region-line";
const BOUNDARY_FILL_SELECTED = "region-fill-selected";
const BOUNDARY_LINE_SELECTED = "region-line-selected";

function buildGeoJSON(selectedId: string | null) {
  return {
    type: "FeatureCollection" as const,
    features: regionBoundaries.map((rb) => ({
      type: "Feature" as const,
      properties: {
        id: rb.id,
        selected: rb.id === selectedId,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: rb.coordinates,
      },
    })),
  };
}

export default function WineMap({
  producers,
  regions,
  onSelectProducer,
  onSelectRegion,
  selectedRegionId,
  showProducers,
  showBoundaries,
  hasActiveFilter = false,
}: WineMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const regionMarkersRef = useRef<maplibregl.Marker[]>([]);
  const boundariesAdded = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const style = "https://tiles.openfreemap.org/styles/positron";

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

    // Add GeoJSON boundary layers once map style loads
    map.current.on("load", () => {
      if (!map.current || boundariesAdded.current) return;
      boundariesAdded.current = true;

      const geojson = buildGeoJSON(selectedRegionId);

      map.current.addSource(BOUNDARY_SOURCE, {
        type: "geojson",
        data: geojson as any,
      });

      // Unselected region fills
      map.current.addLayer({
        id: BOUNDARY_FILL_LAYER,
        type: "fill",
        source: BOUNDARY_SOURCE,
        filter: ["!=", ["get", "selected"], true],
        paint: {
          "fill-color": "rgba(140, 40, 60, 0.08)",
          "fill-opacity": [
            "interpolate", ["linear"], ["zoom"],
            3, 0,
            4.5, 0.4,
            7, 0.7,
          ],
        },
      });

      // Unselected region outlines
      map.current.addLayer({
        id: BOUNDARY_LINE_LAYER,
        type: "line",
        source: BOUNDARY_SOURCE,
        filter: ["!=", ["get", "selected"], true],
        paint: {
          "line-color": "rgba(140, 40, 60, 0.45)",
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            3, 0,
            5, 1,
            8, 2,
          ],
          "line-opacity": [
            "interpolate", ["linear"], ["zoom"],
            3, 0,
            4.5, 0.5,
            7, 0.8,
          ],
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
      });

      // Selected region fill
      map.current.addLayer({
        id: BOUNDARY_FILL_SELECTED,
        type: "fill",
        source: BOUNDARY_SOURCE,
        filter: ["==", ["get", "selected"], true],
        paint: {
          "fill-color": "rgba(140, 40, 60, 0.18)",
          "fill-opacity": [
            "interpolate", ["linear"], ["zoom"],
            2, 0.3,
            5, 0.7,
            8, 0.85,
          ],
        },
      });

      // Selected region outline
      map.current.addLayer({
        id: BOUNDARY_LINE_SELECTED,
        type: "line",
        source: BOUNDARY_SOURCE,
        filter: ["==", ["get", "selected"], true],
        paint: {
          "line-color": "rgba(140, 40, 60, 0.85)",
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            2, 1.5,
            5, 2.5,
            8, 3.5,
          ],
          "line-opacity": 1,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
      });

      // Click handlers
      map.current.on("click", BOUNDARY_FILL_LAYER, (e: any) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) onSelectRegion(feature.properties.id);
      });
      map.current.on("click", BOUNDARY_FILL_SELECTED, (e: any) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) onSelectRegion(feature.properties.id);
      });

      // Cursor change
      map.current.on("mouseenter", BOUNDARY_FILL_LAYER, () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", BOUNDARY_FILL_LAYER, () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", BOUNDARY_FILL_SELECTED, () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", BOUNDARY_FILL_SELECTED, () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });

    return () => {
      boundariesAdded.current = false;
      map.current?.remove();
    };
  }, []);

  // Update GeoJSON data when selection changes
  useEffect(() => {
    if (!map.current || !boundariesAdded.current) return;
    const source = map.current.getSource(BOUNDARY_SOURCE) as any;
    if (source?.setData) {
      source.setData(buildGeoJSON(selectedRegionId));
    }
  }, [selectedRegionId]);

  // Toggle boundary visibility
  useEffect(() => {
    if (!map.current || !boundariesAdded.current) return;
    const visibility = showBoundaries ? "visible" : "none";
    [BOUNDARY_FILL_LAYER, BOUNDARY_LINE_LAYER, BOUNDARY_FILL_SELECTED, BOUNDARY_LINE_SELECTED].forEach((id) => {
      try {
        if (map.current?.getLayer(id)) {
          map.current.setLayoutProperty(id, "visibility", visibility);
        }
      } catch (_) { /* ignore */ }
    });
  }, [showBoundaries]);

  // Region markers
  useEffect(() => {
    if (!map.current) return;

    regionMarkersRef.current.forEach((m) => m.remove());
    regionMarkersRef.current = [];

    // Build a set of region IDs that have matching producers
    const regionIdsWithProducers = new Set(producers.map((p) => p.regionId));

    regions.forEach((region) => {
      const hasMatchingProducers = !hasActiveFilter || regionIdsWithProducers.has(region.id);
      const dimmed = hasActiveFilter && !hasMatchingProducers;

      const el = document.createElement("div");
      el.className = "region-marker";
      el.setAttribute("data-testid", `region-marker-${region.id}`);
      el.style.opacity = dimmed ? "0.25" : "1";
      el.style.filter = dimmed ? "grayscale(1)" : "none";
      el.style.transition = "opacity 0.3s ease, filter 0.3s ease";
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${selectedRegionId === region.id ? '#8c1c2e' : 'rgba(140, 28, 46, 0.35)'};
          border: 2px solid ${selectedRegionId === region.id ? '#6a1522' : 'rgba(140, 28, 46, 0.6)'};
          cursor: ${dimmed ? 'default' : 'pointer'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 0 ${selectedRegionId === region.id ? '12px' : '8px'} rgba(140, 28, 46, ${selectedRegionId === region.id ? '0.5' : '0.25'});
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M8 22h8M12 2v3M12 5a7 7 0 0 1 7 7c0 4-3.5 7-7 10-3.5-3-7-6-7-10a7 7 0 0 1 7-7Z"/>
          </svg>
        </div>
      `;
      if (!dimmed) {
        el.addEventListener("click", () => onSelectRegion(region.id));
        el.addEventListener("mouseenter", () => {
          el.querySelector("div")!.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.querySelector("div")!.style.transform = "scale(1)";
        });
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([region.lng, region.lat])
        .addTo(map.current!);

      regionMarkersRef.current.push(marker);
    });
  }, [regions, onSelectRegion, selectedRegionId, producers, hasActiveFilter]);

  // Producer markers — toggle visibility
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!showProducers) return;

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

      const popup = new maplibregl.Popup({
        offset: 12,
        closeButton: false,
        closeOnClick: false,
        className: "producer-popup",
      }).setHTML(
        `<div style="padding: 4px 8px; font-size: 12px; font-family: 'Fraunces', serif; font-weight: 500; white-space: nowrap; color: var(--text);">${producer.name}</div>`
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
  }, [producers, onSelectProducer, showProducers]);

  // Auto-fit bounds when filters are active
  useEffect(() => {
    if (!map.current || !hasActiveFilter || producers.length === 0) return;

    // Calculate bounding box of all visible (filtered) producers
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    producers.forEach((p) => {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    });

    if (minLng !== Infinity) {
      // Add padding so markers aren't at the very edge
      const lngPad = Math.max((maxLng - minLng) * 0.2, 1);
      const latPad = Math.max((maxLat - minLat) * 0.2, 1);
      const bounds: [[number, number], [number, number]] = [
        [minLng - lngPad, minLat - latPad],
        [maxLng + lngPad, maxLat + latPad],
      ];
      map.current.fitBounds(bounds, { padding: 60, duration: 1000, maxZoom: 10 });
    }
  }, [hasActiveFilter, producers]);

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
