"use client";

import { Flex, Text, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface ResultsSummaryProps {
  hasActiveFilters: any;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
  entityName?: string;
}

export function ResultsSummary({
  hasActiveFilters,
  filteredCount,
  totalCount,
  onClearFilters,
  entityName = "items",
}: ResultsSummaryProps) {
  return (
    <Flex justify="space-between" align="center" mb="md">
      <Text fw={500} className="text-gray-700">
        {hasActiveFilters ? (
          <>
            Showing <span className="text-blue-600">{filteredCount}</span> of{" "}
            <span className="text-gray-600">{totalCount}</span> {entityName}
          </>
        ) : (
          <>
            Total: <span className="text-gray-600">{totalCount}</span>{" "}
            {entityName}
          </>
        )}
      </Text>

      {hasActiveFilters && (
        <Button
          variant="subtle"
          color="red"
          size="sm"
          onClick={onClearFilters}
          leftSection={<IconX size={14} />}
        >
          Clear filters
        </Button>
      )}
    </Flex>
  );
}
