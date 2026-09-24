import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { createBrandMapStyle } from "./brandMapStyle";

maplibregl.setWorkerUrl(workerUrl);

function markerLogoSvg() {
  return `
    <svg class="brand-map-marker__logo" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="54" r="25" fill="url(#brandMarkerSun)" />
      <path d="M10 84c11-16 24-24 40-24s29 8 40 24" fill="none" stroke="#171b15" stroke-width="6" stroke-linecap="round" />
      <defs><linearGradient id="brandMarkerSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd58b" /><stop offset="1" stop-color="#f47c51" /></linearGradient></defs>
    </svg>
  `;
}

function createMarkerElement(markerLabel, directionsUrl) {
  const marker = document.createElement("a");
  marker.className = "brand-map-marker";
  marker.href = directionsUrl;
  marker.target = "_blank";
  marker.rel = "noreferrer";
  marker.setAttribute("aria-label", `Open directions to ${markerLabel}`);
  marker.title = `Open directions to ${markerLabel}`;
  marker.innerHTML = `
    <span class="brand-map-marker__inner">
      <span class="brand-map-marker__tail"></span>
      <span class="brand-map-marker__badge">${markerLogoSvg()}</span>
    </span>
  `;
  return marker;
}

export default function BrandMap({
  latitude,
  longitude,
  directionsUrl,
  markerLabel,
  zoom = 16,
  interactive = true,
  className = "",
  onReady,
  onError,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    let map;
    let marker;
    let hasLoaded = false;
    let disposed = false;

    try {
      map = new maplibregl.Map({
        container: mapRef.current,
        style: createBrandMapStyle(),
        center: [longitude, latitude],
        zoom,
        bearing: 0,
        pitch: 0,
        interactive,
        cooperativeGestures: interactive,
        dragRotate: false,
        touchPitch: false,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: "© OpenFreeMap · © OpenStreetMap contributors",
        }),
        "top-right",
      );

      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "bottom-right");
      }

      marker = new maplibregl.Marker({
        element: createMarkerElement(markerLabel, directionsUrl),
        anchor: "bottom",
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      map.once("load", () => {
        hasLoaded = true;
        if (!disposed) onReady?.();
      });

      map.on("error", (event) => {
        const error = event?.error || event;
        console.error("Brand map error", error);
        if (!hasLoaded && !disposed) onError?.(error);
      });
    } catch (error) {
      console.error("Brand map could not initialize", error);
      onError?.(error);
    }

    return () => {
      disposed = true;
      marker?.remove();
      map?.remove();
    };
  }, [directionsUrl, interactive, latitude, longitude, markerLabel, onError, onReady, zoom]);

  return <div ref={mapRef} className={`brand-map ${className}`} aria-label={`Map showing ${markerLabel}`} />;
}
