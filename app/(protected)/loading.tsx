"use client";

import React from "react";
import { Loader, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        padding: 0,
        margin: 0,
      }}
      role="status"
      aria-live="polite"
    >
      <Stack align="center" spacing="xs">
        <Loader size={60} variant="dots" color="indigo" aria-hidden />
        <Text size="lg" weight={700} style={{ lineHeight: 1 }}>
          FleetWise
        </Text>
      </Stack>
    </div>
  );
}
