"use client";

import { Button, Group, SimpleGrid, LoadingOverlay, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Driver, CreateDriverDto, AvailabilityStatus, LicenseStatus } from "@/types/driver.types";
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
  onSubmit: (values: CreateDriverDto) => void;
  initialValues?: Driver | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

export function DriverForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: DriverFormProps) {
  const form = useForm({
    initialValues: {
      licenseNumber: "",
      licenseExpiry: "",
      licenseStatus: "Valid" as LicenseStatus,
      yearsOfExperience: 0,
      emergencyContact: "",
      emergencyContactPhone: "",
      availabilityStatus: "Available" as AvailabilityStatus,
      documentVerified: false,
      backgroundCheckDone: false,
    },
    validate: {
      licenseNumber: (value) =>
        value.length < 5 ? "License number must be valid" : null,
      yearsOfExperience: (value) => {
        if (value < 0) return "Years of experience cannot be negative";
        return null;
      },
      emergencyContactPhone: (value) =>
        value.length < 10 ? "Phone number must be valid" : null,
    },
  });

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title={mode === "add" ? "Add New Driver" : "Edit Driver"}
      size="lg"
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: "md" }} />
        <form
          onSubmit={form.onSubmit((values) => {
            onSubmit(values);
          })}
        >
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
            <Input
              label="License Number"
              placeholder="DL1234567890"
              {...form.getInputProps("licenseNumber")}
              icon={<IconFileText size={18} className="text-gray-400" />}
            />
            <Input
              label="License Expiry"
              type="date"
              {...form.getInputProps("licenseExpiry")}
              icon={<IconCalendar size={18} className="text-gray-400" />}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
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
                form.values.licenseStatus
                  ? {
                      value: form.values.licenseStatus,
                      label: form.values.licenseStatus,
                    }
                  : null
              }
              onChange={(option: any) =>
                form.setFieldValue("licenseStatus", option?.value || "")
              }
              error={form.errors.licenseStatus}
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="5"
              {...form.getInputProps("yearsOfExperience")}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
            <Input
              label="Emergency Contact Name"
              placeholder="John Doe"
              {...form.getInputProps("emergencyContact")}
              icon={<IconUser size={18} className="text-gray-400" />}
            />
            <Input
              label="Emergency Contact Phone"
              placeholder="+91-9876543210"
              {...form.getInputProps("emergencyContactPhone")}
              icon={<IconPhone size={18} className="text-gray-400" />}
            />
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
                form.values.availabilityStatus
                  ? {
                      value: form.values.availabilityStatus,
                      label: form.values.availabilityStatus,
                    }
                  : null
              }
              onChange={(option: any) =>
                form.setFieldValue("availabilityStatus", option?.value || "")
              }
              error={form.errors.availabilityStatus}
            />
          </Box>

          <Group mb="lg" grow>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.getInputProps("documentVerified", { type: "checkbox" })}
              />
              <span className="text-sm">Document Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.getInputProps("backgroundCheckDone", { type: "checkbox" })}
              />
              <span className="text-sm">Background Check Done</span>
            </label>
          </Group>

          <Group grow>
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {mode === "add" ? "Create Driver" : "Update Driver"}
            </Button>
          </Group>
        </form>
      </div>
    </CustomModal>
  );
}
