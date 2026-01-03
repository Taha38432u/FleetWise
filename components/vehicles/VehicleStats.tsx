"use client";

import {
  Grid,
  Paper,
  Group,
  Text,
  ThemeIcon,
  RingProgress,
} from "@mantine/core";
import {
  IconGauge,
  IconTool,
  IconGasStation,
  IconChartPie,
} from "@tabler/icons-react";
import { Vehicle } from "@/data/vehicles";

export function VehicleStats({ vehicles }: { vehicles: Vehicle[] }) {
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
  const inMaintenance = vehicles.filter(
    (v) => v.status === "In Maintenance"
  ).length;
  const avgHealth = Math.round(
    vehicles.reduce((acc, v) => acc + v.healthScore, 0) / totalVehicles
  );

  return (
    <Grid gutter="md" mb="xl">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={600}>
              FLEET HEALTH
            </Text>
            <ThemeIcon color="teal" variant="light" size="lg">
              <IconGauge size={20} />
            </ThemeIcon>
          </Group>
          <Group>
            <RingProgress
              size={64}
              thickness={6}
              sections={[{ value: avgHealth, color: "teal" }]}
              label={
                <Text size="xs" ta="center" fw={700}>
                  {avgHealth}%
                </Text>
              }
            />
            <div>
              <Text size="xl" fw={700}>
                Excellent
              </Text>
              <Text size="xs" c="dimmed">
                Avg Score
              </Text>
            </div>
          </Group>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={600}>
              MAINTENANCE
            </Text>
            <ThemeIcon color="orange" variant="light" size="lg">
              <IconTool size={20} />
            </ThemeIcon>
          </Group>
          <Group align="flex-end" gap="xs">
            <Text size="xl" fw={700}>
              {inMaintenance}
            </Text>
            <Text size="sm" fw={500} className="mb-1">
              Vehicles
            </Text>
          </Group>
          <Text size="xs" c="orange" mt={4}>
            Requires Attention
          </Text>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={600}>
              FUEL EFFICIENCY
            </Text>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconGasStation size={20} />
            </ThemeIcon>
          </Group>
          <Group align="flex-end" gap="xs">
            <Text size="xl" fw={700}>
              9.8
            </Text>
            <Text size="sm" fw={500} className="mb-1">
              km/L
            </Text>
          </Group>
          <Text size="xs" c="green" mt={4}>
            +2.4% vs last month
          </Text>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={600}>
              ACTIVE FLEET
            </Text>
            <ThemeIcon color="violet" variant="light" size="lg">
              <IconChartPie size={20} />
            </ThemeIcon>
          </Group>
          <Group align="flex-end" gap="xs">
            <Text size="xl" fw={700}>
              {Math.round((activeVehicles / totalVehicles) * 100)}%
            </Text>
            <Text size="sm" fw={500} className="mb-1">
              Utilization
            </Text>
          </Group>
          <Text size="xs" c="dimmed" mt={4}>
            {activeVehicles} on road / {totalVehicles} total
          </Text>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
