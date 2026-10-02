import { useEffect, useEffectEvent, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GuideLocationMap.css";

const BANGLADESH_CENTER = [23.8103, 90.4125];

function getCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function createPinIcon(isSelected = false, companyName = "Guide") {
  const initial = isSelected
    ? "✓"
    : (companyName.trim().charAt(0).toUpperCase() || "G");
  const safeInitial = initial.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

  return L.divIcon({
    className: "guide-map-pin",
    html: `<span class="guide-map-pin-body${isSelected ? " is-selected" : ""}"><span class="guide-map-pin-initial">${safeInitial}</span></span>`,
    iconSize: [40, 48],
    iconAnchor: [20, 46],
  });
}

export default function GuideLocationMap({
  latitude,
  longitude,
  zoom = 7,
  markers = [],
  selectable = false,
  onLocationSelect,
  onMarkerSelect,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  const selectedLatitude = getCoordinate(latitude);
  const selectedLongitude = getCoordinate(longitude);

  const handleMapClick = useEffectEvent((event) => {
    if (selectable) {
      onLocationSelect?.(
        event.latlng.lat.toFixed(7),
        event.latlng.lng.toFixed(7),
      );
    }
  });

  const handleMarkerClick = useEffectEvent((marker) => {
    onMarkerSelect?.(marker.guide || marker);
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
    }).setView(BANGLADESH_CENTER, 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    map.on("click", handleMapClick);
    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const center = selectedLatitude !== null && selectedLongitude !== null
      ? [selectedLatitude, selectedLongitude]
      : BANGLADESH_CENTER;

    map.setView(center, zoom);
  }, [selectedLatitude, selectedLongitude, zoom]);

  useEffect(() => {
    const layer = markerLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) {
      return;
    }

    layer.clearLayers();

    if (selectedLatitude !== null && selectedLongitude !== null) {
      L.marker([selectedLatitude, selectedLongitude], {
        icon: createPinIcon(true),
      }).addTo(layer);
    }

    const validMarkers = markers.filter((marker) => (
      getCoordinate(marker.latitude) !== null
      && getCoordinate(marker.longitude) !== null
    ));

    validMarkers.forEach((marker) => {
      const mapMarker = L.marker(
        [Number(marker.latitude), Number(marker.longitude)],
        { icon: createPinIcon(false, marker.companyName || "Guide") },
      ).addTo(layer);

      mapMarker.on("click", () => handleMarkerClick(marker));

      const tooltip = document.createElement("span");
      tooltip.textContent = marker.companyName || "Guide location";
      mapMarker.bindTooltip(tooltip, { direction: "top", offset: [0, -38] });
    });

    if (validMarkers.length > 0) {
      const bounds = L.latLngBounds(
        validMarkers.map((marker) => [
          Number(marker.latitude),
          Number(marker.longitude),
        ]),
      );

      if (selectedLatitude !== null && selectedLongitude !== null) {
        bounds.extend([selectedLatitude, selectedLongitude]);
      }

      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
    }
  }, [markers, selectedLatitude, selectedLongitude]);

  return (
    <div
      ref={containerRef}
      className={`guide-location-map${selectable ? " is-selectable" : ""}`}
      role="application"
      aria-label={selectable ? "Choose guide location on map" : "Guide locations map"}
    />
  );
}