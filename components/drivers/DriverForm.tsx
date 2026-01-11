"use client";
;
import { Button, Group, SimpleGrid, LoadingOverlay, Box } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Driver,
  CreateDriverDto,
  UpdateDriverDto,
} from "@/types/driver.types";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import {
  IconPhone,
  IconUser,
  IconFileText,
  IconCalendar,
} from "@tabler/icons-react";

interface DriverFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CreateDriverDto | UpdateDriverDto) => void;
  initialValues?: Driver | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

const getValidationSchema = (mode: "add" | "edit") => {
  const base = Yup.object().shape({
    licenseNumber: Yup.string()
      .required("License number is required")
      .min(5, "License number must be at least 5 characters")
      .matches(/^[A-Z0-9]+$/, "License number must contain only letters and numbers"),
    licenseExpiry: Yup.string()
      .required("License expiry date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "License expiry must be in YYYY-MM-DD format"),
    licenseStatus: Yup.string()
      .required("License status is required")
      .oneOf(["Valid", "Expired", "Suspended", "Pending Verification"]),
    yearsOfExperience: Yup.number()
      .required("Years of experience is required")
      .min(0, "Years of experience cannot be negative")
      .max(60, "Years of experience cannot exceed 60"),
    emergencyContact: Yup.string()
      .required("Emergency contact name is required")
      .min(2, "Emergency contact name must be at least 2 characters"),
    emergencyContactPhone: Yup.string()
      .required("Emergency contact phone is required")
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits"),
    availabilityStatus: Yup.string()
      .required("Availability status is required")
      .oneOf(["Available", "On Duty", "Off Duty", "On Leave"]),
    documentVerified: Yup.boolean(),
    backgroundCheckDone: Yup.boolean(),
  });

  if (mode === "add") {
    const userSchema = Yup.object().shape({
      user: Yup.object().shape({
        email: Yup.string().required("Email is required").email("Invalid email"),
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        phone: Yup.string()
          .required("Phone is required")
          .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
          .min(10, "Phone must be at least 10 digits"),
      }),
    });

    return base.concat(userSchema as any);
  }

  // For edit mode: allow `user` to be optional, but validate fields if provided
  const userEditSchema = Yup.object().shape({
    user: Yup.object().shape({
      email: Yup.string().email("Invalid email"),
      firstName: Yup.string(),
      lastName: Yup.string(),
      phone: Yup.string()
        .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
        .min(10, "Phone must be at least 10 digits"),
    }).notRequired(),
  });

  return base.concat(userEditSchema as any);
};

export function DriverForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: DriverFormProps) {
  const getInitialValues = (): CreateDriverDto | UpdateDriverDto => {
    if (initialValues && mode === "edit") {
      const editVals: UpdateDriverDto = {
        user: {
          email: initialValues.user?.email || undefined,
          firstName: initialValues.user?.firstName || undefined,
          lastName: initialValues.user?.lastName || undefined,
          phone: initialValues.user?.phone || undefined,
        },
        licenseNumber: initialValues.licenseNumber || undefined,
        licenseExpiry: initialValues.licenseExpiry || undefined,
        licenseStatus: initialValues.licenseStatus || undefined,
        yearsOfExperience: initialValues.yearsOfExperience || undefined,
        emergencyContact: initialValues.emergencyContact || undefined,
        emergencyContactPhone: initialValues.emergencyContactPhone || undefined,
        availabilityStatus: initialValues.availabilityStatus || undefined,
        documentVerified: initialValues.documentVerified || undefined,
        backgroundCheckDone: initialValues.backgroundCheckDone || undefined,
      };

      return editVals;
    }

    const createVals: CreateDriverDto = {
      user: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      },
      licenseNumber: "",
      licenseExpiry: "",
      licenseStatus: "Valid",
      yearsOfExperience: 0,
      emergencyContact: "",
      emergencyContactPhone: "",
      availabilityStatus: "Available",
      documentVerified: false,
      backgroundCheckDone: false,
    };

    return createVals;
  };

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title={mode === "add" ? "Add New Driver" : "Edit Driver"}
      size="lg"
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: "md" }} />
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema(mode)}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              onSubmit(values);
            } finally {
              setSubmitting(false);
            }
          }}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => {
            const vals: any = values as any;
            return (
            <Form>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                <Input
                  label="Email"
                  placeholder="driver@company.com"
                  value={vals.user?.email || ""}
                  onChange={(e) => setFieldValue("user.email", e.target.value)}
                  error={(touched as any).user?.email ? (errors as any).user?.email : undefined}
                />
                <Input
                  label="Phone"
                  placeholder="+91-9876543210"
                  value={vals.user?.phone || ""}
                  onChange={(e) => setFieldValue("user.phone", e.target.value)}
                  error={(touched as any).user?.phone ? (errors as any).user?.phone : undefined}
                />
                <Input
                  label="First Name"
                  placeholder="John"
                  value={vals.user?.firstName || ""}
                  onChange={(e) => setFieldValue("user.firstName", e.target.value)}
                  error={(touched as any).user?.firstName ? (errors as any).user?.firstName : undefined}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={vals.user?.lastName || ""}
                  onChange={(e) => setFieldValue("user.lastName", e.target.value)}
                  error={(touched as any).user?.lastName ? (errors as any).user?.lastName : undefined}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                <div>
                  <Input
                    label="License Number"
                    placeholder="DL1234567890"
                    value={vals.licenseNumber || ""}
                    onChange={(e) => setFieldValue("licenseNumber", e.target.value)}
                    onBlur={() => {}}
                    error={touched.licenseNumber ? (errors as any).licenseNumber : undefined}
                    icon={<IconFileText size={18} className="text-gray-400" />}
                  />
                </div>
                <div>
                  <Input
                    label="License Expiry"
                    type="date"
                    value={vals.licenseExpiry || ""}
                    onChange={(e) => setFieldValue("licenseExpiry", e.target.value)}
                    onBlur={() => {}}
                    error={touched.licenseExpiry ? (errors as any).licenseExpiry : undefined}
                    icon={<IconCalendar size={18} className="text-gray-400" />}
                  />
                </div>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                <div>
                  <CustomSelect
                    label="License Status"
                    placeholder="Select license status"
                    options={[
                      { value: "Valid", label: "Valid" },
                      { value: "Expired", label: "Expired" },
                      { value: "Suspended", label: "Suspended" },
                      { value: "Pending Verification", label: "Pending Verification" },
                    ]}
                    value={
                      vals.licenseStatus
                        ? {
                            value: vals.licenseStatus,
                            label: vals.licenseStatus,
                          }
                        : null
                    }
                    onChange={(option: any) =>
                      setFieldValue("licenseStatus", option?.value || "")
                    }
                    error={touched.licenseStatus ? (errors as any).licenseStatus : undefined}
                  />
                </div>
                <div>
                  <Input
                    label="Years of Experience"
                    type="number"
                    placeholder="5"
                    value={(vals.yearsOfExperience || 0).toString()}
                    onChange={(e) => setFieldValue("yearsOfExperience", parseInt(e.target.value) || 0)}
                    onBlur={() => {}}
                    error={touched.yearsOfExperience ? (errors as any).yearsOfExperience : undefined}
                  />
                </div>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                <div>
                  <Input
                    label="Emergency Contact Name"
                    placeholder="John Doe"
                    value={vals.emergencyContact || ""}
                    onChange={(e) => setFieldValue("emergencyContact", e.target.value)}
                    onBlur={() => {}}
                    error={touched.emergencyContact ? (errors as any).emergencyContact : undefined}
                    icon={<IconUser size={18} className="text-gray-400" />}
                  />
                </div>
                <div>
                  <Input
                    label="Emergency Contact Phone"
                    placeholder="+91-9876543210"
                    value={vals.emergencyContactPhone || ""}
                    onChange={(e) => setFieldValue("emergencyContactPhone", e.target.value)}
                    onBlur={() => {}}
                    error={touched.emergencyContactPhone ? (errors as any).emergencyContactPhone : undefined}
                    icon={<IconPhone size={18} className="text-gray-400" />}
                  />
                </div>
              </SimpleGrid>

              <Box mb="md">
                <CustomSelect
                  label="Availability Status"
                  placeholder="Select availability status"
                  options={[
                    { value: "Available", label: "Available" },
                    { value: "On Duty", label: "On Duty" },
                    { value: "Off Duty", label: "Off Duty" },
                    { value: "On Leave", label: "On Leave" },
                  ]}
                    value={
                    vals.availabilityStatus
                      ? {
                          value: vals.availabilityStatus,
                          label: vals.availabilityStatus,
                        }
                      : null
                  }
                  onChange={(option: any) =>
                    setFieldValue("availabilityStatus", option?.value || "")
                  }
                  error={touched.availabilityStatus ? (errors as any).availabilityStatus : undefined}
                />
              </Box>

              <Group mb="lg" grow>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!vals.documentVerified}
                    onChange={(e) => setFieldValue("documentVerified", e.target.checked)}
                  />
                  <span className="text-sm">Document Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!vals.backgroundCheckDone}
                    onChange={(e) => setFieldValue("backgroundCheckDone", e.target.checked)}
                  />
                  <span className="text-sm">Background Check Done</span>
                </label>
              </Group>

              <Group grow>
                <Button variant="default" onClick={onClose} disabled={isLoading || isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading || isSubmitting}>
                  {mode === "add" ? "Create Driver" : "Update Driver"}
                </Button>
              </Group>
            </Form>
          );
        }}
        </Formik>
      </div>
    </CustomModal>
  );
}
