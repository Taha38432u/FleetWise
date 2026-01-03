"use client";

import { Button, Group, SimpleGrid, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Vehicle, VehicleType, VehicleStatus, CreateVehicleDto } from "@/data/vehicles";
import { useEffect } from "react";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { formatDateInput } from "@/utils/dateFormatter";

interface VehicleFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CreateVehicleDto) => void;
  initialValues?: Vehicle | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

type FormValues = CreateVehicleDto;

export function VehicleForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: VehicleFormProps) {
  const form = useForm<FormValues>({
    initialValues: {
      plate: "",
      type: "Truck" as VehicleType,
      model: "",
      year: new Date().getFullYear(),
      status: "Active" as VehicleStatus,
      mileage: 0,
      fuelEfficiency: 0,
      assignedDriver: "",
      insuranceExpiry: "",
      fitnessExpiry: "",
      lastService: "",
      nextPredictedMaintenance: "",
      healthScore: 100,
    },

    validate: {
      plate: (value) =>
        value.length < 3 ? "Plate number must be valid" : null,
      model: (value) => (value.length < 2 ? "Model is required" : null),
      year: (value) =>
        value < 2000 || value > 2026
          ? "Year must be between 2000 and 2026"
          : null,
      mileage: (value) => {
        const numValue = Number(value);
        if (numValue < 0) return "Mileage cannot be negative";
        if (!Number.isInteger(numValue)) return "Mileage must be a whole number";
        return null;
      },
      fuelEfficiency: (value) => {
        const numValue = Number(value);
        if (numValue < 0) return "Fuel efficiency cannot be negative";
        if (!Number.isInteger(numValue)) return "Fuel efficiency must be a whole number";
        return null;
      },
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...initialValues,
        lastService: formatDateInput(initialValues.lastService),
        nextPredictedMaintenance: formatDateInput(initialValues.nextPredictedMaintenance),
        insuranceExpiry: formatDateInput(initialValues.insuranceExpiry),
        fitnessExpiry: formatDateInput(initialValues.fitnessExpiry),
      });
    } else {
      form.reset();
    }
  }, [initialValues]);

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title={mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
      size="lg"
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: "md" }} />
        <form
          onSubmit={form.onSubmit((values) => {
            // Ensure mileage and fuelEfficiency are integers
            const intValues = {
              ...values,
              mileage: Math.floor(values.mileage),
              fuelEfficiency: Math.floor(values.fuelEfficiency),
            };
            onSubmit(intValues);
          })}
        >
        <SimpleGrid cols={2} spacing="lg">
          <Input
            label="Plate Number"
            placeholder="ABC-1234"
            required
            {...form.getInputProps("plate")}
          />
          <CustomSelect
            label="Vehicle Type"
            placeholder="Select type"
            options={[
              { value: "Truck", label: "Truck" },
              { value: "Van", label: "Van" },
              { value: "Car", label: "Car" },
              { value: "Bike", label: "Bike" },
            ]}
            withAsterisk
            value={
              form.values.type
                ? { value: form.values.type, label: form.values.type }
                : null
            }
            onChange={(option: any) =>
              form.setFieldValue("type", option?.value)
            }
          />
          <Input
            label="Model"
            placeholder="Ford F-150"
            required
            {...form.getInputProps("model")}
          />
          <Input
            label="Year"
            placeholder="2024"
            type="number"
            min={2000}
            max={2026}
            required
            {...form.getInputProps("year")}
          />
          <CustomSelect
            label="Status"
            placeholder="Select status"
            options={[
              { value: "Active", label: "Active" },
              { value: "Idle", label: "Idle" },
              { value: "In Maintenance", label: "In Maintenance" },
              { value: "Decommissioned", label: "Decommissioned" },
            ]}
            withAsterisk
            value={
              form.values.status
                ? { value: form.values.status, label: form.values.status }
                : null
            }
            onChange={(option: any) =>
              form.setFieldValue("status", option?.value)
            }
          />
          <Input
            label="Assigned Driver"
            placeholder="John Doe"
            {...form.getInputProps("assignedDriver")}
          />
          <Input
            label="Mileage (km)"
            placeholder="0"
            type="number"
            min={0}
            {...form.getInputProps("mileage")}
          />
          <Input
            label="Fuel Efficiency (km/L)"
            placeholder="10.5"
            type="number"
            min={0}
            {...form.getInputProps("fuelEfficiency")}
          />
          <Input
            label="Last Service"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("lastService")}
          />
          <Input
            label="Next Predicted Maintenance"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("nextPredictedMaintenance")}
          />
          <Input
            label="Insurance Expiry"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("insuranceExpiry")}
          />
          <Input
            label="Fitness Cert. Expiry"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("fitnessExpiry")}
          />
          <Input
            label="Health Score"
            placeholder="0"
            type="number"
            min={0}
            max={100}
            {...form.getInputProps("healthScore")}
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" color="blue" loading={isLoading}>
            {mode === "add" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </Group>
      </form>
      </div>
    </CustomModal>
  );
}
