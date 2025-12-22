"use client";

import { useState, useEffect } from "react";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
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
  IconPigMoney,
} from "@tabler/icons-react";
import { useGetBudgets } from "@/hooks/useBudgets";
import { Budget } from "@/types/api.types";
import AddEditBudgetModal from "@/components/budgets/AddEditBudgetModel";
import BudgetDeleteModal from "@/components/budgets/BudgetDeleteModel";
import { BudgetCards } from "@/components/budgets/BudgetCards";
import {
  ResultsSummary,
} from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";
import { useBudgetProgress } from "@/hooks/useBudgets";
import { formatBudgetPeriod, getBudgetStatus } from "@/utils/budgetUtils";

// Helper function for status colors
function getStatusColor(status: string) {
  const colors: { [key: string]: string } = {
    active: "green",
    upcoming: "blue",
    expired: "gray",
  };
  return colors[status] || "gray";
}

// Helper function for progress colors
function getProgressColor(percentUsed: number, isOverBudget: boolean) {
  if (isOverBudget) return "red";
  if (percentUsed >= 80) return "yellow";
  return "green";
}

const BudgetsPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  // const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debounce search to avoid too many API calls
  const [debouncedSearchFilter] = useDebouncedValue(searchFilter, 500);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Server-side query with filters and pagination
  const {
    data: budgetsResponse,
    isLoading,
    error,
  } = useGetBudgets({
    page: currentPage,
    limit: isMobile ? 5 : 10,
    search: debouncedSearchFilter || undefined,
    isPagination: true,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, statusFilter]);

  const handleAddBudget = () => {
    setModalMode("add");
    setEditingBudget(null);
    setAddEditModalOpened(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setModalMode("edit");
    setEditingBudget(budget);
    setAddEditModalOpened(true);
  };

  const handleDeleteBudget = (budget: Budget) => {
    setDeletingBudget(budget);
    setDeleteModalOpened(true);
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpened(false);
    setEditingBudget(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setDeletingBudget(null);
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
  const budgets = budgetsResponse?.data || [];
  const meta = budgetsResponse?.data?.meta;

  const totalBudgets = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0;
  const pageCount = meta?.totalPages || 1;

  // Filter budgets by status on client-side for now
  const filteredBudgets = statusFilter 
    ? budgets.filter(budget => getBudgetStatus(budget) === statusFilter)
    : budgets;

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

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "category.name",
      header: "Category",
      cell: (info) => {
        const budget = info.row.original;
        return (
          <Flex align="center" gap="sm">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: budget.category?.color || '#3b82f6' }}
            >
              <IconPigMoney size={16} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {budget.category?.name}
              </div>
              <Badge 
                color={budget.category?.type === 'income' ? 'green' : 'red'} 
                variant="light" 
                size="xs"
              >
                {budget.category?.type}
              </Badge>
            </div>
          </Flex>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Budget Amount",
      cell: (info) => {
        const budget = info.row.original;
        return (
          <Text fw={600} className="text-blue-600">
            PKR {budget.amount.toFixed(2)}
          </Text>
        );
      },
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const budget = row.original;
        const progress = useBudgetProgress(budget);
        
        return (
          <div className="min-w-[120px]">
            <Flex justify="space-between" align="center" mb="xs">
              <Text size="xs" c="dimmed">
                {progress.percentUsed.toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed">
                PKR {progress.used.toFixed(2)} / PKR {budget.amount.toFixed(2)}
              </Text>
            </Flex>
            <Progress
              value={Math.min(progress.percentUsed, 100)}
              color={getProgressColor(progress.percentUsed, progress.isOverBudget)}
              size="sm"
              radius="xl"
            />
            {progress.isOverBudget && (
              <Text size="xs" c="red" mt={4}>
                Over budget by PKR {(progress.used - budget.amount).toFixed(2)}
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
        const budget = info.row.original;
        const status = getBudgetStatus(budget);
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
        const budget = info.row.original;
        return (
          <div className="text-sm text-gray-500">
            {formatBudgetPeriod(budget.startDate, budget.endDate)}
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
            onClick={() => handleEditBudget(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteBudget(row.original)}
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
          <h2 className="text-red-800 font-semibold">Error loading budgets</h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message || "Failed to load budgets. Please try again."}
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
          <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
          <p className="text-sm text-gray-600 mt-1">
            Set and track spending limits for your categories
          </p>
        </div>
        <Group>
          <Button
            variant="filled"
            onClick={handleAddBudget}
            leftSection={<IconPlus size={16} />}
            size="md"
          >
            Create Budget
          </Button>
        </Group>
      </div>

      {/* Reusable Results Summary */}
      <ResultsSummary
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalBudgets}
        onClearFilters={clearFilters}
        entityName="budgets"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <BudgetCards
            data={filteredBudgets}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            totalItems={totalBudgets}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={filteredBudgets}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalBudgets}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Budget Modal */}
      <AddEditBudgetModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        budget={editingBudget}
      />

      {/* Delete Budget Modal */}
      <BudgetDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        budget={deletingBudget}
      />
    </div>
  );
};

export default BudgetsPage;