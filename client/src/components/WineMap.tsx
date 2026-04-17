import { useEffect, useRef } from "react";
import { regionBoundaries } from "@/data/regionBoundaries";
import { vintageData, vintageColor, vintageLabel, VINTAGE_LEGEND } from "@/data/vintages";

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
  vintageYear?: number | null;
}

const BOUNDARY_SOURCE = "region-boundaries";
const BOUNDARY_FILL_LAYER = "region-fill";
const BOUNDARY_LINE_LAYER = "region-line";
const BOUNDARY_FILL_SELECTED = "region-fill-selected";
const BOUNDARY_LINE_SELECTED = "region-line-selected";

const wineCountries = [
  { code: "FR", name: "France", lat: 46.6, lng: 2.3 },
  { code: "IT", name: "Italy", lat: 42.5, lng: 12.5 },
  { code: "ES", name: "Spain", lat: 40.0, lng: -3.7 },
  { code: "DE", name: "Germany", lat: 50.1, lng: 8.5 },
  { code: "PT", name: "Portugal", lat: 41.2, lng: -7.8 },
  { code: "AT", name: "Austria", lat: 48.2, lng: 15.5 },
  { code: "HU", name: "Hungary", lat: 48.1, lng: 21.3 },
  { code: "HR", name: "Croatia", lat: 44.5, lng: 15.0 },
  { code: "GE", name: "Georgia", lat: 41.7, lng: 44.8 },
  { code: "GR", name: "Greece", lat: 36.4, lng: 25.4 },
  { code: "GB", name: "England", lat: 51.0, lng: -0.5 },
  { code: "ZA", name: "South Africa", lat: -33.9, lng: 18.8 },
  { code: "AR", name: "Argentina", lat: -33.0, lng: -68.5 },
  { code: "CL", name: "Chile", lat: -34.0, lng: -71.0 },
  { code: "US", name: "USA", lat: 38.5, lng: -122.0 },
  { code: "CA", name: "Canada", lat: 49.9, lng: -119.5 },
  { code: "MX", name: "Mexico", lat: 32.1, lng: -116.6 },
  { code: "AU", name: "Australia", lat: -34.5, lng: 139.0 },
  { code: "NZ", name: "New Zealand", lat: -41.5, lng: 174.0 },
  { code: "CN", name: "China", lat: 38.5, lng: 106.0 },
  { code: "LB", name: "Lebanon", lat: 33.9, lng: 35.9 },
  { code: "BR", name: "Brazil", lat: -29.2, lng: -51.2 },
  { code: "JP", name: "Japan", lat: 35.7, lng: 138.6 },
  { code: "TR", name: "Turkey", lat: 38.6, lng: 34.8 },
];

const VINTAGE_OVERLAY = "vintage-overlay";
const VILLAGE_LABELS_SOURCE = "village-labels";
const VILLAGE_LABELS_LAYER = "village-labels-layer";

const villageLabels = [
  // Bordeaux
  { name: "Saint-Émilion", lat: 44.89, lng: -0.16 },
  { name: "Pauillac", lat: 45.20, lng: -0.75 },
  { name: "Margaux", lat: 45.04, lng: -0.67 },
  { name: "Pomerol", lat: 44.93, lng: -0.18 },
  { name: "Sauternes", lat: 44.53, lng: -0.34 },
  { name: "Pessac-Léognan", lat: 44.73, lng: -0.63 },
  // Burgundy
  { name: "Gevrey-Chambertin", lat: 47.23, lng: 4.97 },
  { name: "Vosne-Romanée", lat: 47.17, lng: 4.95 },
  { name: "Nuits-Saint-Georges", lat: 47.14, lng: 4.95 },
  { name: "Meursault", lat: 46.98, lng: 4.76 },
  { name: "Puligny-Montrachet", lat: 46.95, lng: 4.75 },
  { name: "Pommard", lat: 47.01, lng: 4.79 },
  { name: "Chablis", lat: 47.81, lng: 3.80 },
  // Piedmont
  { name: "Barolo", lat: 44.61, lng: 7.94 },
  { name: "Barbaresco", lat: 44.73, lng: 8.08 },
  { name: "La Morra", lat: 44.64, lng: 7.93 },
  { name: "Serralunga", lat: 44.61, lng: 7.99 },
  // Tuscany
  { name: "Montalcino", lat: 43.06, lng: 11.49 },
  { name: "Montepulciano", lat: 43.10, lng: 11.78 },
  { name: "Bolgheri", lat: 43.23, lng: 10.61 },
  { name: "Chianti Classico", lat: 43.47, lng: 11.25 },
  { name: "San Gimignano", lat: 43.47, lng: 11.04 },
  // Napa
  { name: "Rutherford", lat: 38.46, lng: -122.42 },
  { name: "Oakville", lat: 38.43, lng: -122.41 },
  { name: "Stags Leap", lat: 38.42, lng: -122.35 },
  { name: "Calistoga", lat: 38.58, lng: -122.58 },
  { name: "St. Helena", lat: 38.51, lng: -122.47 },
];

function buildVillageGeoJSON() {
  return {
    type: "FeatureCollection" as const,
    features: villageLabels.map(v => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [v.lng, v.lat] },
      properties: { name: v.name },
    })),
  };
}

// Build a lookup: regionId → score for a given year
function getVintageScoresForYear(year: number): Map<string, number | null> {
  const m = new Map<string, number | null>();
  for (const rv of vintageData) {
    const v = rv.vintages.find(v => v.year === year);
    m.set(rv.regionId, v?.score ?? null);
  }
  return m;
}

function buildProducerGeoJSON(producers: Producer[]) {
  return {
    type: "FeatureCollection" as const,
    features: producers.map(p => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        flagshipWine: p.flagshipWine,
        country: p.country,
        priceRange: p.priceRange,
        wineType: p.wineType[0],
        regionId: p.regionId,
      },
    })),
  };
}

function buildGeoJSON(selectedId: string | null) {
  return {
    type: "FeatureCollection" as const,
    features: regionBoundaries.map((rb) => {
      const isMulti =
        rb.coordinates.length > 1 &&
        Array.isArray(rb.coordinates[0]) &&
        Array.isArray(rb.coordinates[0][0]) &&
        typeof rb.coordinates[0][0][0] === "number";

      return {
        type: "Feature" as const,
        properties: {
          id: rb.id,
          selected: rb.id === selectedId,
        },
        geometry: isMulti
          ? {
              type: "MultiPolygon" as const,
              coordinates: rb.coordinates.map((ring: any) => [ring]),
            }
          : {
              type: "Polygon" as const,
              coordinates: rb.coordinates,
            },
      };
    }),
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
  vintageYear = null,
}: WineMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const regionMarkersRef = useRef<maplibregl.Marker[]>([]);
  const countryMarkersRef = useRef<maplibregl.Marker[]>([]);
  const boundariesAdded = useRef(false);
  const producerLayersAdded = useRef(false);
  // Keep stable references to callbacks for zoom listener
  const onSelectRegionRef = useRef(onSelectRegion);
  const onSelectProducerRef = useRef(onSelectProducer);
  onSelectRegionRef.current = onSelectRegion;
  onSelectProducerRef.current = onSelectProducer;

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

      // Strip roads/transit/rail from basemap and soften boundary lines
      const style = map.current.getStyle();
      if (style?.layers) {
        const hidePatterns = /road|highway|motorway|trunk|transit|rail|ferry|path/i;
        style.layers.forEach((layer: any) => {
          if (hidePatterns.test(layer.id)) {
            try { map.current!.setLayoutProperty(layer.id, "visibility", "none"); } catch (_) {}
          }
          if (/boundary/i.test(layer.id) && layer.type === "line") {
            try { map.current!.setPaintProperty(layer.id, "line-opacity", 0.2); } catch (_) {}
          }
        });
      }

      const geojson = buildGeoJSON(selectedRegionId);

      map.current.addSource(BOUNDARY_SOURCE, {
        type: "geojson",
        data: geojson as any,
      });

      // Unselected region fills — zoom-aware opacity
      map.current.addLayer({
        id: BOUNDARY_FILL_LAYER,
        type: "fill",
        source: BOUNDARY_SOURCE,
        filter: ["!=", ["get", "selected"], true],
        paint: {
          "fill-color": "rgba(140, 40, 60, 0.08)",
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 0,
            4, 0,
            6, 0.3,
            8, 0.6,
            10, 0.8,
          ],
        },
      });

      // Unselected region outlines — zoom-aware
      map.current.addLayer({
        id: BOUNDARY_LINE_LAYER,
        type: "line",
        source: BOUNDARY_SOURCE,
        filter: ["!=", ["get", "selected"], true],
        paint: {
          "line-color": "rgba(140, 40, 60, 0.45)",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 0,
            4, 0,
            6, 0.5,
            8, 1,
            10, 1.5,
          ],
          "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 0,
            4, 0,
            6, 0.4,
            8, 0.7,
            10, 0.9,
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
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 0.2,
            4, 0.4,
            6, 0.6,
            8, 0.8,
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
            "interpolate",
            ["linear"],
            ["zoom"],
            2, 1,
            4, 1.5,
            6, 2,
            8, 2.5,
            10, 3,
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
        if (feature?.properties?.id) onSelectRegionRef.current(feature.properties.id);
      });
      map.current.on("click", BOUNDARY_FILL_SELECTED, (e: any) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) onSelectRegionRef.current(feature.properties.id);
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

      // ─── Producer native GeoJSON layers (clustered) ───────────────────
      producerLayersAdded.current = true;

      map.current.addSource("producers", {
        type: "geojson",
        data: buildProducerGeoJSON(producers) as any,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 50,
      });

      // Cluster circles
      map.current.addLayer({
        id: "producer-clusters",
        type: "circle",
        source: "producers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#8C1C2E",
          "circle-radius": ["step", ["get", "point_count"], 18, 5, 22, 10, 26, 20, 30],
          "circle-opacity": 0.9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.7)",
        },
      });

      // Cluster count labels
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "producers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Open Sans Regular"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#F7F4EF",
        },
      });

      // Individual producer dots (unclustered)
      map.current.addLayer({
        id: "producer-dots",
        type: "circle",
        source: "producers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match", ["get", "wineType"],
            "red", "#7a1e3a",
            "white", "#b8860b",
            "rosé", "#d4889a",
            "sparkling", "#c4a747",
            "#8c3b55",
          ],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 8, 6, 12, 8],
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Producer name labels (appear at zoom 9+)
      map.current.addLayer({
        id: "producer-labels",
        type: "symbol",
        source: "producers",
        filter: ["!", ["has", "point_count"]],
        minzoom: 9,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Regular"],
          "text-size": 11,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#5A5248",
          "text-halo-color": "rgba(255,255,255,0.9)",
          "text-halo-width": 2,
        },
      });

      // Apply initial showProducers visibility
      const producerVisibility = showProducers ? "visible" : "none";
      ["producer-clusters", "cluster-count", "producer-dots", "producer-labels"].forEach(id => {
        try { map.current!.setLayoutProperty(id, "visibility", producerVisibility); } catch (_) {}
      });

      // Click on cluster → zoom in
      map.current.on("click", "producer-clusters", async (e: any) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, { layers: ["producer-clusters"] });
        if (!features.length) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.current.getSource("producers") as any;
        try {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          map.current!.flyTo({ center: (features[0].geometry as any).coordinates, zoom, duration: 1000 });
        } catch (_) {}
      });

      // Click on individual producer dot → select
      map.current.on("click", "producer-dots", (e: any) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onSelectProducerRef.current(feature.properties.id);
        }
      });

      // Cursor changes
      map.current.on("mouseenter", "producer-clusters", () => { if (map.current) map.current.getCanvas().style.cursor = "pointer"; });
      map.current.on("mouseleave", "producer-clusters", () => { if (map.current) map.current.getCanvas().style.cursor = ""; });
      map.current.on("mouseenter", "producer-dots", () => { if (map.current) map.current.getCanvas().style.cursor = "pointer"; });
      map.current.on("mouseleave", "producer-dots", () => { if (map.current) map.current.getCanvas().style.cursor = ""; });

      // Hover tooltip on producer dots
      const producerPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, className: "wine-tooltip", offset: [0, -8], maxWidth: "220px" });

      map.current.on("mouseenter", "producer-dots", (e: any) => {
        if (!map.current || !e.features?.length) return;
        const f = e.features[0];
        const priceLabel = ({ budget: "$", mid: "$$", premium: "$$$", luxury: "$$$$" } as Record<string, string>)[f.properties.priceRange] || "$$";
        producerPopup.setLngLat(e.lngLat).setHTML(`
          <div style="padding: 8px 12px; font-family: 'Jost', sans-serif; font-size: 12px; color: #2c1a14; line-height: 1.5;">
            <div style="font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #2c1a14; margin-bottom: 4px;">${f.properties.name}</div>
            <div style="color: #8c6a5a; margin-bottom: 3px;">${f.properties.country}</div>
            <div style="margin-bottom: 3px; color: #5a5248;">${f.properties.flagshipWine}</div>
            <div style="color: #8C1C2E; font-weight: 600;">${priceLabel}</div>
          </div>
        `).addTo(map.current!);
      });
      map.current.on("mouseleave", "producer-dots", () => { producerPopup.remove(); });

      // ─── Vintage overlay layer (on top of boundaries) ────────────────
      map.current.addSource("vintage-overlay-src", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] } as any,
      });

      map.current.addLayer({
        id: VINTAGE_OVERLAY,
        type: "fill",
        source: "vintage-overlay-src",
        paint: {
          "fill-color": ["coalesce", ["get", "fillColor"], "rgba(0,0,0,0)"],
          "fill-opacity": 0.9,
        },
        layout: { visibility: "none" },
      });

      // ─── Village / Appellation labels (zoom 8+) ─────────────────────
      map.current.addSource(VILLAGE_LABELS_SOURCE, {
        type: "geojson",
        data: buildVillageGeoJSON() as any,
      });

      map.current.addLayer({
        id: VILLAGE_LABELS_LAYER,
        type: "symbol",
        source: VILLAGE_LABELS_SOURCE,
        minzoom: 8,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Italic"],
          "text-size": 11,
          "text-allow-overlap": false,
          "text-anchor": "center",
          "text-padding": 4,
        },
        paint: {
          "text-color": "rgba(140, 28, 46, 0.6)",
          "text-halo-color": "rgba(255, 255, 255, 0.8)",
          "text-halo-width": 2,
        },
      });
    });

    return () => {
      boundariesAdded.current = false;
      producerLayersAdded.current = false;
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
    [
      BOUNDARY_FILL_LAYER,
      BOUNDARY_LINE_LAYER,
      BOUNDARY_FILL_SELECTED,
      BOUNDARY_LINE_SELECTED,
    ].forEach((id) => {
      try {
        if (map.current?.getLayer(id)) {
          map.current.setLayoutProperty(id, "visibility", visibility);
        }
      } catch (_) {
        /* ignore */
      }
    });
  }, [showBoundaries]);

  // Country flag markers (zoom 2-5)
  useEffect(() => {
    if (!map.current) return;

    countryMarkersRef.current.forEach((m) => m.remove());
    countryMarkersRef.current = [];

    const currentZoom = map.current.getZoom();

    wineCountries.forEach((country) => {
      const el = document.createElement("div");
      el.className = "country-flag-marker";
      el.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        cursor: default;
        pointer-events: none;
        transition: opacity 0.4s ease;
        opacity: ${currentZoom <= 5 ? "1" : "0"};
      `;

      const flagWrapper = document.createElement("div");
      flagWrapper.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
        border: 1.5px solid rgba(255,255,255,0.9);
        box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        background: #f0ebe5;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const flagImg = document.createElement("img");
      flagImg.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
      flagImg.alt = country.name;
      flagImg.style.cssText = `
        width: 28px;
        height: 20px;
        object-fit: cover;
      `;
      flagImg.loading = "lazy";

      flagWrapper.appendChild(flagImg);

      const codeLabel = document.createElement("div");
      codeLabel.textContent = country.code;
      codeLabel.style.cssText = `
        font-family: 'Geist Mono', 'Courier New', monospace;
        font-size: 8px;
        font-weight: 600;
        color: #5a5248;
        letter-spacing: 0.05em;
        text-shadow: 0 0 4px rgba(255,255,255,0.9);
        white-space: nowrap;
      `;

      el.appendChild(flagWrapper);
      el.appendChild(codeLabel);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([country.lng, country.lat])
        .addTo(map.current!);

      countryMarkersRef.current.push(marker);
    });

    // Zoom listener to fade country flags in/out
    const handleZoom = () => {
      if (!map.current) return;
      const z = map.current.getZoom();
      countryMarkersRef.current.forEach((m) => {
        const markerEl = m.getElement();
        if (z <= 4) {
          markerEl.style.opacity = "1";
          markerEl.style.pointerEvents = "none";
        } else if (z <= 5) {
          markerEl.style.opacity = String(1 - (z - 4));
          markerEl.style.pointerEvents = "none";
        } else {
          markerEl.style.opacity = "0";
          markerEl.style.pointerEvents = "none";
        }
      });
    };

    map.current.on("zoom", handleZoom);

    return () => {
      map.current?.off("zoom", handleZoom);
    };
  }, []);

  // Region text label markers
  useEffect(() => {
    if (!map.current) return;

    regionMarkersRef.current.forEach((m) => m.remove());
    regionMarkersRef.current = [];

    const regionIdsWithProducers = new Set(producers.map((p) => p.regionId));
    const currentZoom = map.current.getZoom();

    // Build producer count per region
    const producerCountMap = new Map<string, number>();
    producers.forEach((p) => {
      producerCountMap.set(p.regionId, (producerCountMap.get(p.regionId) ?? 0) + 1);
    });

    regions.forEach((region) => {
      const hasMatchingProducers = !hasActiveFilter || regionIdsWithProducers.has(region.id);
      const dimmed = hasActiveFilter && !hasMatchingProducers;
      const isSelected = selectedRegionId === region.id;

      const el = document.createElement("div");
      el.className = "region-label-marker";
      el.setAttribute("data-testid", `region-marker-${region.id}`);
      el.setAttribute("data-region-id", region.id);
      el.style.cssText = `
        opacity: ${dimmed ? "0.25" : "1"};
        filter: ${dimmed ? "grayscale(1)" : "none"};
        transition: opacity 0.3s ease, filter 0.3s ease;
        cursor: ${dimmed ? "default" : "pointer"};
      `;

      // Get initial label styles based on current zoom
      const getLabelStyle = (zoom: number, selected: boolean) => {
        let fontSize: string;
        let fontWeight: string;
        let opacity: number;
        let background: string;
        let padding: string;
        let borderRadius: string;

        if (selected) {
          fontSize = "17px";
          fontWeight = "700";
          opacity = dimmed ? 0.25 : 1;
          background = "rgba(255,255,255,0.82)";
          padding = "2px 8px";
          borderRadius = "12px";
        } else if (zoom < 4) {
          fontSize = "11px";
          fontWeight = "500";
          opacity = dimmed ? 0.1 : 0.6;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        } else if (zoom < 6) {
          fontSize = "13px";
          fontWeight = "500";
          opacity = dimmed ? 0.25 : 1;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        } else {
          fontSize = "15px";
          fontWeight = "700";
          opacity = dimmed ? 0.25 : 1;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        }

        return { fontSize, fontWeight, opacity, background, padding, borderRadius };
      };

      const applyLabelStyle = (labelEl: HTMLElement, zoom: number, sel: boolean) => {
        const s = getLabelStyle(zoom, sel);
        labelEl.style.fontSize = s.fontSize;
        labelEl.style.fontWeight = s.fontWeight;
        labelEl.style.opacity = String(s.opacity);
        labelEl.style.background = s.background;
        labelEl.style.padding = s.padding;
        labelEl.style.borderRadius = s.borderRadius;
      };

      const labelDiv = document.createElement("div");
      labelDiv.textContent = region.name;
      labelDiv.style.cssText = `
        font-family: 'Fraunces', Georgia, serif;
        color: #8C1C2E;
        text-shadow: 0 0 6px rgba(255,255,255,0.9), 0 0 3px rgba(255,255,255,0.9);
        white-space: nowrap;
        transition: all 0.25s ease;
        user-select: none;
        box-shadow: ${isSelected ? "0 1px 6px rgba(140,28,46,0.2)" : "none"};
      `;

      applyLabelStyle(labelDiv, currentZoom, isSelected);

      el.appendChild(labelDiv);

      if (!dimmed) {
        el.addEventListener("click", () => onSelectRegionRef.current(region.id));

        // Hover tooltip for region
        const producerCount = producerCountMap.get(region.id) ?? 0;
        const grapeList = region.grapes.slice(0, 3).join(" · ");
        const popup = new maplibregl.Popup({
          offset: [0, -8],
          closeButton: false,
          closeOnClick: false,
          className: "wine-tooltip",
          maxWidth: "220px",
        }).setHTML(`
          <div style="
            padding: 8px 12px;
            font-family: 'Jost', sans-serif;
            font-size: 12px;
            color: #2c1a14;
            line-height: 1.5;
          ">
            <div style="font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #8C1C2E; margin-bottom: 4px;">${region.name}</div>
            <div style="color: #5a5248; margin-bottom: 3px;">${region.country}</div>
            <div style="margin-bottom: 3px;">${producerCount} producer${producerCount !== 1 ? "s" : ""} · ${region.grapes.length} grape${region.grapes.length !== 1 ? "s" : ""}</div>
            ${grapeList ? `<div style="color: #8c6a5a; font-size: 11px;">${grapeList}</div>` : ""}
          </div>
        `);

        el.addEventListener("mouseenter", () => {
          popup.setLngLat([region.lng, region.lat]).addTo(map.current!);
        });
        el.addEventListener("mouseleave", () => {
          popup.remove();
        });
      }

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([region.lng, region.lat])
        .addTo(map.current!);

      regionMarkersRef.current.push(marker);
    });

    // Zoom listener to update region label sizes
    const handleZoom = () => {
      if (!map.current) return;
      const z = map.current.getZoom();
      regionMarkersRef.current.forEach((m) => {
        const markerEl = m.getElement();
        const regionId = markerEl.getAttribute("data-region-id");
        const labelEl = markerEl.querySelector("div") as HTMLElement | null;
        if (!labelEl) return;
        const isSelected = regionId === selectedRegionId;
        // Use inline getLabelStyle logic
        let fontSize: string;
        let fontWeight: string;
        let opacity: number;
        let background: string;
        let padding: string;
        let borderRadius: string;
        const isDimmed = parseFloat(markerEl.style.opacity) < 0.5;

        if (isSelected) {
          fontSize = "17px";
          fontWeight = "700";
          opacity = isDimmed ? 0.25 : 1;
          background = "rgba(255,255,255,0.82)";
          padding = "2px 8px";
          borderRadius = "12px";
        } else if (z < 4) {
          fontSize = "11px";
          fontWeight = "500";
          opacity = isDimmed ? 0.1 : 0.6;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        } else if (z < 6) {
          fontSize = "13px";
          fontWeight = "500";
          opacity = isDimmed ? 0.25 : 1;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        } else {
          fontSize = "15px";
          fontWeight = "700";
          opacity = isDimmed ? 0.25 : 1;
          background = "transparent";
          padding = "0";
          borderRadius = "0";
        }

        labelEl.style.fontSize = fontSize;
        labelEl.style.fontWeight = fontWeight;
        labelEl.style.opacity = String(opacity);
        labelEl.style.background = background;
        labelEl.style.padding = padding;
        labelEl.style.borderRadius = borderRadius;
      });
    };

    map.current.on("zoom", handleZoom);

    return () => {
      map.current?.off("zoom", handleZoom);
    };
  }, [regions, selectedRegionId, producers, hasActiveFilter]);

  // Update producer GeoJSON source when producers change
  useEffect(() => {
    if (!map.current || !producerLayersAdded.current) return;
    const source = map.current.getSource("producers") as any;
    if (source?.setData) {
      source.setData(buildProducerGeoJSON(producers));
    }
  }, [producers]);

  // Toggle producer layer visibility
  useEffect(() => {
    if (!map.current || !producerLayersAdded.current) return;
    const visibility = showProducers ? "visible" : "none";
    ["producer-clusters", "cluster-count", "producer-dots", "producer-labels"].forEach(id => {
      try {
        if (map.current?.getLayer(id)) {
          map.current.setLayoutProperty(id, "visibility", visibility);
        }
      } catch (_) {}
    });
  }, [showProducers]);

  // Auto-fit bounds when filters are active
  useEffect(() => {
    if (!map.current || !hasActiveFilter || producers.length === 0) return;

    let minLng = Infinity,
      maxLng = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    producers.forEach((p) => {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    });

    if (minLng !== Infinity) {
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

  // Vintage heatmap overlay
  useEffect(() => {
    if (!map.current || !boundariesAdded.current) return;

    const m = map.current;
    const layer = m.getLayer(VINTAGE_OVERLAY);
    if (!layer) return;

    if (vintageYear === null || vintageYear === undefined) {
      // Hide overlay
      m.setLayoutProperty(VINTAGE_OVERLAY, "visibility", "none");
      return;
    }

    // Build overlay GeoJSON from region boundaries + vintage scores
    const scores = getVintageScoresForYear(vintageYear);
    const features = regionBoundaries
      .filter(rb => scores.has(rb.id))
      .map(rb => {
        const score = scores.get(rb.id) ?? null;
        const isMulti =
          rb.coordinates.length > 1 &&
          Array.isArray(rb.coordinates[0]) &&
          Array.isArray(rb.coordinates[0][0]) &&
          typeof rb.coordinates[0][0][0] === "number";

        return {
          type: "Feature" as const,
          properties: {
            id: rb.id,
            fillColor: vintageColor(score),
            score,
            label: vintageLabel(score),
          },
          geometry: isMulti
            ? { type: "MultiPolygon" as const, coordinates: rb.coordinates.map((ring: any) => [ring]) }
            : { type: "Polygon" as const, coordinates: rb.coordinates },
        };
      });

    const source = m.getSource("vintage-overlay-src") as any;
    if (source?.setData) {
      source.setData({ type: "FeatureCollection", features } as any);
    }
    m.setLayoutProperty(VINTAGE_OVERLAY, "visibility", "visible");
  }, [vintageYear]);

  return (
    <>
      <style>{`
        .wine-tooltip .maplibregl-popup-content {
          background: rgba(255, 252, 248, 0.97);
          border: 1px solid rgba(140, 28, 46, 0.15);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
          padding: 0;
        }
        .wine-tooltip .maplibregl-popup-tip {
          border-top-color: rgba(255, 252, 248, 0.97);
        }
        .wine-tooltip.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: rgba(255, 252, 248, 0.97);
        }
        .wine-tooltip.maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-bottom-color: rgba(255, 252, 248, 0.97);
        }
      `}</style>
      <div ref={mapContainer} className="w-full h-full" data-testid="wine-map" />
      {vintageYear !== null && vintageYear !== undefined && (
        <div style={{
          position: "absolute",
          bottom: 28,
          right: 10,
          background: "rgba(255,255,255,0.94)",
          border: "1px solid #EDEAE3",
          borderRadius: 8,
          padding: "8px 10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.04em",
          color: "#5A5248",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 5,
        }}>
          {VINTAGE_LEGEND.map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: color,
                border: "1px solid rgba(0,0,0,0.08)",
                flexShrink: 0,
              }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
