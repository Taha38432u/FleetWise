import { makeApiCall } from "@/api/api";
import { TrackingPoint } from "@/types/fleet.types";

export async function getVehicleLocation(vehicleId: string) {
  return makeApiCall<{ ok: boolean; data: TrackingPoint | null }>({
    method: "GET",
    url: `tracking/${vehicleId}`,
  });
}

export async function getVehicleHistory(vehicleId: string, params?: { from?: string; to?: string }) {
  const query = new URLSearchParams();
  if (params?.from) query.append("from", params.from);
  if (params?.to) query.append("to", params.to);

  return makeApiCall<{ ok: boolean; data: TrackingPoint[] }>({
    method: "GET",
    url: `tracking/${vehicleId}/history${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function saveVehicleLocation(data: any) {
  return makeApiCall<{ ok: boolean; data: TrackingPoint }>({
    method: "POST",
    url: "tracking/location",
    data,
  });
}
