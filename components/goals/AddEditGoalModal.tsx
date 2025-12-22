"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  NumberInput,
  Flex,
  Switch,
  Progress,
  Badge,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { useCreateGoal, useUpdateGoal } from "@/hooks/useGoals";
import { CreateGoalInput, Goal, UpdateGoalInput } from "@/types/api.types";
import { toast } from "react-toastify";
import { IconTarget, IconCalendar, IconPigMoney } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/en";
import "@mantine/dates/styles.css";
import formatCurrency from "@/utils/formatCurrency";

// Validation schema
const GoalSchema = Yup.object()
  .shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Goal name is required"),
    targetAmount: Yup.number()
      .required("Target amount is required")
      .min(0.01, "Target amount must be greater than 0"),
    savedAmount: Yup.number()
      .min(0, "Saved amount cannot be negative")
      .test(
        "saved-less-than-target",
        "Saved amount cannot exceed target amount",
        function (value) {
          const { targetAmount } = this.parent;
          if (value === undefined || value === null) return true;
          return value <= targetAmount;
        }
      ),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    isCompleted: Yup.boolean(),
  })
  .test("date-range", "End date must be after start date", function (value) {
    if (!value.startDate || !value.endDate) return true;
    return new Date(value.startDate) <= new Date(value.endDate);
  });

interface AddEditGoalModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  goal?: Goal | null;
}

export default function AddEditGoalModal({
  opened,
  onClose,
  mode,
  goal,
}: AddEditGoalModalProps) {
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();

  const isPending =
    createGoalMutation.isPending || updateGoalMutation.isPending;
  const isEdit = mode === "edit";

  const initialValues: UpdateGoalInput = {
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || 0,
    savedAmount: goal?.savedAmount || 0,
    startDate: goal?.startDate || "",
    endDate: goal?.endDate || "",
    isCompleted: goal?.isCompleted || false,
  };

  const handleSubmit = (values: UpdateGoalInput) => {
    // Convert dates to ISO strings with time component
    const submitData = {
      ...values,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : "",
      endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
    };

    if (isEdit && goal) {
      updateGoalMutation.mutate(
        { id: goal.id, data: submitData },
        {
          onSuccess: () => {
            toast.success("Goal updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update goal");
          },
        }
      );
    } else {
      // For creating new goals, use only CreateGoalInput fields
      const createData: CreateGoalInput = {
        name: values.name!,
        targetAmount: values.targetAmount!,
        startDate: values.startDate!,
        endDate: values.endDate!,
      };

      createGoalMutation.mutate(createData, {
        onSuccess: () => {
          toast.success("Goal created successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create goal");
        },
      });
    }
  };

  const handleClose = () => {
    createGoalMutation.reset();
    updateGoalMutation.reset();
    onClose();
  };

  // Helper to format date for display in preview
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Calculate progress for preview
  const calculateProgress = (savedAmount: number, targetAmount: number) => {
    if (targetAmount <= 0) return 0;
    return Math.min((savedAmount / targetAmount) * 100, 100);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Edit Goal" : "Create New Goal"}
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
            ? "Update your goal details below."
            : "Set a savings goal to track your progress."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={GoalSchema}
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
                {/* Goal Name */}
                <Input
                  id="name"
                  name="name"
                  label="Goal Name"
                  type="text"
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                  value={values.name || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.name || submitCount > 0) && errors.name}
                  required
                />

                {/* Target Amount */}
                <NumberInput
                  label="Target Amount"
                  placeholder="0.00"
                  value={values.targetAmount || 0}
                  onChange={(value) => setFieldValue("targetAmount", value)}
                  onBlur={handleBlur}
                  error={
                    (touched.targetAmount || submitCount > 0) &&
                    errors.targetAmount
                  }
                  min={0.01}
                  step={0.01}
                  precision={2}
                  required
                  leftSection={<IconTarget size={16} />}
                />

                {/* Saved Amount (Only for edit mode) */}
                {isEdit && (
                  <NumberInput
                    label="Saved Amount"
                    placeholder="0.00"
                    value={values.savedAmount || 0}
                    onChange={(value) => setFieldValue("savedAmount", value)}
                    onBlur={handleBlur}
                    error={
                      (touched.savedAmount || submitCount > 0) &&
                      errors.savedAmount
                    }
                    min={0}
                    step={0.01}
                    precision={2}
                    leftSection={<IconPigMoney size={16} />}
                    description="Update the amount you've saved towards this goal"
                  />
                )}

                {/* Date Range */}
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

                {/* Completion Status (Only for edit mode) */}
                {isEdit && (
                  <Switch
                    label="Mark as completed"
                    description="Check this if you've achieved your goal"
                    checked={values.isCompleted || false}
                    onChange={(event) =>
                      setFieldValue("isCompleted", event.currentTarget.checked)
                    }
                  />
                )}

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
                    Goal Preview:
                  </Text>
                  <Flex align="center" gap="sm" mb="xs">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <IconTarget size={14} className="text-white" />
                    </div>
                    <Text size="sm" fw={500}>
                      {values.name || "Goal Name"}
                    </Text>
                    {(values.isCompleted ||
                      (values.savedAmount &&
                        values.savedAmount >= values.targetAmount)) && (
                      <Badge color="green" size="xs">
                        Completed
                      </Badge>
                    )}
                  </Flex>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <Flex justify="space-between" align="center" mb="xs">
                      <Text size="xs" c="dimmed">
                        Progress
                      </Text>
                      <Text size="xs" fw={600} className="text-purple-600">
                        {calculateProgress(
                          values.savedAmount || 0,
                          values.targetAmount || 0
                        ).toFixed(1)}
                        %
                      </Text>
                    </Flex>
                    <Progress
                      value={calculateProgress(
                        values.savedAmount || 0,
                        values.targetAmount || 0
                      )}
                      color={
                        values.isCompleted ||
                        (values.savedAmount &&
                          values.savedAmount >= values.targetAmount)
                          ? "green"
                          : "purple"
                      }
                      size="sm"
                      radius="xl"
                    />
                  </div>

                  <Flex justify="space-between" align="center">
                    <Text size="sm" c="dimmed">
                      Saved:
                    </Text>
                    <Text size="sm" fw={500} className="text-green-600">
                      {formatCurrency(values.savedAmount || 0)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center" mt={4}>
                    <Text size="sm" c="dimmed">
                      Target:
                    </Text>
                    <Text size="sm" fw={600} className="text-purple-600">
                      {formatCurrency(values.targetAmount || 0)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center" mt={4}>
                    <Text size="sm" c="dimmed">
                      Remaining:
                    </Text>
                    <Text size="sm" fw={500} className="text-blue-600">
                      {formatCurrency(
                        (values.targetAmount || 0) - (values.savedAmount || 0)
                      )}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center" mt={4}>
                    <Text size="sm" c="dimmed">
                      Period:
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatDateForDisplay(values.startDate || "")} to{" "}
                      {formatDateForDisplay(values.endDate || "")}
                    </Text>
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
                  <Button type="submit" loading={isPending} color="purple">
                    {isEdit ? "Update Goal" : "Create Goal"}
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