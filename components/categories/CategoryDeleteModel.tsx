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
import { useDeleteCategory } from "@/hooks/useCategories";
import { Category } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTrash } from "@tabler/icons-react";

interface CategoryDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function CategoryDeleteModal({
  opened,
  onClose,
  category,
}: CategoryDeleteModalProps) {
  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = () => {
    if (!category) return;

    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success(`Category "${category.name}" deleted successfully`);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete category");
      },
    });
  };

  const handleClose = () => {
    deleteCategoryMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Delete Category"
      centered
      radius="md"
      size="sm"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={deleteCategoryMutation.isPending}
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
            Delete Category?
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Are you sure you want to delete{" "}
            <Text span fw={600} c="dark.4">
              "{category?.name}"
            </Text>
            ? This action cannot be undone and all associated transactions will
            be affected.
          </Text>
        </Flex>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteCategoryMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteCategoryMutation.isPending}
            leftSection={<IconTrash size={16} />}
          >
            Delete Category
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
