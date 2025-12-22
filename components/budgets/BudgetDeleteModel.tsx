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
import { useDeleteBudget } from "@/hooks/useBudgets";
import { Budget } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash, IconPigMoney } from "@tabler/icons-react";
import { useBudgetProgress } from "@/hooks/useBudgets";
import { formatBudgetPeriod } from "@/utils/budgetUtils";

interface BudgetDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  budget: Budget | null;
}

export default function BudgetDeleteModal({
  opened,
  onClose,
  budget,
}: BudgetDeleteModalProps) {
  const deleteBudgetMutation = useDeleteBudget();
  const progress = budget ? useBudgetProgress(budget) : null;

  const handleDelete = () => {
    if (!budget) return;

    deleteBudgetMutation.mutate(budget.id, {
      onSuccess: () => {
        toast.success(
          `Budget for "${budget.category?.name}" deleted successfully`
        );
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete budget");
      },
    });
  };

  const handleClose = () => {
    deleteBudgetMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Budget"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteBudgetMutation.isPending}
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
            Delete Budget?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete the budget for{" "}
            <Text span fw={600} c="dark.4">
              "{budget?.category?.name}"
            </Text>
            ? This action cannot be undone.
          </Text>

          {budget && progress && (
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
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: budget.category?.color || "#3b82f6",
                  }}
                >
                  <IconPigMoney size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <Text fw={500}>{budget.category?.name}</Text>
                  <Text size="xs" c="dimmed">
                    {formatBudgetPeriod(budget.startDate, budget.endDate)}
                  </Text>
                </div>
              </Flex>

              {/* Progress Display */}
              <div className="mb-2">
                <Flex justify="space-between" align="center" mb="xs">
                  <Text size="xs" c="dimmed">
                    Progress
                  </Text>
                  <Text
                    size="xs"
                    fw={600}
                    className={
                      progress.isOverBudget ? "text-red-600" : "text-green-600"
                    }
                  >
                    {progress.percentUsed.toFixed(1)}%
                  </Text>
                </Flex>
                <Progress
                  value={Math.min(progress.percentUsed, 100)}
                  color={progress.isOverBudget ? "red" : "green"}
                  size="sm"
                  radius="xl"
                />
              </div>

              <Flex justify="space-between" align="center">
                <Text size="xs" c="dimmed">
                  Used: ${progress.used.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  Budget: ${budget.amount.toFixed(2)}
                </Text>
              </Flex>
            </Box>
          )}
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteBudgetMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteBudgetMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Budget
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
