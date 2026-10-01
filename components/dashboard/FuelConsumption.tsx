"use client";

import { Group, Paper, Text, ThemeIcon, Title } from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconGasStation,
} from "@tabler/icons-react";
import { Line } from "react-chartjs-2";

export function FuelConsumption({
  dashboardData,
  fuelConsumptionData,
  chartOptions,
}: {
  dashboardData: any;
  fuelConsumptionData: any;
  chartOptions: any;
}) {
  return (
    <Paper withBorder p="md" radius="lg" className="h-full">
      <Group justify="space-between" mb="md">
        <Title order={4} size="h5">
          Fuel Consumption Trend
        </Title>
        <Group gap="xs">
          <ThemeIcon size="sm" color="green" variant="light">
            <IconGasStation size={16} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            {dashboardData.fuelConsumption.current} km/L
            <Text
              component="span"
              size="xs"
              c={dashboardData.fuelConsumption.trend === "up" ? "green" : "red"}
              ml="xs"
            >
              {dashboardData.fuelConsumption.trend === "up" ? (
                <IconArrowUpRight size={12} />
              ) : (
                <IconArrowDownRight size={12} />
              )}
              {Math.abs(
                dashboardData.fuelConsumption.current -
                  dashboardData.fuelConsumption.lastMonth
              ).toFixed(1)}
            </Text>
          </Text>
        </Group>
      </Group>
      <div className="h-64">
        <Line data={fuelConsumptionData} options={chartOptions} />
      </div>
    </Paper>
  );
}
