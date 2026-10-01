import { makeApiCall } from "@/api/api";
import { AnalyticsSummaryResponse } from "@/types/fleet.types";

export async function getAnalyticsSummary() {
  return makeApiCall<AnalyticsSummaryResponse>({
    method: "GET",
    url: "analytics/summary",
  });
}
