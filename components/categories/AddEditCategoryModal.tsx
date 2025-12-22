"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Box,
  LoadingOverlay,
  ColorInput,
  Flex,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "../common/Input/CustomSelect";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { CreateCategoryInput, Category } from "@/types/api.types";
import { toast } from "react-toastify";

// Validation schema
const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  type: Yup.object().shape({
    value: Yup.string()
      .oneOf(["income", "expense"])
      .required("Type is required"),
  }),
  color: Yup.string()
    .required("Color is required")
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Color must be a valid hex code"
    ),
});

interface AddEditCategoryModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  category?: Category | null;
}

const defaultColors = [
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
  "#868e96",
  "#495057",
  "#212529",
];

export default function AddEditCategoryModal({
  opened,
  onClose,
  mode,
  category,
}: AddEditCategoryModalProps) {
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const isEdit = mode === "edit";

  // Initial values: type is an object for react-select
  const initialValues: CreateCategoryInput = {
    name: category?.name || "",
    type: category?.type
      ? {
          value: category.type,
          label: category.type === "income" ? "Income" : "Expense",
        }
      : "", // null is better than "" for react-select
    color: category?.color || "#228be6",
  };

  const handleSubmit = (values: CreateCategoryInput) => {
    const payload = {
      ...values,
      type: values.type.value, // send string to API
    };

    if (isEdit && category) {
      updateCategoryMutation.mutate(
        { id: category.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Category Edited Successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update category");
          },
        }
      );
    } else {
      createCategoryMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Category Created Successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create category");
        },
      });
    }
  };

  const handleClose = () => {
    createCategoryMutation.reset();
    updateCategoryMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Edit Category" : "Add New Category"}
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
            ? "Update your category details below."
            : "Create a new category to organize your transactions."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={CategorySchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            setFieldTouched,
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
                  label="Category Name"
                  type="text"
                  placeholder="e.g., Groceries, Salary, Rent"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.name || submitCount > 0) && errors.name}
                />

                <CustomSelect
                  label="Type"
                  placeholder="Select type"
                  options={[
                    { value: "income", label: "Income" },
                    { value: "expense", label: "Expense" },
                  ]}
                  value={values.type}
                  onChange={(option) => {
                    setFieldValue("type", option); // save full object
                    setFieldTouched("type", true, true); // mark touched + validate immediately
                  }}
                  onBlur={() => setFieldTouched("type", true, true)}
                  touched={touched.type || submitCount > 0} // show error if form submitted
                  error={errors.type?.value || errors.type} // depends on Yup schema
                  showValidation
                />

                <ColorInput
                  label="Color"
                  placeholder="Pick a color"
                  value={values.color}
                  onChange={(value) => setFieldValue("color", value)}
                  format="hex"
                  swatches={defaultColors}
                  swatchesPerRow={7}
                  error={(touched.color || submitCount > 0) && errors.color}
                  required
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
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: values.color,
                        border: "1px solid #dee2e6",
                      }}
                    />
                    <Text size="sm" fw={500}>
                      {values.name}
                    </Text>
                    <Text
                      size="sm"
                      c={values.type?.value === "income" ? "green" : "red"}
                      style={{ marginLeft: "auto" }}
                    >
                      {values.type?.label}
                    </Text>
                  </Flex>
                </Box>

                {/* API Error messages */}
                {(createCategoryMutation.error ||
                  updateCategoryMutation.error) && (
                  <Text size="sm" c="red">
                    {createCategoryMutation.error?.message ||
                      updateCategoryMutation.error?.message ||
                      "An error occurred. Please try again."}
                  </Text>
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
                    {isEdit ? "Update Category" : "Create Category"}
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
