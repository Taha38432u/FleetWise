import { makeApiCall } from "@/api/api";

export type FuelLog = {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  odometer: number;
  date: string;
};

export async function createFuelLog(data: {
  vehicleId: string;
  liters: number;
  cost: number;
  odometer: number;
  date?: string;
}) {
  return makeApiCall<{ ok: boolean; data: FuelLog }>({
    method: "POST",
    url: "fuel",
    data: {
      ...data,
      date: data.date || new Date().toISOString(),
    },
  });
}

export async function getFuelByVehicle(vehicleId: string) {
  return makeApiCall<{ ok: boolean; data: FuelLog[]; efficiency: number }>({
    method: "GET",
    url: `fuel/vehicle/${vehicleId}`,
  });
}
