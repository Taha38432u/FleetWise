"use client";

import {
  Table,
  Box,
  Stack,
  Text,
  Flex,
  Paper,
  Badge,
  Pagination,
  LoadingOverlay,
  Skeleton,
  Group,
} from "@mantine/core";
import {
  IconSearch,
} from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import clsx from "clsx";
import classes from "./CustomTable.module.css";

interface CustomTableProps<T extends object> {
  columns: ColumnDef<T, any>[];
  data: T[];
  // Server-side pagination props
  pageCount?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  // Server-side sorting props
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  className?: string;
  // Loading state
  isLoading?: boolean;
  // Optional title
  title?: string;
  // Optional description
  description?: string;
}

export function CustomTable<T extends object>({
  columns,
  data,
  // Server-side pagination
  pageCount = 1,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  onSortingChange,
  className,
  isLoading = false,
  title,
  description,
}: CustomTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    // state: {
    //   sorting: onSortingChange ? sorting : localSorting,
    // },
    // onSortingChange: onSortingChange ? handleSortingChange : setLocalSorting,
    getSortedRowModel: getSortedRowModel(),
    // Server-side features
    manualPagination: true,
    manualSorting: !!onSortingChange,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    debugTable: false,
  });

  const rows = table.getRowModel().rows;

  return (
    <Box className={clsx(classes.tableRoot, className)}>
      {/* Header with title and description */}
      {(title || description) && (
        <Box className={classes.tableHeaderSection}>
          {title && (
            <Text className={classes.tableTitle} size="xl" fw={700}>
              {title}
            </Text>
          )}
          {description && (
            <Text className={classes.tableDescription} size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Box>
      )}

      {/* Table container with premium styling */}
      <Paper className={classes.premiumTableContainer} withBorder radius="lg">
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2, radius: "lg" }}
          loaderProps={{ type: "bars" }}
        />

        <Box className={classes.tableScrollWrapper}>
          <Table className={classes.premiumTable} highlightOnHover>
            <thead className={classes.premiumTableHead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={classes.premiumTableHeaderCell}
                        style={{
                          width: header.getSize() ?? undefined,
                        }}
                      >
                        <Flex
                          align="center"
                          gap="xs"
                          className={classes.headerContent}
                        >
                          <Text
                            className={clsx(
                              classes.headerText,
                              canSort && classes.sortableHeader
                            )}
                            size="sm"
                            fw={600}
                            truncate
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Text>

                          {isSorted && (
                            <Badge
                              size="xs"
                              variant="light"
                              className={classes.sortBadge}
                            >
                              {isSorted === "asc" ? "A-Z" : "Z-A"}
                            </Badge>
                          )}
                        </Flex>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className={classes.premiumTableBody}>
              {isLoading && rows.length === 0 ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={classes.skeletonRow}>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className={classes.premiumTableCell}>
                        <Skeleton height={20} radius="sm" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={columns.length} className={classes.emptyState}>
                    <Stack align="center" gap="md" p="xl">
                      <Box className={classes.emptyStateIconWrapper}>
                        <IconSearch
                          size={48}
                          className={classes.emptyStateIcon}
                        />
                      </Box>
                      <Stack align="center" gap="xs">
                        <Text size="lg" fw={600}>
                          No results found
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          No data matches your current filters or search
                          criteria
                        </Text>
                      </Stack>
                    </Stack>
                  </td>
                </tr>
              ) : (
                // Data rows
                rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={clsx(
                      classes.premiumTableRow,
                      rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={classes.premiumTableCell}
                        style={{
                          width: cell.column.getSize() ?? undefined,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Box>
      </Paper>

      {/* Premium Footer with Pagination */}
      {rows.length > 0 && !isLoading && (
        <Paper className={classes.premiumFooter} withBorder radius="lg" mt="md">
          <Flex justify="space-between" align="center" p="md">
            <Stack gap={2}>
              <Text size="sm" fw={500}>
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, totalItems)} entries
              </Text>
              <Text size="xs" c="dimmed">
                Total: {totalItems.toLocaleString()} records
              </Text>
            </Stack>

            <Group gap="xs">
              <Pagination
                value={currentPage}
                onChange={onPageChange}
                total={Math.max(1, pageCount)}
                radius="md"
                withEdges
                siblings={2}
                boundaries={2}
                classNames={{
                  control: classes.paginationControl,
                  dots: classes.paginationDots,
                }}
              />

              {pageCount > 1 && (
                <Text size="sm" c="dimmed" ml="sm">
                  Page {currentPage} of {pageCount}
                </Text>
              )}
            </Group>
          </Flex>
        </Paper>
      )}
    </Box>
  );
}
