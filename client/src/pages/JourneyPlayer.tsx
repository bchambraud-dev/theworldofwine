import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { journeys } from "@/data/journeys";
import { quizzes } from "@/data/quizzes";
import { regionBoundaries } from "@/data/regionBoundaries";
import { useTrack } from "@/hooks/use-track";

declare const maplibregl: typeof import("maplibre-gl").default;

const BOUNDARY_SOURCE = "journey-boundaries";
const BOUNDARY_FILL = "journey-fill";
const BOUNDARY_LINE = "journey-line";

export default function JourneyPlayer() {
  const [, params] = useRoute("/journey/:id");
  const [, setLocation] = useLocation();
  const track = useTrack();
  const journeyId = params?.id;
  const journey = journeys.find((j) => j.id === journeyId);

  const [currentStop, setCurrentStop] = useState(0);
  const [completed, setCompleted] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const boundariesAdded = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !journey) return;

    const firstStop = journey.stops[0];
    const center = firstStop.mapCenter
      ? [firstStop.mapCenter.lng, firstStop.mapCenter.lat]
      : [15, 35];
    const zoom = firstStop.mapCenter?.zoom || 4;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: center as [number, number],
      zoom,
      minZoom: 2,
      maxZoom: 14,
      attributionControl: false,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    mapRef.current.on("load", () => {
      if (!mapRef.current || boundariesAdded.current) return;
      boundariesAdded.current = true;

      // Add boundary layers
      const geojson = buildBoundaryGeoJSON(firstStop.targetId || null);
      mapRef.current.addSource(BOUNDARY_SOURCE, {
        type: "geojson",
        data: geojson as any,
      });
      mapRef.current.addLayer({
        id: BOUNDARY_FILL,
        type: "fill",
        source: BOUNDARY_SOURCE,
        paint: {
          "fill-color": "rgba(140, 40, 60, 0.15)",
          "fill-opacity": 0.6,
        },
      });
      mapRef.current.addLayer({
        id: BOUNDARY_LINE,
        type: "line",
        source: BOUNDARY_SOURCE,
        paint: {
          "line-color": "rgba(140, 40, 60, 0.7)",
          "line-width": 2.5,
        },
        layout: { "line-join": "round", "line-cap": "round" },
      });
    });

    return () => {
      boundariesAdded.current = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [journeyId]);

  // Fly to current stop
  useEffect(() => {
    if (!journey || !mapRef.current) return;
    const stop = journey.stops[currentStop];
    if (stop?.mapCenter) {
      mapRef.current.flyTo({
        center: [stop.mapCenter.lng, stop.mapCenter.lat],
        zoom: stop.mapCenter.zoom,
        duration: 1800,
      });
    }
    // Update boundary highlight
    if (mapRef.current && boundariesAdded.current) {
      const source = mapRef.current.getSource(BOUNDARY_SOURCE) as any;
      if (source?.setData) {
        source.setData(buildBoundaryGeoJSON(stop?.targetId || null));
      }
    }
    track("journey_stop_view", { journeyId, stop: currentStop });
  }, [currentStop, journeyId]);

  const goNext = useCallback(() => {
    if (!journey) return;
    if (currentStop < journey.stops.length - 1) {
      setCurrentStop((s) => s + 1);
    } else {
      setCompleted(true);
      track("journey_completed", { journeyId });
    }
  }, [currentStop, journey, journeyId]);

  const goPrev = useCallback(() => {
    if (currentStop > 0) {
      setCurrentStop((s) => s - 1);
      setCompleted(false);
    }
  }, [currentStop]);

  if (!journey) {
    return (
      <div className="page-scroll" style={{ padding: 60, textAlign: "center" }}>
        <div className="lv-empty-icon">🗺️</div>
        <div className="lv-empty-title">Journey not found</div>
        <button
          className="chip"
          onClick={() => setLocation("/journeys")}
          style={{ marginTop: 16 }}
        >
          Browse Journeys
        </button>
      </div>
    );
  }

  const stop = journey.stops[currentStop];
  const progress = ((currentStop + 1) / journey.stops.length) * 100;
  const linkedQuiz = quizzes.find((q) => q.journeyId === journey.id);

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--topbar)",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        zIndex: 50,
      }}
      data-testid="journey-player"
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "40%",
          minWidth: 320,
          maxWidth: 520,
          background: "var(--wh)",
          borderRight: "1px solid var(--border-c)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Journey header */}
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: "1px solid var(--border-c)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setLocation("/journeys")}
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.58rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text3)",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 8,
              display: "block",
            }}
            data-testid="back-to-journeys"
          >
            ← All Journeys
          </button>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.15rem",
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {journey.title}
          </div>
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.58rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text3)",
            }}
          >
            Stop {currentStop + 1} of {journey.stops.length}
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: "var(--bg2)",
              borderRadius: 2,
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--wine)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 24px",
          }}
        >
          {completed ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🎉</div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  color: "var(--text)",
                  marginBottom: 8,
                }}
              >
                Journey Complete!
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 300,
                  color: "var(--text2)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                You've explored all {journey.stops.length} stops in "{journey.title}".
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="chip active"
                  onClick={() => setLocation("/explore")}
                  data-testid="explore-further"
                >
                  Explore the Map
                </button>
                {linkedQuiz && (
                  <button
                    className="chip"
                    onClick={() => setLocation(`/quiz/${linkedQuiz.id}`)}
                    data-testid="take-quiz"
                    style={{ borderColor: "var(--wine)", color: "var(--wine)" }}
                  >
                    Take the Quiz
                  </button>
                )}
                <button
                  className="chip"
                  onClick={() => setLocation("/journeys")}
                >
                  More Journeys
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  lineHeight: 1.25,
                  marginBottom: 16,
                }}
              >
                {stop.title}
              </h3>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--text2)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{ __html: stop.narrative }}
              />
            </>
          )}
        </div>

        {/* Navigation */}
        {!completed && (
          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid var(--border-c)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              background: "var(--wh)",
            }}
          >
            <button
              onClick={goPrev}
              disabled={currentStop === 0}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: currentStop === 0 ? "var(--text3)" : "var(--text2)",
                background: "none",
                border: "none",
                cursor: currentStop === 0 ? "default" : "pointer",
                opacity: currentStop === 0 ? 0.4 : 1,
              }}
              data-testid="btn-prev-stop"
            >
              ← Previous
            </button>
            <button
              onClick={goNext}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "8px 20px",
                borderRadius: 100,
                border: "none",
                background: "var(--wine)",
                color: "white",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              data-testid="btn-next-stop"
            >
              {currentStop === journey.stops.length - 1 ? "Finish Journey" : "Next Stop →"}
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANEL — MAP */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} data-testid="journey-map" />
      </div>
    </div>
  );
}

function buildBoundaryGeoJSON(targetId: string | null) {
  if (!targetId) {
    return { type: "FeatureCollection" as const, features: [] };
  }
  const boundary = regionBoundaries.find((rb) => rb.id === targetId);
  if (!boundary) {
    return { type: "FeatureCollection" as const, features: [] };
  }
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { id: boundary.id },
        geometry: {
          type: "Polygon" as const,
          coordinates: boundary.coordinates,
        },
      },
    ],
  };
}
