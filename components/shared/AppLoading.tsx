"use client";

import { Loader, Text } from "@mantine/core";

export function AppLoading() {
  return (
    <div
      className="flex min-h-[100dvh] w-full items-center justify-center bg-surface p-4"
      role="status"
      aria-live="polite"
    >
      <div className="ui-card-compact flex flex-col items-center gap-3 px-8 py-7">
        <Loader size={42} variant="dots" color="green" aria-hidden />
        <Text size="lg" fw={800} className="text-ink">
          FleetWise
        </Text>
      </div>
    </div>
  );
}
