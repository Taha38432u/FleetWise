// components/transactions/TransactionDeleteModal.tsx
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
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { Transaction } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash, IconReceipt } from "@tabler/icons-react";

interface TransactionDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDeleteModal({
  opened,
  onClose,
  transaction,
}: TransactionDeleteModalProps) {
  const deleteTransactionMutation = useDeleteTransaction();

  const handleDelete = () => {
    if (!transaction) return;

    deleteTransactionMutation.mutate(transaction.id, {
      onSuccess: () => {
        toast.success("Transaction deleted successfully");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete transaction");
      },
    });
  };

  const handleClose = () => {
    deleteTransactionMutation.reset();
    onClose();
  };

  const getTypeColor = (type: string) => (type === "income" ? "green" : "red");
  const getTypeIcon = (type: string) => (type === "income" ? "↑" : "↓");

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Transaction"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteTransactionMutation.isPending}
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
            Delete Transaction?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </Text>

          {transaction && (
            <Box
              p="md"
              style={{
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                width: "100%",
              }}
            >
              <Flex align="center" gap="sm" mb="xs">
                <IconReceipt size={20} className="text-blue-600" />
                <div style={{ flex: 1 }}>
                  <Text fw={500} truncate>
                    {transaction.note || "No description"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {transaction.account?.name} •{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </div>
              </Flex>

              <Flex justify="space-between" align="center">
                <Badge
                  color={getTypeColor(transaction.type)}
                  variant="light"
                  leftSection={getTypeIcon(transaction.type)}
                >
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
                </Badge>
                <Text
                  fw={600}
                  className={
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}{" "}
                  {transaction.account?.currency}{" "}
                  {transaction.amount.toLocaleString()}
                </Text>
              </Flex>
            </Box>
          )}
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteTransactionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteTransactionMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Transaction
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
