import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVehicleHistory,
  getVehicleLocation,
  saveVehicleLocation,
} from "@/api/tracking/trackingApi";

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "";

export function useVehicleLocation(vehicleId?: string) {
  return useQuery({
    queryKey: ["tracking", "latest", vehicleId],
    queryFn: () => getVehicleLocation(vehicleId as string),
    enabled: Boolean(vehicleId),
    refetchInterval: 10000,
  });
}

export function useVehicleHistory(vehicleId?: string, params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["tracking", "history", vehicleId, params],
    queryFn: () => getVehicleHistory(vehicleId as string, params),
    enabled: Boolean(vehicleId),
  });
}

export function useSaveVehicleLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveVehicleLocation,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      return data;
    },
  });
}

export function useTrackingSocket() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!socketUrl) {
      return;
    }

    const normalizedBase = socketUrl.replace(/\/api\/?$/, "");
    const nextSocket = io(`${normalizedBase}/tracking`, {
      transports: ["websocket", "polling"],
    });

    nextSocket.on("location:broadcast", (payload) => {
      setEvents((prev) => [payload, ...prev].slice(0, 100));
    });

    return () => {
      nextSocket.disconnect();
    };
  }, []);

  return { events };
}
