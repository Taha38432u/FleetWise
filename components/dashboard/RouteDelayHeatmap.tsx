"use client";

import { Badge, Group, Paper, Text, Title } from "@mantine/core";
import { IconArrowDownRight } from "@tabler/icons-react";
import { Bar } from "react-chartjs-2";

export function RouteDelayHeatmap({
  routeDelayHeatmapData,
  chartOptions,
}: {
  routeDelayHeatmapData: any;
  chartOptions: any;
}) {
  return (
    <Paper withBorder p="md" radius="lg" className="h-full">
      <Group justify="space-between" mb="md">
        <Title order={4} size="h5">
          Route Delay Heatmap
        </Title>
        <Text size="sm" c="dimmed">
          This Week
        </Text>
      </Group>
      <div className="h-64">
        <Bar
          data={routeDelayHeatmapData}
          options={{
            ...chartOptions,
            plugins: {
              legend: { display: false },
            },
          }}
        />
      </div>
      <Group justify="apart" mt="sm">
        <Text size="sm" c="dimmed">
          Avg Delay: 19.7min
        </Text>
        <Badge color="green" variant="light">
          <IconArrowDownRight size={12} /> 12% from last week
        </Badge>
      </Group>
    </Paper>
  );
}
