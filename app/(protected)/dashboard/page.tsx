"use client";

import { useState } from "react";
import { Grid } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Import new components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { VehicleHealthWidget } from "@/components/dashboard/VehicleHealthWidget";
import { RouteDelayHeatmap } from "@/components/dashboard/RouteDelayHeatmap";
import { MaintenanceTrend } from "@/components/dashboard/MaintenanceTrend";
import { FuelConsumption } from "@/components/dashboard/FuelConsumption";
import { AIRiskDistribution } from "@/components/dashboard/AIRiskDistribution";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

// Mock data
const dashboardData = {
  summary: {
    totalVehicles: 42,
    activeVehicles: 36,
    idleVehicles: 4,
    maintenanceVehicles: 2,
    driversOnline: 38,
    driversOffline: 4,
    routesToday: 24,
    subscriptionStatus: "Active Pro",
    monthlyCost: "$12,450",
  },
  alerts: {
    critical: 3,
    warning: 7,
    info: 12,
  },
  aiPredictions: {
    next7Days: 2,
    next30Days: 8,
  },
  vehicleHealth: 87,
  fuelConsumption: {
    current: 8.2,
    lastMonth: 7.8,
    trend: "up",
  },
};

// Chart data
const routeDelayHeatmapData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Delay Minutes",
      data: [15, 22, 18, 35, 28, 12, 8],
      backgroundColor: [
        "rgba(59, 130, 246, 0.1)",
        "rgba(59, 130, 246, 0.2)",
        "rgba(59, 130, 246, 0.3)",
        "rgba(59, 130, 246, 0.7)",
        "rgba(59, 130, 246, 0.5)",
        "rgba(59, 130, 246, 0.2)",
        "rgba(59, 130, 246, 0.1)",
      ],
      borderColor: "#3b82f6",
      borderWidth: 1,
    },
  ],
};

const maintenanceTrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Maintenance Events",
      data: [12, 19, 15, 25, 22, 30],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const fuelConsumptionData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Fuel Efficiency (km/L)",
      data: [7.2, 7.5, 7.8, 8.0, 8.1, 8.2],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const aiRiskDistributionData = {
  labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"],
  datasets: [
    {
      data: [2, 5, 12, 23],
      backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"],
      borderWidth: 1,
      borderColor: "#ffffff",
    },
  ],
};

export default function OperationalIntelligenceDashboard() {
  const [timeRange, setTimeRange] = useState("today");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <QuickActions />

      <main className="p-6">
        <StatsGrid dashboardData={dashboardData} />

        {/* Widgets Row 1 */}
        <Grid gutter="lg" mb="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <VehicleHealthWidget dashboardData={dashboardData} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <RouteDelayHeatmap
              routeDelayHeatmapData={routeDelayHeatmapData}
              chartOptions={chartOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <MaintenanceTrend
              maintenanceTrendData={maintenanceTrendData}
              chartOptions={chartOptions}
            />
          </Grid.Col>
        </Grid>

        {/* Widgets Row 2 */}
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FuelConsumption
              dashboardData={dashboardData}
              fuelConsumptionData={fuelConsumptionData}
              chartOptions={chartOptions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <AIRiskDistribution
              dashboardData={dashboardData}
              aiRiskDistributionData={aiRiskDistributionData}
              chartOptions={chartOptions}
            />
          </Grid.Col>
        </Grid>
      </main>
    </div>
  );
}
