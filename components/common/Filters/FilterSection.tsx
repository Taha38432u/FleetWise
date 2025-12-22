"use client";

import { ReactNode } from "react";
import { Paper, Flex, Text, Badge, Button, Divider, Box } from "@mantine/core";
import { IconFilter, IconFilterOff } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

interface FilterSectionProps {
  children: ReactNode;
  filtersExpanded: boolean;
  setFiltersExpanded: (expanded: boolean) => void;
  hasActiveFilters: any;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
  title?: string;
}

export function FilterSection({
  children,
  filtersExpanded,
  setFiltersExpanded,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onClearFilters,
  title = "Filters",
}: FilterSectionProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Paper
      withBorder
      p={isMobile ? "md" : "lg"}
      mb="xl"
      radius="lg"
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm"
    >
      <Flex
        direction={isMobile ? "column" : "row"}
        justify="space-between"
        align={isMobile ? "flex-start" : "center"}
        mb={filtersExpanded ? "md" : 0}
        gap={isMobile ? "sm" : 0}
      >
        <Flex align="center" gap="sm" wrap="wrap">
          <IconFilter size={isMobile ? 18 : 20} className="text-blue-600" />
          <Text fw={600} size={isMobile ? "md" : "lg"} className="text-blue-900">
            {title}
          </Text>
          {hasActiveFilters && (
            <Badge size={isMobile ? "xs" : "sm"} color="blue" variant="filled">
              {filteredCount} of {totalCount}
            </Badge>
          )}
        </Flex>

        <Flex
          gap={isMobile ? "xs" : "sm"}
          mt={isMobile ? "sm" : 0}
          direction={isMobile ? "column" : "row"}
          w={isMobile ? "100%" : "auto"}
        >
          {hasActiveFilters && (
            <Button
              variant="light"
              color="red"
              size={isMobile ? "xs" : "sm"}
              onClick={onClearFilters}
              leftSection={<IconFilterOff size={isMobile ? 14 : 16} />}
              fullWidth={isMobile}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="subtle"
            size={isMobile ? "xs" : "sm"}
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            rightSection={
              <IconFilter
                size={isMobile ? 14 : 16}
                className={`transform transition-transform ${filtersExpanded ? "rotate-180" : ""}`}
              />
            }
            fullWidth={isMobile}
          >
            {filtersExpanded ? "Hide" : "Show"} Filters
          </Button>
        </Flex>
      </Flex>

      {filtersExpanded && (
        <>
          <Divider mb="md" />
          <Box className="bg-white/50 p-4 rounded-lg border border-blue-100">
            {children}
          </Box>
        </>
      )}
    </Paper>
  );
}
