import { LatLngValue } from "@/components/map/LocationPickerMap";
import { parseLocationParts } from "@/components/map/locationUtils";

export const DEFAULT_DEMO_START: LatLngValue = { latitude: 24.8607, longitude: 67.0011 };
export const DEFAULT_DEMO_END: LatLngValue = { latitude: 24.9256, longitude: 67.0869 };

export function getRouteSimulationPoints(route: any) {
  const start = parseLocationParts(route?.startLocation).point;
  const end = parseLocationParts(route?.endLocation).point;

  return {
    start: start || DEFAULT_DEMO_START,
    end: end || DEFAULT_DEMO_END,
    isFallback: !start || !end,
  };
}

export function interpolateRoutePoint(start: LatLngValue, end: LatLngValue, ratio: number) {
  const boundedRatio = Math.max(0, Math.min(ratio, 1));
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * boundedRatio,
    longitude: start.longitude + (end.longitude - start.longitude) * boundedRatio,
  };
}

export function routeHeading(start: LatLngValue, end: LatLngValue) {
  const deltaLat = end.latitude - start.latitude;
  const deltaLng = end.longitude - start.longitude;
  return Math.round((Math.atan2(deltaLng, deltaLat) * 180) / Math.PI + 360) % 360;
}

export function demoSpeedForRatio(ratio: number) {
  return 35 + Math.round(Math.sin(Math.max(0, Math.min(ratio, 1)) * Math.PI) * 25);
}
