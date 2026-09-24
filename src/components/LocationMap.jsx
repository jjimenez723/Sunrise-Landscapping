import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";

const LazyBrandMap = lazy(() => import("./BrandMap"));

function MapPlaceholder({ label = "Map loading" }) {
  return (
    <div className="brand-map__placeholder" aria-hidden="true">
      <span className="brand-map__placeholder-grid"></span>
      <span className="brand-map__placeholder-label">{label}</span>
    </div>
  );
}

function MapUnavailable({ directionsUrl }) {
  return (
    <div className="brand-map__message">
      <span className="brand-map__message-mark">↗</span>
      <strong>Map unavailable right now.</strong>
      <a href={directionsUrl} target="_blank" rel="noreferrer">Open directions</a>
    </div>
  );
}

class MapErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Brand map chunk failed", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function LocationMap({
  latitude,
  longitude,
  directionsUrl,
  markerLabel,
  zoom = 16,
  interactive = true,
}) {
  const frameRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!frameRef.current) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "650px 0px" },
    );

    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMapFailed(false);
    setMapReady(false);
  }, [latitude, longitude]);

  return (
    <div ref={frameRef} className="location-map-frame">
      {mapFailed ? (
        <MapUnavailable directionsUrl={directionsUrl} />
      ) : shouldLoad ? (
        <MapErrorBoundary fallback={<MapUnavailable directionsUrl={directionsUrl} />}>
          <Suspense fallback={<MapPlaceholder />}>
            <LazyBrandMap
              latitude={latitude}
              longitude={longitude}
              directionsUrl={directionsUrl}
              markerLabel={markerLabel}
              zoom={zoom}
              interactive={interactive}
              onReady={() => setMapReady(true)}
              onError={() => setMapFailed(true)}
            />
          </Suspense>
          {!mapReady && <div className="brand-map__loading" aria-hidden="true">Loading map…</div>}
        </MapErrorBoundary>
      ) : (
        <MapPlaceholder label="Location map" />
      )}
    </div>
  );
}
