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
  Switch,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconWallet,
  IconCategory,
  IconCalendar,
} from "@tabler/icons-react";
import {
  useGetRecurringTransactions,
  useUpdateRecurring,
} from "@/hooks/useRecurring";
import { RecurringTransaction } from "@/types/api.types";
import AddEditRecurringModal from "@/components/recurring/AddEditRecurringModel";
import RecurringDeleteModal from "@/components/recurring/RecurringDeleteModal";
import { RecurringCards } from "@/components/recurring/RecurringCards";
import { ResultsSummary } from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";
import { useRecurringTransactionInfo } from "@/hooks/useRecurring";
import formatCurrency from "@/utils/formatCurrency";
import { formatNextRunDate, getRecurringStatus } from "@/utils/recurringUtils";

// Helper function for status colors
function getStatusColor(status: string) {
  const colors: { [key: string]: string } = {
    active: "green",
    paused: "gray",
    overdue: "red",
  };
  return colors[status] || "gray";
}

const RecurringPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<RecurringTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<RecurringTransaction | null>(null);
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
    data: recurringResponse,
    isLoading,
    error,
  } = useGetRecurringTransactions({
    page: currentPage,
    limit: isMobile ? 5 : 10,
    search: debouncedSearchFilter || undefined,
    isPagination: true,
  });

  const updateRecurringMutation = useUpdateRecurring();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, statusFilter]);

  const handleAddRecurring = () => {
    setModalMode("add");
    setEditingTransaction(null);
    setAddEditModalOpened(true);
  };

  const handleEditRecurring = (transaction: RecurringTransaction) => {
    setModalMode("edit");
    setEditingTransaction(transaction);
    setAddEditModalOpened(true);
  };

  const handleDeleteRecurring = (transaction: RecurringTransaction) => {
    setDeletingTransaction(transaction);
    setDeleteModalOpened(true);
  };

  const handleToggleActive = (id: number, active: boolean) => {
    updateRecurringMutation.mutate({
      id,
      data: { active },
    });
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpened(false);
    setEditingTransaction(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setDeletingTransaction(null);
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
  const recurringTransactions = recurringResponse?.data || [];
  const meta = recurringResponse?.data?.meta;

  const totalRecurring = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0;
  const pageCount = meta?.totalPages || 1;

  // Filter recurring transactions by status on client-side for now
  const filteredTransactions = statusFilter
    ? recurringTransactions.filter((transaction) => {
        const status = getRecurringStatus(transaction);
        return status.status === statusFilter;
      })
    : recurringTransactions;

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

  const columns: ColumnDef<RecurringTransaction>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Flex align="center" gap="sm">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                transaction.type === "income"
                  ? "bg-green-500"
                  : transaction.type === "expense"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              <IconRefresh size={16} className="text-white" />
            </div>
            <div>
              <Text
                fw={600}
                className={
                  transaction.type === "income"
                    ? "text-green-600"
                    : transaction.type === "expense"
                    ? "text-red-600"
                    : "text-blue-600"
                }
              >
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
              >
                {transaction.type}
              </Badge>
            </div>
          </Flex>
        );
      },
    },
    {
      accessorKey: "account.name",
      header: "Account",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Flex align="center" gap="sm">
            <IconWallet size={16} className="text-gray-400" />
            <Text>{transaction.account?.name}</Text>
          </Flex>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Flex align="center" gap="sm">
            <IconCategory size={16} className="text-gray-400" />
            <Text>{transaction.category?.name}</Text>
          </Flex>
        );
      },
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: (info) => {
        const frequency = info.getValue() as string;
        return (
          <Badge variant="outline" size="sm">
            {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "nextRunDate",
      header: "Next Run",
      cell: (info) => {
        const transaction = info.row.original;
        const infoData = useRecurringTransactionInfo(transaction);
        return (
          <Flex direction="column" gap="xs">
            <Text size="sm">{formatNextRunDate(transaction.nextRunDate)}</Text>
            {infoData.isOverdue && transaction.active && (
              <Text size="xs" c="red">
                {infoData.daysUntilNextRun} days ago
              </Text>
            )}
            {!infoData.isOverdue && transaction.active && (
              <Text size="xs" c="dimmed">
                in {infoData.daysUntilNextRun} days
              </Text>
            )}
          </Flex>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const transaction = info.row.original;
        const status = getRecurringStatus(transaction);
        return (
          <Flex align="center" gap="sm">
            <Switch
              size="sm"
              checked={transaction.active}
              onChange={(event) =>
                handleToggleActive(transaction.id, event.currentTarget.checked)
              }
            />
            <Badge
              color={getStatusColor(status.status)}
              variant="light"
              size="sm"
            >
              {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
            </Badge>
          </Flex>
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
            onClick={() => handleEditRecurring(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteRecurring(row.original)}
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
          <h2 className="text-red-800 font-semibold">
            Error loading recurring transactions
          </h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message ||
              "Failed to load recurring transactions. Please try again."}
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Recurring Transactions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Automate your regular income and expenses with scheduled
            transactions
          </p>
        </div>
        <Group>
          <Button
            variant="filled"
            onClick={handleAddRecurring}
            leftSection={<IconPlus size={16} />}
            size="md"
            color="orange"
          >
            Create Recurring
          </Button>
        </Group>
      </div>

      {/* Reusable Results Summary */}
      <ResultsSummary
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalRecurring}
        onClearFilters={clearFilters}
        entityName="recurring transactions"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <RecurringCards
            data={filteredTransactions}
            onEdit={handleEditRecurring}
            onDelete={handleDeleteRecurring}
            onToggleActive={handleToggleActive}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            totalItems={totalRecurring}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={filteredTransactions}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalRecurring}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Recurring Modal */}
      <AddEditRecurringModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        transaction={editingTransaction}
      />

      {/* Delete Recurring Modal */}
      <RecurringDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        transaction={deletingTransaction}
      />
    </div>
  );
};

export default RecurringPage;
