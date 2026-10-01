"use client";

import {
  Badge,
  Grid,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconChartBar,
  IconRoad,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";

export function StatsGrid({ dashboardData }: { dashboardData: any }) {
  return (
    <Grid gutter="md" mb="lg">
      {/* Vehicle Summary */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <ThemeIcon size="lg" color="green" variant="light">
                <IconTruck size={20} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="dimmed">
                VEHICLES
              </Text>
            </Group>
            <Badge color="green" variant="light">
              {dashboardData.summary.totalVehicles}
            </Badge>
          </Group>
          <SimpleGrid cols={3} spacing="xs">
            <div className="text-center">
              <Text size="xl" fw={700}>
                {dashboardData.summary.activeVehicles}
              </Text>
              <Text size="xs" c="dimmed">
                Active
              </Text>
            </div>
            <div className="text-center">
              <Text size="xl" fw={700}>
                {dashboardData.summary.idleVehicles}
              </Text>
              <Text size="xs" c="dimmed">
                Idle
              </Text>
            </div>
            <div className="text-center">
              <Text size="xl" fw={700}>
                {dashboardData.summary.maintenanceVehicles}
              </Text>
              <Text size="xs" c="dimmed">
                Maintenance
              </Text>
            </div>
          </SimpleGrid>
        </Paper>
      </Grid.Col>

      {/* Drivers Summary */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <ThemeIcon size="lg" color="green" variant="light">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="dimmed">
                DRIVERS
              </Text>
            </Group>
            <Badge color="green" variant="light">
              {dashboardData.summary.driversOnline}/
              {dashboardData.summary.driversOnline +
                dashboardData.summary.driversOffline}
            </Badge>
          </Group>
          <SimpleGrid cols={2} spacing="xs">
            <div className="text-center">
              <Text size="xl" fw={700}>
                {dashboardData.summary.driversOnline}
              </Text>
              <Text size="xs" c="dimmed">
                Online
              </Text>
            </div>
            <div className="text-center">
              <Text size="xl" fw={700}>
                {dashboardData.summary.driversOffline}
              </Text>
              <Text size="xs" c="dimmed">
                Offline
              </Text>
            </div>
          </SimpleGrid>
        </Paper>
      </Grid.Col>

      {/* Routes & Alerts */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <ThemeIcon size="lg" color="orange" variant="light">
                <IconRoad size={20} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="dimmed">
                ROUTES TODAY
              </Text>
            </Group>
            <Badge color="orange" variant="light">
              {dashboardData.summary.routesToday}
            </Badge>
          </Group>
          <div className="space-y-2">
            <Group justify="apart">
              <Text size="xs" c="dimmed">
                Open Alerts
              </Text>
              <Badge size="xs" color="red" variant="light">
                {dashboardData.alerts.critical} Critical
              </Badge>
            </Group>
            <Progress.Root size={20}>
              <Progress.Section
                value={(dashboardData.alerts.critical / 22) * 100}
                color="red"
              >
                <Progress.Label>{dashboardData.alerts.critical}</Progress.Label>
              </Progress.Section>
              <Progress.Section
                value={(dashboardData.alerts.warning / 22) * 100}
                color="yellow"
              >
                <Progress.Label>{dashboardData.alerts.warning}</Progress.Label>
              </Progress.Section>
              <Progress.Section
                value={(dashboardData.alerts.info / 22) * 100}
                color="green"
              >
                <Progress.Label>{dashboardData.alerts.info}</Progress.Label>
              </Progress.Section>
            </Progress.Root>
          </div>
        </Paper>
      </Grid.Col>

      {/* Maintenance & Cost */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper withBorder p="md" radius="lg" className="h-full">
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <ThemeIcon size="lg" color="green" variant="light">
                <IconChartBar size={20} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="dimmed">
                SERVICE WINDOW
              </Text>
            </Group>
            <Badge color="green" variant="light">
              {dashboardData.aiPredictions.next7Days +
                dashboardData.aiPredictions.next30Days}{" "}
              Total
            </Badge>
          </Group>
          <SimpleGrid cols={2} spacing="xs" mb="sm">
            <div className="text-center">
              <Text size="xl" fw={700} c="red">
                {dashboardData.aiPredictions.next7Days}
              </Text>
              <Text size="xs" c="dimmed">
                Next 7 Days
              </Text>
            </div>
            <div className="text-center">
              <Text size="xl" fw={700} c="orange">
                {dashboardData.aiPredictions.next30Days}
              </Text>
              <Text size="xs" c="dimmed">
                Next 30 Days
              </Text>
            </div>
          </SimpleGrid>
          <Group justify="apart">
            <div>
              <Text size="xs" c="dimmed">
                Monthly Cost
              </Text>
              <Text size="xl" fw={700}>
                {dashboardData.summary.monthlyCost}
              </Text>
            </div>
            <Badge color="green" variant="light">
              {dashboardData.summary.subscriptionStatus}
            </Badge>
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
