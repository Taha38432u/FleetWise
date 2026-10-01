import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIn, checkOut, getAttendance, getMyAttendance } from "@/api/attendance/attendanceApi";

export function useAttendance(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["attendance", params],
    queryFn: () => getAttendance(params),
  });
}

export function useMyAttendance(
  params?: { page?: number; pageSize?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: ["attendance", "me", params],
    queryFn: () => getMyAttendance(params),
    enabled,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
