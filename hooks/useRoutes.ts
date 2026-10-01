import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute, deleteRoute, getMyRoutes, getRouteLocation, getRoutes, requestRouteLocation, updateMyRouteStatus, updateRoute } from "@/api/routes/routesApi";

export function useRoutes(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["routes", params],
    queryFn: () => getRoutes(params),
  });
}

export function useMyRoutes(
  params?: { page?: number; pageSize?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: ["routes", "me", params],
    queryFn: () => getMyRoutes(params),
    enabled,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useUpdateMyRouteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMyRouteStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["routes", "me"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useRequestRouteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestRouteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useGetRouteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getRouteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
    },
  });
}
