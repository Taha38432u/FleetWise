import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  GetVehiclesResponse,
} from "@/api/vehicles/vehicleApi";
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from "@/data/vehicles";

export function useGetVehicles(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  search?: string;
  enabled?: boolean;
}) {
  return useQuery<GetVehiclesResponse, Error>({
    queryKey: ["vehicles", params],
    queryFn: () => getVehicles(params),
    enabled: params?.enabled ?? true,
    placeholderData: (prevData: GetVehiclesResponse | undefined) => prevData,
  });
}

export function useGetVehicle(id: string) {
  return useQuery<Vehicle, Error>({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleDto) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) =>
      updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
