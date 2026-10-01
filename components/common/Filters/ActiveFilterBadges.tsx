"use client";

import { Flex, Text, Badge, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFilterBadgesProps {
  filters: ActiveFilter[];
}

export function ActiveFilterBadges({ filters }: ActiveFilterBadgesProps) {
  if (filters.length === 0) return null;

  return (
    <Flex gap="sm" mt="md" wrap="wrap" align="center">
      <Text size="sm" fw={700} className="text-ink">
        Active filters:
      </Text>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          color="green"
          variant="light"
          size="sm"
          rightSection={
            <ActionIcon
              size="xs"
              variant="transparent"
              onClick={filter.onRemove}
            >
              <IconX size={10} />
            </ActionIcon>
          }
        >
          {filter.label}: {filter.value}
        </Badge>
      ))}
    </Flex>
  );
}
