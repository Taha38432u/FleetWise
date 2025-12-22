"use client";

import React, { ReactNode } from "react";
import { Modal as MantineModal, CloseButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface CustomModalProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  centered?: boolean;
  padding?: number | "xs" | "sm" | "md" | "lg" | "xl";
  overlayOpacity?: number;
}

const CustomModal = ({
  opened,
  onClose,
  title,
  children,
  size = "md",
  closeOnClickOutside = true,
  closeOnEscape = true,
  centered = true,
  padding = "lg", // eslint-disable-line @typescript-eslint/no-unused-vars
  overlayOpacity = 0.2, // eslint-disable-line @typescript-eslint/no-unused-vars
}: CustomModalProps) => {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      size={size}
      centered={centered}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      padding={0}
      radius={24} // rounded-3xl equivalent
      withCloseButton={false}
      transitionProps={{ transition: "pop", duration: 200 }}
      overlayProps={{
        backgroundOpacity: 0.2,
        blur: 8,
      }}
      classNames={{
        content:
          "flex flex-col bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100",
        body: "p-0",
      }}
    >
      {/* Header */}
      <div className="relative px-6 py-5 flex items-center justify-between">
        {title && (
          <h3 className="text-xl font-bold tracking-tight leading-none bg-linear-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h3>
        )}
        <CloseButton
          onClick={onClose}
          size="lg"
          radius="xl"
          variant="transparent"
          className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          icon={<IconX size={20} stroke={2.5} />}
        />
      </div>

      {/* Body */}
      <div className={title ? "px-6 pb-8 pt-2" : "p-6"}>{children}</div>
    </MantineModal>
  );
};

export default CustomModal;
