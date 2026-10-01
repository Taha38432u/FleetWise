"use client";

import { useState } from "react";
import {
  Modal,
  Text,
  Badge,
  Group,
  Tabs,
  Stack,
  Paper,
  Grid,
  SimpleGrid,
  ThemeIcon,
  Progress,
  Button,
  Select,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import {
  IconUser,
  IconFileText,
  IconPhone,
  IconCheck,
  IconAlertTriangle,
  IconTruck,
  IconPlus,
  IconMinus,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Driver } from "@/types/driver.types";
import { formatDate } from "@/utils/dateFormatter";
import CustomModal from "@/components/common/Input/CustomModal";
import { useGetVehicles } from "@/hooks/useVehicles";
import {
  useAssignVehicleToDriver,
  useUnassignVehicleFromDriver,
  useGetDriver,
} from "@/hooks/useDrivers";
import { toast } from "react-toastify";
import { formatLabel } from "@/utils/formatLabel";

interface DriverModalProps {
  driver: Driver | null;
  onClose: () => void;
}

export function DriverModal({ driver, onClose }: DriverModalProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [vehicleToUnassign, setVehicleToUnassign] = useState<string | null>(null);

  // Fetch detailed driver data by ID
  const { data: driverResponse, isLoading, refetch } = useGetDriver(driver?.id || "");
  const driverData = driverResponse?.data;
  // Fetch available vehicles (hooks must run unconditionally)
  const { data: vehiclesResponse } = useGetVehicles({
    page: 1,
    pageSize: 100,
  });

  const assignMutation = useAssignVehicleToDriver();
  const unassignMutation = useUnassignVehicleFromDriver();

  if (!driver) return null;

  const allVehicles = vehiclesResponse?.data?.data || [];
  const assignedVehicleIds = driverData?.assignedVehicles?.map((v) => v.id) || [];

  // Only unassigned vehicles can be newly assigned here.
  const availableVehicles = allVehicles.filter(
    (v) => !v.assignedDriverId && !assignedVehicleIds.includes(v.id)
  );

  const handleAssignVehicle = () => {
    if (!selectedVehicleId) {
      toast.error("Please select a vehicle");
      return;
    }

    assignMutation.mutate(
      { driverId: driver.id, vehicleId: selectedVehicleId },
      {
        onSuccess: () => {
          toast.success("Vehicle assigned successfully");
          setShowAssignModal(false);
          setSelectedVehicleId(null);
          refetch();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to assign vehicle");
        },
      }
    );
  };

  const handleUnassignVehicle = (vehicleId: string) => {
    setVehicleToUnassign(vehicleId);
    setShowUnassignModal(true);
  };

  const confirmUnassignVehicle = () => {
    if (!vehicleToUnassign) return;

    unassignMutation.mutate(vehicleToUnassign, {
      onSuccess: () => {
        toast.success("Vehicle unassigned successfully");
        setShowUnassignModal(false);
        setVehicleToUnassign(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to unassign vehicle");
        setShowUnassignModal(false);
        setVehicleToUnassign(null);
      },
    });
  };

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case "Valid":
        return "green";
      case "Expired":
        return "red";
      case "Suspended":
        return "orange";
      case "Pending Verification":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "green";
      case "On Duty":
        return "green";
      case "Off Duty":
        return "gray";
      case "On Leave":
        return "yellow";
      default:
        return "gray";
    }
  };

  // Show nothing while loading
  if (isLoading || !driverData) {
    return (
      <CustomModal
        opened={!!driver}
        onClose={onClose}
        title="Driver Details"
        size="xl"
      >
        <LoadingOverlay visible={true} overlayProps={{ radius: "md" }} />
        <div style={{ height: "400px" }} />
      </CustomModal>
    );
  }

  return (
    <CustomModal
      opened={!!driver}
      onClose={onClose}
      title="Driver Details"
      size="xl"
    >
      {/* Header with Name and License Status */}
      <div className="flex items-center gap-3 mb-6">
        <ThemeIcon size={48} radius="md" color="green" variant="light">
          <IconUser size={24} />
        </ThemeIcon>
        <div>
          {driverData.user && (
            <>
              <Text fw={700} size="lg">
                {driverData.user.firstName} {driverData.user.lastName}
              </Text>
              <Text size="sm" c="dimmed">
                {driverData.user.email}
              </Text>
            </>
          )}
        </div>
        <div className="ml-auto">
          <Badge
            color={getLicenseStatusColor(driverData.licenseStatus)}
            size="lg"
          >
            {formatLabel(driverData.licenseStatus)}
          </Badge>
          <Badge
            color={getAvailabilityColor(driverData.availabilityStatus)}
            size="lg"
            ml="xs"
          >
            {formatLabel(driverData.availabilityStatus)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab value="overview" leftSection={<IconUser size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="documents" leftSection={<IconFileText size={16} />}>
            Documents
          </Tabs.Tab>
          <Tabs.Tab value="vehicles" leftSection={<IconTruck size={16} />}>
            Vehicles
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Grid gutter="md">
            <Grid.Col span={8}>
              {/* License Information */}
              <Paper withBorder p="md" radius="md" mb="md">
                <Text size="lg" fw={600} mb="sm">
                  License Information
                </Text>
                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">
                      License Number
                    </Text>
                    <Text fw={500}>{driverData.licenseNumber}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Expiry Date
                    </Text>
                    <Text fw={500}>{formatDate(driverData.licenseExpiry)}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      License Status
                    </Text>
                    <Badge color={getLicenseStatusColor(driverData.licenseStatus)} size="sm" mt="xs">
                      {formatLabel(driverData.licenseStatus)}
                    </Badge>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Years of Experience
                    </Text>
                    <Text fw={500}>{driverData.yearsOfExperience} years</Text>
                  </div>
                </SimpleGrid>
              </Paper>

              {/* Employment Information */}
              <Paper withBorder p="md" radius="md" mb="md">
                <Text size="lg" fw={600} mb="sm">
                  Employment Information
                </Text>
                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">
                      Availability
                    </Text>
                    <Badge
                      color={getAvailabilityColor(driverData.availabilityStatus)}
                      size="sm"
                      mt="xs"
                    >
                      {formatLabel(driverData.availabilityStatus)}
                    </Badge>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Last Working Date
                    </Text>
                    <Text fw={500}>
                      {driverData.lastWorkingDate ? formatDate(driverData.lastWorkingDate) : "N/A"}
                    </Text>
                  </div>
                </SimpleGrid>
              </Paper>

              {/* Emergency Contact */}
              <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="sm">
                  Emergency Contact
                </Text>
                <Group mb="xs">
                  <ThemeIcon size="lg" radius="md" color="red" variant="light">
                    <IconUser size={18} />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>{driverData.emergencyContact}</Text>
                    <Group gap="xs" mt="xs">
                      <ThemeIcon size="sm" radius="md" variant="light" color="green">
                        <IconPhone size={14} />
                      </ThemeIcon>
                      <Text size="sm">{driverData.emergencyContactPhone}</Text>
                    </Group>
                  </div>
                </Group>
              </Paper>
            </Grid.Col>

            {/* Right Column - Performance Metrics */}
            <Grid.Col span={4}>
              

              {/* Stats Card */}
              <Paper withBorder p="md" radius="md">
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        Total Rides
                      </Text>
                      <Text size="sm" fw={600}>
                        {driverData.totalRides}
                      </Text>
                    </Group>
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        Total Distance
                      </Text>
                      <Text size="sm" fw={600}>
                        {driverData?.totalDistance?.toLocaleString()} km
                      </Text>
                    </Group>
                    <Progress
                      value={(driverData.totalDistance / 100000) * 100}
                      color="green"
                      size="sm"
                      radius="md"
                    />
                  </div>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Documents Tab */}
        <Tabs.Panel value="documents">
          <Paper withBorder p="md" radius="md" mb="md">
            <Text size="lg" fw={600} mb="md">
              Document Verification
            </Text>
            <Stack gap="md">
              {/* Document Verified */}
              <Paper p="sm" bg="gray.0" radius="md" mb="sm">
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      color={driverData.documentVerified ? "green" : "red"}
                      variant="light"
                    >
                      {driverData.documentVerified ? (
                        <IconCheck size={18} />
                      ) : (
                        <IconAlertCircle size={18} />
                      )}
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Documents Verified</Text>
                      <Text size="sm" c="dimmed">
                        {driverData.documentVerified
                          ? "All documents verified"
                          : "Documents pending verification"}
                      </Text>
                    </div>
                  </Group>
                  <Badge
                    color={driverData.documentVerified ? "green" : "red"}
                    variant="light"
                  >
                    {driverData.documentVerified ? "Verified" : "Pending"}
                  </Badge>
                </Group>
              </Paper>

              {/* Background Check */}
              <Paper p="sm" bg="gray.0" radius="md">
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      color={driverData.backgroundCheckDone ? "green" : "yellow"}
                      variant="light"
                    >
                      {driverData.backgroundCheckDone ? (
                        <IconCheck size={18} />
                      ) : (
                        <IconClock size={18} />
                      )}
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Background Check</Text>
                      <Text size="sm" c="dimmed">
                        {driverData.backgroundCheckDone
                          ? `Completed on ${formatDate(driverData.backgroundCheckDate)}`
                          : "Background check pending"}
                      </Text>
                    </div>
                  </Group>
                  <Badge
                    color={driverData.backgroundCheckDone ? "green" : "yellow"}
                    variant="light"
                  >
                    {driverData.backgroundCheckDone ? "Complete" : "Pending"}
                  </Badge>
                </Group>
              </Paper>
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Vehicles Tab */}
        <Tabs.Panel value="vehicles">
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Assigned Vehicles
              </Text>
              <Button
                leftSection={<IconPlus size={18} />}
                size="sm"
                onClick={() => setShowAssignModal(true)}
              >
                Assign Vehicle
              </Button>
            </Group>

            {driverData.assignedVehicles && driverData.assignedVehicles.length > 0 ? (
              <Stack gap="md">
                {driverData.assignedVehicles.map((vehicle) => (
                  <Paper
                    key={vehicle.id}
                    withBorder
                    p="md"
                    radius="md"
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Text fw={600}>
                        {vehicle.model}
                      </Text>
                      <Text size="sm" c="dimmed">
                        License Plate: {vehicle.plate}
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge size="sm" color="green" variant="light">
                          {vehicle.type}
                        </Badge>
                      </Group>
                    </div>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() =>
                        handleUnassignVehicle(vehicle.id)
                      }
                      loading={Boolean((unassignMutation as any).isLoading)}
                    >
                      <IconMinus size={18} />
                    </ActionIcon>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Paper withBorder p="lg" ta="center" bg="gray.0">
                <Text c="dimmed" size="sm">
                  No vehicles assigned
                </Text>
              </Paper>
            )}
          </Stack>

          {/* Assign Vehicle Modal */}
          {showAssignModal && (
            <Modal
              opened={showAssignModal}
              onClose={() => setShowAssignModal(false)}
              title="Assign Vehicle to Driver"
              centered
            >
              <Stack gap="md">
                <Text size="sm" c="dimmed">
                  Select a vehicle to assign to {driverData.user?.firstName}{" "}
                  {driverData.user?.lastName}
                </Text>
                <Select
                  label="Vehicle"
                  placeholder="Choose vehicle"
                  data={availableVehicles.map((v) => ({
                    value: v.id,
                    label: `${v.model} (${v.plate})`,
                  }))}
                  value={selectedVehicleId}
                  onChange={(value) => setSelectedVehicleId(value)}
                  searchable
                />
                <Group justify="flex-end">
                  <Button
                    variant="light"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignVehicle}
                    loading={Boolean((assignMutation as any).isLoading)}
                  >
                    Assign
                  </Button>
                </Group>
              </Stack>
            </Modal>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Unassign Vehicle Modal */}
      <Modal
        opened={showUnassignModal}
        onClose={() => {
          setShowUnassignModal(false);
          setVehicleToUnassign(null);
        }}
        title="Unassign Vehicle"
        centered
      >
        <Stack gap="md">
          <div
            style={{
              backgroundColor: "#ffe0e0",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ff6b6b",
            }}
          >
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" color="red" variant="light">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <div>
                <Text fw={600}>Confirm Unassignment</Text>
                <Text size="sm" c="dimmed">
                  Are you sure you want to unassign this vehicle from the driver?
                </Text>
              </div>
            </Group>
          </div>
          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                setShowUnassignModal(false);
                setVehicleToUnassign(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmUnassignVehicle}
              loading={Boolean((unassignMutation as any).isLoading)}
            >
              Unassign Vehicle
            </Button>
          </Group>
        </Stack>
      </Modal>
    </CustomModal>
  );
}
