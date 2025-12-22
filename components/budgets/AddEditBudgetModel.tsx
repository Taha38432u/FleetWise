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
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateBudget, useUpdateBudget } from "@/hooks/useBudgets";
import { useGetCategories } from "@/hooks/useCategories";
import { CreateBudgetInput, Budget, Category } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconPigMoney, IconCalendar } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

// Validation schema
const BudgetSchema = Yup.object()
  .shape({
    categoryId: Yup.number()
      .min(1, "Category is required")
      .required("Category is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(0.01, "Amount must be greater than 0"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
    rollover: Yup.boolean().default(false),
  })
  .test("date-range", "End date must be after start date", function (value) {
    if (!value.startDate || !value.endDate) return true;
    return value.startDate <= value.endDate;
  });

interface AddEditBudgetModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  budget?: Budget | null;
}

export default function AddEditBudgetModal({
  opened,
  onClose,
  mode,
  budget,
}: AddEditBudgetModalProps) {
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const { data: categoriesResponse } = useGetCategories({ enabled: opened });

  const isPending =
    createBudgetMutation.isPending || updateBudgetMutation.isPending;
  const isEdit = mode === "edit";

  const categories = categoriesResponse?.data?.data || [];
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const initialValues: CreateBudgetInput = {
    categoryId: budget?.categoryId || 0,
    amount: budget?.amount || 0,
    startDate: budget?.startDate || "",
    endDate: budget?.endDate || "",
    rollover: budget?.rollover || false,
  };

  const handleSubmit = (values: CreateBudgetInput) => {
    // Convert dates to ISO strings with time component
    const submitData = {
      ...values,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : "",
      endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
    };

    if (isEdit && budget) {
      updateBudgetMutation.mutate(
        { id: budget.id, data: submitData },
        {
          onSuccess: () => {
            toast.success("Budget updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update budget");
          },
        }
      );
    } else {
      createBudgetMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Budget created successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create budget");
        },
      });
    }
  };

  const handleClose = () => {
    createBudgetMutation.reset();
    updateBudgetMutation.reset();
    onClose();
  };

  const getCategoryOptions = () => {
    return expenseCategories.map((category: Category) => ({
      value: category.id.toString(),
      label: category?.name,
    }));
  };

  // Helper to format date for display in preview
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Show as YYYY-MM-DD in preview
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Edit Budget" : "Create New Budget"}
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
            ? "Update your budget details below."
            : "Set a budget for a category to track your spending."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={BudgetSchema}
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
                />

                {/* Budget Amount */}
                <NumberInput
                  label="Budget Amount"
                  placeholder="0.00"
                  value={values.amount}
                  onChange={(value) => setFieldValue("amount", value)}
                  onBlur={handleBlur}
                  error={(touched.amount || submitCount > 0) && errors.amount}
                  min={0.01}
                  step={0.01}
                  precision={2}
                  required
                  leftSection={<IconPigMoney size={16} />}
                />

                {/* Date Range - FIXED DateInput */}
                <Flex gap="md" wrap="wrap">
                  <Box style={{ flex: 1 }} className="min-w-[200px]">
                    <DateInput
                      label="Start Date"
                      placeholder="Select start date"
                      value={
                        values.startDate ? new Date(values.startDate) : null
                      }
                      onChange={(date) => {
                        if (!date) {
                          setFieldValue("startDate", "");
                        } else if (date instanceof Date) {
                          setFieldValue("startDate", date.toISOString());
                        } else {
                          // In case Mantine returns string
                          setFieldValue(
                            "startDate",
                            new Date(date).toISOString()
                          );
                        }
                      }}
                      error={
                        (touched.startDate || submitCount > 0) &&
                        errors.startDate
                      }
                      required
                      clearable
                      leftSection={<IconCalendar size={16} />}
                      valueFormat="YYYY-MM-DD"
                    />
                  </Box>
                  <Box style={{ flex: 1 }} className="min-w-[200px]">
                    <DateInput
                      label="End Date"
                      placeholder="Select end date"
                      value={values.endDate ? new Date(values.endDate) : null}
                      onChange={(date) => {
                        if (!date) {
                          setFieldValue("endDate", "");
                        } else if (date instanceof Date) {
                          setFieldValue("endDate", date.toISOString());
                        } else {
                          // In case Mantine returns string
                          setFieldValue(
                            "endDate",
                            new Date(date).toISOString()
                          );
                        }
                      }}
                      error={
                        (touched.endDate || submitCount > 0) && errors.endDate
                      }
                      required
                      clearable
                      leftSection={<IconCalendar size={16} />}
                      valueFormat="YYYY-MM-DD"
                    />
                  </Box>
                </Flex>

                {/* Rollover Option */}
                <Switch
                  label="Enable rollover"
                  description="Unused amount will carry over to next period"
                  checked={values.rollover}
                  onChange={(event) =>
                    setFieldValue("rollover", event.currentTarget.checked)
                  }
                />

                {/* Preview */}
                {values.categoryId && (
                  <Box
                    p="md"
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Text size="sm" fw={500} mb="xs">
                      Budget Preview:
                    </Text>
                    <Flex align="center" gap="sm" mb="xs">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            expenseCategories.find(
                              (c) => c.id === values.categoryId
                            )?.color || "#3b82f6",
                        }}
                      >
                        <IconPigMoney size={14} className="text-white" />
                      </div>
                      <Text size="sm" fw={500}>
                        {expenseCategories.find(
                          (c) => c.id === values.categoryId
                        )?.name || "Category"}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text size="sm" c="dimmed">
                        Amount:
                      </Text>
                      <Text size="sm" fw={600} className="text-blue-600">
                        PKR {Number(values.amount || 0).toFixed(2)}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center" mt={4}>
                      <Text size="sm" c="dimmed">
                        Period:
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatDateForDisplay(values.startDate)} to{" "}
                        {formatDateForDisplay(values.endDate)}
                      </Text>
                    </Flex>
                  </Box>
                )}

                <Group mt="md" justify="flex-end" gap="sm">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isPending} color="blue">
                    {isEdit ? "Update Budget" : "Create Budget"}
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
