"use client";

import { useState, useEffect } from "react";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import formatCurrency from "@/utils/formatCurrency";
import {
  Badge,
  ActionIcon,
  Group,
  Button,
  Loader,
  Text,
  Flex,
  useMantineTheme,
  Progress,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconTarget,
} from "@tabler/icons-react";
import { useGetGoals } from "@/hooks/useGoals";
import { Goal } from "@/types/api.types";
import AddEditGoalModal from "@/components/goals/AddEditGoalModal";
import GoalDeleteModal from "@/components/goals/GoalDeleteModel";
import { GoalCards } from "@/components/goals/GoalsCards";
import {
  ResultsSummary,
} from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";
import { useGoalProgress } from "@/hooks/useGoals";
import { formatGoalPeriod, getGoalStatus } from "@/utils/goalsUtils";

// Helper function for status colors
function getStatusColor(status: string) {
  const colors: { [key: string]: string } = {
    active: "blue",
    upcoming: "grape",
    completed: "green",
    expired: "red",
  };
  return colors[status] || "gray";
}

// Helper function for progress colors
function getProgressColor(isCompleted: boolean, isOverdue: boolean) {
  if (isCompleted) return "green";
  if (isOverdue) return "red";
  return "blue";
}

const GoalsPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debounce search to avoid too many API calls
  const [debouncedSearchFilter] = useDebouncedValue(searchFilter, 500);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Server-side query with filters and pagination
  const {
    data: goalsResponse,
    isLoading,
    error,
  } = useGetGoals({
    page: currentPage,
    limit: isMobile ? 5 : 10,
    search: debouncedSearchFilter || undefined,
    isPagination: true,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, statusFilter]);

  const handleAddGoal = () => {
    setModalMode("add");
    setEditingGoal(null);
    setAddEditModalOpened(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setModalMode("edit");
    setEditingGoal(goal);
    setAddEditModalOpened(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeletingGoal(goal);
    setDeleteModalOpened(true);
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpened(false);
    setEditingGoal(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setDeletingGoal(null);
  };

  const clearFilters = () => {
    setSearchFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
  };

  const hasActiveFilters = searchFilter || statusFilter;
  const goals = goalsResponse?.data || [];
  const meta = goalsResponse?.data?.meta;

  const totalGoals = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0;
  const pageCount = meta?.totalPages || 1;

  // Filter goals by status on client-side for now
  const filteredGoals = statusFilter 
    ? goals.filter(goal => getGoalStatus(goal) === statusFilter)
    : goals;

  // Active filters for badges
  const activeFilters = [
    ...(searchFilter
      ? [
          {
            key: "search",
            label: "Search",
            value: searchFilter,
            onRemove: () => setSearchFilter(""),
          },
        ]
      : []),
    ...(statusFilter
      ? [
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onRemove: () => setStatusFilter(""),
          },
        ]
      : []),
  ];

  const columns: ColumnDef<Goal>[] = [
    {
      accessorKey: "name",
      header: "Goal Name",
      cell: (info) => {
        const goal = info.row.original;
        return (
          <Flex align="center" gap="sm">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <IconTarget size={16} className="text-white" />
            </div>
            <div className="font-medium text-gray-900">
              {info.getValue() as string}
            </div>
          </Flex>
        );
      },
    },
    {
      accessorKey: "targetAmount",
      header: "Target Amount",
      cell: (info) => {
        const goal = info.row.original;
        return (
          <Text fw={600} className="text-purple-600">
            {formatCurrency(goal.targetAmount)}
          </Text>
        );
      },
    },
    {
      accessorKey: "savedAmount",
      header: "Saved Amount",
      cell: (info) => {
        const goal = info.row.original;
        return (
          <Text fw={500} className="text-green-600">
            {formatCurrency(goal.savedAmount)}
          </Text>
        );
      },
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const goal = row.original;
        const progress = useGoalProgress(goal);
        
        return (
          <div className="min-w-[120px]">
            <Flex justify="space-between" align="center" mb="xs">
              <Text size="xs" c="dimmed">
                {progress.progress.toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed">
                {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
              </Text>
            </Flex>
            <Progress
              value={progress.progress}
              color={getProgressColor(progress.isCompleted, progress.isOverdue)}
              size="sm"
              radius="xl"
            />
            {progress.isOverdue && (
              <Text size="xs" c="red" mt={4}>
                {Math.abs(progress.daysRemaining)} days overdue
              </Text>
            )}
            {!progress.isOverdue && !progress.isCompleted && (
              <Text size="xs" c="dimmed" mt={4}>
                {progress.daysRemaining} days left
              </Text>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const goal = info.row.original;
        const status = getGoalStatus(goal);
        return (
          <Badge color={getStatusColor(status)} variant="light" size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: (info) => {
        const goal = info.row.original;
        return (
          <div className="text-sm text-gray-500">
            {formatGoalPeriod(goal.startDate, goal.endDate)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Group gap="xs">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => handleEditGoal(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteGoal(row.original)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
      enableSorting: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading goals</h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message || "Failed to load goals. Please try again."}
          </p>
          <Button
            variant="light"
            color="red"
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Goals</h1>
          <p className="text-sm text-gray-600 mt-1">
            Set and track your savings goals with progress monitoring
          </p>
        </div>
        <Group>
          <Button
            variant="filled"
            onClick={handleAddGoal}
            leftSection={<IconPlus size={16} />}
            size="md"
            color="purple"
          >
            Create Goal
          </Button>
        </Group>
      </div>

      {/* Reusable Results Summary */}
      <ResultsSummary
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalGoals}
        onClearFilters={clearFilters}
        entityName="goals"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <GoalCards
            data={filteredGoals}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            totalItems={totalGoals}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={filteredGoals}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalGoals}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <AddEditGoalModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        goal={editingGoal}
      />

      {/* Delete Goal Modal */}
      <GoalDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        goal={deletingGoal}
      />
    </div>
  );
};

export default GoalsPage;