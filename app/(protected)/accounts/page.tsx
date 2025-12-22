// app/accounts/page.tsx
"use client";

import TransferMoneyModal from "@/components/accounts/TransferMoneyModal";
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
  IconWallet,
  IconTransfer,
  IconCalendar,
  //   IconCurrencyDollar,
} from "@tabler/icons-react";
import { useGetAccounts } from "@/hooks/useAccounts";
import { Account } from "@/types/api.types";
import AddEditAccountModal from "@/components/accounts/AddEditAccountModal";
import AccountDeleteModal from "@/components/accounts/AccountDeleteModal";
import {
  FilterSection,
  FilterControls,
  FilterControl,
  ActiveFilterBadges,
  ResultsSummary,
} from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";

// Mobile Cards Component with Pagination
function AccountCards({
  data,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
}: {
  data: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
}) {
  return (
    <div className="space-y-2">
      {/* Cards */}
      <div className="space-y-3 p-2">
        {data.map((account) => (
          <Card
            key={account.id}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            className="hover:shadow-md transition-all duration-200 border-blue-100 bg-white"
          >
            {/* Header with Icon and Name */}
            <Flex justify="space-between" align="flex-start" gap="sm" mb="xs">
              <Flex align="center" gap="xs" className="flex-1 min-w-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <IconWallet size={16} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text fw={600} size="sm" truncate className="text-gray-900">
                    {account.name}
                  </Text>
                  <Badge
                    color={getAccountTypeColor(account.type)}
                    variant="light"
                    size="xs"
                    className="mt-0.5"
                  >
                    {account.type.charAt(0).toUpperCase() +
                      account.type.slice(1)}
                  </Badge>
                </div>
              </Flex>

              {/* Actions */}
              <Group gap="xs" className="shrink-0">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => onEdit(account)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(account)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Flex>

            {/* Balance - Stack vertically on mobile */}
            <Flex direction="column" gap="xs" mt="sm">
              <Text size="xs" c="dimmed" className="font-medium">
                Current Balance
              </Text>
              <Text fw={700} size="lg" className="text-green-600">
                {account.currency}{" "}
                {account.balance?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Flex>

            {/* Details - Stack horizontally with reduced space */}
            <Flex justify="space-between" align="center" mt="sm" gap="xs">
              <Text size="xs" c="dimmed">
                Currency
              </Text>
              <Badge variant="outline" size="xs">
                {account.currency}
              </Badge>
            </Flex>

            {/* Created Date */}
            <Flex align="center" gap="xs" mt="xs">
              <IconCalendar size={12} className="text-gray-400" />
              <Text size="xs" c="dimmed">
                {new Date(account.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
          </Card>
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
                <IconWallet size={24} className="text-blue-400" />
              </div>
              <Text size="sm" fw={600} className="text-blue-900 mb-1">
                No accounts found
              </Text>
              <Text size="xs" className="text-blue-700">
                Try adjusting your search or create a new account
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
              control: 'data-active:bg-blue-600 data-active:border-blue-600 text-xs',
            }}
          />
        </Flex>
      )}

      {/* Mobile Page Info */}
      {data.length > 0 && (
        <Flex justify="center" p="xs" className="bg-gray-50 border-t border-gray-100">
          <Text size="xs" c="dimmed" className="text-center px-2">
            Page {currentPage} of {totalPages} • {data.length} of {totalItems} accounts
          </Text>
        </Flex>
      )}
    </div>
  );
}

// Helper function for account type colors
function getAccountTypeColor(type: string) {
  const colors: { [key: string]: string } = {
    checking: "blue",
    savings: "green",
    credit: "orange",
    investment: "purple",
    cash: "gray",
  };
  return colors[type] || "gray";
}

const AccountsPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [transferModalOpened, setTransferModalOpened] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debounce search to avoid too many API calls
  const [debouncedNameFilter] = useDebouncedValue(nameFilter, 500);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Server-side query with filters and pagination
  const {
    data: accountsResponse,
    isLoading,
    error,
  } = useGetAccounts({
    page: currentPage,
    limit: isMobile ? 5 : 10,
    search: debouncedNameFilter || undefined,
    type: typeFilter || undefined,
    isPagination: true,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedNameFilter, typeFilter]);

  const handleAddAccount = () => {
    setModalMode("add");
    setEditingAccount(null);
    setAddEditModalOpened(true);
  };

  const handleEditAccount = (account: Account) => {
    setModalMode("edit");
    setEditingAccount(account);
    setAddEditModalOpened(true);
  };

  const handleDeleteAccount = (account: Account) => {
    setDeletingAccount(account);
    setDeleteModalOpened(true);
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpened(false);
    setEditingAccount(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setDeletingAccount(null);
  };

  const clearFilters = () => {
    setNameFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
  };

  const hasActiveFilters = nameFilter || typeFilter;
  const accounts = accountsResponse?.data?.data || [];
  const meta = accountsResponse?.data?.meta;

  const totalAccounts = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0;
  const pageCount = meta?.totalPages || 1;

  // Active filters for badges
  const activeFilters = [
    ...(nameFilter
      ? [
          {
            key: "name",
            label: "Name",
            value: nameFilter,
            onRemove: () => setNameFilter(""),
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
  ];

  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "name",
      header: "Account Name",
      cell: (info) => (
        <Flex align="center" gap="sm">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <IconWallet size={16} className="text-white" />
          </div>
          <div className="font-medium text-gray-900">
            {info.getValue() as string}
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
          <Badge color={getAccountTypeColor(type)} variant="light" size="sm">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: (info) => {
        const account = info.row.original;
        return (
          <Text fw={600} className="text-green-600">
            {account.currency}{" "}
            {account.balance?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: (info) => (
        <Badge variant="outline" size="sm">
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString()}
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
            onClick={() => handleEditAccount(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteAccount(row.original)}
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
          <h2 className="text-red-800 font-semibold">Error loading accounts</h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message || "Failed to load accounts. Please try again."}
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
          <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your bank accounts and track balances
          </p>
        </div>
        <Group>
          <Button
            variant="light"
            onClick={() => setTransferModalOpened(true)}
            leftSection={<IconTransfer size={16} />}
            size="md"
            disabled={accounts.length < 2}
          >
            Transfer Money
          </Button>
          <Button
            variant="filled"
            onClick={handleAddAccount}
            leftSection={<IconPlus size={16} />}
            size="md"
          >
            Add Account
          </Button>
        </Group>
      </div>

      {/* Reusable Filter Section */}
      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalAccounts}
        onClearFilters={clearFilters}
        title="Account Filters"
      >
        <FilterControls>
          <FilterControl>
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Search by Name
            </Text>
            <TextInput
              placeholder="Type to search accounts..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              leftSection={<IconSearch size={18} className="text-blue-500" />}
              rightSection={
                nameFilter ? (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => setNameFilter("")}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              size="md"
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Filter by Type
            </Text>
            <Select
              placeholder="All types"
              data={[
                { value: "checking", label: "🏦 Checking" },
                { value: "savings", label: "💰 Savings" },
                { value: "credit", label: "💳 Credit" },
                { value: "investment", label: "📈 Investment" },
                { value: "cash", label: "💵 Cash" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
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
        totalCount={totalAccounts}
        onClearFilters={clearFilters}
        entityName="accounts"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <AccountCards
            data={accounts}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            totalItems={totalAccounts}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={accounts}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalAccounts}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Account Modal */}
      <AddEditAccountModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        account={editingAccount}
      />

      {/* Delete Account Modal */}
      <AccountDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        account={deletingAccount}
      />

      <TransferMoneyModal
        opened={transferModalOpened}
        onClose={() => setTransferModalOpened(false)}
        accounts={accounts}
      />
    </div>
  );
};

export default AccountsPage;
