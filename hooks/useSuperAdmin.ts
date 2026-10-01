import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deactivateOwnerOrganization,
  getOwnerOverview,
  getOwnerSubscriptions,
  getOwnerUsers,
  resetOwnerOrganization,
} from "@/api/super-admin/superAdminApi";

export function useOwnerOverview(enabled = true) {
  return useQuery({
    queryKey: ["owner", "overview"],
    queryFn: getOwnerOverview,
    enabled,
  });
}

export function useOwnerUsers(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["owner", "users", params],
    queryFn: () => getOwnerUsers(params),
  });
}

export function useOwnerSubscriptions(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["owner", "subscriptions", params],
    queryFn: () => getOwnerSubscriptions(params),
  });
}

export function useDeactivateOwnerOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateOwnerOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
  });
}

export function useResetOwnerOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetOwnerOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
  });
}
