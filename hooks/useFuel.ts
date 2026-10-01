import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFuelLog, getFuelByVehicle } from "@/api/fuel/fuelApi";

export function useFuelByVehicle(vehicleId?: string) {
  return useQuery({
    queryKey: ["fuel", vehicleId],
    queryFn: () => getFuelByVehicle(vehicleId!),
    enabled: Boolean(vehicleId),
  });
}

export function useCreateFuelLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFuelLog,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fuel", variables.vehicleId] });
    },
  });
}
