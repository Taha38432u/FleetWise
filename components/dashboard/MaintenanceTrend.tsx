"use client";

import { Badge, Group, Paper, Text, Title } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Line } from "react-chartjs-2";

export function MaintenanceTrend({
  maintenanceTrendData,
  chartOptions,
}: {
  maintenanceTrendData: any;
  chartOptions: any;
}) {
  return (
    <Paper withBorder p="md" radius="lg" className="h-full">
      <Group justify="space-between" mb="md">
        <Title order={4} size="h5">
          Maintenance Trend
        </Title>
        <Text size="sm" c="dimmed">
          Last 6 Months
        </Text>
      </Group>
      <div className="h-64">
        <Line data={maintenanceTrendData} options={chartOptions} />
      </div>
      <Group justify="apart" mt="sm">
        <Text size="sm" c="dimmed">
          30 events this month
        </Text>
        <Badge color="orange" variant="light">
          <IconArrowUpRight size={12} /> 25% increase
        </Badge>
      </Group>
    </Paper>
  );
}
