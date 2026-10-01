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
      radius={14}
      withCloseButton={false}
      zIndex={400}
      transitionProps={{ transition: "pop", duration: 180 }}
      overlayProps={{
        backgroundOpacity: 0.28,
        zIndex: 399,
      }}
      classNames={{
        content: "flex flex-col border border-line bg-white shadow-[0_18px_48px_rgba(16,33,22,0.16)]",
        body: "p-0",
      }}
    >
      <div className="relative flex items-center justify-between border-b border-line px-6 py-5">
        {title && (
          <h3 className="text-xl font-extrabold leading-none tracking-tight text-ink">
            {title}
          </h3>
        )}
        <CloseButton
          onClick={onClose}
          size="lg"
          radius="xl"
          variant="transparent"
          className="text-slate-500 transition-colors duration-200 hover:bg-green-50 hover:text-primary"
          icon={<IconX size={20} stroke={2.5} />}
        />
      </div>

      <div className={title ? "px-6 pb-8 pt-2" : "p-6"}>{children}</div>
    </MantineModal>
  );
};

export default CustomModal;
