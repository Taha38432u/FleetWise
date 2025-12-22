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
  Alert,
} from "@mantine/core";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useTransferMoney } from "@/hooks/useAccounts";
import { Account } from "@/types/api.types";
import { toast } from "react-toastify";
import {
  IconTransfer,
  IconAlertCircle,
  IconArrowRight,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";

interface TransferMoneyModalProps {
  opened: boolean;
  onClose: () => void;
  accounts: Account[];
}

interface TransferFormValues {
  fromAccountId: number | null;
  toAccountId: number | null;
  amount: number;
  description: string;
}

interface TransferError extends Error {
  message: string;
}

export default function TransferMoneyModal({
  opened,
  onClose,
  accounts,
}: TransferMoneyModalProps) {
  const transferMoneyMutation = useTransferMoney();
  const [fromAccount, setFromAccount] = useState<Account | null>(null);

  // Create validation schema with access to accounts
  const TransferSchema = useMemo(() => {
    return Yup.object().shape({
      fromAccountId: Yup.number()
        .nullable()
        .required("From account is required"),
      toAccountId: Yup.number()
        .nullable()
        .required("To account is required")
        .test(
          "different-account",
          "Cannot transfer to the same account",
          function (value) {
            const { fromAccountId } = this.parent as TransferFormValues;
            return value !== fromAccountId;
          }
        ),
      amount: Yup.number()
        .required("Amount is required")
        .min(0.01, "Amount must be greater than 0")
        .test(
          "sufficient-balance",
          "Insufficient balance in source account",
          function (value) {
            const { fromAccountId } = this.parent as TransferFormValues;
            if (!fromAccountId || !value) return true;

            const account = accounts.find((acc) => acc.id === fromAccountId);
            return account ? value <= account.balance : true;
          }
        ),
      description: Yup.string().max(200, "Description too long").nullable(),
    });
  }, [accounts]);

  const initialValues: TransferFormValues = {
    fromAccountId: null,
    toAccountId: null,
    amount: 0,
    description: "",
  };

  const handleSubmit = (
    values: TransferFormValues,
    { resetForm }: FormikHelpers<TransferFormValues>
  ) => {
    if (!values.fromAccountId || !values.toAccountId) return;

    transferMoneyMutation.mutate(
      {
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId,
        amount: values.amount,
        description:
          values.description ||
          `Transfer to ${
            accounts.find((acc) => acc.id === values.toAccountId)?.name ||
            "account"
          }`,
      },
      {
        onSuccess: () => {
          toast.success("Money transferred successfully");
          resetForm();
          onClose();
        },
        onError: (error: unknown) => {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to transfer money";
          toast.error(errorMsg);
        },
      }
    );
  };

  const handleClose = () => {
    transferMoneyMutation.reset();
    setFromAccount(null);
    onClose();
  };

  const handleFromAccountChange = (accountId: string | null) => {
    const id = accountId ? parseInt(accountId, 10) : null;
    const selectedAccount = accounts.find((acc) => acc.id === id) || null;
    setFromAccount(selectedAccount);
  };

  const getFilteredToAccounts = (fromAccountId: number | null): Account[] => {
    if (!fromAccountId) return accounts;
    return accounts.filter((account) => account.id !== fromAccountId);
  };

  const accountSelectData = accounts.map((account) => ({
    value: account.id.toString(),
    label: `${account.name} (${
      account.currency
    } ${account.balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })})`,
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Flex align="center" gap="sm">
          <IconTransfer size={24} className="text-blue-600" />
          <Text fw={600}>Transfer Money</Text>
        </Flex>
      }
      centered
      radius="md"
      size="lg"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay
          visible={transferMoneyMutation.isPending}
          overlayProps={{ blur: 2 }}
          loaderProps={{ type: "bars" }}
        />

        <Text size="sm" color="dimmed" mb="md">
          Transfer money between your accounts
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={TransferSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange
        >
          {({ setFieldValue, values, errors, touched, submitCount }) => {
            const toAccount = values.toAccountId
              ? accounts.find((acc) => acc.id === values.toAccountId)
              : null;

            const isSameAccount =
              values.fromAccountId !== null &&
              values.toAccountId !== null &&
              values.fromAccountId === values.toAccountId;
            const hasInsufficientBalance =
              fromAccount && values.amount > fromAccount.balance;
            const canSubmit =
              values.fromAccountId &&
              values.toAccountId &&
              values.amount > 0 &&
              !isSameAccount &&
              !hasInsufficientBalance;

            return (
              <Form>
                <Flex direction="column" gap="md">
                  {/* From Account */}
                  <Select
                    label="From Account"
                    placeholder="Select source account"
                    data={accountSelectData}
                    value={values.fromAccountId?.toString() || null}
                    onChange={(value) => {
                      setFieldValue(
                        "fromAccountId",
                        value ? parseInt(value, 10) : null
                      );
                      setFieldValue("toAccountId", null);
                      setFieldValue("amount", 0);
                      handleFromAccountChange(value);
                    }}
                    error={
                      (touched.fromAccountId || submitCount > 0) &&
                      errors.fromAccountId
                        ? errors.fromAccountId
                        : false
                    }
                    required
                    searchable
                    nothingFoundMessage="No accounts found"
                  />

                  {/* To Account */}
                  <Select
                    label="To Account"
                    placeholder="Select destination account"
                    data={getFilteredToAccounts(values.fromAccountId).map(
                      (account) => ({
                        value: account.id.toString(),
                        label: `${account.name} (${
                          account.currency
                        } ${account.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })})`,
                      })
                    )}
                    value={values.toAccountId?.toString() || null}
                    onChange={(value) =>
                      setFieldValue(
                        "toAccountId",
                        value ? parseInt(value, 10) : null
                      )
                    }
                    error={
                      (touched.toAccountId || submitCount > 0) &&
                      errors.toAccountId
                        ? errors.toAccountId
                        : false
                    }
                    required
                    disabled={!values.fromAccountId}
                    searchable
                    nothingFoundMessage="No accounts found"
                  />

                  {/* Amount */}
                  <NumberInput
                    label="Amount"
                    placeholder="0.00"
                    value={values.amount}
                    onChange={(value) => setFieldValue("amount", value ?? 0)}
                    error={
                      (touched.amount || submitCount > 0) && errors.amount
                        ? errors.amount
                        : false
                    }
                    min={0.01}
                    step={0.01}
                    precision={2}
                    required
                    disabled={!values.fromAccountId}
                  />

                  {/* Available Balance */}
                  {fromAccount && (
                    <Text size="sm" c="dimmed">
                      Available: {fromAccount.currency}{" "}
                      {fromAccount.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  )}

                  {/* Description */}
                  <Select
                    label="Description (Optional)"
                    placeholder="Add a description"
                    data={[
                      `Transfer to ${toAccount?.name || "account"}`,
                      "Fund transfer",
                      "Account rebalancing",
                      "Other transfer",
                    ]}
                    value={values.description}
                    onChange={(value) =>
                      setFieldValue("description", value || "")
                    }
                    searchable
                  />

                  {/* Transfer Preview */}
                  {values.fromAccountId &&
                    values.toAccountId &&
                    values.amount > 0 && (
                      <Box
                        p="md"
                        style={{
                          border: "1px solid #e9ecef",
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <Text size="sm" fw={500} mb="xs">
                          Transfer Preview:
                        </Text>
                        <Flex align="center" justify="center" gap="lg">
                          <div className="text-center">
                            <Text size="sm" fw={600} c="red">
                              - {fromAccount?.currency}{" "}
                              {values.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {fromAccount?.name}
                            </Text>
                          </div>

                          <IconArrowRight size={20} className="text-blue-500" />

                          <div className="text-center">
                            <Text size="sm" fw={600} c="green">
                              + {toAccount?.currency}{" "}
                              {values.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {toAccount?.name}
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    )}

                  {/* Same Account Warning */}
                  {isSameAccount && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Same Account Selected"
                      icon={<IconAlertCircle size={16} />}
                    >
                      You cannot transfer money to the same account.
                    </Alert>
                  )}

                  {/* Insufficient Balance Warning */}
                  {hasInsufficientBalance && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Insufficient Balance"
                      icon={<IconAlertCircle size={16} />}
                    >
                      The selected account does not have sufficient balance for
                      this transfer.
                    </Alert>
                  )}

                  {/* Error messages */}
                  {transferMoneyMutation.error && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Transfer Failed"
                      icon={<IconAlertCircle size={16} />}
                    >
                      {(transferMoneyMutation.error as TransferError)
                        ?.message ||
                        "An error occurred during transfer. Please try again."}
                    </Alert>
                  )}

                  <Group mt="md" justify="flex-end" gap="sm">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={transferMoneyMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={transferMoneyMutation.isPending}
                      color="blue"
                      disabled={!canSubmit}
                      leftSection={<IconTransfer size={16} />}
                    >
                      Transfer Money
                    </Button>
                  </Group>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
}
