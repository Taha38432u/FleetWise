import { ApiMeta } from "@/types/api.types";

export interface AnalyticsSummaryResponse {
  ok: boolean;
  data: {
    role: string;
    summary: {
      totalVehicles: number;
      activeVehicles: number;
      idleVehicles: number;
      maintenanceVehicles: number;
      totalDrivers: number;
      driversOnline: number;
      driversOffline: number;
      availableDrivers: number;
      routesToday: number;
      subscriptionStatus: string;
      monthlyCost: string;
    };
    alerts: {
      critical: number;
      warning: number;
      info: number;
    };
    aiPredictions: {
      next7Days: number;
      next30Days: number;
    };
    upcomingMaintenance: any[];
    upcomingPredictions: any[];
    context: any;
  };
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  status: string;
  scheduledAt: string;
  completedAt?: string | null;
  cost?: number | null;
  mechanicId?: string | null;
  notes?: string | null;
  vehicle?: {
    id: string;
    plate: string;
    model: string;
    status: string;
  };
  mechanic?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface PredictiveAlert {
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
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  meta: ApiMeta;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

export interface FleetRoute {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  scheduledAt: string;
  status: string;
  driverId?: string | null;
  vehicleId?: string | null;
  estimatedDistance?: number | null;
  actualDistance?: number | null;
  notes?: string | null;
  driver?: any;
  vehicle?: any;
}

export interface TrackingPoint {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: string;
}

export interface BillingPlan {
  key: string;
  name: string;
  priceMonthly: number;
  limits: string[];
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: string;
  status: string;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
}
