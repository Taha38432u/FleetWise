"use client";

import { Badge, Group, ActionIcon, Text } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Vehicle } from "@/data/vehicles";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/dateFormatter";

interface VehicleTableProps {
  data: Vehicle[]; // paginated data
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  isLoading?: boolean;
}

export function VehicleTable({
  data,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  isLoading,
}: VehicleTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Idle":
        return "yellow";
      case "In Maintenance":
        return "orange";
      case "Decommissioned":
        return "gray";
      default:
        return "blue";
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "plate",
      header: "Plate Number",
      cell: (info) => <Text fw={500}>{info.getValue() as string}</Text>,
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <div>
          <Text size="sm" fw={500}>
            {row.original.model}
          </Text>
          <Text size="xs" c="dimmed">
            {row.original.year}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          color={getStatusColor(info.getValue() as string)}
          variant="light"
        >
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "mileage",
      header: "Mileage",
      cell: (info) => (
        <Text size="sm">{(info.getValue() as number).toLocaleString()} km</Text>
      ),
    },
    {
      accessorKey: "assignedDriver",
      header: "Driver",
      cell: (info) => {
        const driver = info.getValue() as string;
        return driver !== "N/A" ? (
          <Text size="sm">{driver}</Text>
        ) : (
          <Text size="xs" c="dimmed">
            Unassigned
          </Text>
        );
      },
    },
    {
      accessorKey: "nextPredictedMaintenance",
      header: "Next Maint.",
      cell: (info) => <Text size="sm">{formatDate(info.getValue() as string)}</Text>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => onView(row.original)}
            title="View Details"
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => onEdit(row.original)}
            title="Edit"
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(row.original)}
            title="Delete"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <CustomTable
      data={data}
      columns={columns}
      totalItems={totalItems}
      pageCount={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
