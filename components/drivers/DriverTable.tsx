"use client";

import { Badge, Group, ActionIcon, Text } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Driver } from "@/types/driver.types";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/dateFormatter";
import { formatLabel } from "@/utils/formatLabel";

interface DriverTableProps {
  data: Driver[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  isLoading?: boolean;
}

export function DriverTable({
  data,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  isLoading,
}: DriverTableProps) {
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

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "licenseNumber",
      header: "License Number",
      cell: (info) => <Text fw={500}>{info.getValue() as string}</Text>,
    },
    {
      accessorKey: "user.firstName",
      header: "Driver Name",
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? (
          <Text size="sm">
            {user.firstName} {user.lastName}
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            N/A
          </Text>
        );
      },
    },
    {
      accessorKey: "licenseStatus",
      header: "License Status",
      cell: (info) => (
        <Badge
          color={getLicenseStatusColor(info.getValue() as string)}
          variant="light"
        >
          {formatLabel(info.getValue())}
        </Badge>
      ),
    },
    {
      accessorKey: "availabilityStatus",
      header: "Availability",
      cell: (info) => (
        <Badge
          color={getAvailabilityColor(info.getValue() as string)}
          variant="light"
        >
          {formatLabel(info.getValue())}
        </Badge>
      ),
    },
    {
      accessorKey: "yearsOfExperience",
      header: "Experience",
      cell: (info) => <Text size="sm">{info.getValue() as number} years</Text>,
    },

    {
      accessorKey: "licenseExpiry",
      header: "License Expiry",
      cell: (info) => (
        <Text size="sm">{formatDate(info.getValue() as string)}</Text>
      ),
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
            color="green"
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
      onPageChange={(newPage: number) => onPageChange(newPage)}
      isLoading={isLoading}
    />
  );
}
