import { makeApiCall } from "@/api/api";
import { AppNotification, PaginatedResponse } from "@/types/fleet.types";

export async function getNotifications(params?: { page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));
  return makeApiCall<PaginatedResponse<AppNotification>>({
    method: "GET",
    url: `notifications${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function markNotificationRead(id: string) {
  return makeApiCall<{ ok: boolean; data: AppNotification }>({
    method: "PATCH",
    url: `notifications/${id}/read`,
  });
}

export async function markAllNotificationsRead() {
  return makeApiCall<{ ok: boolean; data: { count: number } }>({
    method: "PATCH",
    url: "notifications/read-all",
  });
}

export async function deleteNotification(id: string) {
  return makeApiCall({
    method: "DELETE",
    url: `notifications/${id}`,
  });
}
