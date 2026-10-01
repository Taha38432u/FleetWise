import { makeApiCall } from "@/api/api";

export async function getOwnerOverview() {
  return makeApiCall<{ ok: boolean; data: any }>({
    method: "GET",
    url: "super-admin/overview",
  });
}

export async function getOwnerUsers(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== "") query.append(key, String(value));
  });
  return makeApiCall<{ ok: boolean; data: any[]; meta: any }>({
    method: "GET",
    url: `super-admin/users${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function getOwnerSubscriptions(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== "") query.append(key, String(value));
  });
  return makeApiCall<{ ok: boolean; data: any[]; meta: any }>({
    method: "GET",
    url: `super-admin/subscriptions${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function deactivateOwnerOrganization(adminUserId: string) {
  return makeApiCall<{ ok: boolean; data: any }>({
    method: "POST",
    url: `super-admin/organizations/${adminUserId}/deactivate`,
  });
}

export async function resetOwnerOrganization(adminUserId: string) {
  return makeApiCall<{ ok: boolean; data: any }>({
    method: "POST",
    url: `super-admin/organizations/${adminUserId}/reset`,
  });
}
