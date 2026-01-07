import { makeApiCall } from "@/api/api";
import {
  CreateDriverDto,
  UpdateDriverDto,
  GetDriversResponse,
  GetDriverResponse,
  CreateDriverResponse,
  UpdateDriverResponse,
  GetDriversParams,
  CreateDrivingRecordDto,
  GetDrivingRecordsResponse,
  CreateDriverRatingDto,
  GetDriverRatingsResponse,
} from "@/types/driver.types";

const BASE_URL = "drivers";

// Get all drivers with pagination and filters
export const getDrivers = async (params?: GetDriversParams) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.pageSize) searchParams.append("pageSize", params.pageSize.toString());
  if (params?.licenseStatus) searchParams.append("licenseStatus", params.licenseStatus);
  if (params?.availabilityStatus) searchParams.append("availabilityStatus", params.availabilityStatus);
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const response = await makeApiCall<GetDriversResponse>({
    method: "GET",
    url,
  });

  return response;
};

// Get driver by ID
export const getDriver = async (id: string) => {
  const response = await makeApiCall<GetDriverResponse>({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });

  return response;
};

// Get driver by user ID
export const getDriverByUserId = async (userId: string) => {
  const response = await makeApiCall<GetDriverResponse>({
    method: "GET",
    url: `${BASE_URL}/user/${userId}`,
  });

  return response;
};

// Create driver profile
export const createDriver = async (data: CreateDriverDto) => {
  const response = await makeApiCall<CreateDriverResponse>({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });

  return response;
};

// Update driver profile
export const updateDriver = async (id: string, data: UpdateDriverDto) => {
  const response = await makeApiCall<UpdateDriverResponse>({
    method: "PUT",
    url: `${BASE_URL}/${id}`,
    data,
  });

  return response;
};

// Delete driver
export const deleteDriver = async (id: string) => {
  const response = await makeApiCall({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });

  return response;
};

// Assign vehicle to driver
export const assignVehicleToDriver = async (driverId: string, vehicleId: string) => {
  const response = await makeApiCall<GetDriverResponse>({
    method: "POST",
    url: `${BASE_URL}/${driverId}/assign-vehicle/${vehicleId}`,
  });

  return response;
};

// Unassign vehicle from driver
export const unassignVehicleFromDriver = async (vehicleId: string) => {
  const response = await makeApiCall({
    method: "POST",
    url: `${BASE_URL}/${vehicleId}/unassign-vehicle`,
  });

  return response;
};

// Add driving record
export const addDrivingRecord = async (driverId: string, data: CreateDrivingRecordDto) => {
  const response = await makeApiCall({
    method: "POST",
    url: `${BASE_URL}/${driverId}/driving-records`,
    data,
  });

  return response;
};

// Get driving history
export const getDrivingRecords = async (driverId: string, page = 1, pageSize = 10) => {
  const response = await makeApiCall<GetDrivingRecordsResponse>({
    method: "GET",
    url: `${BASE_URL}/${driverId}/driving-records?page=${page}&pageSize=${pageSize}`,
  });

  return response;
};

// Add driver rating
export const addDriverRating = async (driverId: string, data: CreateDriverRatingDto) => {
  const response = await makeApiCall({
    method: "POST",
    url: `${BASE_URL}/${driverId}/ratings`,
    data,
  });

  return response;
};

// Get driver ratings
export const getDriverRatings = async (driverId: string, page = 1, pageSize = 10) => {
  const response = await makeApiCall<GetDriverRatingsResponse>({
    method: "GET",
    url: `${BASE_URL}/${driverId}/ratings?page=${page}&pageSize=${pageSize}`,
  });

  return response;
};
