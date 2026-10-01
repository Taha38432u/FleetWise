"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrackingPoint } from "@/types/fleet.types";

interface VehicleMapProps {
  points: TrackingPoint[];
  selectedVehicleLabel?: string;
}

const DEFAULT_CENTER: [number, number] = [24.8607, 67.0011];

const vehicleIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: #15803d;
      border: 3px solid #ffffff;
      outline: 2px solid #bbf7d0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7h11v9H3V7Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M14 10h4l3 3v3h-7v-6Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="white"/>
        <path d="M17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18],
});

function latestPopup(label: string | undefined, point: TrackingPoint) {
  return `
    <strong>${label || "Vehicle"}</strong><br/>
    ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}<br/>
    ${point.speed || 0} km/h
  `;
}

export function VehicleMap({ points, selectedVehicleLabel }: VehicleMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    polylineRef.current = L.polyline([], {
      color: "#15803d",
      weight: 4,
      opacity: 0.85,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const latLngs = points.map((point) =>
      L.latLng(point.latitude, point.longitude),
    );
    polylineRef.current?.setLatLngs(latLngs);

    const latestPoint = points[points.length - 1];
    if (!latestPoint) {
      map.setView(DEFAULT_CENTER, 11);
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const latestLatLng = L.latLng(latestPoint.latitude, latestPoint.longitude);

    if (!markerRef.current) {
      markerRef.current = L.marker(latestLatLng, { icon: vehicleIcon }).addTo(map);
    } else {
      markerRef.current.setLatLng(latestLatLng);
    }

    markerRef.current.bindPopup(latestPopup(selectedVehicleLabel, latestPoint));

    if (latLngs.length > 1) {
      map.fitBounds(L.latLngBounds(latLngs), {
        padding: [48, 48],
        maxZoom: 15,
      });
    } else {
      map.setView(latestLatLng, 14);
    }
  }, [points, selectedVehicleLabel]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Operations Map</p>
          <p className="text-xs text-slate-500">
            {selectedVehicleLabel || "Live fleet positions"}
          </p>
        </div>
        <div className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {points.length} point{points.length === 1 ? "" : "s"}
        </div>
      </div>

      <div ref={containerRef} className="h-[520px] w-full" />
    </div>
  );
}
