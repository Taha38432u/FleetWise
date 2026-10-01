"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Loader } from "@mantine/core";
import { VehicleMap } from "@/components/map/VehicleMap";
import { useGetVehicle, useGetVehicles } from "@/hooks/useVehicles";
import { useSaveVehicleLocation, useTrackingSocket, useVehicleHistory, useVehicleLocation } from "@/hooks/useTracking";
import { EmptyState, PageHeader, Surface } from "@/components/shared";
import { parseLocationParts } from "@/components/map/locationUtils";
import {
  demoSpeedForRatio,
  getRouteSimulationPoints,
  interpolateRoutePoint,
  routeHeading,
} from "@/components/tracking/simulatedMovement";
import { toast } from "react-toastify";

export default function LiveTrackingPage() {
  const vehiclesQuery = useGetVehicles({ page: 1, pageSize: 100 });
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [isPlaybackRunning, setIsPlaybackRunning] = useState(false);
  const playbackTimerRef = useRef<number | null>(null);
  const { events } = useTrackingSocket();

  const vehicles = vehiclesQuery.data?.data?.data || [];
  const effectiveVehicleId = selectedVehicleId || vehicles[0]?.id || "";
  const latestQuery = useVehicleLocation(effectiveVehicleId || undefined);
  const historyQuery = useVehicleHistory(effectiveVehicleId || undefined);
  const vehicleDetailQuery = useGetVehicle(effectiveVehicleId || "");
  const saveLocation = useSaveVehicleLocation();
  const selectedVehicle =
    vehicleDetailQuery.data ||
    vehicles.find((vehicle: any) => vehicle.id === effectiveVehicleId) ||
    vehicles[0];
  const liveHistory = useMemo(
    () => historyQuery.data?.data || [],
    [historyQuery.data?.data],
  );

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) window.clearInterval(playbackTimerRef.current);
    };
  }, []);

  const mergedPoints = useMemo(() => {
    const socketPoints = events.filter(
      (event) => event.vehicleId === selectedVehicle?.id,
    );
    return [...liveHistory, ...socketPoints].sort(
      (a: any, b: any) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [events, liveHistory, selectedVehicle?.id]);

  if (vehiclesQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const latestPoint = latestQuery.data?.data;
  const activeRoute = selectedVehicle?.activeRoute;
  const start = parseLocationParts(activeRoute?.startLocation);
  const end = parseLocationParts(activeRoute?.endLocation);

  const startRoutePlayback = () => {
    if (!selectedVehicle?.id) {
      toast.error("Select a vehicle first.");
      return;
    }

    if (playbackTimerRef.current) window.clearInterval(playbackTimerRef.current);
    setIsPlaybackRunning(true);
    let step = 0;
    const steps = 30;
    const routeForMovement = activeRoute || {
      startLocation: null,
      endLocation: null,
    };
    const { start: demoStart, end: demoEnd, isFallback } = getRouteSimulationPoints(routeForMovement);
    const heading = routeHeading(demoStart, demoEnd);
    if (isFallback) toast.info("Using fallback demo map points for this vehicle.");

    playbackTimerRef.current = window.setInterval(() => {
      step += 1;
      const ratio = Math.min(step / steps, 1);
      const point = interpolateRoutePoint(demoStart, demoEnd, ratio);

      saveLocation.mutate({
        vehicleId: selectedVehicle.id,
        latitude: point.latitude,
        longitude: point.longitude,
        speed: demoSpeedForRatio(ratio),
        heading,
        timestamp: new Date().toISOString(),
      });

      if (ratio >= 1 && playbackTimerRef.current) {
        window.clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
        setIsPlaybackRunning(false);
      }
    }, 1800);
  };

  const stopRoutePlayback = () => {
    if (playbackTimerRef.current) window.clearInterval(playbackTimerRef.current);
    playbackTimerRef.current = null;
    setIsPlaybackRunning(false);
  };

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Tracking"
        title="Live Tracking"
        description="Monitor real GPS points sent while drivers run assigned routes."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="h-11 rounded-xl border border-line px-3 text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-green-100"
              value={effectiveVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
            >
              {vehicles.map((vehicle: any) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} - {vehicle.model}
                </option>
              ))}
            </select>
            <Button
              onClick={isPlaybackRunning ? stopRoutePlayback : startRoutePlayback}
              loading={saveLocation.isPending && isPlaybackRunning}
              disabled={!selectedVehicle?.id}
            >
              {isPlaybackRunning ? "Stop Movement" : "Start Web Movement"}
            </Button>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <VehicleMap
          points={mergedPoints}
          selectedVehicleLabel={
            selectedVehicle ? `${selectedVehicle.plate} - ${selectedVehicle.model}` : undefined
          }
        />

        <Surface>
          <h2 className="text-lg font-extrabold text-ink">Vehicle and route detail</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Assigned driver", selectedVehicle?.assignedDriver || "Unassigned"],
              ["Active route", activeRoute?.name || "No active route"],
              ["Start name", start.label || "No route start"],
              ["Start point", start.coordinates || "-"],
              ["End name", end.label || "No route end"],
              ["End point", end.coordinates || "-"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  {label}
                </p>
                <p className="mt-2 text-sm font-extrabold text-ink">{value}</p>
              </div>
            ))}
            <div className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Latitude
              </p>
              <p className="mt-2 text-lg font-extrabold text-ink">
                {latestPoint?.latitude ?? "-"}
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Longitude
              </p>
              <p className="mt-2 text-lg font-extrabold text-ink">
                {latestPoint?.longitude ?? "-"}
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Speed
              </p>
              <p className="mt-2 text-lg font-extrabold text-ink">
                {latestPoint?.speed ?? 0} km/h
              </p>
            </div>
          </div>
        </Surface>
      </section>

      <Surface>
        <h2 className="text-lg font-extrabold text-ink">Route playback</h2>
        <div className="mt-4 space-y-3">
          {mergedPoints.length ? (
            mergedPoints
              .slice()
              .reverse()
                  .map((point: any) => (
                <div key={point.id} className="rounded-xl border border-green-100 bg-green-50/40 px-4 py-3">
                  <p className="text-sm font-bold text-ink">
                    {point.latitude}, {point.longitude}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(point.timestamp).toLocaleString()} - speed {point.speed || 0} km/h
                  </p>
                </div>
              ))
          ) : (
            <EmptyState title="No telemetry yet" description="GPS points appear when drivers run assigned routes with tracking enabled." />
          )}
        </div>
      </Surface>
    </div>
  );
}
