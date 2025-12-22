"use client";

import { Badge, Group, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { Doughnut } from "react-chartjs-2";

export function AIRiskDistribution({
  dashboardData,
  aiRiskDistributionData,
  chartOptions,
}: {
  dashboardData: any;
  aiRiskDistributionData: any;
  chartOptions: any;
}) {
  return (
    <Paper withBorder p="md" radius="lg" className="h-full">
      <Group justify="space-between" mb="md">
        <Title order={4} size="h5">
          AI Risk Distribution
        </Title>
        <Badge color="violet" variant="light">
          {dashboardData.aiPredictions.next7Days +
            dashboardData.aiPredictions.next30Days}{" "}
          Total Risks
        </Badge>
      </Group>
      <div className="h-64">
        <Doughnut
          data={aiRiskDistributionData}
          options={{
            ...chartOptions,
            plugins: {
              legend: {
                position: "right" as const,
              },
            },
          }}
        />
      </div>
      <SimpleGrid cols={4} spacing="xs" mt="md">
        <div className="text-center">
          <Badge color="red" size="lg" circle>
            2
          </Badge>
          <Text size="xs" c="dimmed">
            High
          </Text>
        </div>
        <div className="text-center">
          <Badge color="yellow" size="lg" circle>
            5
          </Badge>
          <Text size="xs" c="dimmed">
            Medium
          </Text>
        </div>
        <div className="text-center">
          <Badge color="blue" size="lg" circle>
            12
          </Badge>
          <Text size="xs" c="dimmed">
            Low
          </Text>
        </div>
        <div className="text-center">
          <Badge color="green" size="lg" circle>
            23
          </Badge>
          <Text size="xs" c="dimmed">
            No Risk
          </Text>
        </div>
      </SimpleGrid>
    </Paper>
  );
}
