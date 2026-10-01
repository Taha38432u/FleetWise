import { makeApiCall } from "@/api/api";
import { FleetRoute, PaginatedResponse } from "@/types/fleet.types";

export async function getRoutes(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  return makeApiCall<PaginatedResponse<FleetRoute>>({
    method: "GET",
    url: `routes${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function getMyRoutes(params?: { page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));
  return makeApiCall<PaginatedResponse<FleetRoute>>({
    method: "GET",
    url: `routes/me${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function createRoute(data: any) {
  return makeApiCall<{ ok: boolean; data: FleetRoute }>({
    method: "POST",
    url: "routes",
    data,
  });
}

export async function updateRoute(id: string, data: any) {
  return makeApiCall<{ ok: boolean; data: FleetRoute }>({
    method: "PATCH",
    url: `routes/${id}`,
    data,
  });
}

export async function updateMyRouteStatus(id: string, data: any) {
  return makeApiCall<{ ok: boolean; data: FleetRoute }>({
    method: "PATCH",
    url: `routes/${id}/driver-status`,
    data,
  });
}

export async function requestRouteLocation(id: string) {
  return makeApiCall<{ ok: boolean; data: any }>({
    method: "POST",
    url: `routes/${id}/request-location`,
  });
}

export async function getRouteLocation(id: string) {
  return makeApiCall<{ ok: boolean; data: any }>({
    method: "GET",
    url: `routes/${id}/location`,
  });
}

export async function deleteRoute(id: string) {
  return makeApiCall({
    method: "DELETE",
    url: `routes/${id}`,
  });
}
