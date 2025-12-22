"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  Select,
  NumberInput,
  Flex,
  Switch,
  Textarea,
  Badge,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateRecurring, useUpdateRecurring } from "@/hooks/useRecurring";
import { useGetAccounts } from "@/hooks/useAccounts";
import { useGetCategories } from "@/hooks/useCategories";
import {
  CreateRecurringInput,
  RecurringTransaction,
  UpdateRecurringInput,
  Account,
  Category,
} from "@/types/api.types";
import { toast } from "react-toastify";
import {
  IconRefresh,
  IconCalendar,
  IconWallet,
  IconCategory,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/en";
import "@mantine/dates/styles.css";
import formatCurrency from "@/utils/formatCurrency";
import { getFrequencyOptions, getTypeOptions } from "@/utils/recurringUtils";

// Validation schema - use string for form handling, convert to Date in submit
const RecurringSchema = Yup.object().shape({
  accountId: Yup.number()
    .min(1, "Account is required")
    .required("Account is required"),
  categoryId: Yup.number()
    .min(1, "Category is required")
    .required("Category is required"),
  type: Yup.string()
    .oneOf(["income", "expense", "transfer"], "Please select a valid type")
    .required("Type is required"),
  amount: Yup.number()
    .required("Amount is required")
    .min(0.01, "Amount must be greater than 0"),
  frequency: Yup.string()
    .oneOf(
      ["daily", "weekly", "monthly", "yearly"],
      "Please select a valid frequency"
    )
    .required("Frequency is required"),
  nextRunDate: Yup.string().required("Next run date is required"),
  note: Yup.string().max(500, "Note must be less than 500 characters"),
  active: Yup.boolean().default(true),
});

interface AddEditRecurringModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  transaction?: RecurringTransaction | null;
}

export default function AddEditRecurringModal({
  opened,
  onClose,
  mode,
  transaction,
}: AddEditRecurringModalProps) {
  const createRecurringMutation = useCreateRecurring();
  const updateRecurringMutation = useUpdateRecurring();
  const { data: accountsResponse } = useGetAccounts({ enabled: opened });
  const { data: categoriesResponse } = useGetCategories({ enabled: opened });

  const isPending =
    createRecurringMutation.isPending || updateRecurringMutation.isPending;
  const isEdit = mode === "edit";

  const accounts = accountsResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];

  const initialValues: UpdateRecurringInput & { nextRunDate: string } = {
    accountId: transaction?.accountId || 0,
    categoryId: transaction?.categoryId || 0,
    type: transaction?.type || "expense",
    amount: transaction?.amount || 0,
    frequency: transaction?.frequency || "monthly",
    nextRunDate: transaction?.nextRunDate
      ? new Date(transaction.nextRunDate).toISOString().split("T")[0] // Format for date input
      : "",
    note: transaction?.note || "",
    active: transaction?.active ?? true,
  };

  const handleSubmit = (
    values: UpdateRecurringInput & { nextRunDate: string }
  ) => {
    // Convert nextRunDate from string to Date object for backend
    const submitData = {
      ...values,
      nextRunDate: values.nextRunDate
        ? new Date(values.nextRunDate)
        : new Date(),
    };

    if (isEdit && transaction) {
      updateRecurringMutation.mutate(
        { id: transaction.id, data: submitData },
        {
          onSuccess: () => {
            toast.success("Recurring transaction updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(
              error?.message || "Failed to update recurring transaction"
            );
          },
        }
      );
    } else {
      // For creating new recurring transactions
      const createData: CreateRecurringInput = {
        accountId: values.accountId!,
        categoryId: values.categoryId!,
        type: values.type! as "income" | "expense" | "transfer",
        amount: values.amount!,
        frequency: values.frequency! as
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly",
        nextRunDate: values.nextRunDate
          ? new Date(values.nextRunDate)
          : new Date(),
        note: values.note,
        active: values.active,
      };

      createRecurringMutation.mutate(createData, {
        onSuccess: () => {
          toast.success("Recurring transaction created successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "Failed to create recurring transaction"
          );
        },
      });
    }
  };

  const handleClose = () => {
    createRecurringMutation.reset();
    updateRecurringMutation.reset();
    onClose();
  };

  // Helper to format date for display in preview
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get account options
  const getAccountOptions = () => {
    return accounts.map((account: Account) => ({
      value: account.id.toString(),
      label: account.name,
    }));
  };

  // Get category options
  const getCategoryOptions = () => {
    return categories.map((category: Category) => ({
      value: category.id.toString(),
      label: category.name,
    }));
  };

  // Helper to get selected account/category for preview
  const getSelectedAccount = (accountId: number) => {
    return accounts.find((acc) => acc.id === accountId);
  };

  const getSelectedCategory = (categoryId: number) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        isEdit ? "Edit Recurring Transaction" : "Create Recurring Transaction"
      }
      centered
      radius="md"
      size="lg"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={isPending}
          overlayProps={{ blur: 2 }}
          loaderProps={{ type: "bars" }}
        />

        <Text size="sm" color="dimmed" mb="md">
          {isEdit
            ? "Update your recurring transaction details below."
            : "Set up automated recurring transactions to save time."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={RecurringSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            touched,
            submitCount,
          }) => (
            <Form>
              <Flex direction="column" gap="md">
                {/* Account Selection */}
                <Select
                  label="Account"
                  placeholder="Select an account"
                  data={getAccountOptions()}
                  value={values.accountId ? values.accountId.toString() : null}
                  onChange={(value) =>
                    setFieldValue("accountId", value ? parseInt(value) : 0)
                  }
                  error={
                    (touched.accountId || submitCount > 0) && errors.accountId
                  }
                  required
                  searchable
                  nothingFoundMessage="No accounts found"
                  leftSection={<IconWallet size={16} />}
                />

                {/* Category Selection */}
                <Select
                  label="Category"
                  placeholder="Select a category"
                  data={getCategoryOptions()}
                  value={
                    values.categoryId ? values.categoryId.toString() : null
                  }
                  onChange={(value) =>
                    setFieldValue("categoryId", value ? parseInt(value) : 0)
                  }
                  error={
                    (touched.categoryId || submitCount > 0) && errors.categoryId
                  }
                  required
                  searchable
                  nothingFoundMessage="No categories found"
                  leftSection={<IconCategory size={16} />}
                />

                {/* Type Selection */}
                <Select
                  label="Transaction Type"
                  placeholder="Select type"
                  data={getTypeOptions()}
                  value={values.type || null}
                  onChange={(value) => setFieldValue("type", value)}
                  error={(touched.type || submitCount > 0) && errors.type}
                  required
                />

                {/* Amount */}
                <NumberInput
                  label="Amount"
                  placeholder="0.00"
                  value={values.amount || 0}
                  onChange={(value) => setFieldValue("amount", value)}
                  onBlur={handleBlur}
                  error={(touched.amount || submitCount > 0) && errors.amount}
                  min={0.01}
                  step={0.01}
                  precision={2}
                  required
                  leftSection={<IconRefresh size={16} />}
                />

                {/* Frequency */}
                <Select
                  label="Frequency"
                  placeholder="Select frequency"
                  data={getFrequencyOptions()}
                  value={values.frequency || null}
                  onChange={(value) => setFieldValue("frequency", value)}
                  error={
                    (touched.frequency || submitCount > 0) && errors.frequency
                  }
                  required
                />

                {/* Next Run Date */}
                <DateInput
                  label="Next Run Date"
                  placeholder="Select next run date"
                  value={
                    values.nextRunDate
                      ? new Date(values.nextRunDate + "T00:00:00")
                      : null
                  }
                  onChange={(date) => {
                    if (!date) {
                      setFieldValue("nextRunDate", "");
                      return;
                    }

                    let d: Date;

                    // Handle string input from manual typing
                    if (typeof date === "string") {
                      d = new Date(date + "T00:00:00");
                    } else {
                      d = date;
                    }

                    const dateString = d.toISOString().split("T")[0];
                    setFieldValue("nextRunDate", dateString);
                  }}
                  error={
                    (touched.nextRunDate || submitCount > 0) &&
                    errors.nextRunDate
                  }
                  required
                  clearable
                  leftSection={<IconCalendar size={16} />}
                  valueFormat="YYYY-MM-DD"
                />

                {/* Note */}
                <Textarea
                  label="Note (Optional)"
                  placeholder="Add a description for this recurring transaction..."
                  value={values.note || ""}
                  onChange={(event) =>
                    setFieldValue("note", event.currentTarget.value)
                  }
                  onBlur={handleBlur}
                  error={(touched.note || submitCount > 0) && errors.note}
                  rows={3}
                />

                {/* Active Status */}
                <Switch
                  label="Active"
                  description="Enable or disable this recurring transaction"
                  checked={values.active ?? true}
                  onChange={(event) =>
                    setFieldValue("active", event.currentTarget.checked)
                  }
                />

                {/* Preview */}
                <Box
                  p="md"
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Text size="sm" fw={500} mb="xs">
                    Recurring Transaction Preview:
                  </Text>

                  <Flex align="center" gap="sm" mb="xs">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        values.type === "income"
                          ? "bg-green-500"
                          : values.type === "expense"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      <IconRefresh size={14} className="text-white" />
                    </div>
                    <Text size="sm" fw={500}>
                      {formatCurrency(values.amount || 0)}
                    </Text>
                    <Badge
                      color={
                        values.type === "income"
                          ? "green"
                          : values.type === "expense"
                          ? "red"
                          : "blue"
                      }
                      size="xs"
                    >
                      {values.type
                        ? values.type.charAt(0).toUpperCase() +
                          values.type.slice(1)
                        : "Type"}
                    </Badge>
                    {(!values.active || values.active === false) && (
                      <Badge color="gray" size="xs">
                        Paused
                      </Badge>
                    )}
                  </Flex>

                  <Flex direction="column" gap="xs">
                    <Flex justify="space-between">
                      <Text size="sm" c="dimmed">
                        Account:
                      </Text>
                      <Text size="sm">
                        {getSelectedAccount(values.accountId || 0)?.name ||
                          "Not selected"}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text size="sm" c="dimmed">
                        Category:
                      </Text>
                      <Text size="sm">
                        {getSelectedCategory(values.categoryId || 0)?.name ||
                          "Not selected"}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text size="sm" c="dimmed">
                        Frequency:
                      </Text>
                      <Text size="sm">
                        {values.frequency
                          ? values.frequency.charAt(0).toUpperCase() +
                            values.frequency.slice(1)
                          : "Not selected"}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text size="sm" c="dimmed">
                        Next Run:
                      </Text>
                      <Text size="sm">
                        {formatDateForDisplay(values.nextRunDate || "")}
                      </Text>
                    </Flex>
                    {values.note && (
                      <Flex direction="column">
                        <Text size="sm" c="dimmed">
                          Note:
                        </Text>
                        <Text size="sm" className="mt-1">
                          {values.note}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>

                <Group mt="md" justify="flex-end" gap="sm">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isPending} color="orange">
                    {isEdit ? "Update Recurring" : "Create Recurring"}
                  </Button>
                </Group>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
