// components/accounts/AddEditAccountModal.tsx
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
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { CurrencySelect } from "../common/CurrencySelect";
import { useCreateAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { CreateAccountInput, Account } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconWallet, IconCurrencyDollar } from "@tabler/icons-react";

// Validation schema
const AccountSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  type: Yup.string()
    .oneOf(
      ["checking", "savings", "credit", "investment", "cash"],
      "Please select a valid account type"
    )
    .required("Type is required"),
  balance: Yup.number()
    .required("Balance is required")
    .min(0, "Balance cannot be negative"),
  currency: Yup.string().default("PKR"),
});

interface AddEditAccountModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  account?: Account | null;
}

// Helper function to format currency display
function formatCurrencyDisplay(currency: string, amount: number) {
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(amount);

  // Add currency symbols
  const symbols: { [key: string]: string } = {
    PKR: "₨",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CNY: "¥",
    KRW: "₩",
    RUB: "₽",
    TRY: "₺",
    BRL: "R$",
    CAD: "C$",
    AUD: "A$",
    SGD: "S$",
    NZD: "NZ$",
    CHF: "CHF",
    HKD: "HK$",
    MXN: "Mex$",
    PHP: "₱",
    THB: "฿",
    VND: "₫",
    AED: "د.إ",
    SAR: "﷼",
    QAR: "﷼",
    KWD: "د.ك",
    BDT: "৳",
    LKR: "Rs",
    NPR: "Rs",
    EGP: "£",
    MYR: "RM",
    IDR: "Rp",
    TWD: "NT$",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    HUF: "Ft",
    CZK: "Kč",
    ILS: "₪",
    CLP: "CLP$",
    COP: "COL$",
    ARS: "ARS$",
    PEN: "S/",
    ZAR: "R",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol} ${formattedAmount}`;
}

export default function AddEditAccountModal({
  opened,
  onClose,
  mode,
  account,
}: AddEditAccountModalProps) {
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const isPending =
    createAccountMutation.isPending || updateAccountMutation.isPending;
  const isEdit = mode === "edit";

  const initialValues: CreateAccountInput = {
    name: account?.name || "",
    type: account?.type || "checking",
    balance: account?.balance || 0,
    currency: account?.currency || "PKR", // Default to PKR
  };

  const handleSubmit = (values: CreateAccountInput) => {
    if (isEdit && account) {
      // Update existing account
      updateAccountMutation.mutate(
        { id: account.id, data: values },
        {
          onSuccess: () => {
            toast.success("Account updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update account");
          },
        }
      );
    } else {
      // Create new account
      createAccountMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Account created successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create account");
        },
      });
    }
  };

  const handleClose = () => {
    createAccountMutation.reset();
    updateAccountMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Edit Account" : "Add New Account"}
      centered
      radius="md"
      size="md"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={isPending}
          overlayProps={{ blur: 2 }}
          loaderProps={{ type: "bars" }}
        />

        <Text size="sm" color="dimmed" mb="md">
          {isEdit
            ? "Update your account details below."
            : "Create a new account to track your finances."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={AccountSchema}
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
                <Input
                  id="name"
                  name="name"
                  label="Account Name"
                  type="text"
                  placeholder="e.g., Chase Checking, Savings Account"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.name || submitCount > 0) && errors.name}
                  required
                />

                <Select
                  label="Account Type"
                  placeholder="Select type"
                  data={[
                    { value: "checking", label: "🏦 Checking Account" },
                    { value: "savings", label: "💰 Savings Account" },
                    { value: "credit", label: "💳 Credit Card" },
                    { value: "investment", label: "📈 Investment" },
                    { value: "cash", label: "💵 Cash" },
                  ]}
                  value={values.type}
                  onChange={(value) => setFieldValue("type", value)}
                  error={(touched.type || submitCount > 0) && errors.type}
                  required
                />

                <NumberInput
                  label="Current Balance"
                  placeholder="0.00"
                  value={values.balance}
                  onChange={(value) => setFieldValue("balance", value)}
                  onBlur={handleBlur}
                  error={(touched.balance || submitCount > 0) && errors.balance}
                  min={0}
                  step={0.01}
                  precision={2}
                  required
                  leftSection={<IconCurrencyDollar size={16} />}
                />

                <CurrencySelect
                  value={values.currency}
                  onChange={(value) => setFieldValue("currency", value)}
                  label="Currency"
                  placeholder="Select currency"
                  error={
                    (touched.currency || submitCount > 0) && errors.currency
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
                    Preview:
                  </Text>
                  <Flex align="center" gap="sm">
                    <IconWallet size={20} className="text-blue-600" />
                    <Text size="sm" fw={500}>
                      {values.name || "Account Name"}
                    </Text>
                    <Text size="sm" c="blue" style={{ marginLeft: "auto" }}>
                      {values.type
                        ? values.type.charAt(0).toUpperCase() +
                          values.type.slice(1)
                        : "Type"}
                    </Text>
                  </Flex>
                  <Text size="sm" c="dimmed" mt="xs">
                    Balance:{" "}
                    {formatCurrencyDisplay(
                      values.currency,
                      values.balance || 0
                    )}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    Currency: {values.currency}
                  </Text>
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
                    {isEdit ? "Update Account" : "Create Account"}
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
