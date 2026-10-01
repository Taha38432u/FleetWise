"use client";

import type { ReactNode } from "react";
import { Button, Loader } from "@mantine/core";
import { toast } from "react-toastify";
import { useAuthState } from "@/components/auth/AuthProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCheckIn, useCheckOut, useMyAttendance } from "@/hooks/useAttendance";
import { useMyRoutes } from "@/hooks/useRoutes";
import { useOwnerOverview } from "@/hooks/useSuperAdmin";
import { EmptyState, PageHeader, Surface } from "@/components/shared";
import { AdminDashboardCharts, SuperAdminCommandCharts } from "./DashboardCharts";
import { formatLabel } from "@/utils/formatLabel";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

function StatCard({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: string | number;
  tone?: "green";
}) {
  const toneMap = {
    green: "border-green-100 bg-green-50 text-primary",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneMap[tone]}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
    </div>
  );
}

function MiniList({
  title,
  empty,
  items,
  render,
}: {
  title: string;
  empty: string;
  items: any[];
  render: (item: any) => ReactNode;
}) {
  return (
    <Surface>
      <h2 className="text-lg font-extrabold tracking-tight text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
              {render(item)}
            </div>
          ))
        ) : (
          <EmptyState title="No items" description={empty} />
        )}
      </div>
    </Surface>
  );
}

function AdminDashboard({ analytics, user }: { analytics: any; user: any }) {
  const summary = analytics?.summary || {};
  const alerts = analytics?.alerts || {};
  const maintenance = analytics?.upcomingMaintenance || [];

  return (
    <>
      <PageHeader
        eyebrow="Admin Command Center"
        title={`Welcome back, ${user?.firstName || "Admin"}.`}
        description="Fleet capacity, open maintenance, spend, and subscription state in one place."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vehicles" value={summary.totalVehicles || 0} tone="green" />
        <StatCard label="Drivers" value={summary.totalDrivers || 0} tone="green" />
        <StatCard label="Routes Today" value={summary.routesToday || 0} tone="green" />
        <StatCard label="Monthly Cost" value={summary.monthlyCost || "$0.00"} tone="green" />
      </section>
      <AdminDashboardCharts analytics={analytics} />
      <section className="grid gap-6 xl:grid-cols-2">
        <MiniList
          title="Maintenance Pressure"
          empty="No open maintenance items."
          items={maintenance}
          render={(item) => (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {item.vehicle?.plate} - {item.type}
              </p>
              <p className="text-xs text-slate-500">
                {formatLabel(item.status)} - {new Date(item.scheduledAt).toLocaleString()}
              </p>
            </>
          )}
        />
        <MiniList
          title="Open Alerts"
          empty="No critical operational blockers beyond maintenance list."
          items={maintenance.slice(0, 5)}
          render={(item) => (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {item.vehicle?.plate} needs {item.type}
              </p>
              <p className="text-xs text-slate-500">{formatLabel(item.status)}</p>
            </>
          )}
        />
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Critical Alerts" value={alerts.critical || 0} tone="green" />
        <StatCard label="Warnings" value={alerts.warning || 0} tone="green" />
        <StatCard label="Unread Info" value={alerts.info || 0} tone="green" />
      </section>
    </>
  );
}

function SuperAdminDashboard({ overview, user }: { overview: any; user: any }) {
  const payment = overview?.paymentStatus || {};
  return (
    <>
      <PageHeader
        eyebrow="SaaS Owner Command"
        title={`Owner command center, ${user?.firstName || "owner"}.`}
        description="Track paying admin accounts, subscription health, trial risk, and plan mix."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Admin Accounts" value={overview?.totalUsers || 0} tone="green" />
        <StatCard label="Active Plans" value={payment.activeSubscriptions || 0} tone="green" />
        <StatCard label="Pending Payments" value={payment.pendingPayments || 0} tone="green" />
        <StatCard label="Active Trials" value={payment.activeTrials || 0} tone="green" />
      </section>
      <SuperAdminCommandCharts overview={overview} />
    </>
  );
}

function DispatcherDashboard({ analytics, user }: { analytics: any; user: any }) {
  const summary = analytics?.summary || {};
  const maintenance = analytics?.upcomingMaintenance || [];

  return (
    <>
      <PageHeader
        eyebrow="Dispatcher Workspace"
        title={`Dispatch board for ${user?.firstName || "dispatcher"}.`}
        description="Focus on route readiness, available drivers, vehicle availability, and tracking handoff."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available Drivers" value={summary.availableDrivers || 0} tone="green" />
        <StatCard label="Active Vehicles" value={summary.activeVehicles || 0} tone="green" />
        <StatCard label="Routes Today" value={summary.routesToday || 0} tone="green" />
        <StatCard label="Idle Vehicles" value={summary.idleVehicles || 0} tone="green" />
      </section>
      <MiniList
        title="Dispatch Blockers"
        empty="No maintenance blockers are currently affecting dispatch."
        items={maintenance}
        render={(item) => (
          <>
            <p className="text-sm font-semibold text-slate-900">
              {item.vehicle?.plate} - {item.type}
            </p>
            <p className="text-xs text-slate-500">
              {item.description} - {formatLabel(item.status)}
            </p>
          </>
        )}
      />
    </>
  );
}

function DriverDashboard({
  user,
  myRoutes,
  myAttendance,
  checkInMutation,
  checkOutMutation,
  isDemo,
  blockWrite,
}: {
  user: any;
  myRoutes: any;
  myAttendance: any;
  checkInMutation: any;
  checkOutMutation: any;
  isDemo: boolean;
  blockWrite: (action?: string) => boolean;
}) {
  const routes = myRoutes.data?.data || [];
  const attendance = myAttendance.data?.data || [];
  const todayKey = new Date().toDateString();
  const todayAttendance = attendance.find(
    (entry: any) => new Date(entry.date).toDateString() === todayKey,
  );
  const checkedInToday = Boolean(todayAttendance?.checkInTime);
  const canCheckOutToday = Boolean(
    todayAttendance?.checkInTime && !todayAttendance?.checkOutTime,
  );
  const activeRoute =
    routes.find((route: any) => route.status === "IN_PROGRESS") ||
    routes.find((route: any) => route.status === "SCHEDULED");

  return (
    <>
      <PageHeader
        eyebrow="Driver Workspace"
        title={`Your work queue, ${user?.firstName || "driver"}.`}
        description="View assigned routes and attendance. Writes are locked on demo accounts."
        actions={
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (blockWrite("Check-in")) return;
              checkInMutation.mutate(undefined, {
                onSuccess: () => toast.success("Checked in successfully"),
                onError: (error: any) => toast.error(error?.message || "Check-in failed"),
              });
            }}
            loading={checkInMutation.isPending}
            disabled={isDemo || checkedInToday}
          >
            {checkedInToday ? "Checked In" : "Check In"}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (blockWrite("Check-out")) return;
              checkOutMutation.mutate(undefined, {
                onSuccess: () => toast.success("Checked out successfully"),
                onError: (error: any) => toast.error(error?.message || "Check-out failed"),
              });
            }}
            loading={checkOutMutation.isPending}
            disabled={isDemo || !canCheckOutToday}
          >
            Check Out
          </Button>
        </div>
        }
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned Routes" value={routes.length} tone="green" />
        <StatCard
          label="Active Route"
          value={activeRoute ? formatLabel(activeRoute.status) : "None"}
          tone="green"
        />
        <StatCard label="Attendance Records" value={attendance.length} tone="green" />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <MiniList
          title="My Routes"
          empty="No routes assigned yet."
          items={routes}
          render={(route) => (
            <>
              <p className="text-sm font-semibold text-slate-900">{route.name}</p>
              <p className="text-xs text-slate-500">
                {route.startLocation} to {route.endLocation}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary">
                {formatLabel(route.status)}
              </p>
            </>
          )}
        />
        <MiniList
          title="My Attendance"
          empty="Attendance history will appear here."
          items={attendance}
          render={(entry) => (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(entry.date).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-500">
                In: {entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString() : "-"} - Out:{" "}
                {entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleTimeString() : "-"}
              </p>
            </>
          )}
        />
      </section>
    </>
  );
}

function MechanicDashboard({ analytics, user }: { analytics: any; user: any }) {
  const queue = analytics?.context?.myQueue || [];
  const backlogCount = queue.filter((item: any) => item.status === "PENDING").length;
  const activeCount = queue.filter((item: any) => item.status === "IN_PROGRESS").length;
  const completed = queue.filter((item: any) => item.status === "COMPLETED");

  return (
    <>
      <PageHeader
        eyebrow="Mechanic Workspace"
        title={`Service queue for ${user?.firstName || "mechanic"}.`}
        description="Pending jobs, active repairs, and recently completed work."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Backlog" value={backlogCount} tone="green" />
        <StatCard label="Active Jobs" value={activeCount} tone="green" />
        <StatCard label="Completed (shown)" value={completed.length} tone="green" />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <MiniList
          title="My Maintenance Queue"
          empty="The maintenance queue is currently clear."
          items={queue}
          render={(item) => (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {item.vehicle?.plate} - {item.type}
              </p>
              <p className="text-xs text-slate-500">
                {item.description} - {formatLabel(item.status)}
              </p>
            </>
          )}
        />
        <MiniList
          title="Recently Completed"
          empty="No completed jobs in this view yet."
          items={completed}
          render={(item) => (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {item.vehicle?.plate} - {item.type}
              </p>
              <p className="text-xs text-slate-500">
                Cost ${Number(item.cost || 0).toFixed(2)}
              </p>
            </>
          )}
        />
      </section>
    </>
  );
}

export default function DashboardView() {
  const { user } = useAuthState();
  const { isDemo, blockWrite } = useDemoReadOnly();
  const { data, isLoading } = useAnalytics();
  const isDriver = user?.role === "DRIVER";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const myRoutes = useMyRoutes({ pageSize: 5 }, isDriver);
  const myAttendance = useMyAttendance({ pageSize: 5 }, isDriver);
  const ownerOverview = useOwnerOverview(isSuperAdmin);
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  if (
    isLoading ||
    (isDriver && (myRoutes.isLoading || myAttendance.isLoading)) ||
    (isSuperAdmin && ownerOverview.isLoading)
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const analytics = data?.data;
  const role = user?.role || analytics?.role || "ADMIN";

  return (
    <div className="ui-page">
      {role === "ADMIN" && <AdminDashboard analytics={analytics} user={user} />}
      {role === "SUPER_ADMIN" && (
        <SuperAdminDashboard overview={ownerOverview.data?.data} user={user} />
      )}
      {role === "DISPATCHER" && <DispatcherDashboard analytics={analytics} user={user} />}
      {role === "DRIVER" && (
        <DriverDashboard
          user={user}
          myRoutes={myRoutes}
          myAttendance={myAttendance}
          checkInMutation={checkInMutation}
          checkOutMutation={checkOutMutation}
          isDemo={isDemo}
          blockWrite={blockWrite}
        />
      )}
      {role === "MECHANIC" && <MechanicDashboard analytics={analytics} user={user} />}
    </div>
  );
}
