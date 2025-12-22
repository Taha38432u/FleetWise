"use client";

import {
  Card,
  Text,
  Badge,
  ActionIcon,
  Group,
  Flex,
  Progress,
  Pagination,
} from "@mantine/core";
import { Budget } from "@/types/api.types";
import {
  IconEdit,
  IconTrash,
  IconCalendar,
  IconPigMoney,
} from "@tabler/icons-react";
import { useBudgetProgress } from "@/hooks/useBudgets";
import { formatBudgetPeriod, getBudgetStatus } from "@/utils/budgetUtils";

interface BudgetCardsProps {
  data: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
}

export function BudgetCards({
  data,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
}: BudgetCardsProps) {
  return (
    <div className="space-y-2">
      {/* Cards */}
      <div className="space-y-3 p-2">
        {data.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {data.length === 0 && (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="text-center border-blue-100 bg-blue-50 mx-2"
          >
            <div className="flex flex-col items-center py-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <IconPigMoney size={24} className="text-blue-400" />
              </div>
              <Text size="sm" fw={600} className="text-blue-900 mb-1">
                No budgets found
              </Text>
              <Text size="xs" className="text-blue-700">
                Try adjusting your search or create a new budget
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
                "data-active:bg-blue-600 data-active:border-blue-600 text-xs",
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
            budgets
          </Text>
        </Flex>
      )}
    </div>
  );
}

function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}) {
  const progress = useBudgetProgress(budget);
  const status = getBudgetStatus(budget);
  const statusColors = {
    active: "green",
    upcoming: "blue",
    expired: "gray",
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="hover:shadow-md transition-all duration-200 border-blue-100 bg-white"
    >
      {/* Header with Category and Status */}
      <Flex justify="space-between" align="flex-start" gap="sm" mb="xs">
        <Flex align="center" gap="xs" className="flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: budget.category?.color || "#3b82f6" }}
          >
            <IconPigMoney size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Text fw={600} size="sm" truncate className="text-gray-900">
              {budget.category?.name}
            </Text>
            <Badge
              color={statusColors[status]}
              variant="light"
              size="xs"
              className="mt-0.5"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </Flex>

        {/* Actions */}
        <Group gap="xs" className="shrink-0">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => onEdit(budget)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => onDelete(budget)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Flex>

      {/* Progress Section */}
      <div className="mt-3">
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
          color={
            progress.isOverBudget
              ? "red"
              : progress.isNearLimit
              ? "yellow"
              : "green"
          }
          size="sm"
          radius="xl"
          className="mb-2"
        />

        <Flex justify="space-between" align="center" gap="xs">
          <Text size="xs" c="dimmed">
            Used: {budget.category?.type === "expense" ? "-" : ""}$
            {progress.used.toFixed(2)}
          </Text>
          <Text size="xs" c="dimmed">
            Remaining: PKR {progress.remaining.toFixed(2)}
          </Text>
        </Flex>
      </div>

      {/* Budget Amount and Period */}
      <Flex justify="space-between" align="center" mt="sm" gap="xs">
        <Text size="sm" fw={600} className="text-blue-600">
          PKR {budget.amount.toFixed(2)}
        </Text>
        <Badge variant="outline" size="xs">
          Total Budget
        </Badge>
      </Flex>

      {/* Period */}
      <Flex align="center" gap="xs" mt="xs">
        <IconCalendar size={12} className="text-gray-400" />
        <Text size="xs" c="dimmed">
          {formatBudgetPeriod(budget.startDate, budget.endDate)}
        </Text>
      </Flex>

      {/* Type Indicator Bar */}
      <div
        className={`h-0.5 rounded-full mt-2 ${
          budget.category?.type === "income"
            ? "bg-gradient-to-r from-green-400 to-green-500"
            : "bg-gradient-to-r from-red-400 to-red-500"
        }`}
      />
    </Card>
  );
}
