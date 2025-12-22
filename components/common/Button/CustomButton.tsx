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
  gradient?: {
    from: string;
    to: string;
  };
  customIcon?: ReactNode;
}

const CustomButton = ({
  isLoading = false,
  variant = "default",
  gradient,
  customIcon,
  children,
  ...props
}: CustomButtonProps) => {
  const theme = useMantineTheme();

  const getGradient = () => {
    if (gradient) return gradient;

    switch (variant) {
      case "login":
        return { from: theme.colors.blue[6], to: theme.colors.cyan[6] };
      case "signup":
        return { from: theme.colors.green[6], to: theme.colors.teal[6] };
      case "submit":
        return { from: theme.colors.violet[6], to: theme.colors.grape[6] };
      default:
        return { from: theme.colors.blue[6], to: theme.colors.cyan[6] };
    }
  };

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

  const buttonGradient = getGradient();
  const icon = getIcon();

  return (
    <Button
      fullWidth
      size="md"
      loading={isLoading}
      leftSection={!isLoading && icon}
      styles={{
        root: {
          background: `linear-gradient(135deg, ${buttonGradient.from} 0%, ${buttonGradient.to} 100%)`,
          border: "none",
          borderRadius: theme.radius.md,
          height: 48,
          fontWeight: 600,
          fontSize: theme.fontSizes.sm,
          boxShadow: `0 4px 16px ${buttonGradient.from}33`,
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: `0 6px 20px ${buttonGradient.from}4D`,
          },
          transition: "all 0.2s ease",
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
