"use client";

import React, { useRef } from "react";
import Select, {
  GroupBase,
  Props,
  components,
  DropdownIndicatorProps,
  ClearIndicatorProps,
  ControlProps,
  MenuProps,
  OptionProps,
  SingleValueProps,
  MultiValueProps,
} from "react-select";
import { Tooltip } from "@mantine/core";
import { IconChevronDown, IconX, IconInfoCircle } from "@tabler/icons-react";

interface CustomSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Props<Option, IsMulti, Group> {
  label?: string;
  description?: string;
  error?: any;
  touched?: boolean;
  warning?: boolean;
  size?: "sm" | "md" | "lg";
  withAsterisk?: boolean;
  options: any;
  showValidation?: boolean;
  loading?: boolean;
  className?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

const CustomSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  label,
  description,
  error,
  touched = false,
  warning = false,
  size = "md",
  withAsterisk = false,
  className = "",
  leftSection,
  rightSection,
  ...props
}: CustomSelectProps<Option, IsMulti, Group>) => {
  //   const [focused, setFocused] = useState(false);
  const selectRef = useRef<any>(null);

  const hasError = Boolean(error);
  const showWarning = warning && !hasError;

  const sizeClasses = { sm: "text-sm", md: "text-sm", lg: "text-base" };
  const controlHeight = { sm: 36, md: 44, lg: 50 }; // slightly smaller control

  const getValidationIcon = () => {
    if (hasError) {
      const errorMessage =
        typeof error === "string" ? error : "Invalid selection";
      return (
        <Tooltip label={errorMessage} color="red" withArrow>
          <IconX className="w-5 h-5 text-red-500" />
        </Tooltip>
      );
    }
    if (showWarning) {
      return (
        <Tooltip label="Warning" color="yellow" withArrow>
          <IconInfoCircle className="w-5 h-5 text-yellow-500" />
        </Tooltip>
      );
    }
    return null;
  };

  const DropdownIndicator = (
    props: DropdownIndicatorProps<Option, IsMulti, Group>
  ) => (
    <components.DropdownIndicator {...props}>
      <IconChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${
          props.selectProps.menuIsOpen ? "rotate-180" : ""
        }`}
      />
    </components.DropdownIndicator>
  );

  const ClearIndicator = (
    props: ClearIndicatorProps<Option, IsMulti, Group>
  ) => (
    <components.ClearIndicator {...props}>
      <IconX className="w-4 h-4 hover:text-red-500 transition-colors cursor-pointer" />
    </components.ClearIndicator>
  );

  const Control = ({
    children,
    ...props
  }: ControlProps<Option, IsMulti, Group>) => (
    <components.Control {...props}>
      {leftSection && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {leftSection}
        </div>
      )}
      {rightSection && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          {rightSection}
        </div>
      )}
      {children}
    </components.Control>
  );

  const MenuComp = (props: MenuProps<Option, IsMulti, Group>) => (
    <components.Menu {...props}>
      <div className="rounded-md border border-line bg-white overflow-hidden">
        {props.children}
      </div>
    </components.Menu>
  );

  const OptionComp = (props: OptionProps<Option, IsMulti, Group>) => (
    <components.Option {...props}>
      <div
        className={`px-2 py-1 hover:bg-surface transition-colors ${
          props.isSelected ? "bg-green-50 text-primary" : ""
        }`}
      >
        {props.children}
      </div>
    </components.Option>
  );

  const SingleValue = ({
    children,
    ...props
  }: SingleValueProps<Option, IsMulti, Group>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">{children}</div>
    </components.SingleValue>
  );

  const MultiValue = ({
    children,
    ...props
  }: MultiValueProps<Option, IsMulti, Group>) => (
    <components.MultiValue {...props}>
      <div className="bg-green-100 text-primary px-2 py-0.5 rounded-md text-sm font-medium flex items-center gap-1">
        {children}
      </div>
    </components.MultiValue>
  );

  const validationIcon = getValidationIcon();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block mb-2 text-sm font-semibold ${
            props.isDisabled
              ? "text-muted"
              : hasError
              ? "text-red-600"
              : "text-slate-700"
          }`}
        >
          {label} {withAsterisk && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="mb-2 text-sm text-muted">{description}</p>
      )}

      <div className="relative">
        <Select
          ref={selectRef}
          //   onFocus={() => setFocused(true)}
          //   onBlur={() => setFocused(false)}
          isClearable // enable cross to delete value
          classNamePrefix="react-select"
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: controlHeight[size],
              borderWidth: "2px",
              borderColor: hasError
                ? "#ef4444"
                : showWarning
                ? "#eab308"
                : "#d9e7dc",
              boxShadow: "none",
              "&:hover": {
                borderColor: hasError
                  ? "#ef4444"
                  : showWarning
                  ? "#eab308"
                  : "#15803d",
              },
              paddingLeft: leftSection ? "2.5rem" : "0.5rem",
              paddingRight: "0.5rem",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#9ca3af",
              fontSize: sizeClasses[size],
            }),
            input: (base) => ({
              ...base,
              fontSize: sizeClasses[size],
              color: "#111827",
            }),
            singleValue: (base) => ({
              ...base,
              fontSize: sizeClasses[size],
              color: "#111827",
            }),
            multiValue: (base) => ({ ...base, backgroundColor: "#dcfce7" }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#15803d",
              fontSize: "0.875rem",
              fontWeight: 500,
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#15803d",
              ":hover": { backgroundColor: "#bbf7d0", color: "#dc2626" },
            }),
            indicatorSeparator: () => ({ display: "none" }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: "0.5rem",
              color: "#6b7280",
            }),
            clearIndicator: (base) => ({
              ...base,
              padding: "0.5rem",
              color: "#6b7280",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              marginTop: "0.25rem",
              borderRadius: "0.5rem",
              boxShadow: "none",
              border: "1px solid #d9e7dc",
            }),
            option: (base, state) => ({
              ...base,
              fontSize: "0.875rem",
              padding: "0.25rem 0.5rem", // smaller option
              backgroundColor: state.isSelected
                ? "#f0fdf4"
                : state.isFocused
                ? "#f0fdf4"
                : "#ffffff",
              color: state.isSelected ? "#15803d" : "#111827",
            }),
          }}
          components={{
            DropdownIndicator,
            ClearIndicator,
            Control,
            Menu: MenuComp,
            Option: OptionComp,
            SingleValue,
            MultiValue: props.isMulti ? MultiValue : undefined,
          }}
          {...props}
        />

        {validationIcon && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            {validationIcon}
          </div>
        )}
      </div>

      {hasError && typeof error === "string" && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}

      {showWarning && (
        <p className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
          <IconInfoCircle className="w-4 h-4" /> Please check this field
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
