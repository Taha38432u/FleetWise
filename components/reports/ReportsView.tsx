"use client";

import { useMemo, useState } from "react";
import { Button, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL, makeApiCall } from "@/api/api";
import { EmptyState, PageHeader, Surface } from "@/components/shared";

type ReportResponse<T = any> = {
  ok: boolean;
  data: T;
};

async function fetchReport<T = any>(path: string, from?: string, to?: string) {
  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);
  return makeApiCall<ReportResponse<T>>({
    method: "GET",
    url: `${path}${query.toString() ? `?${query.toString()}` : ""}`,
  });
}

async function downloadReport(path: string, from?: string, to?: string) {
  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);
  query.append("format", "csv");

  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/${path}?${query.toString()}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${path.replace(/\//g, "-")}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [exportingPath, setExportingPath] = useState<string | null>(null);

  const fleetSummary = useQuery({
    queryKey: ["reports", "fleet-summary", from, to],
    queryFn: () => fetchReport<Record<string, any>>("reports/fleet-summary", from, to),
  });
  const driverPerformance = useQuery({
    queryKey: ["reports", "driver-performance", from, to],
    queryFn: () => fetchReport<any[]>("reports/driver-performance", from, to),
  });
  const maintenanceHistory = useQuery({
    queryKey: ["reports", "maintenance-history", from, to],
    queryFn: () => fetchReport<any[]>("reports/maintenance-history", from, to),
  });
  const routeEfficiency = useQuery({
    queryKey: ["reports", "route-efficiency", from, to],
    queryFn: () => fetchReport<any[]>("reports/route-efficiency", from, to),
  });
  const budgetVsActual = useQuery({
    queryKey: ["reports", "budget-vs-actual", from, to],
    queryFn: () => fetchReport<any[]>("reports/budget-vs-actual", from, to),
  });
  const operationsDashboard = useQuery({
    queryKey: ["reports", "operations-dashboard", from, to],
    queryFn: () => fetchReport<Record<string, any>>("reports/operations-dashboard", from, to),
  });

  const loading =
    fleetSummary.isLoading ||
    driverPerformance.isLoading ||
    maintenanceHistory.isLoading ||
    routeEfficiency.isLoading ||
    budgetVsActual.isLoading ||
    operationsDashboard.isLoading;

  const summary = fleetSummary.data?.data;
  const performance = driverPerformance.data?.data || [];
  const maintenance = maintenanceHistory.data?.data || [];
  const routes = routeEfficiency.data?.data || [];
  const budgets = budgetVsActual.data?.data || [];
  const operations = operationsDashboard.data?.data;
  const term = search.trim().toLowerCase();
  const filterRows = (rows: any[]) =>
    term
      ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term))
      : rows;

  const reportCards = useMemo(
    () => [
      { label: "Vehicles", value: summary?.totalVehicles || 0 },
      { label: "Active", value: summary?.activeVehicles || 0 },
      { label: "Maintenance", value: summary?.maintenanceVehicles || 0 },
      { label: "Fleet cost", value: `$${Number(operations?.summary?.totalCost || 0).toFixed(0)}` },
      { label: "Driver salaries", value: `$${Number(operations?.summary?.driverSalaryCost || 0).toFixed(0)}` },
      { label: "Mechanic labor", value: `$${Number(operations?.summary?.mechanicLaborCost || 0).toFixed(0)}` },
      { label: "Completed routes", value: operations?.summary?.completedRoutes || 0 },
      { label: "Abandoned routes", value: operations?.summary?.abandonedRoutes || 0 },
      { label: "Active trials", value: operations?.summary?.trialing || 0 },
    ],
    [operations?.summary, summary],
  );

  const exportCsv = async (path: string) => {
    if (exportingPath) return;
    setExportingPath(path);
    try {
      await downloadReport(path, from, to);
    } finally {
      setExportingPath(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Reporting"
        title="Fleet Reports"
        description="Run exportable views across fleet operations, maintenance, route performance, and spend."
        actions={
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <input type="date" className="h-11 rounded-xl border border-line px-3 text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-green-100" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className="h-11 rounded-xl border border-line px-3 text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-green-100" value={to} onChange={(e) => setTo(e.target.value)} />
            <input placeholder="Search reports" className="h-11 rounded-xl border border-line px-3 text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-green-100" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button
              variant="default"
              disabled={Boolean(exportingPath)}
              onClick={() => { setFrom(""); setTo(""); setSearch(""); }}
            >
              Clear
            </Button>
          </div>
        }
      />

      <Surface>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {reportCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{card.label}</p>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      </Surface>

      <section className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <h2 className="text-lg font-extrabold text-ink">Fleet cost report</h2>
          <ReportTable
            emptyTitle="No fleet cost rows"
            columns={["description", "type", "amount", "occurredAt"]}
            rows={filterRows(operations?.costs?.transactions || [])}
            format={{
              amount: (value) => `$${Number(value || 0).toFixed(2)}`,
              occurredAt: (value) => value ? new Date(String(value)).toLocaleDateString() : "-",
            }}
          />
        </Surface>

        <Surface>
          <h2 className="text-lg font-extrabold text-ink">Mechanic labor report</h2>
          <ReportTable
            emptyTitle="No mechanic labor rows"
            columns={["mechanicName", "vehiclePlate", "type", "status", "amount"]}
            rows={filterRows(operations?.mechanicLabor || [])}
            format={{
              amount: (value) => `$${Number(value || 0).toFixed(2)}`,
            }}
          />
        </Surface>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <h2 className="text-lg font-extrabold text-ink">Vehicle utilization</h2>
          <ReportTable
            emptyTitle="No vehicle utilization rows"
            columns={["plate", "status", "routeCount", "maintenanceCount"]}
            rows={filterRows(operations?.vehicleUtilization || [])}
          />
        </Surface>

        <Surface>
          <h2 className="text-lg font-extrabold text-ink">Driver activity and salaries</h2>
          <ReportTable
            emptyTitle="No driver activity rows"
            columns={["driverId", "total", "salary", "routeExpenses"]}
            rows={filterRows(operations?.driverSalaries || [])}
            format={{
              total: (value) => `$${Number(value || 0).toFixed(2)}`,
              salary: (value) => `$${Number(value || 0).toFixed(2)}`,
              routeExpenses: (value) => `$${Number(value || 0).toFixed(2)}`,
            }}
          />
        </Surface>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Driver performance</h2>
            <Button
              size="xs"
              variant="default"
              loading={exportingPath === "reports/driver-performance"}
              disabled={Boolean(exportingPath)}
              onClick={() => exportCsv("reports/driver-performance")}
            >
              Export CSV
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {performance.length ? performance.map((row: any) => (
              <div key={row.driverId} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                <p className="text-sm font-bold text-ink">{row.driverName}</p>
                <p className="text-xs text-muted">
                  {row.trips} trips · {row.distance} km · {Number(row.fuelUsed || 0).toFixed(2)} L
                </p>
              </div>
            )) : <EmptyState title="No driver data" description="Driver performance rows appear after completed routes." />}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Budget vs actual</h2>
            <Button
              size="xs"
              variant="default"
              loading={exportingPath === "reports/budget-vs-actual"}
              disabled={Boolean(exportingPath)}
              onClick={() => exportCsv("reports/budget-vs-actual")}
            >
              Export CSV
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {budgets.length ? budgets.map((budget: any) => (
              <div key={budget.id} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                <p className="text-sm font-bold text-ink">{budget.name}</p>
                <p className="text-xs text-muted">
                  Budget ${Number(budget.amount || 0).toFixed(2)} · Actual ${Number(budget.actual || 0).toFixed(2)} · Remaining ${Number(budget.remaining || 0).toFixed(2)}
                </p>
              </div>
            )) : <EmptyState title="No budget rows" description="Budget vs actual rows appear after budgets and transactions exist." />}
          </div>
        </Surface>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Maintenance history</h2>
            <Button
              size="xs"
              variant="default"
              loading={exportingPath === "reports/maintenance-history"}
              disabled={Boolean(exportingPath)}
              onClick={() => exportCsv("reports/maintenance-history")}
            >
              Export CSV
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {maintenance.length ? maintenance.map((item: any) => (
              <div key={item.id} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                <p className="text-sm font-bold text-ink">
                  {item.vehicle?.plate} · {item.type}
                </p>
                <p className="text-xs text-muted">
                  {item.status} · ${Number(item.cost || 0).toFixed(2)}
                </p>
              </div>
            )) : <EmptyState title="No maintenance history" description="Completed and scheduled maintenance records show here." />}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Route efficiency</h2>
            <Button
              size="xs"
              variant="default"
              loading={exportingPath === "reports/route-efficiency"}
              disabled={Boolean(exportingPath)}
              onClick={() => exportCsv("reports/route-efficiency")}
            >
              Export CSV
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {routes.length ? routes.map((route: any) => (
              <div key={route.id} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                <p className="text-sm font-bold text-ink">{route.name}</p>
                <p className="text-xs text-muted">
                  {route.startLocation} to {route.endLocation} · planned {route.estimatedDistance || 0} km · actual {route.actualDistance || 0} km
                </p>
              </div>
            )) : <EmptyState title="No route efficiency data" description="Route efficiency appears after route completion and GPS history." />}
          </div>
        </Surface>
      </section>
    </div>
  );
}

function ReportTable({
  rows,
  columns,
  emptyTitle,
  format = {},
}: {
  rows: any[];
  columns: string[];
  emptyTitle: string;
  format?: Record<string, (value: unknown, row: any) => string>;
}) {
  if (!rows.length) {
    return (
      <div className="mt-4">
        <EmptyState title={emptyTitle} description="Rows appear after matching operational records exist." />
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-green-50/70">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  {column.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rows.map((row, index) => (
              <tr key={row.id || `${columns[0]}-${index}`}>
                {columns.map((column) => (
                  <td key={column} className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                    {format[column]
                      ? format[column](row[column], row)
                      : String(row[column] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
