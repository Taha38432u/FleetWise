"use client";

import { ActionIcon, Button, Group } from "@mantine/core";
import {
  IconCalendar,
  IconFilter,
  IconPlus,
  IconRefresh,
  IconRoad,
  IconSearch,
} from "@tabler/icons-react";

export function QuickActions() {
  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200">
      <Group justify="space-between">
        <Group gap="sm">
          <Button
            leftSection={<IconPlus size={18} />}
            className="bg-primary hover:bg-primary-hover"
          >
            Add Vehicle
          </Button>
          <Button leftSection={<IconCalendar size={18} />} variant="outline">
            Schedule
          </Button>
          <Button leftSection={<IconRoad size={18} />} variant="outline">
            Plan Routes
          </Button>
        </Group>

        <Group gap="xs">
          <ActionIcon variant="outline" size="lg">
            <IconRefresh size={18} />
          </ActionIcon>
          <ActionIcon variant="outline" size="lg">
            <IconFilter size={18} />
          </ActionIcon>
          <ActionIcon variant="outline" size="lg">
            <IconSearch size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </div>
  );
}
