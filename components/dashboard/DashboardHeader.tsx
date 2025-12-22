"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  SegmentedControl,
  Text,
} from "@mantine/core";
import {
  IconBell,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react";
import { useState } from "react";

export function DashboardHeader({
  timeRange,
  setTimeRange,
}: {
  timeRange: string;
  setTimeRange: (value: string) => void;
}) {
  const [user] = useState({
    name: "Admin User",
    role: "Administrator",
    avatar: "AU",
  });

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <IconTruck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FleetWise</h1>
            <p className="text-xs text-gray-500">
              Operational Intelligence Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <SegmentedControl
            value={timeRange}
            onChange={setTimeRange}
            data={[
              { label: "Today", value: "today" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
              { label: "Quarter", value: "quarter" },
            ]}
            size="sm"
          />

          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconBell size={20} />
            <Badge
              size="xs"
              circle
              color="red"
              className="absolute -top-1 -right-1"
            >
              3
            </Badge>
          </ActionIcon>

          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
              >
                <Group gap="sm">
                  <Avatar color="blue" size="sm">
                    {user.avatar}
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <Text size="sm" fw={500}>
                      {user.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.role}
                    </Text>
                  </div>
                </Group>
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </header>
  );
}
