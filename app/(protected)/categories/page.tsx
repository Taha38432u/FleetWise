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
  IconCalendar,
} from "@tabler/icons-react";
import { useGetCategories } from "@/hooks/useCategories";
import { Category } from "@/types/api.types";
import AddEditCategoryModal from "@/components/categories/AddEditCategoryModal";
import CategoryDeleteModal from "@/components/categories/CategoryDeleteModel";
import {
  FilterSection,
  FilterControls,
  FilterControl,
  ActiveFilterBadges,
  ResultsSummary,
} from "@/components/common/Filters";
import { useMediaQuery, useDebouncedValue } from "@mantine/hooks";

// Mobile Cards Component with Pagination
function CategoryCards({ 
  data, 
  onEdit, 
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
  pageSize,
  totalItems
}: { 
  data: Category[]; 
  onEdit: (category: Category) => void; 
  onDelete: (category: Category) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}) {
  return (
    <div className="space-y-2">
      {/* Cards */}
      <div className="space-y-3 p-2">
        {data.map((category) => (
          <Card
            key={category.id}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            className="hover:shadow-md transition-all duration-200 border-blue-100 bg-white"
          >
            {/* Header with Color and Name */}
            <Flex justify="space-between" align="flex-start" gap="sm" mb="xs">
              <Flex align="center" gap="xs" className="flex-1 min-w-0">
                <div
                  className="w-6 h-6 rounded-full border border-white shadow-sm shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="min-w-0 flex-1">
                  <Text fw={600} size="sm" truncate className="text-gray-900">
                    {category.name}
                  </Text>
                  <Badge
                    color={category.type === "income" ? "green" : "red"}
                    variant="light"
                    size="xs"
                    className="mt-0.5"
                  >
                    {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                  </Badge>
                </div>
              </Flex>

              {/* Actions */}
              <Group gap="xs" className="shrink-0">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => onEdit(category)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(category)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Flex>

            {/* Details */}
            <Flex direction="column" gap="xs" className="mt-2">
              <Flex align="center" gap="xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <Text size="xs" className="text-gray-600 font-mono">
                  {category.color}
                </Text>
              </Flex>
              
              <Flex align="center" gap="xs">
                <IconCalendar size={14} className="text-gray-400" />
                <Text size="xs" className="text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            </Flex>

            {/* Type Indicator Bar */}
            <div
              className={`h-0.5 rounded-full mt-2 ${
                category.type === "income" 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
            />
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
                <IconSearch size={24} className="text-blue-400" />
              </div>
              <Text size="sm" fw={600} className="text-blue-900 mb-1">
                No categories found
              </Text>
              <Text size="xs" className="text-blue-700">
                Try adjusting your search or create a new category
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
            Page {currentPage} of {totalPages} • {data.length} of {totalItems} categories
          </Text>
        </Flex>
      )}
    </div>
  );
}

const CategoriesPage = () => {
  const [addEditModalOpened, setAddEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
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
  const { data: categoriesResponse, isLoading, error } = useGetCategories({
    page: currentPage,
    limit: isMobile ? 5 : 10, // Different limits for mobile/desktop
    search: debouncedNameFilter || undefined,
    type: typeFilter || undefined,
    isPagination: true,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedNameFilter, typeFilter]);

  const handleAddCategory = () => {
    setModalMode("add");
    setEditingCategory(null);
    setAddEditModalOpened(true);
  };

  const handleEditCategory = (category: Category) => {
    setModalMode("edit");
    setEditingCategory(category);
    setAddEditModalOpened(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category);
    setDeleteModalOpened(true);
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpened(false);
    setEditingCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setDeletingCategory(null);
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
    // You can implement server-side sorting here
    // by adding sort parameters to your API call
  };

  const hasActiveFilters = nameFilter || typeFilter;
  const categories = categoriesResponse?.data?.data || [];
  const meta = categoriesResponse?.data?.meta;
  
  const totalCategories = meta?.totalItems || 0;
  const filteredCount = meta?.totalItems || 0; // Server returns filtered total
  const pageCount = meta?.totalPages || 1;
  const currentPageSize = isMobile ? 5 : 10;

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

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => {
        const type = info.getValue() as "income" | "expense";
        return (
          <Badge
            color={type === "income" ? "green" : "red"}
            variant="light"
            size="sm"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: (info) => {
        const color = info.getValue() as string;
        return (
          <Group gap="sm">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600 font-mono">{color}</span>
          </Group>
        );
      },
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
            onClick={() => handleEditCategory(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteCategory(row.original)}
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
            Error loading categories
          </h2>
          <p className="text-red-600 text-sm mt-1">
            {error.message || "Failed to load categories. Please try again."}
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
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your income and expense categories
          </p>
        </div>
        <Button
          variant="filled"
          onClick={handleAddCategory}
          leftSection={<IconPlus size={16} />}
          size="md"
        >
          Add Category
        </Button>
      </div>

      {/* Reusable Filter Section */}
      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalCategories}
        onClearFilters={clearFilters}
        title="Category Filters"
      >
        <FilterControls>
          <FilterControl>
            <Text fw={500} size="sm" mb="xs" className="text-blue-900">
              Search by Name
            </Text>
            <TextInput
              placeholder="Type to search categories..."
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
                { value: "income", label: "💰 Income" },
                { value: "expense", label: "💸 Expense" },
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
        totalCount={totalCategories}
        onClearFilters={clearFilters}
        entityName="categories"
      />

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile Cards View with Server-side Pagination */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CategoryCards 
            data={categories} 
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageCount}
            pageSize={currentPageSize}
            totalItems={totalCategories}
          />
        </div>
      ) : (
        /* Desktop Table View with Server-side Features */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CustomTable
            columns={columns}
            data={categories}
            // Server-side pagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalItems={totalCategories}
            onPageChange={handlePageChange}
            // Server-side sorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
            // Loading state
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <AddEditCategoryModal
        opened={addEditModalOpened}
        onClose={handleCloseAddEditModal}
        mode={modalMode}
        category={editingCategory}
      />

      {/* Delete Category Modal */}
      <CategoryDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        category={deletingCategory}
      />
    </div>
  );
};

export default CategoriesPage;