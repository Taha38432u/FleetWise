import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaff,
  deleteStaff,
  getStaff,
  StaffInput,
  updateStaff,
} from "@/api/staff/staffApi";

export function useStaff(params?: {
  page?: number;
  pageSize?: number;
  role?: string;
  search?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => getStaff(params),
    enabled: params?.enabled ?? true,
    placeholderData: (previous) => previous,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StaffInput) => createStaff(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffInput> }) =>
      updateStaff(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}
