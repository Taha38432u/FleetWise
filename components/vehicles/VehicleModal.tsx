"use client";

import { Badge, Button, SimpleGrid, Tabs, Text } from "@mantine/core";
import {
  IconCalendar,
  IconFileDescription,
  IconMapPin,
  IconRoute,
  IconTool,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Vehicle } from "@/data/vehicles";
import { useGetVehicle } from "@/hooks/useVehicles";
import { formatDate, isDateExpired } from "@/utils/dateFormatter";
import CustomModal from "../common/Input/CustomModal";
import { formatLabel } from "@/utils/formatLabel";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

function InfoTile({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="ui-kicker">{label}</p>
      <p className="mt-2 text-sm font-bold text-ink">{value || "Not available"}</p>
    </div>
  );
}

export function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const vehicleDetailQuery = useGetVehicle(vehicle?.id || "");
  if (!vehicle) return null;

  const currentVehicle = vehicleDetailQuery.data || vehicle;
  const activeRoute = currentVehicle.activeRoute;
  const latestLocation = currentVehicle.latestLocation;
  const openMaintenanceCount = currentVehicle.openMaintenanceCount || 0;

  return (
    <CustomModal opened={Boolean(vehicle)} onClose={onClose} title="Vehicle Details" size="xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Text fw={800} size="xl" className="text-ink">
            {currentVehicle.plate}
          </Text>
          <Text size="sm" className="text-muted">
            {currentVehicle.model} · {currentVehicle.type} · {currentVehicle.year}
          </Text>
        </div>
        <Badge
          color={
            currentVehicle.status === "Active"
              ? "green"
              : currentVehicle.status === "In Maintenance"
                ? "yellow"
                : "gray"
          }
          size="lg"
        >
          {currentVehicle.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab value="overview" leftSection={<IconTruck size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="route" leftSection={<IconRoute size={16} />}>
            Route State
          </Tabs.Tab>
          <Tabs.Tab value="maintenance" leftSection={<IconTool size={16} />}>
            Maintenance
          </Tabs.Tab>
          <Tabs.Tab value="documents" leftSection={<IconFileDescription size={16} />}>
            Documents
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <InfoTile
              label="Assigned driver"
              value={
                currentVehicle.assignedDriver && currentVehicle.assignedDriver !== "N/A"
                  ? currentVehicle.assignedDriver
                  : "Unassigned"
              }
            />
            <InfoTile
              label="Availability"
              value={activeRoute ? "Assigned to active route" : "Available for dispatch"}
            />
            <InfoTile label="Mileage" value={`${currentVehicle.mileage.toLocaleString()} km`} />
            <InfoTile label="Fuel efficiency" value={`${currentVehicle.fuelEfficiency} km/L`} />
            <InfoTile label="Health score" value={`${currentVehicle.healthScore}/100`} />
            <InfoTile label="Open maintenance" value={openMaintenanceCount} />
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="route">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <InfoTile label="Current route" value={activeRoute?.name || "No active route"} />
            <InfoTile
              label="Route status"
              value={activeRoute?.status ? formatLabel(activeRoute.status) : "Available"}
            />
            <InfoTile
              label="Destination"
              value={activeRoute?.endLocation || "No destination assigned"}
            />
            <InfoTile
              label="Start location"
              value={activeRoute?.startLocation || "No start point assigned"}
            />
            <InfoTile
              label="Latest GPS"
              value={
                latestLocation
                  ? `${latestLocation.latitude}, ${latestLocation.longitude}`
                  : "No GPS update yet"
              }
            />
            <InfoTile
              label="Last update"
              value={
                latestLocation?.timestamp
                  ? new Date(latestLocation.timestamp).toLocaleString()
                  : "No GPS update yet"
              }
            />
          </SimpleGrid>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button component={Link} href="/routes" leftSection={<IconRoute size={16} />}>
              Open Routes
            </Button>
            <Button
              component={Link}
              href="/live-tracking"
              variant="default"
              leftSection={<IconMapPin size={16} />}
            >
              View Tracking
            </Button>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="maintenance">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <InfoTile label="Last service" value={formatDate(currentVehicle.lastService)} />
            <InfoTile
              label="Next scheduled service"
              value={formatDate(currentVehicle.nextPredictedMaintenance)}
            />
            <InfoTile label="Open maintenance records" value={openMaintenanceCount} />
            <InfoTile label="Health score" value={`${currentVehicle.healthScore}/100`} />
          </SimpleGrid>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button component={Link} href="/maintenance" leftSection={<IconTool size={16} />}>
              Schedule Service
            </Button>
            <Button
              component={Link}
              href="/mechanics"
              variant="default"
              leftSection={<IconUser size={16} />}
            >
              Mechanic Queue
            </Button>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="documents">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <InfoTile
              label="Insurance"
              value={`${isDateExpired(currentVehicle.insuranceExpiry) ? "Expired" : "Valid"} · ${formatDate(currentVehicle.insuranceExpiry)}`}
            />
            <InfoTile
              label="Fitness certificate"
              value={`${isDateExpired(currentVehicle.fitnessExpiry) ? "Expired" : "Valid"} · ${formatDate(currentVehicle.fitnessExpiry)}`}
            />
            <InfoTile label="Registration" value="Linked to vehicle plate" />
            <InfoTile label="Compliance action" value="Update dates from Edit Vehicle" />
          </SimpleGrid>
          <div className="mt-5">
            <Button
              component={Link}
              href="/vehicles"
              variant="default"
              leftSection={<IconCalendar size={16} />}
            >
              Manage Vehicle Record
            </Button>
          </div>
        </Tabs.Panel>
      </Tabs>
    </CustomModal>
  );
}
