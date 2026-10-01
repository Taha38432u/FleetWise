import { LatLngValue } from "@/components/map/LocationPickerMap";

export function parseLocationParts(value?: string | null) {
  if (!value) return { label: "", coordinates: "", point: null as LatLngValue | null };
  const [coordinatesPart, ...labelParts] = value.split("|").map((item) => item.trim());
  const match = coordinatesPart.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  const point = match
    ? { latitude: Number(match[1]), longitude: Number(match[2]) }
    : null;
  const label = labelParts.join(" | ") || "";
  return { label, coordinates: coordinatesPart, point };
}

export function formatLocation(point: LatLngValue, label?: string) {
  const coordinates = `${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
  return label ? `${coordinates} | ${label}` : coordinates;
}

export async function reverseGeocode(point: LatLngValue) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(point.latitude));
  url.searchParams.set("lon", String(point.longitude));
  url.searchParams.set("zoom", "14");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return "";

  const data = await response.json();
  const address = data.address || {};
  return [
    address.road || address.neighbourhood || address.suburb,
    address.city || address.town || address.village || address.county,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ") || data.display_name || "";
}
