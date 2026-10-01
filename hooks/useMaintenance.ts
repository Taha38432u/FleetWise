import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  createMaintenance,
  deleteMaintenance,
  getAiHealth,
  getAiModelInfo,
  getMaintenance,
  getMaintenancePredictions,
  PredictiveAlert,
  predictMaintenance,
  updateMaintenance,
} from "@/api/maintenance/maintenanceApi";
import { MaintenanceRecord, PaginatedResponse } from "@/types/fleet.types";

export function useMaintenance(
  params?: Record<string, string | number | undefined>,
): UseQueryResult<PaginatedResponse<MaintenanceRecord>, Error> {
  return useQuery({
    queryKey: ["maintenance", params],
    queryFn: () => getMaintenance(params),
  }) as UseQueryResult<PaginatedResponse<MaintenanceRecord>, Error>;
}

export function useMaintenancePredictions(
  params?: Record<string, string | number | boolean | undefined>,
): UseQueryResult<
  { ok: boolean; data: PredictiveAlert[] },
  Error
> {
  return useQuery({
    queryKey: ["maintenance", "predictions", params],
    queryFn: () => getMaintenancePredictions(params),
  }) as UseQueryResult<{ ok: boolean; data: PredictiveAlert[] }, Error>;
}

export function useAiHealth(enabled = true) {
  return useQuery({
    queryKey: ["maintenance", "ai-health"],
    queryFn: getAiHealth,
    enabled,
    retry: 1,
  });
}

export function useAiModelInfo(enabled = true) {
  return useQuery({
    queryKey: ["maintenance", "ai-model-info"],
    queryFn: getAiModelInfo,
    enabled,
    retry: 1,
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMaintenance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
}

export function usePredictMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: predictMaintenance,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "predictions"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      if (response?.data?.vehicleId) {
        queryClient.invalidateQueries({ queryKey: ["vehicles", response.data.vehicleId] });
      }
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
