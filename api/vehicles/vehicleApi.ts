import { makeApiCall } from "@/api/api";
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from "@/data/vehicles";

export interface MetaData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetVehiclesResponse {
  ok: boolean;
  data: {
    data: Vehicle[];
    meta: MetaData;
  };
}

export interface GetVehicleResponse {
  ok: boolean;
  data: Vehicle;
}

export const getVehicles = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  search?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.pageSize) queryParams.append("pageSize", String(params.pageSize));
    if (params?.status) queryParams.append("status", params.status);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.search) queryParams.append("search", params.search);

    const response = await makeApiCall<GetVehiclesResponse>({
      url: `vehicles${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
      method: "GET",
    });

    return response;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.error?.message || "Failed to fetch vehicles"
    );
  }
};

export const getVehicle = async (id: string) => {
  try {
    const response = await makeApiCall<GetVehicleResponse>({
      url: `vehicles/${id}`,
      method: "GET",
    });

    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.error?.message || "Failed to fetch vehicle"
    );
  }
};

export const createVehicle = async (data: CreateVehicleDto) => {
  try {
    const response = await makeApiCall<GetVehicleResponse>({
      url: "vehicles",
      method: "POST",
      data,
    });

    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.error?.message || "Failed to create vehicle"
    );
  }
};

export const updateVehicle = async (id: string, data: UpdateVehicleDto) => {
  try {
    const response = await makeApiCall<GetVehicleResponse>({
      url: `vehicles/${id}`,
      method: "PUT",
      data,
    });

    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.error?.message || "Failed to update vehicle"
    );
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    await makeApiCall({
      url: `vehicles/${id}`,
      method: "DELETE",
    });
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.error?.message || "Failed to delete vehicle"
    );
  }
};
