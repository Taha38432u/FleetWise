import { makeApiCall } from "@/api/api";
import { UserRole } from "@/lib/access";
import { ApiMeta } from "@/types/api.types";

export type StaffUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  status: string;
  createdAt: string;
  driver?: {
    id: string;
    licenseNumber: string;
    licenseExpiry: string;
    yearsOfExperience: number;
    emergencyContact: string;
    emergencyContactPhone: string;
    availabilityStatus: string;
  } | null;
};

export type StaffInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status?: string;
  password?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  yearsOfExperience?: number | string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  driver?: {
    licenseNumber?: string;
    licenseExpiry?: string;
    yearsOfExperience?: number | string;
    emergencyContact?: string;
    emergencyContactPhone?: string;
  };
};

export async function getStaff(params?: {
  page?: number;
  pageSize?: number;
  role?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));
  if (params?.role) query.append("role", params.role);
  if (params?.search) query.append("search", params.search);

  return makeApiCall<{ ok: boolean; data: StaffUser[]; meta: ApiMeta }>({
    method: "GET",
    url: `staff${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function createStaff(data: StaffInput) {
  return makeApiCall<{ ok: boolean; data: StaffUser }>({
    method: "POST",
    url: "staff",
    data,
  });
}

export async function updateStaff(id: string, data: Partial<StaffInput>) {
  return makeApiCall<{ ok: boolean; data: StaffUser }>({
    method: "PATCH",
    url: `staff/${id}`,
    data,
  });
}

export async function deleteStaff(id: string) {
  return makeApiCall({
    method: "DELETE",
    url: `staff/${id}`,
  });
}
