"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  Flex,
  Progress,
} from "@mantine/core";
import { useDeleteGoal } from "@/hooks/useGoals";
import { Goal } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash, IconTarget } from "@tabler/icons-react";
import { useGoalProgress } from "@/hooks/useGoals";
import { formatGoalPeriod } from "@/utils/goalsUtils";

interface GoalDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function GoalDeleteModal({
  opened,
  onClose,
  goal,
}: GoalDeleteModalProps) {
  const deleteGoalMutation = useDeleteGoal();
  const progress = goal ? useGoalProgress(goal) : null;

  const handleDelete = () => {
    if (!goal) return;

    deleteGoalMutation.mutate(goal.id, {
      onSuccess: () => {
        toast.success(`Goal "${goal.name}" deleted successfully`);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete goal");
      },
    });
  };

  const handleClose = () => {
    deleteGoalMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Goal"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteGoalMutation.isPending}
          overlayProps={{ blur: 2 }}
          loaderProps={{ type: "bars" }}
        />

        <Flex direction="column" align="center" gap="md" mb="lg">
          <Box
            style={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
              borderRadius: "50%",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconTrash size={32} stroke={1.5} color="white" />
          </Box>

          <Text ta="center" fw={500} size="lg">
            Delete Goal?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete{" "}
            <Text span fw={600} c="dark.4">
              "{goal?.name}"
            </Text>
            ? This action cannot be undone and all progress will be lost.
          </Text>

          {goal && progress && (
            <Box
              p="md"
              style={{
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                width: "100%",
              }}
            >
              <Flex align="center" gap="sm" mb="sm">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <IconTarget size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <Text fw={500}>{goal.name}</Text>
                  <Text size="xs" c="dimmed">
                    {formatGoalPeriod(goal.startDate, goal.endDate)}
                  </Text>
                </div>
              </Flex>

              {/* Progress Display */}
              <div className="mb-2">
                <Flex justify="space-between" align="center" mb="xs">
                  <Text size="xs" c="dimmed">
                    Progress
                  </Text>
                  <Text size="xs" fw={600} className="text-purple-600">
                    {progress.progress.toFixed(1)}%
                  </Text>
                </Flex>
                <Progress
                  value={progress.progress}
                  color={progress.isCompleted ? "green" : "purple"}
                  size="sm"
                  radius="xl"
                />
              </div>

              <Flex justify="space-between" align="center">
                <Text size="xs" c="dimmed">
                  Saved: PKR {goal.savedAmount.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  Target: PKR {goal.targetAmount.toFixed(2)}
                </Text>
              </Flex>
            </Box>
          )}
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteGoalMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteGoalMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Goal
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
