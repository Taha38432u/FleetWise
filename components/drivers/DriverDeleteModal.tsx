"use client";

import { LoadingOverlay, Button, Group, Text, Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import CustomModal from "@/components/common/Input/CustomModal";
import { Driver } from "@/types/driver.types";

interface DriverDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driver?: Driver | null;
  isLoading?: boolean;
}

export function DriverDeleteModal({
  opened,
  onClose,
  onConfirm,
  driver,
  isLoading = false,
}: DriverDeleteModalProps) {
  const driverName = driver?.user
    ? `${driver.user.firstName} ${driver.user.lastName}`
    : "Driver";

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Delete Driver"
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
            Are you sure you want to delete <strong>{driverName}</strong> from the system?
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
