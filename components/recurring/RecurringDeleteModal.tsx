"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  Flex,
  Badge,
} from "@mantine/core";
import { useDeleteRecurring } from "@/hooks/useRecurring";
import { RecurringTransaction } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash, IconRefresh, IconWallet, IconCategory, IconCalendar } from "@tabler/icons-react";
import { useRecurringTransactionInfo } from "@/hooks/useRecurring";
import formatCurrency from "@/utils/formatCurrency";
import { formatNextRunDate } from "@/utils/recurringUtils";

interface RecurringDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: RecurringTransaction | null;
}

export default function RecurringDeleteModal({
  opened,
  onClose,
  transaction,
}: RecurringDeleteModalProps) {
  const deleteRecurringMutation = useDeleteRecurring();
  const info = transaction ? useRecurringTransactionInfo(transaction) : null;

  const handleDelete = () => {
    if (!transaction) return;

    deleteRecurringMutation.mutate(transaction.id, {
      onSuccess: () => {
        toast.success(`Recurring transaction deleted successfully`);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete recurring transaction");
      },
    });
  };

  const handleClose = () => {
    deleteRecurringMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Recurring Transaction"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteRecurringMutation.isPending}
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
            Delete Recurring Transaction?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete this recurring transaction? This action cannot be undone.
          </Text>

          {transaction && info && (
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-500' : 
                  transaction.type === 'expense' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  <IconRefresh size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <Flex align="center" gap="sm">
                    <Text fw={500}>{formatCurrency(transaction.amount)}</Text>
                    <Badge 
                      color={
                        transaction.type === 'income' ? 'green' : 
                        transaction.type === 'expense' ? 'red' : 'blue'
                      } 
                      size="xs"
                    >
                      {transaction.type}
                    </Badge>
                    <Badge 
                      color={transaction.active ? (info.isOverdue ? "red" : "green") : "gray"} 
                      size="xs"
                    >
                      {transaction.active ? (info.isOverdue ? "Overdue" : "Active") : "Paused"}
                    </Badge>
                  </Flex>
                  {transaction.note && (
                    <Text size="xs" c="dimmed" mt={4}>
                      {transaction.note}
                    </Text>
                  )}
                </div>
              </Flex>

              <Flex direction="column" gap="xs">
                <Flex align="center" gap="xs">
                  <IconWallet size={12} className="text-gray-400" />
                  <Text size="xs" c="dimmed">
                    Account: {transaction.account?.name}
                  </Text>
                </Flex>

                <Flex align="center" gap="xs">
                  <IconCategory size={12} className="text-gray-400" />
                  <Text size="xs" c="dimmed">
                    Category: {transaction.category?.name}
                  </Text>
                </Flex>

                <Flex align="center" gap="xs">
                  <IconCalendar size={12} className="text-gray-400" />
                  <Text size="xs" c="dimmed">
                    Frequency: {info.frequencyLabel}
                  </Text>
                </Flex>

                <Flex align="center" gap="xs">
                  <IconRefresh size={12} className="text-gray-400" />
                  <Text size="xs" c="dimmed">
                    Next Run: {formatNextRunDate(transaction.nextRunDate)}
                    {info.isOverdue && ` (${info.daysUntilNextRun} days ago)`}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteRecurringMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteRecurringMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Recurring
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}