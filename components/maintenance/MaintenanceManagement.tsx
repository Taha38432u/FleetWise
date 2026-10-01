"use client";

import { useMemo, useState } from "react";
import { Button, Group, Loader, SimpleGrid } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { useAuthState } from "@/components/auth/AuthProvider";
import { useGetVehicles } from "@/hooks/useVehicles";
import { useStaff } from "@/hooks/useStaff";
import {
  useCreateMaintenance,
  useDeleteMaintenance,
  useMaintenance,
  useUpdateMaintenance,
} from "@/hooks/useMaintenance";
import { PageHeader } from "@/components/shared";
import { formatLabel } from "@/utils/formatLabel";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

const PAGE_SIZE = 10;

const emptyMaintenance = {
  vehicleId: "",
  mechanicId: "",
  type: "Routine Service",
  description: "",
  status: "PENDING",
  scheduledAt: "",
  completedAt: "",
  cost: "",
  notes: "",
};

const maintenanceSchema = Yup.object({
  vehicleId: Yup.string().required("Vehicle is required"),
  mechanicId: Yup.string().optional(),
  type: Yup.string().required("Type is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string()
    .oneOf(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .required("Status is required"),
  scheduledAt: Yup.string().required("Scheduled date/time is required"),
  completedAt: Yup.string().optional(),
  cost: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(0, "Cost cannot be negative")
    .optional(),
  notes: Yup.string().optional(),
});

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
  (status) => ({ value: status, label: formatLabel(status) }),
);

function toDateTimeInput(value?: string | null) {
  return value ? value.slice(0, 16) : "";
}

export default function MaintenancePage() {
  const { role } = useAuthState();
  const { isDemo, blockWrite } = useDemoReadOnly();
  const canCreateMaintenance = (role === "ADMIN" || role === "DISPATCHER") && !isDemo;
  const canDeleteMaintenance = role === "ADMIN" && !isDemo;
  const canEditMaintenance = !isDemo;

  const [editing, setEditing] = useState<any | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const maintenanceQuery = useMaintenance({ page: currentPage, pageSize: PAGE_SIZE });
  const vehiclesQuery = useGetVehicles({ page: 1, pageSize: 100 });
  const mechanicsQuery = useStaff({
    page: 1,
    pageSize: 100,
    role: "MECHANIC",
    enabled: role === "ADMIN" || role === "DISPATCHER",
  });
  const createMutation = useCreateMaintenance();
  const updateMutation = useUpdateMaintenance();
  const deleteMutation = useDeleteMaintenance();

  const vehicles = useMemo(
    () => vehiclesQuery.data?.data?.data || [],
    [vehiclesQuery.data],
  );
  const mechanics = mechanicsQuery.data?.data || [];
  const records = maintenanceQuery.data?.data || [];
  const meta = maintenanceQuery.data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage,
    pageSize: PAGE_SIZE,
  };

  const openCount = records.filter(
    (r: any) => r.status === "PENDING" || r.status === "IN_PROGRESS",
  ).length;

  const vehicleOptions = vehicles.map((vehicle: any) => ({
    value: vehicle.id,
    label: `${vehicle.plate} - ${vehicle.model}`,
  }));
  const mechanicOptions = [
    { value: "", label: "Unassigned" },
    ...mechanics.map((mechanic: any) => ({
      value: mechanic.id,
      label: `${mechanic.firstName} ${mechanic.lastName}`,
    })),
  ];

  const closeForm = () => {
    setEditing(null);
    setFormOpened(false);
  };

  const openCreate = () => {
    if (blockWrite("Creating maintenance")) return;
    setEditing(null);
    setFormOpened(true);
  };

  const openEdit = (record: any) => {
    if (blockWrite("Editing maintenance")) return;
    setEditing(record);
    setFormOpened(true);
  };

  const initialValues = editing
    ? {
        vehicleId: editing.vehicleId || "",
        mechanicId: editing.mechanicId || "",
        type: editing.type || "",
        description: editing.description || "",
        status: editing.status || "PENDING",
        scheduledAt: toDateTimeInput(editing.scheduledAt),
        completedAt: toDateTimeInput(editing.completedAt),
        cost: editing.cost ? String(editing.cost) : "",
        notes: editing.notes || "",
      }
    : emptyMaintenance;

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Vehicle",
        accessorKey: "vehicle",
        cell: ({ row }) => row.original.vehicle?.plate || "Unassigned",
      },
      { header: "Type", accessorKey: "type" },
      {
        header: "Mechanic",
        accessorKey: "mechanic",
        cell: ({ row }) =>
          row.original.mechanic
            ? `${row.original.mechanic.firstName} ${row.original.mechanic.lastName}`
            : "Unassigned",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => formatLabel(getValue()),
      },
      {
        header: "Scheduled",
        accessorKey: "scheduledAt",
        cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
      },
      {
        header: "Cost",
        accessorKey: "cost",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <Group gap="xs" wrap="nowrap">
            <Button
              variant="default"
              size="xs"
              disabled={
                !canEditMaintenance ||
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            {canDeleteMaintenance && (
              <Button
                variant="light"
                color="red"
                size="xs"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending
                }
                onClick={() => setDeleteId(row.original.id)}
              >
                Delete
              </Button>
            )}
          </Group>
        ),
      },
    ],
    [
      canDeleteMaintenance,
      canEditMaintenance,
      createMutation.isPending,
      deleteMutation.isPending,
      updateMutation.isPending,
    ],
  );

  if (maintenanceQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Workshop"
        title="Maintenance Operations"
        description="Schedule service jobs, assign mechanics, track status and cost from one queue."
        actions={
          canCreateMaintenance ? (
            <Button
              onClick={openCreate}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
            >
              Add Maintenance
            </Button>
          ) : isDemo ? (
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-muted">
              Read-only demo
            </span>
          ) : null
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Total records
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{meta.totalItems}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Open jobs
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{openCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Vehicles
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{vehicles.length}</p>
        </div>
      </section>

      <CustomTable
        title="Maintenance Queue"
        description="Service jobs and mechanic backlog."
        columns={columns}
        data={records}
        totalItems={meta.totalItems}
        pageCount={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setCurrentPage}
        isLoading={maintenanceQuery.isLoading}
      />

      <CustomModal
        opened={formOpened}
        onClose={closeForm}
        title={editing ? "Edit Maintenance" : "Add Maintenance"}
        size="xl"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={maintenanceSchema}
          enableReinitialize
          onSubmit={async (values) => {
            if (blockWrite("Saving maintenance")) return;
            const payload = {
              ...values,
              mechanicId: values.mechanicId || null,
              completedAt: values.completedAt || null,
              cost: values.cost ? Number(values.cost) : null,
            };

            try {
              if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, data: payload });
              } else {
                await createMutation.mutateAsync(payload);
              }
              toast.success(editing ? "Maintenance updated" : "Maintenance created");
              closeForm();
              setCurrentPage(1);
            } catch (error: any) {
              toast.error(
                error?.response?.data?.message ||
                  error?.message ||
                  "Failed to save maintenance record",
              );
            }
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <CustomSelect
                  label="Vehicle"
                  placeholder="Select vehicle"
                  options={vehicleOptions}
                  withAsterisk
                  value={
                    vehicleOptions.find((option: any) => option.value === values.vehicleId) ||
                    null
                  }
                  onChange={(option: any) => setFieldValue("vehicleId", option?.value || "")}
                  error={touched.vehicleId ? errors.vehicleId : undefined}
                />
                <CustomSelect
                  label="Mechanic"
                  placeholder="Assign mechanic"
                  options={mechanicOptions}
                  value={
                    mechanicOptions.find((option: any) => option.value === values.mechanicId) ||
                    mechanicOptions[0]
                  }
                  onChange={(option: any) => setFieldValue("mechanicId", option?.value || "")}
                  error={touched.mechanicId ? errors.mechanicId : undefined}
                />
                <Input
                  label="Type"
                  placeholder="Routine Service"
                  value={values.type}
                  onChange={(event) => setFieldValue("type", event.target.value)}
                  error={touched.type ? errors.type : undefined}
                />
                <CustomSelect
                  label="Status"
                  options={statusOptions}
                  value={
                    statusOptions.find((option) => option.value === values.status) || null
                  }
                  onChange={(option: any) =>
                    setFieldValue("status", option?.value || "PENDING")
                  }
                  error={touched.status ? errors.status : undefined}
                />
                <Input
                  label="Scheduled At"
                  type="datetime-local"
                  value={values.scheduledAt}
                  onChange={(event) => setFieldValue("scheduledAt", event.target.value)}
                  error={touched.scheduledAt ? errors.scheduledAt : undefined}
                />
                <Input
                  label="Completed At"
                  type="datetime-local"
                  value={values.completedAt}
                  onChange={(event) => setFieldValue("completedAt", event.target.value)}
                  error={touched.completedAt ? errors.completedAt : undefined}
                />
                <Input
                  label="Estimated Cost"
                  type="number"
                  value={values.cost}
                  onChange={(event) => setFieldValue("cost", event.target.value)}
                  error={touched.cost ? errors.cost : undefined}
                />
                <Input
                  label="Notes"
                  value={values.notes}
                  onChange={(event) => setFieldValue("notes", event.target.value)}
                  error={touched.notes ? errors.notes : undefined}
                />
              </SimpleGrid>

              <label className="mt-5 block text-sm font-bold text-ink">
                Description
                <textarea
                  className={`mt-2 min-h-[110px] w-full rounded-xl border px-4 py-3 text-ink transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-green-100 ${
                    touched.description && errors.description
                      ? "border-red-500"
                      : "border-line"
                  }`}
                  value={values.description}
                  onChange={(event) => setFieldValue("description", event.target.value)}
                />
              </label>
              {touched.description && errors.description && (
                <p className="mt-2 text-sm text-red-600">{String(errors.description)}</p>
              )}

              <Group justify="flex-end" mt="xl">
                <Button
                  variant="default"
                  onClick={closeForm}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editing ? "Save Changes" : "Create Maintenance"}
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Maintenance"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this maintenance record?
        </p>
        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => setDeleteId(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (!deleteId || blockWrite("Deleting maintenance")) return;
              deleteMutation.mutate(deleteId, {
                onSuccess: () => {
                  toast.success("Maintenance deleted");
                  setDeleteId(null);
                },
                onError: (error: any) =>
                  toast.error(
                    error?.response?.data?.message || error?.message || "Delete failed",
                  ),
              });
            }}
          >
            Delete
          </Button>
        </Group>
      </CustomModal>
    </div>
  );
}
