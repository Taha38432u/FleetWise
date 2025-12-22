// components/accounts/AccountDeleteModal.tsx
"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  Flex,
} from "@mantine/core";
import { useDeleteAccount } from "@/hooks/useAccounts";
import { Account } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash, IconWallet } from "@tabler/icons-react";

interface AccountDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  account: Account | null;
}

export default function AccountDeleteModal({
  opened,
  onClose,
  account,
}: AccountDeleteModalProps) {
  const deleteAccountMutation = useDeleteAccount();

  const handleDelete = () => {
    if (!account) return;

    deleteAccountMutation.mutate(account.id, {
      onSuccess: () => {
        toast.success(`Account "${account.name}" deleted successfully`);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete account");
      },
    });
  };

  const handleClose = () => {
    deleteAccountMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Account"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteAccountMutation.isPending}
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
            Delete Account?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete{" "}
            <Text span fw={600} c="dark.4">
              "{account?.name}"
            </Text>
            ? This action cannot be undone and all associated transactions will
            be affected.
          </Text>

          {account && (
            <Box
              p="md"
              style={{
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                width: "100%",
              }}
            >
              <Flex align="center" gap="sm">
                <IconWallet size={20} className="text-blue-600" />
                <div>
                  <Text fw={500}>{account.name}</Text>
                  <Text size="sm" c="dimmed">
                    {account.type} • {account.currency}{" "}
                    {account.balance?.toLocaleString()}
                  </Text>
                </div>
              </Flex>
            </Box>
          )}
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteAccountMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Account
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
