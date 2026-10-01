"use client";

import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { Tooltip } from "@mantine/core";
import {
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconLock,
  IconMail,
  IconSearch,
  IconCalendar,
} from "@tabler/icons-react";

interface CommonInputProps {
  value?: string;
  touched?: boolean;
  error?: any;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email" | "number" | "tel" | "search" | "date" | "datetime-local" | "color";
  id?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  minLength?: number;
  required?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  description?: string;
  warning?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  showValidation?: boolean;
  showCharacterCount?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  autoFocus?: boolean;
  loading?: boolean;
  [x: string]: any;
}

const Input = ({
  value = "",
  touched = false,
  error,
  onChange,
  onBlur,
  onPaste,
  type = "text",
  id,
  label,
  placeholder,
  className = "",
  disabled = false,
  name,
  minLength,
  required = false,
  maxLength,
  icon,
  description,
  warning = false,
  size, // eslint-disable-line @typescript-eslint/no-unused-vars
  variant, // eslint-disable-line @typescript-eslint/no-unused-vars
  radius, // eslint-disable-line @typescript-eslint/no-unused-vars
  showValidation = false,
  showCharacterCount = false,
  leftSection, // eslint-disable-line @typescript-eslint/no-unused-vars
  rightSection,
  autoFocus = false,
  loading = false,
  ...rest
}: CommonInputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const hasError = Boolean(error);
  const isValid = touched && !hasError && value && showValidation;
  const showWarning = warning && !hasError;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e); // Formik marks touched here
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "email":
        return <IconMail className="w-5 h-5" />;
      case "password":
        return <IconLock className="w-5 h-5" />;
      case "search":
        return <IconSearch className="w-5 h-5" />;
      case "date":
        return <IconCalendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const validationIcon = hasError ? (
    <Tooltip label={error} color="red" withArrow>
      <IconX className="w-5 h-5 text-red-500" />
    </Tooltip>
  ) : isValid ? (
    <IconCheck className="w-5 h-5 text-green-500" />
  ) : showWarning ? (
    <Tooltip label="Warning" color="yellow" withArrow>
      <IconInfoCircle className="w-5 h-5 text-yellow-500" />
    </Tooltip>
  ) : null;

  const passwordToggle =
    type === "password" ? (
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-md transition-colors"
        disabled={disabled}
      >
        {showPassword ? (
          <IconEyeOff className="w-5 h-5 text-muted" />
        ) : (
          <IconEye className="w-5 h-5 text-muted" />
        )}
      </button>
    ) : null;

  // Calculate right padding based on elements present
  const rightElementsCount = [
    validationIcon,
    passwordToggle,
    rightSection,
  ].filter(Boolean).length;
  // Base padding + (number of icons * icon width approx)
  const paddingRight =
    rightElementsCount > 0 ? `${rightElementsCount * 2.5 + 0.5}rem` : "";

  const actualType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 text-sm font-semibold ${
            disabled
              ? "text-muted"
              : hasError
              ? "text-red-600"
              : "text-slate-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="mb-2 text-sm text-muted">{description}</p>
      )}

      <div className="relative">
        {getDefaultIcon() && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {getDefaultIcon()}
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type={actualType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setFocused(true)}
          onPaste={onPaste}
          placeholder={placeholder}
          disabled={disabled || loading}
          minLength={minLength}
          maxLength={maxLength}
          // required={required}
          className={`
            w-full h-12 px-4 border-2 rounded-lg
            ${
              hasError
                ? "border-red-500"
                : focused
                ? "border-green-600"
                : "border-line"
            }
            transition-all focus:outline-none
            ${getDefaultIcon() ? "pl-10" : ""}
          `}
          style={{ paddingRight: paddingRight || undefined }}
          {...rest}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {validationIcon}
          {passwordToggle}
          {rightSection}
        </div>
      </div>

      {hasError && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {showCharacterCount && maxLength && (
        <p className="mt-2 text-xs text-muted">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
};

export default Input;
