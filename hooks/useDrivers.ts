import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDrivers,
  getDriver,
  getDriverByUserId,
  createDriver,
  updateDriver,
  deleteDriver,
  assignVehicleToDriver,
  unassignVehicleFromDriver,
  addDrivingRecord,
  getDrivingRecords,
} from "@/api/drivers/driverApi";
import {
  GetDriversParams,
  CreateDriverDto,
  UpdateDriverDto,
  CreateDrivingRecordDto,
} from "@/types/driver.types";

// Get all drivers
export const useGetDrivers = (params?: GetDriversParams) => {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => getDrivers(params),
    placeholderData: (previousData) => previousData,
  });
};

// Get single driver
export const useGetDriver = (id: string) => {
  return useQuery({
    queryKey: ["driver", id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });
};

// Get driver by user ID
export const useGetDriverByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["driver", "user", userId],
    queryFn: () => getDriverByUserId(userId),
    enabled: !!userId,
  });
};

// Create driver
export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDriverDto) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

// Update driver
export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDriverDto }) =>
      updateDriver(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver", id] });
    },
  });
};

// Delete driver
export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

// Assign vehicle to driver
export const useAssignVehicleToDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ driverId, vehicleId }: { driverId: string; vehicleId: string }) =>
      assignVehicleToDriver(driverId, vehicleId),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

// Unassign vehicle from driver
export const useUnassignVehicleFromDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => unassignVehicleFromDriver(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

// Add driving record
export const useAddDrivingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ driverId, data }: { driverId: string; data: CreateDrivingRecordDto }) =>
      addDrivingRecord(driverId, data),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({ queryKey: ["driving-records", driverId] });
    },
  });
};

// Get driving records
export const useGetDrivingRecords = (driverId: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["driving-records", driverId, page, pageSize],
    queryFn: () => getDrivingRecords(driverId, page, pageSize),
    enabled: !!driverId,
  });
};


