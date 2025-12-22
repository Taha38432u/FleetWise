// components/transactions/AddEditTransactionModal.tsx
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
  Textarea,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransactions";
import { useGetAccounts } from "@/hooks/useAccounts";
import { useGetCategories } from "@/hooks/useCategories";
import { CreateTransactionInput, Transaction } from "@/types/api.types";
import { toast } from "react-toastify";
import {
  IconReceipt,
  IconCalendar,
  IconWallet,
  IconCategory,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";


// Validation schema
const TransactionSchema = Yup.object().shape({
  accountId: Yup.number().required("Account is required"),
  categoryId: Yup.number().required("Category is required"),
  type: Yup.string()
    .oneOf(["income", "expense"], "Type must be income or expense")
    .required("Type is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  note: Yup.string().max(500, "Note must be less than 500 characters"),
  date: Yup.date().required("Date is required"),
});

interface AddEditTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  transaction?: Transaction | null;
}

export default function AddEditTransactionModal({
  opened,
  onClose,
  mode,
  transaction,
}: AddEditTransactionModalProps) {
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  // Fetch accounts and categories
  const { data: accountsResponse } = useGetAccounts({
    enabled: opened,
    isPagination: false,
  });
  const { data: categoriesResponse } = useGetCategories({
    enabled: opened,
    isPagination: false,
  });

  const isPending =
    createTransactionMutation.isPending || updateTransactionMutation.isPending;
  const isEdit = mode === "edit";

  const accounts = accountsResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];

  const initialValues: CreateTransactionInput = {
    accountId: transaction?.accountId || 0,
    categoryId: transaction?.categoryId || 0,
    type: transaction?.type || "expense",
    amount: transaction?.amount || 0,
    note: transaction?.note || "",
    date: transaction?.date || new Date().toISOString(),
  };

  const handleSubmit = (values: CreateTransactionInput) => {
    if (isEdit && transaction) {
      updateTransactionMutation.mutate(
        { id: transaction.id, data: values },
        {
          onSuccess: () => {
            toast.success("Transaction updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update transaction");
          },
        }
      );
    } else {
      createTransactionMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Transaction created successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create transaction");
        },
      });
    }
  };

  const handleClose = () => {
    createTransactionMutation.reset();
    updateTransactionMutation.reset();
    onClose();
  };

  const getAccountCurrency = (accountId: number) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account?.currency || "";
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Edit Transaction" : "Add New Transaction"}
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

        <Formik
          initialValues={initialValues}
          validationSchema={TransactionSchema}
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
                {/* Type Selection */}
                <Select
                  label="Transaction Type"
                  placeholder="Select type"
                  data={[
                    { value: "income", label: "💰 Income" },
                    { value: "expense", label: "💸 Expense" },
                  ]}
                  value={values.type}
                  onChange={(value) => setFieldValue("type", value)}
                  error={(touched.type || submitCount > 0) && errors.type}
                  required
                  leftSection={<IconReceipt size={16} />}
                />

                {/* Account Selection */}
                <Select
                  label="Account"
                  placeholder="Select account"
                  data={accounts.map((account) => ({
                    value: account.id.toString(),
                    label: `${account.name} (${
                      account.currency
                    } ${account.balance.toLocaleString()})`,
                  }))}
                  value={values.accountId?.toString() || ""}
                  onChange={(value) =>
                    setFieldValue("accountId", value ? parseInt(value) : 0)
                  }
                  error={
                    (touched.accountId || submitCount > 0) && errors.accountId
                  }
                  required
                  leftSection={<IconWallet size={16} />}
                />

                {/* Category Selection */}
                <Select
                  label="Category"
                  placeholder="Select category"
                  data={categories
                    .filter((cat) => cat.type === values.type)
                    .map((category) => ({
                      value: category.id.toString(),
                      label: category.name,
                      color: category.color,
                    }))}
                  value={values.categoryId?.toString() || ""}
                  onChange={(value) =>
                    setFieldValue("categoryId", value ? parseInt(value) : 0)
                  }
                  error={
                    (touched.categoryId || submitCount > 0) && errors.categoryId
                  }
                  required
                  leftSection={<IconCategory size={16} />}
                />

                {/* Amount */}
                <NumberInput
                  label="Amount"
                  placeholder="0.00"
                  value={values.amount}
                  onChange={(value) => setFieldValue("amount", value)}
                  onBlur={handleBlur}
                  error={(touched.amount || submitCount > 0) && errors.amount}
                  min={0.01}
                  step={0.01}
                  precision={2}
                  required
                  leftSection={
                    <Text size="sm" c="dimmed">
                      {getAccountCurrency(values.accountId)}
                    </Text>
                  }
                />

                {/* Date */}
                <DateInput
                  label="Date"
                  placeholder="Select date"
                  value={values.date ? new Date(values.date) : new Date()}
                  onChange={(date) =>
                    setFieldValue("date", date?.toISOString())
                  }
                  maxDate={new Date()}
                  required
                  leftSection={<IconCalendar size={16} />}
                />

                {/* Note */}
                <Textarea
                  label="Note"
                  placeholder="Add a note (optional)"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="note"
                  rows={3}
                  error={(touched.note || submitCount > 0) && errors.note}
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
                    Preview:
                  </Text>
                  <Flex justify="space-between" align="center">
                    <Text size="sm">
                      {values.type === "income" ? "Income" : "Expense"} •{" "}
                      {getAccountCurrency(values.accountId)}
                    </Text>
                    <Text
                      size="sm"
                      fw={600}
                      className={
                        values.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {values.type === "income" ? "+" : "-"}{" "}
                      {getAccountCurrency(values.accountId)}{" "}
                      {values.amount?.toLocaleString() || "0.00"}
                    </Text>
                  </Flex>
                  {values.note && (
                    <Text size="sm" c="dimmed" mt="xs" truncate>
                      Note: {values.note}
                    </Text>
                  )}
                </Box>

                <Group mt="md" justify="flex-end" gap="sm">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isPending} color="blue">
                    {isEdit ? "Update Transaction" : "Create Transaction"}
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
