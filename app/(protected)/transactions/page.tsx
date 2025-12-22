// app/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Group,
  Button,
  Loader,
  Text,
  Card,
  Flex,
  useMantineTheme,
  Pagination,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconX,
  IconReceipt,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { useGetTransactions } from "@/hooks/useTransactions";
import { useGetAccounts } from "@/hooks/useAccounts";
import { useGetCategories } from "@/hooks/useCategories";
import { Transaction } from "@/types/api.types";
import AddEditTransactionModal from "@/components/transactions/AddEditTransactionModal";
import TransactionDeleteModal from "@/components/transactions/TransactionDeleteModal";
import {
  FilterSection,
  FilterControls,
  FilterControl,
  ActiveFilterBadges,
  ResultsSummary,
} from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";

// Mobile Cards Component with Pagination
function TransactionCards({
  data,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
}: {
  data: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
}) {
  const getTypeColor = (type: string) => (type === "income" ? "green" : "red");
  const getTypeIcon = (type: string) =>
    type === "income" ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />;

  return (
    <div className="space-y-3 p-2">
      {data.map((transaction) => (
        <Card
          key={transaction.id}
          shadow="xs"
          padding="sm"
          radius="md"
          withBorder
          className="hover:shadow-md transition-all duration-150 border-gray-200 bg-white"
        >
          {/* Top row: Note and Amount */}
          <Flex justify="space-between" align="center">
            <div className="flex-1 min-w-0">
              <Text fw={600} size="sm" lineClamp={1}>
                {transaction.note || "No description"}
              </Text>
              <Badge
                color={getTypeColor(transaction.type)}
                variant="light"
                size="xs"
                className="mt-1"
              >
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </Badge>
            </div>

            <Text fw={700} size="md" className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
              {transaction.type === "income" ? "+" : "-"} {transaction.account?.currency}{" "}
              {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Flex>

          {/* Middle row: Account & Category */}
          <Flex justify="space-between" mt={4}>
            <Text size="xs" c="dimmed">
              {transaction.account?.name || "No Account"}
            </Text>
            <Flex align="center" gap={4}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: transaction.category?.color || "#ccc",
                }}
              />
              <Text size="xs" c="dimmed">
                {transaction.category?.name || "No Category"}
              </Text>
            </Flex>
          </Flex>

          {/* Bottom row: Date & Actions */}
          <Flex justify="space-between" align="center" mt={6}>
            <Text size="xs" c="dimmed">
              {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Group spacing={4}>
              <ActionIcon size="sm" variant="light" color="blue" onClick={() => onEdit(transaction)}>
                <IconEdit size={14} />
              </ActionIcon>
              <ActionIcon size="sm" variant="light" color="red" onClick={() => onDelete(transaction)}>
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          </Flex>
        </Card>
      ))}

      {data.length === 0 && (
        <Card shadow="xs" padding="xl" radius="md" withBorder className="text-center border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <IconReceipt size={24} className="text-gray-400" />
            </div>
            <Text size="sm" fw={600} className="text-gray-800 mb-1">
              No transactions
            </Text>
            <Text size="xs" className="text-gray-600">
              Adjust filters or add a new transaction
            </Text>
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <Flex justify="center" p="sm">
          <Pagination value={currentPage} onChange={onPageChange} total={totalPages} size="sm" withEdges />
        </Flex>
      )}
    </div>
  );
}


const TransactionsPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("");
  const [accountFilter, setAccountFilter] = useState<string | null>("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>("");
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debounce search to avoid too many API calls
  const [debouncedSearchFilter] = useDebouncedValue(searchFilter, 500);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Fetch accounts and categories for filters
  const { data: accountsResponse } = useGetAccounts({ 
    enabled: true,
    isPagination: false 
  });
  const { data: categoriesResponse } = useGetCategories({ 
    enabled: true,
    isPagination: false 
  });

  // Server-side query with filters and pagination
  const {
    data: transactionsResponse,
    isLoading,
    error,
  } = useGetTransactions({
    page: currentPage,
    limit: isMobile ? 5 : 10,
    search: debouncedSearchFilter || undefined,
    type: typeFilter || undefined,
    accountId: accountFilter ? Number(accountFilter) : undefined,
    categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    startDate: startDateFilter?.toISOString().split('T')[0],
    endDate: endDateFilter?.toISOString().split('T')[0],
    isPagination: true,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, typeFilter, accountFilter, categoryFilter, startDateFilter, endDateFilter]);

  const handleAddTransaction = () => {
    setModalMode("add");
    setEditingTransaction(null);
    setAddEditModalOpened(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setModalMode("edit");
    setEditingTransaction(transaction);
    setAddEditModalOpened(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setDeleteModalOpened(true);
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
    setTypeFilter("");
    setAccountFilter("");
    setCategoryFilter("");
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
  };

  const hasActiveFilters = searchFilter || typeFilter || accountFilter || categoryFilter || startDateFilter || endDateFilter;
  const transactions = transactionsResponse?.data?.data || [];
  const meta = transactionsResponse?.data?.meta;

  const totalTransactions = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0;
  const pageCount = meta?.totalPages || 1;

  const accounts = accountsResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];

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
    ...(typeFilter
      ? [
          {
            key: "type",
            label: "Type",
            value: typeFilter,
            onRemove: () => setTypeFilter(""),
          },
        ]
      : []),
    ...(accountFilter
      ? [
          {
            key: "account",
            label: "Account",
            value: accounts.find(acc => acc.id.toString() === accountFilter)?.name || accountFilter,
            onRemove: () => setAccountFilter(""),
          },
        ]
      : []),
    ...(categoryFilter
      ? [
          {
            key: "category",
            label: "Category",
            value: categories.find(cat => cat.id.toString() === categoryFilter)?.name || categoryFilter,
            onRemove: () => setCategoryFilter(""),
          },
        ]
      : []),
    ...(startDateFilter
      ? [
          {
            key: "startDate",
            label: "From",
            value: startDateFilter.toLocaleDateString(),
            onRemove: () => setStartDateFilter(null),
          },
        ]
      : []),
    ...(endDateFilter
      ? [
          {
            key: "endDate",
            label: "To",
            value: endDateFilter.toLocaleDateString(),
            onRemove: () => setEndDateFilter(null),
          },
        ]
      : []),
  ];

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "note",
      header: "Description",
      cell: (info) => (
        <Flex align="center" gap="sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            info.row.original.type === "income" 
              ? "bg-green-100 text-green-600" 
              : "bg-red-100 text-red-600"
          }`}>
            {info.row.original.type === "income" ? 
              <IconTrendingUp size={16} /> : 
              <IconTrendingDown size={16} />
            }
          </div>
          <div className="font-medium text-gray-900">
            {info.getValue() as string || "No description"}
          </div>
        </Flex>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => {
        const type = info.getValue() as string;
        return (
          <Badge 
            color={type === "income" ? "green" : "red"} 
            variant="light" 
            size="sm"
            leftSection={type === "income" ? "↑" : "↓"}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Text 
            fw={600} 
            className={transaction.type === "income" ? "text-green-600" : "text-red-600"}
          >
            {transaction.type === "income" ? "+" : "-"}{" "}
            {transaction.account?.currency} {transaction.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: "account.name",
      header: "Account",
      cell: (info) => (
        <Badge variant="outline" size="sm">
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Flex align="center" gap="xs">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: transaction.category?.color || '#ccc',
              }}
            />
            <Text size="sm">{transaction.category?.name}</Text>
          </Flex>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString()}
            <br />
            <Text size="xs" c="dimmed">
              {date.toLocaleTimeString()}
            </Text>
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
            onClick={() => handleEditTransaction(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteTransaction(row.original)}
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
          <h2 className="text-red-800 font-semibold">Error loading transactions</h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message || "Failed to load transactions. Please try again."}
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
          <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your income and expense transactions
          </p>
        </div>
        <Group>
          <Button
            variant="filled"
            onClick={handleAddTransaction}
            leftSection={<IconPlus size={16} />}
            size="md"
          >
            Add Transaction
          </Button>
        </Group>
      </div>

      {/* Reusable Filter Section */}
      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalTransactions}
        onClearFilters={clearFilters}
        title="Transaction Filters"
      >
        <FilterControls>
          <FilterControl>
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Search Notes
            </Text>
            <TextInput
              placeholder="Search transaction notes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              leftSection={<IconSearch size={18} className="text-blue-500" />}
              rightSection={
                searchFilter ? (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => setSearchFilter("")}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[150px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Type
            </Text>
            <Select
              placeholder="All types"
              data={[
                { value: "income", label: "💰 Income" },
                { value: "expense", label: "💸 Expense" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Account
            </Text>
            <Select
              placeholder="All accounts"
              data={accounts.map(account => ({
                value: account.id.toString(),
                label: account.name,
              }))}
              value={accountFilter}
              onChange={setAccountFilter}
              clearable
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Category
            </Text>
            <Select
              placeholder="All categories"
              data={categories.map(category => ({
                value: category.id.toString(),
                label: category.name,
              }))}
              value={categoryFilter}
              onChange={setCategoryFilter}
              clearable
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[150px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              From Date
            </Text>
            <DateInput
              placeholder="Start date"
              value={startDateFilter}
              onChange={setStartDateFilter}
              maxDate={endDateFilter || new Date()}
              clearable
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[150px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              To Date
            </Text>
            <DateInput
              placeholder="End date"
              value={endDateFilter}
              onChange={setEndDateFilter}
              minDate={startDateFilter || undefined}
              maxDate={new Date()}
              clearable
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[120px]">
            <Button
              variant="light"
              color="blue"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              leftSection={<IconX size={16} />}
              fullWidth
              size="md"
            >
              Reset
            </Button>
          </FilterControl>
        </FilterControls>

        <ActiveFilterBadges filters={activeFilters} />
      </FilterSection>

      {/* Reusable Results Summary */}
      <ResultsSummary
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalTransactions}
        onClearFilters={clearFilters}
        entityName="transactions"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <TransactionCards
            data={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            totalItems={totalTransactions}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={transactions}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalTransactions}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Transaction Modal */}
      <AddEditTransactionModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        transaction={editingTransaction}
      />

      {/* Delete Transaction Modal */}
      <TransactionDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        transaction={deletingTransaction}
      />
    </div>
  );
};

export default TransactionsPage;