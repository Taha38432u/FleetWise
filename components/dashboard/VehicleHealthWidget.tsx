"use client";

import {
  Badge,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";

export function VehicleHealthWidget({ dashboardData }: { dashboardData: any }) {
  return (
    <Paper withBorder p="md" radius="lg" className="h-full">
      <Group justify="space-between" mb="md">
        <Title order={4} size="h5">
          Vehicle Health Score
        </Title>
        <Badge
          color={
            dashboardData.vehicleHealth >= 80
              ? "green"
              : dashboardData.vehicleHealth >= 60
              ? "yellow"
              : "red"
          }
          variant="light"
        >
          {dashboardData.vehicleHealth}/100
        </Badge>
      </Group>
      <div className="flex justify-center">
        <RingProgress
          size={180}
          thickness={16}
          roundCaps
          label={
            <Text size="xl" fw={700} ta="center">
              {dashboardData.vehicleHealth}%
            </Text>
          }
          sections={[
            {
              value: dashboardData.vehicleHealth,
              color:
                dashboardData.vehicleHealth >= 80
                  ? "green"
                  : dashboardData.vehicleHealth >= 60
                  ? "yellow"
                  : "red",
              tooltip: "Vehicle Health Score",
            },
          ]}
        />
      </div>
      <SimpleGrid cols={3} spacing="xs" mt="md">
        <div className="text-center">
          <Text size="sm" fw={600}>
            Excellent
          </Text>
          <Text size="xs" c="dimmed">
            15 vehicles
          </Text>
        </div>
        <div className="text-center">
          <Text size="sm" fw={600}>
            Good
          </Text>
          <Text size="xs" c="dimmed">
            18 vehicles
          </Text>
        </div>
        <div className="text-center">
          <Text size="sm" fw={600}>
            Poor
          </Text>
          <Text size="xs" c="dimmed">
            9 vehicles
          </Text>
        </div>
      </SimpleGrid>
    </Paper>
  );
}
