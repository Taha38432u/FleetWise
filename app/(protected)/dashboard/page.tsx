"use client";

import { useState } from "react";
import {
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  Menu,
  Avatar,
  RingProgress,
  Progress,
  SegmentedControl,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTruck,
  IconUsers,
  IconRoad,
  IconChartBar,
  IconBell,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconGasStation,
  IconCalendar,
  IconRefresh,
  IconFilter,
  IconSearch,
  IconPlus,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

// Mock data
const dashboardData = {
  summary: {
    totalVehicles: 42,
    activeVehicles: 36,
    idleVehicles: 4,
    maintenanceVehicles: 2,
    driversOnline: 38,
    driversOffline: 4,
    routesToday: 24,
    subscriptionStatus: "Active Pro",
    monthlyCost: "$12,450",
  },
  alerts: {
    critical: 3,
    warning: 7,
    info: 12,
  },
  aiPredictions: {
    next7Days: 2,
    next30Days: 8,
  },
  vehicleHealth: 87,
  fuelConsumption: {
    current: 8.2,
    lastMonth: 7.8,
    trend: "up",
  },
};

// Chart data
const routeDelayHeatmapData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Delay Minutes',
      data: [15, 22, 18, 35, 28, 12, 8],
      backgroundColor: [
        'rgba(59, 130, 246, 0.1)',
        'rgba(59, 130, 246, 0.2)',
        'rgba(59, 130, 246, 0.3)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(59, 130, 246, 0.2)',
        'rgba(59, 130, 246, 0.1)',
      ],
      borderColor: '#3b82f6',
      borderWidth: 1,
    },
  ],
};

const maintenanceTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Maintenance Events',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const fuelConsumptionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Fuel Efficiency (km/L)',
      data: [7.2, 7.5, 7.8, 8.0, 8.1, 8.2],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const aiRiskDistributionData = {
  labels: ['High Risk', 'Medium Risk', 'Low Risk', 'No Risk'],
  datasets: [
    {
      data: [2, 5, 12, 23],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#3b82f6',
        '#10b981'
      ],
      borderWidth: 1,
      borderColor: '#ffffff',
    },
  ],
};

export default function OperationalIntelligenceDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [user] = useState({
    name: "Admin User",
    role: "Administrator",
    avatar: "AU",
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <IconTruck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FleetWise</h1>
              <p className="text-xs text-gray-500">Operational Intelligence Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <SegmentedControl
              value={timeRange}
              onChange={setTimeRange}
              data={[
                { label: 'Today', value: 'today' },
                { label: 'Week', value: 'week' },
                { label: 'Month', value: 'month' },
                { label: 'Quarter', value: 'quarter' },
              ]}
              size="sm"
            />

            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconBell size={20} />
              <Badge size="xs" circle color="red" className="absolute -top-1 -right-1">
                3
              </Badge>
            </ActionIcon>
            
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <Button variant="subtle" rightSection={<IconChevronDown size={16} />}>
                  <Group gap="sm">
                    <Avatar color="blue" size="sm">{user.avatar}</Avatar>
                    <div className="text-left hidden sm:block">
                      <Text size="sm" fw={500}>{user.name}</Text>
                      <Text size="xs" c="dimmed">{user.role}</Text>
                    </div>
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={16} />} color="red">Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <Group justify="space-between">
          <Group gap="sm">
            <Button 
              leftSection={<IconPlus size={18} />} 
              className="bg-primary hover:bg-primary-hover"
            >
              Add Vehicle
            </Button>
            <Button 
              leftSection={<IconCalendar size={18} />} 
              variant="outline"
            >
              Schedule
            </Button>
            <Button 
              leftSection={<IconRoad size={18} />} 
              variant="outline"
            >
              Plan Routes
            </Button>
          </Group>
          
          <Group gap="xs">
            <ActionIcon variant="outline" size="lg">
              <IconRefresh size={18} />
            </ActionIcon>
            <ActionIcon variant="outline" size="lg">
              <IconFilter size={18} />
            </ActionIcon>
            <ActionIcon variant="outline" size="lg">
              <IconSearch size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </div>

      {/* Main Dashboard */}
      <main className="p-6">
        {/* Top Summary Row */}
        <Grid gutter="md" mb="lg">
          {/* Vehicle Summary */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ThemeIcon size="lg" color="blue" variant="light">
                    <IconTruck size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={600} c="dimmed">VEHICLES</Text>
                </Group>
                <Badge color="blue" variant="light">{dashboardData.summary.totalVehicles}</Badge>
              </Group>
              <SimpleGrid cols={3} spacing="xs">
                <div className="text-center">
                  <Text size="xl" fw={700}>{dashboardData.summary.activeVehicles}</Text>
                  <Text size="xs" c="dimmed">Active</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" fw={700}>{dashboardData.summary.idleVehicles}</Text>
                  <Text size="xs" c="dimmed">Idle</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" fw={700}>{dashboardData.summary.maintenanceVehicles}</Text>
                  <Text size="xs" c="dimmed">Maintenance</Text>
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
                  <Text size="sm" fw={600} c="dimmed">DRIVERS</Text>
                </Group>
                <Badge color="green" variant="light">
                  {dashboardData.summary.driversOnline}/{dashboardData.summary.driversOnline + dashboardData.summary.driversOffline}
                </Badge>
              </Group>
              <SimpleGrid cols={2} spacing="xs">
                <div className="text-center">
                  <Text size="xl" fw={700}>{dashboardData.summary.driversOnline}</Text>
                  <Text size="xs" c="dimmed">Online</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" fw={700}>{dashboardData.summary.driversOffline}</Text>
                  <Text size="xs" c="dimmed">Offline</Text>
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
                  <Text size="sm" fw={600} c="dimmed">ROUTES TODAY</Text>
                </Group>
                <Badge color="orange" variant="light">{dashboardData.summary.routesToday}</Badge>
              </Group>
              <div className="space-y-2">
                <Group justify="apart">
                  <Text size="xs" c="dimmed">Open Alerts</Text>
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
                    color="blue"
                  >
                    <Progress.Label>{dashboardData.alerts.info}</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </div>
            </Paper>
          </Grid.Col>

          {/* AI Predictions & Cost */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ThemeIcon size="lg" color="violet" variant="light">
                    <IconChartBar size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={600} c="dimmed">AI PREDICTIONS</Text>
                </Group>
                <Badge color="violet" variant="light">
                  {dashboardData.aiPredictions.next7Days + dashboardData.aiPredictions.next30Days} Total
                </Badge>
              </Group>
              <SimpleGrid cols={2} spacing="xs" mb="sm">
                <div className="text-center">
                  <Text size="xl" fw={700} c="red">{dashboardData.aiPredictions.next7Days}</Text>
                  <Text size="xs" c="dimmed">Next 7 Days</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" fw={700} c="orange">{dashboardData.aiPredictions.next30Days}</Text>
                  <Text size="xs" c="dimmed">Next 30 Days</Text>
                </div>
              </SimpleGrid>
              <Group justify="apart">
                <div>
                  <Text size="xs" c="dimmed">Monthly Cost</Text>
                  <Text size="xl" fw={700}>{dashboardData.summary.monthlyCost}</Text>
                </div>
                <Badge color="green" variant="light">
                  {dashboardData.summary.subscriptionStatus}
                </Badge>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Widgets Row 1 */}
        <Grid gutter="lg" mb="lg">
          {/* Vehicle Health Score */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">Vehicle Health Score</Title>
                <Badge 
                  color={
                    dashboardData.vehicleHealth >= 80 ? "green" :
                    dashboardData.vehicleHealth >= 60 ? "yellow" : "red"
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
                      color: dashboardData.vehicleHealth >= 80 ? 'green' : 
                            dashboardData.vehicleHealth >= 60 ? 'yellow' : 'red',
                      tooltip: 'Vehicle Health Score' 
                    },
                  ]}
                />
              </div>
              <SimpleGrid cols={3} spacing="xs" mt="md">
                <div className="text-center">
                  <Text size="sm" fw={600}>Excellent</Text>
                  <Text size="xs" c="dimmed">15 vehicles</Text>
                </div>
                <div className="text-center">
                  <Text size="sm" fw={600}>Good</Text>
                  <Text size="xs" c="dimmed">18 vehicles</Text>
                </div>
                <div className="text-center">
                  <Text size="sm" fw={600}>Poor</Text>
                  <Text size="xs" c="dimmed">9 vehicles</Text>
                </div>
              </SimpleGrid>
            </Paper>
          </Grid.Col>

          {/* Route Delay Heatmap */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">Route Delay Heatmap</Title>
                <Text size="sm" c="dimmed">This Week</Text>
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
                <Text size="sm" c="dimmed">Avg Delay: 19.7min</Text>
                <Badge color="green" variant="light">
                  <IconArrowDownRight size={12} /> 12% from last week
                </Badge>
              </Group>
            </Paper>
          </Grid.Col>

          {/* Maintenance Trend Chart */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">Maintenance Trend</Title>
                <Text size="sm" c="dimmed">Last 6 Months</Text>
              </Group>
              <div className="h-64">
                <Line 
                  data={maintenanceTrendData} 
                  options={chartOptions}
                />
              </div>
              <Group justify="apart" mt="sm">
                <Text size="sm" c="dimmed">30 events this month</Text>
                <Badge color="orange" variant="light">
                  <IconArrowUpRight size={12} /> 25% increase
                </Badge>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Widgets Row 2 */}
        <Grid gutter="lg">
          {/* Fuel Consumption Trend */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">Fuel Consumption Trend</Title>
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
                      {dashboardData.fuelConsumption.trend === "up" ? 
                        <IconArrowUpRight size={12} /> : 
                        <IconArrowDownRight size={12} />
                      }
                      {Math.abs(dashboardData.fuelConsumption.current - dashboardData.fuelConsumption.lastMonth).toFixed(1)}
                    </Text>
                  </Text>
                </Group>
              </Group>
              <div className="h-64">
                <Line 
                  data={fuelConsumptionData} 
                  options={chartOptions}
                />
              </div>
            </Paper>
          </Grid.Col>

          {/* AI Risk Distribution */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="lg" className="h-full">
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">AI Risk Distribution</Title>
                <Badge color="violet" variant="light">
                  {dashboardData.aiPredictions.next7Days + dashboardData.aiPredictions.next30Days} Total Risks
                </Badge>
              </Group>
              <div className="h-64">
                <Doughnut 
                  data={aiRiskDistributionData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              </div>
              <SimpleGrid cols={4} spacing="xs" mt="md">
                <div className="text-center">
                  <Badge color="red" size="lg" circle>2</Badge>
                  <Text size="xs" c="dimmed">High</Text>
                </div>
                <div className="text-center">
                  <Badge color="yellow" size="lg" circle>5</Badge>
                  <Text size="xs" c="dimmed">Medium</Text>
                </div>
                <div className="text-center">
                  <Badge color="blue" size="lg" circle>12</Badge>
                  <Text size="xs" c="dimmed">Low</Text>
                </div>
                <div className="text-center">
                  <Badge color="green" size="lg" circle>23</Badge>
                  <Text size="xs" c="dimmed">No Risk</Text>
                </div>
              </SimpleGrid>
            </Paper>
          </Grid.Col>
        </Grid>
      </main>
    </div>
  );
}