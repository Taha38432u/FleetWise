"use client";

import { useMemo, useState } from "react";
import { Button, Group, Loader } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { useGetVehicles } from "@/hooks/useVehicles";
import { useCreateFuelLog, useFuelByVehicle } from "@/hooks/useFuel";
import { PageHeader } from "@/components/shared";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

const schema = Yup.object({
  vehicleId: Yup.string().required("Vehicle is required"),
  liters: Yup.number().min(0.1, "Enter liters").required("Liters required"),
  cost: Yup.number().min(0, "Cost cannot be negative").required("Cost required"),
  odometer: Yup.number().min(0, "Odometer required").required("Odometer required"),
});

export default function FuelLogsView() {
  const { isDemo, blockWrite } = useDemoReadOnly();
  const [vehicleId, setVehicleId] = useState("");
  const [opened, setOpened] = useState(false);
  const vehiclesQuery = useGetVehicles({ page: 1, pageSize: 100 });
  const fuelQuery = useFuelByVehicle(vehicleId || undefined);
  const createMutation = useCreateFuelLog();

  const vehicles = vehiclesQuery.data?.data?.data || [];
  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle: any) => ({
        value: vehicle.id,
        label: `${vehicle.plate} · ${vehicle.make || ""} ${vehicle.model || ""}`.trim(),
      })),
    [vehicles],
  );

  const logs = fuelQuery.data?.data || [];
  const efficiency = fuelQuery.data?.efficiency;

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
      },
      {
        header: "Liters",
        accessorKey: "liters",
        cell: ({ getValue }) => Number(getValue() || 0).toFixed(2),
      },
      {
        header: "Cost",
        accessorKey: "cost",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Odometer",
        accessorKey: "odometer",
        cell: ({ getValue }) => `${Number(getValue() || 0).toLocaleString()} km`,
      },
    ],
    [],
  );

  if (vehiclesQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Fuel operations"
        title="Fuel logs"
        description="Log liters, cost, and odometer per vehicle. Efficiency is km per liter between first and last reading."
        actions={
          <Button
            onClick={() => {
              if (blockWrite("Logging fuel")) return;
              setOpened(true);
            }}
            disabled={isDemo || !vehicleOptions.length}
          >
            Log fill-up
          </Button>
        }
      />

      <div className="ui-section space-y-4">
        <div className="max-w-md">
          <CustomSelect
            label="Vehicle"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            value={vehicleOptions.find((option) => option.value === vehicleId) || null}
            onChange={(option: any) => setVehicleId(option?.value || "")}
          />
        </div>

        {vehicleId ? (
          <>
            <Group gap="md">
              <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                  Efficiency
                </p>
                <p className="mt-1 text-2xl font-extrabold text-ink">
                  {efficiency && Number.isFinite(efficiency)
                    ? `${Number(efficiency).toFixed(2)} km/L`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-white px-4 py-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Entries
                </p>
                <p className="mt-1 text-2xl font-extrabold text-ink">{logs.length}</p>
              </div>
            </Group>

            {fuelQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <Loader size="sm" />
              </div>
            ) : (
              <CustomTable data={logs} columns={columns} />
            )}
          </>
        ) : (
          <p className="text-sm font-semibold text-muted">
            Select a vehicle to view fuel history.
          </p>
        )}
      </div>

      <CustomModal opened={opened} onClose={() => setOpened(false)} title="Log fuel fill-up">
        <Formik
          initialValues={{
            vehicleId: vehicleId || "",
            liters: "",
            cost: "",
            odometer: "",
          }}
          validationSchema={schema}
          onSubmit={(values, helpers) => {
            if (blockWrite("Logging fuel")) return;
            createMutation.mutate(
              {
                vehicleId: values.vehicleId,
                liters: Number(values.liters),
                cost: Number(values.cost),
                odometer: Number(values.odometer),
              },
              {
                onSuccess: () => {
                  toast.success("Fuel log saved");
                  setVehicleId(values.vehicleId);
                  setOpened(false);
                  helpers.resetForm();
                },
                onError: (error: any) =>
                  toast.error(error?.message || "Could not save fuel log"),
              },
            );
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitCount }) => (
            <Form className="space-y-4">
              <CustomSelect
                label="Vehicle"
                options={vehicleOptions}
                withAsterisk
                value={vehicleOptions.find((option) => option.value === values.vehicleId) || null}
                onChange={(option: any) => setFieldValue("vehicleId", option?.value || "")}
                error={(touched.vehicleId || submitCount > 0) && errors.vehicleId}
              />
              <Input
                id="liters"
                name="liters"
                label="Liters"
                type="number"
                value={values.liters}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched.liters || submitCount > 0) && errors.liters}
              />
              <Input
                id="cost"
                name="cost"
                label="Cost"
                type="number"
                value={values.cost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched.cost || submitCount > 0) && errors.cost}
              />
              <Input
                id="odometer"
                name="odometer"
                label="Odometer (km)"
                type="number"
                value={values.odometer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched.odometer || submitCount > 0) && errors.odometer}
              />
              <Button type="submit" loading={createMutation.isPending} fullWidth>
                Save fuel log
              </Button>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </div>
  );
}
