"use client";

import { ReactNode } from "react";
import { Flex, Box } from "@mantine/core";

interface FilterControlsProps {
  children: ReactNode;
}

export function FilterControls({ children }: FilterControlsProps) {
  return (
    <Flex gap="lg" align="flex-end" wrap="wrap">
      {children}
    </Flex>
  );
}

interface FilterControlProps {
  children: ReactNode;
  className?: string;
}

export function FilterControl({
  children,
  className = "",
}: FilterControlProps) {
  return <Box className={`flex-1 min-w-[200px] ${className}`}>{children}</Box>;
}
