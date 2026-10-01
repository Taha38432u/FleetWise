"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LatLngValue = {
  latitude: number;
  longitude: number;
};

interface LocationPickerMapProps {
  value?: LatLngValue | null;
  label: string;
  markerColor?: string;
  onChange: (value: LatLngValue) => void;
}

const DEFAULT_CENTER: [number, number] = [24.8607, 67.0011];

function buildMarkerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 999px 999px 999px 4px;
        background: ${color};
        border: 3px solid #ffffff;
        outline: 2px solid #bbf7d0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: white;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
}

export function LocationPickerMap({
  value,
  label,
  markerColor = "#15803d",
  onChange,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const markerIcon = useMemo(() => buildMarkerIcon(markerColor), [markerColor]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialValue = initialValueRef.current;
    const center: [number, number] = initialValue
      ? [initialValue.latitude, initialValue.longitude]
      : DEFAULT_CENTER;

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom: initialValue ? 14 : 11,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    mapRef.current.on("click", (event: L.LeafletMouseEvent) => {
      onChangeRef.current({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    });

    const resizeTimer = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 150);

    return () => {
      window.clearTimeout(resizeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!value) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const latLng = L.latLng(value.latitude, value.longitude);
    if (!markerRef.current) {
      markerRef.current = L.marker(latLng, { icon: markerIcon }).addTo(map);
    } else {
      markerRef.current.setLatLng(latLng);
      markerRef.current.setIcon(markerIcon);
    }

    markerRef.current.bindPopup(
      `<strong>${label}</strong><br/>${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`,
    );
    map.setView(latLng, Math.max(map.getZoom(), 13));
  }, [label, markerIcon, value]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">
          Click the map to place this route point.
        </p>
      </div>
      <div ref={containerRef} className="h-[460px] w-full" />
    </div>
  );
}
