"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Loader } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { useMyRoutes, useUpdateMyRouteStatus } from "@/hooks/useRoutes";
import { useSaveVehicleLocation } from "@/hooks/useTracking";
import { PageHeader } from "@/components/shared";
import {
  demoSpeedForRatio,
  getRouteSimulationPoints,
  interpolateRoutePoint,
  routeHeading,
} from "@/components/tracking/simulatedMovement";
import { formatLabel } from "@/utils/formatLabel";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

const PAGE_SIZE = 10;

export default function MyRoutesPage() {
  const { isDemo, blockWrite } = useDemoReadOnly();
  const [page, setPage] = useState(1);
  const [trackingRouteId, setTrackingRouteId] = useState<string | null>(null);
  const [pendingRouteActionId, setPendingRouteActionId] = useState<string | null>(null);
  const movementTimerRef = useRef<number | null>(null);
  const routesQuery = useMyRoutes({ page, pageSize: PAGE_SIZE });
  const updateStatus = useUpdateMyRouteStatus();
  const saveLocation = useSaveVehicleLocation();

  const routes = routesQuery.data?.data || [];
  const meta = routesQuery.data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage: page,
    pageSize: PAGE_SIZE,
  };

  const stopTracking = useCallback(() => {
    if (movementTimerRef.current !== null) {
      window.clearInterval(movementTimerRef.current);
      movementTimerRef.current = null;
    }
    setTrackingRouteId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (movementTimerRef.current !== null) {
        window.clearInterval(movementTimerRef.current);
        movementTimerRef.current = null;
      }
    };
  }, []);

  const startGpsTracking = (route: any) => {
    if (blockWrite("GPS streaming")) return;
    if (!route.vehicleId) {
      toast.error("This route has no vehicle assigned.");
      return;
    }

    stopTracking();
    setTrackingRouteId(route.id);

    const { start, end, isFallback } = getRouteSimulationPoints(route);
    const heading = routeHeading(start, end);
    let step = 0;
    const steps = 40;

    const sendPoint = () => {
      const ratio = Math.min(step / steps, 1);
      const point = interpolateRoutePoint(start, end, ratio);
      saveLocation.mutate({
        vehicleId: route.vehicleId,
        latitude: point.latitude,
        longitude: point.longitude,
        speed: demoSpeedForRatio(ratio),
        heading,
        timestamp: new Date().toISOString(),
      });
      step += 1;

      if (ratio >= 1) stopTracking();
    };

    sendPoint();
    movementTimerRef.current = window.setInterval(sendPoint, 1500);
    toast.success(
      isFallback
        ? "Vehicle movement started with fallback map points."
        : "Vehicle movement started for this route.",
    );
  };

  const setRouteStatus = (route: any, status: string) => {
    if (blockWrite("Updating route status")) return;
    if (pendingRouteActionId) return;
    setPendingRouteActionId(route.id);
    updateStatus.mutate(
      { id: route.id, data: { status } },
      {
        onSuccess: () => {
          toast.success(`Route ${formatLabel(status).toLowerCase()}`);
          if (status === "IN_PROGRESS") startGpsTracking(route);
          if (status === "COMPLETED" || status === "CANCELLED") stopTracking();
        },
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message || error?.message || "Route update failed",
          ),
        onSettled: () => setPendingRouteActionId(null),
      },
    );
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: "Route", accessorKey: "name" },
      { header: "Start", accessorKey: "startLocation" },
      { header: "End", accessorKey: "endLocation" },
      {
        header: "Vehicle",
        accessorKey: "vehicle",
        cell: ({ row }) => row.original.vehicle?.plate || "Unassigned",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => formatLabel(getValue()),
      },
      {
        header: "Scheduled",
        accessorKey: "scheduledAt",
        cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const route = row.original;
          const isRoutePending = pendingRouteActionId === route.id;
          const writeLocked = isDemo || Boolean(pendingRouteActionId);
          return (
            <Group gap="xs" wrap="nowrap">
              {route.status === "SCHEDULED" && (
                <Button
                  size="xs"
                  loading={isRoutePending}
                  disabled={writeLocked}
                  onClick={() => setRouteStatus(route, "IN_PROGRESS")}
                >
                  Start
                </Button>
              )}
              {route.status === "IN_PROGRESS" && (
                <>
                  <Button
                    size="xs"
                    color="green"
                    loading={isRoutePending}
                    disabled={writeLocked}
                    onClick={() => setRouteStatus(route, "COMPLETED")}
                  >
                    Complete
                  </Button>
                  <Button
                    size="xs"
                    variant={trackingRouteId === route.id ? "filled" : "default"}
                    disabled={writeLocked && trackingRouteId !== route.id}
                    onClick={() => {
                      if (trackingRouteId === route.id) {
                        stopTracking();
                        return;
                      }
                      startGpsTracking(route);
                    }}
                  >
                    {trackingRouteId === route.id ? "Stop GPS" : "Start GPS"}
                  </Button>
                </>
              )}
            </Group>
          );
        },
      },
    ],
    [isDemo, pendingRouteActionId, trackingRouteId, stopTracking],
  );

  if (routesQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Driver"
        title="My Routes"
        description="View assigned routes. Start, stream GPS, and complete when your account allows writes."
        actions={
          isDemo ? (
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-muted">
              Read-only demo
            </span>
          ) : null
        }
      />

      <CustomTable
        title="Assigned Routes"
        description="Driver route work queue connected to dispatch, tracking, and notifications."
        columns={columns}
        data={routes}
        totalItems={meta.totalItems}
        pageCount={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setPage}
        isLoading={routesQuery.isLoading}
      />
    </div>
  );
}
