import { makeApiCall } from "@/api/api";
import { MaintenanceRecord, PaginatedResponse } from "@/types/fleet.types";

export type PredictiveAlert = {
  id: string;
  vehicleId: string;
  predictedIssue: string;
  riskScore: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  maintenancePriority: "monitor" | "scheduled" | "urgent" | "stop_vehicle";
  suggestedAction?: string | null;
  modelVersion?: string | null;
  dataQuality?: string | null;
  message?: string | null;
  isActioned: boolean;
  createdAt: string;
  vehicle?: any;
};

export type AiHealth = {
  ok: boolean;
  model_available: boolean;
  service?: string;
};

export async function getMaintenance(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return makeApiCall<PaginatedResponse<MaintenanceRecord>>({
    method: "GET",
    url: `maintenance${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function getMaintenanceByVehicle(vehicleId: string) {
  return makeApiCall<{ ok: boolean; data: MaintenanceRecord[] }>({
    method: "GET",
    url: `maintenance/vehicle/${vehicleId}`,
  });
}

export async function createMaintenance(data: any) {
  return makeApiCall<{ ok: boolean; data: MaintenanceRecord }>({
    method: "POST",
    url: "maintenance",
    data,
  });
}

export async function updateMaintenance(id: string, data: any) {
  return makeApiCall<{ ok: boolean; data: MaintenanceRecord }>({
    method: "PATCH",
    url: `maintenance/${id}`,
    data,
  });
}

export async function deleteMaintenance(id: string) {
  return makeApiCall<{ ok: boolean; data: PredictiveAlert }>({
    method: "DELETE",
    url: `maintenance/${id}`,
  });
}

export async function predictMaintenance(vehicleId: string) {
  return makeApiCall<{ ok: boolean; data: PredictiveAlert }>({
    method: "POST",
    url: `maintenance/predict/${vehicleId}`,
  });
}

export async function getMaintenancePredictions(params?: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return makeApiCall<{ ok: boolean; data: PredictiveAlert[] }>({
    method: "GET",
    url: `maintenance/predictions${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

export async function getAiHealth() {
  return makeApiCall<{ ok: boolean; data: AiHealth }>({
    method: "GET",
    url: "maintenance/ai/health",
  });
}

export async function getAiModelInfo() {
  return makeApiCall<{ ok: boolean; data: Record<string, any> }>({
    method: "GET",
    url: "maintenance/ai/model-info",
  });
}
