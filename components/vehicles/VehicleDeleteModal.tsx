"use client";

import { LoadingOverlay, Button, Group, Text, Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import CustomModal from "@/components/common/Input/CustomModal";

interface VehicleDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehiclePlate?: string;
  isLoading?: boolean;
}

export function VehicleDeleteModal({
  opened,
  onClose,
  onConfirm,
  vehiclePlate = "Vehicle",
  isLoading = false,
}: VehicleDeleteModalProps) {
  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Delete Vehicle"
      size="sm"
      centered
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: "md" }} />
        <div style={{ padding: "20px 0" }}>
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            mb="md"
            title="Warning"
          >
            This action cannot be undone.
          </Alert>

          <Text size="sm" mb="lg">
            Are you sure you want to delete the vehicle <strong>{vehiclePlate}</strong>?
          </Text>

          <Group grow>
            <Button
              variant="default"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={onConfirm}
              loading={isLoading}
            >
              Delete
            </Button>
          </Group>
        </div>
      </div>
    </CustomModal>
  );
}
