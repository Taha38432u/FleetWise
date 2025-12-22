"use client";

import {
  Card,
  Text,
  Badge,
  ActionIcon,
  Group,
  Flex,
  Pagination,
  Switch,
} from "@mantine/core";
import { RecurringTransaction } from "@/types/api.types";
import {
  IconEdit,
  IconTrash,
  IconCalendar,
  IconRefresh,
  IconWallet,
  IconCategory,
} from "@tabler/icons-react";
import { useRecurringTransactionInfo } from "@/hooks/useRecurring";
import formatCurrency from "@/utils/formatCurrency";

import { formatNextRunDate } from "@/utils/recurringUtils";

interface RecurringCardsProps {
  data: RecurringTransaction[];
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (transaction: RecurringTransaction) => void;
  onToggleActive: (id: number, active: boolean) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
}

export function RecurringCards({
  data,
  onEdit,
  onDelete,
  onToggleActive,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
}: RecurringCardsProps) {
  return (
    <div className="space-y-2">
      {/* Cards */}
      <div className="space-y-3 p-2">
        {data.map((transaction) => (
          <RecurringCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        ))}

        {data.length === 0 && (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="text-center border-orange-100 bg-orange-50 mx-2"
          >
            <div className="flex flex-col items-center py-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <IconRefresh size={24} className="text-orange-400" />
              </div>
              <Text size="sm" fw={600} className="text-orange-900 mb-1">
                No recurring transactions found
              </Text>
              <Text size="xs" className="text-orange-700">
                Try adjusting your search or create a new recurring transaction
              </Text>
            </div>
          </Card>
        )}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <Flex
          justify="center"
          p="sm"
          className="bg-gray-50 border-t border-gray-200"
        >
          <Pagination
            value={currentPage}
            onChange={onPageChange}
            total={totalPages}
            size="xs"
            withEdges
            siblings={0}
            boundaries={0}
            classNames={{
              control:
                "data-active:bg-orange-600 data-active:border-orange-600 text-xs",
            }}
          />
        </Flex>
      )}

      {/* Mobile Page Info */}
      {data.length > 0 && (
        <Flex
          justify="center"
          p="xs"
          className="bg-gray-50 border-t border-gray-100"
        >
          <Text size="xs" c="dimmed" className="text-center px-2">
            Page {currentPage} of {totalPages} • {data.length} of {totalItems}{" "}
            recurring transactions
          </Text>
        </Flex>
      )}
    </div>
  );
}

function RecurringCard({
  transaction,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  transaction: RecurringTransaction;
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (transaction: RecurringTransaction) => void;
  onToggleActive: (id: number, active: boolean) => void;
}) {
  const info = useRecurringTransactionInfo(transaction);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="hover:shadow-md transition-all duration-200 border-orange-100 bg-white"
    >
      {/* Header with Amount and Status */}
      <Flex justify="space-between" align="flex-start" gap="sm" mb="xs">
        <Flex align="center" gap="xs" className="flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              transaction.type === "income"
                ? "bg-green-500"
                : transaction.type === "expense"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            <IconRefresh size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Text fw={600} size="sm" truncate className="text-gray-900">
              {formatCurrency(transaction.amount)}
            </Text>
            <Badge
              color={
                transaction.type === "income"
                  ? "green"
                  : transaction.type === "expense"
                  ? "red"
                  : "blue"
              }
              variant="light"
              size="xs"
              className="mt-0.5"
            >
              {transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)}
            </Badge>
          </div>
        </Flex>

        {/* Actions */}
        <Group gap="xs" className="shrink-0">
          <Switch
            size="xs"
            checked={transaction.active}
            onChange={(event) =>
              onToggleActive(transaction.id, event.currentTarget.checked)
            }
          />
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => onEdit(transaction)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => onDelete(transaction)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Flex>

      {/* Note */}
      {transaction.note && (
        <Text size="sm" className="text-gray-600 mb-2" lineClamp={2}>
          {transaction.note}
        </Text>
      )}

      {/* Details */}
      <Flex direction="column" gap="xs" className="mt-2">
        <Flex align="center" gap="xs">
          <IconWallet size={14} className="text-gray-400" />
          <Text size="xs" c="dimmed">
            Account: {transaction.account?.name}
          </Text>
        </Flex>

        <Flex align="center" gap="xs">
          <IconCategory size={14} className="text-gray-400" />
          <Text size="xs" c="dimmed">
            Category: {transaction.category?.name}
          </Text>
        </Flex>

        <Flex align="center" gap="xs">
          <IconCalendar size={14} className="text-gray-400" />
          <Text size="xs" c="dimmed">
            Frequency: {info.frequencyLabel}
          </Text>
        </Flex>
      </Flex>

      {/* Next Run Date */}
      <Flex justify="space-between" align="center" mt="sm" gap="xs">
        <Badge
          variant="outline"
          size="xs"
          color={
            !transaction.active ? "gray" : info.isOverdue ? "red" : "green"
          }
        >
          {!transaction.active
            ? "Paused"
            : info.isOverdue
            ? "Overdue"
            : "Active"}
        </Badge>
        <Text size="xs" c="dimmed">
          Next: {formatNextRunDate(transaction.nextRunDate)}
          {info.isOverdue &&
            transaction.active &&
            ` (${info.daysUntilNextRun} days ago)`}
          {!info.isOverdue &&
            transaction.active &&
            ` (in ${info.daysUntilNextRun} days)`}
        </Text>
      </Flex>

      {/* Status Indicator Bar */}
      <div
        className={`h-0.5 rounded-full mt-2 ${
          !transaction.active
            ? "bg-gray-400"
            : info.isOverdue
            ? "bg-gradient-to-r from-red-400 to-red-500"
            : transaction.type === "income"
            ? "bg-gradient-to-r from-green-400 to-green-500"
            : transaction.type === "expense"
            ? "bg-gradient-to-r from-red-400 to-red-500"
            : "bg-gradient-to-r from-blue-400 to-blue-500"
        }`}
      />
    </Card>
  );
}
