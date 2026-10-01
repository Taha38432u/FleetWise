import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "@/api/analytics/analyticsApi";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
    refetchInterval: 30000,
  });
}
