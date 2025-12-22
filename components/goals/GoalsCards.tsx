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
import { Goal } from "@/types/api.types";
import { IconEdit, IconTrash, IconCalendar, IconTarget } from "@tabler/icons-react";
import { useGoalProgress } from "@/hooks/useGoals";
import { formatGoalPeriod, getGoalStatus } from "@/utils/goalsUtils";

interface GoalCardsProps {
  data: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
}

export function GoalCards({
  data,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
}: GoalCardsProps) {
  return (
    <div className="space-y-2">
      {/* Cards */}
      <div className="space-y-3 p-2">
        {data.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
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
            className="text-center border-purple-100 bg-purple-50 mx-2"
          >
            <div className="flex flex-col items-center py-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <IconTarget size={24} className="text-purple-400" />
              </div>
              <Text size="sm" fw={600} className="text-purple-900 mb-1">
                No goals found
              </Text>
              <Text size="xs" className="text-purple-700">
                Try adjusting your search or create a new goal
              </Text>
            </div>
          </Card>
        )}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <Flex justify="center" p="sm" className="bg-gray-50 border-t border-gray-200">
          <Pagination
            value={currentPage}
            onChange={onPageChange}
            total={totalPages}
            size="xs"
            withEdges
            siblings={0}
            boundaries={0}
            classNames={{
              control: 'data-active:bg-purple-600 data-active:border-purple-600 text-xs',
            }}
          />
        </Flex>
      )}

      {/* Mobile Page Info */}
      {data.length > 0 && (
        <Flex justify="center" p="xs" className="bg-gray-50 border-t border-gray-100">
          <Text size="xs" c="dimmed" className="text-center px-2">
            Page {currentPage} of {totalPages} • {data.length} of {totalItems} goals
          </Text>
        </Flex>
      )}
    </div>
  );
}

function GoalCard({ 
  goal, 
  onEdit, 
  onDelete 
}: { 
  goal: Goal; 
  onEdit: (goal: Goal) => void; 
  onDelete: (goal: Goal) => void; 
}) {
  const progress = useGoalProgress(goal);
  const status = getGoalStatus(goal);
  const statusColors = {
    active: "blue",
    upcoming: "grape",
    completed: "green",
    expired: "red"
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="hover:shadow-md transition-all duration-200 border-purple-100 bg-white"
    >
      {/* Header with Goal Name and Status */}
      <Flex justify="space-between" align="flex-start" gap="sm" mb="xs">
        <Flex align="center" gap="xs" className="flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
            <IconTarget size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <Text fw={600} size="sm" truncate className="text-gray-900">
              {goal.name}
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
            onClick={() => onEdit(goal)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => onDelete(goal)}
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
          <Text size="xs" fw={600} className="text-purple-600">
            {progress.progress.toFixed(1)}%
          </Text>
        </Flex>

        <Progress
          value={progress.progress}
          color={
            progress.isCompleted ? "green" : 
            progress.isOverdue ? "red" : "purple"
          }
          size="sm"
          radius="xl"
          className="mb-2"
        />

        <Flex justify="space-between" align="center" gap="xs">
          <Text size="xs" c="dimmed">
            Saved: PKR {goal.savedAmount.toFixed(2)}
          </Text>
          <Text size="xs" c="dimmed">
            Target: PKR {goal.targetAmount.toFixed(2)}
          </Text>
        </Flex>
      </div>

      {/* Days Remaining and Period */}
      <Flex justify="space-between" align="center" mt="sm" gap="xs">
        <Badge 
          variant="outline" 
          size="xs" 
          color={progress.daysRemaining < 7 && !progress.isCompleted ? "red" : "gray"}
        >
          {progress.isCompleted ? "Completed" : `${progress.daysRemaining} days left`}
        </Badge>
        <Text size="xs" c="dimmed">
          Remaining: PKR {progress.remaining.toFixed(2)}
        </Text>
      </Flex>

      {/* Period */}
      <Flex align="center" gap="xs" mt="xs">
        <IconCalendar size={12} className="text-gray-400" />
        <Text size="xs" c="dimmed">
          {formatGoalPeriod(goal.startDate, goal.endDate)}
        </Text>
      </Flex>

      {/* Completion Indicator Bar */}
      <div
        className={`h-0.5 rounded-full mt-2 ${
          progress.isCompleted 
            ? 'bg-gradient-to-r from-green-400 to-green-500' 
            : progress.isOverdue
            ? 'bg-gradient-to-r from-red-400 to-red-500'
            : 'bg-gradient-to-r from-purple-400 to-purple-500'
        }`}
      />
    </Card>
  );
}