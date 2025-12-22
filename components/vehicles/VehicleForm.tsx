"use client";

import { Button, Group, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Vehicle, VehicleType, VehicleStatus } from "@/data/vehicles";
import { useEffect } from "react";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";

interface VehicleFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Vehicle, "id">) => void;
  initialValues?: Vehicle | null;
  mode: "add" | "edit";
}

type FormValues = Omit<Vehicle, "id">;

export function VehicleForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  mode,
}: VehicleFormProps) {
  const form = useForm<FormValues>({
    initialValues: {
      plate: "",
      type: "Truck" as VehicleType,
      model: "",
      year: new Date().getFullYear(),
      status: "Active" as VehicleStatus,
      mileage: 0,
      fuel_efficiency: 0,
      assigned_driver: "",
      insurance_expiry: "",
      fitness_expiry: "",
      last_service: "",
      next_predicted_maintenance: "",
      health_score: 100,
    },

    validate: {
      plate: (value) =>
        value.length < 3 ? "Plate number must be valid" : null,
      model: (value) => (value.length < 2 ? "Model is required" : null),
      year: (value) =>
        value < 2000 || value > 2026
          ? "Year must be between 2000 and 2026"
          : null,
      mileage: (value) => (value < 0 ? "Mileage cannot be negative" : null),
      fuel_efficiency: (value) =>
        value < 0 ? "Fuel efficiency cannot be negative" : null,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues);
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
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          onClose();
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
            {...form.getInputProps("assigned_driver")}
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
            {...form.getInputProps("fuel_efficiency")}
          />
          <Input
            label="Insurance Expiry"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("insurance_expiry")}
          />
          <Input
            label="Fitness Cert. Expiry"
            placeholder="YYYY-MM-DD"
            type="date"
            {...form.getInputProps("fitness_expiry")}
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="blue">
            {mode === "add" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </Group>
      </form>
    </CustomModal>
  );
}
