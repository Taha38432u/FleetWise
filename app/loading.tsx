"use client";

import React from "react";
import { Loader, Text } from "@mantine/core";

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
      <div className="flex flex-col items-center gap-2">
        <Loader size={60} variant="dots" color="indigo" aria-hidden />
        <Text size="lg" fw={700} style={{ lineHeight: 1 }}>
          FleetWise
        </Text>
      </div>
    </div>
  );
}
