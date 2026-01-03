"use client";

import {
  Tabs,
  Grid,
  Text,
  Badge,
  Group,
  Timeline,
  ThemeIcon,
  Button,
  RingProgress,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTruck,
  IconUser,
  IconCalendar,
  IconTool,
  IconAlertTriangle,
  IconFileDescription,
  IconCheck,
} from "@tabler/icons-react";
import { Line } from "react-chartjs-2";
import { Vehicle } from "@/data/vehicles";
import { formatDate, isDateExpired } from "@/utils/dateFormatter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CustomModal from "../common/Input/CustomModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  if (!vehicle) return null;

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Fuel Efficiency (km/L)",
        data: [
          vehicle.fuelEfficiency - 0.5,
          vehicle.fuelEfficiency + 0.2,
          vehicle.fuelEfficiency,
          vehicle.fuelEfficiency + 0.8,
          vehicle.fuelEfficiency - 0.1,
          vehicle.fuelEfficiency + 0.4,
        ],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <CustomModal
      opened={!!vehicle}
      onClose={onClose}
      title="Vehicle Details"
      size="xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Text fw={700} size="xl">
          {vehicle.plate}
        </Text>
        <Badge
          color={
            vehicle.status === "Active"
              ? "green"
              : vehicle.status === "In Maintenance"
              ? "orange"
              : "gray"
          }
          size="lg"
        >
          {vehicle.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab value="overview" leftSection={<IconTruck size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="maintenance" leftSection={<IconTool size={16} />}>
            Maintenance & Health
          </Tabs.Tab>
          <Tabs.Tab
            value="documents"
            leftSection={<IconFileDescription size={16} />}
          >
            Documents
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Grid gutter="md">
            <Grid.Col span={8}>
              <Paper withBorder p="md" radius="md" mb="md">
                <Text size="lg" fw={600} mb="sm">
                  Vehicle Details
                </Text>
                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">
                      Model
                    </Text>
                    <Text fw={500}>{vehicle.model}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Type
                    </Text>
                    <Text fw={500}>{vehicle.type}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Year
                    </Text>
                    <Text fw={500}>{vehicle.year}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Mileage
                    </Text>
                    <Text fw={500}>{vehicle.mileage.toLocaleString()} km</Text>
                  </div>
                </SimpleGrid>
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="sm">
                  Fuel Efficiency Trend
                </Text>
                <div className="h-64">
                  <Line data={data} options={options} />
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper withBorder p="md" radius="md" mb="md" className="h-full">
                <Text size="lg" fw={600} mb="sm">
                  Assigned Driver
                </Text>
                {vehicle.assignedDriver !== "N/A" ? (
                  <div className="flex flex-col items-center py-4">
                    <ThemeIcon
                      size={64}
                      radius="xl"
                      color="blue"
                      variant="light"
                      mb="sm"
                    >
                      <IconUser size={32} />
                    </ThemeIcon>
                    <Text fw={600} size="lg">
                      {vehicle.assignedDriver}
                    </Text>
                    <Text c="dimmed" size="sm">
                      License: DL-987654
                    </Text>
                    <Button variant="light" size="xs" mt="md" fullWidth>
                      View Profile
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-gray-500">
                    <IconUser size={48} className="mb-2 opacity-30" />
                    <Text>No Driver Assigned</Text>
                    <Button variant="outline" size="xs" mt="md">
                      Assign Driver
                    </Button>
                  </div>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Maintenance Tab */}
        <Tabs.Panel value="maintenance">
          <Grid gutter="md">
            <Grid.Col span={7}>
              <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                  Maintenance History
                </Text>
                <Timeline active={0} bulletSize={24} lineWidth={2}>
                  <Timeline.Item
                    bullet={<IconAlertTriangle size={12} />}
                    title="Predicted Failure"
                    color="red"
                  >
                    <Text c="dimmed" size="sm">
                      Brake pad wear detected by AI analysis. High risk of
                      failure in next 500km.
                    </Text>
                    <Text size="xs" mt={4}>
                      Due: {formatDate(vehicle.nextPredictedMaintenance)}
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item
                    bullet={<IconCheck size={12} />}
                    title="Routine Service"
                    color="green"
                  >
                    <Text c="dimmed" size="sm">
                      Oil change, filter replacement, and general inspection.
                    </Text>
                    <Text size="xs" mt={4}>
                      Completed: {formatDate(vehicle.lastService)}
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item
                    bullet={<IconTool size={12} />}
                    title="Tire Replacement"
                    color="blue"
                    lineVariant="dashed"
                  >
                    <Text c="dimmed" size="sm">
                      Replaced all 4 tires.
                    </Text>
                    <Text size="xs" mt={4}>
                      Completed: 6 months ago
                    </Text>
                  </Timeline.Item>
                </Timeline>
              </Paper>
            </Grid.Col>
            <Grid.Col span={5}>
              <Paper withBorder p="md" radius="md" mb="md">
                <Text size="lg" fw={600} mb="sm">
                  AI Health Score
                </Text>
                <Group justify="center">
                  <RingProgress
                    size={160}
                    thickness={16}
                    roundCaps
                    sections={[
                      {
                        value: vehicle.healthScore,
                        color:
                          vehicle.healthScore > 80
                            ? "green"
                            : vehicle.healthScore > 50
                            ? "yellow"
                            : "red",
                      },
                    ]}
                    label={
                      <Text ta="center" size="xl" fw={700}>
                        {vehicle.healthScore}/100
                      </Text>
                    }
                  />
                </Group>
                <Text ta="center" c="dimmed" size="sm" mt="sm">
                  {vehicle.healthScore > 80
                    ? "Vehicle is in excellent condition."
                    : "Vehicle needs attention soon."}
                </Text>
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Text fw={600} mb="xs">
                  Quick Actions
                </Text>
                <Button
                  fullWidth
                  variant="light"
                  color="orange"
                  leftSection={<IconTool size={16} />}
                  mb="xs"
                >
                  Report Issue
                </Button>
                <Button
                  fullWidth
                  variant="light"
                  color="blue"
                  leftSection={<IconCalendar size={16} />}
                >
                  Schedule Service
                </Button>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Documents Tab */}
        <Tabs.Panel value="documents">
          <Paper withBorder p="md" radius="md">
            <Text size="lg" fw={600} mb="md">
              Vehicle Documents
            </Text>
            <SimpleGrid cols={2}>
              <Paper
                withBorder
                p="sm"
                radius="sm"
                className="flex items-center gap-3"
              >
                <ThemeIcon color="red" variant="light" size="xl">
                  <IconFileDescription />
                </ThemeIcon>
                <div className="flex-1">
                  <Text fw={500} size="sm">
                    Insurance Policy
                  </Text>
                  <Text
                    size="xs"
                    c={
                      isDateExpired(vehicle.insuranceExpiry)
                        ? "red"
                        : "dimmed"
                    }
                  >
                    Expires: {formatDate(vehicle.insuranceExpiry)}
                  </Text>
                </div>
                <Button size="xs" variant="subtle">
                  View
                </Button>
              </Paper>
              <Paper
                withBorder
                p="sm"
                radius="sm"
                className="flex items-center gap-3"
              >
                <ThemeIcon color="blue" variant="light" size="xl">
                  <IconFileDescription />
                </ThemeIcon>
                <div className="flex-1">
                  <Text fw={500} size="sm">
                    Registration / RC
                  </Text>
                  <Text size="xs" c="dimmed">
                    Valid Forever
                  </Text>
                </div>
                <Button size="xs" variant="subtle">
                  View
                </Button>
              </Paper>
              <Paper
                withBorder
                p="sm"
                radius="sm"
                className="flex items-center gap-3"
              >
                <ThemeIcon color="teal" variant="light" size="xl">
                  <IconFileDescription />
                </ThemeIcon>
                <div className="flex-1">
                  <Text fw={500} size="sm">
                    Fitness Certificate
                  </Text>
                  <Text
                    size="xs"
                    c={
                      isDateExpired(vehicle.fitnessExpiry)
                        ? "red"
                        : "dimmed"
                    }
                  >
                    Expires: {formatDate(vehicle.fitnessExpiry)}
                  </Text>
                </div>
                <Button size="xs" variant="subtle">
                  View
                </Button>
              </Paper>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </CustomModal>
  );
}
