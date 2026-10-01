import { makeApiCall } from "@/api/api";
import { PaginatedResponse } from "@/types/fleet.types";

export type AttendanceRecord = {
  id: string;
  userId: string;
  checkInAt: string;
  checkOutAt?: string | null;
  status: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

export async function checkIn() {
  return makeApiCall<{ ok: boolean; data: AttendanceRecord }>({
    method: "POST",
    url: "attendance/check-in",
  });
}

export async function checkOut() {
  return makeApiCall<{ ok: boolean; data: AttendanceRecord }>({
    method: "POST",
    url: "attendance/check-out",
  });
}

export async function getAttendance(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return makeApiCall<PaginatedResponse<AttendanceRecord>>({
    method: "GET",
    url: `attendance${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function getMyAttendance(params?: { page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));
  return makeApiCall<PaginatedResponse<AttendanceRecord>>({
    method: "GET",
    url: `attendance/me${query.toString() ? `?${query.toString()}` : ""}`,
  });
}
