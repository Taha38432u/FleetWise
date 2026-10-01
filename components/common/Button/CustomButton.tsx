"use client";

import { Button, ButtonProps, useMantineTheme } from "@mantine/core";
import {
  IconShieldLock,
  IconWallet,
  IconUser,
  IconLogin,
} from "@tabler/icons-react";
import { ReactNode } from "react";

type ButtonVariant = "login" | "signup" | "submit" | "default";

interface CustomButtonProps extends Omit<ButtonProps, "style"> {
  isLoading?: boolean;
  variant?: ButtonVariant;
  type?: any;
  customIcon?: ReactNode;
}

const CustomButton = ({
  isLoading = false,
  variant = "default",
  customIcon,
  children,
  ...props
}: CustomButtonProps) => {
  const theme = useMantineTheme();

  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (variant) {
      case "login":
        return <IconLogin size={18} />;
      case "signup":
        return <IconUser size={18} />;
      case "submit":
        return <IconShieldLock size={18} />;
      default:
        return <IconWallet size={18} />;
    }
  };

  const icon = getIcon();

  return (
    <Button
      fullWidth
      size="md"
      loading={isLoading}
      leftSection={!isLoading && icon}
      styles={{
        root: {
          background: theme.colors.green[7],
          border: `1px solid ${theme.colors.green[7]}`,
          borderRadius: theme.radius.md,
          height: 48,
          fontWeight: 600,
          fontSize: theme.fontSizes.sm,
          "&:hover": {
            background: theme.colors.green[8],
            borderColor: theme.colors.green[8],
          },
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        },
        label: {
          display: "flex",
          alignItems: "center",
          gap: 8,
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
