"use client";

import { useMemo, useState } from "react";
import { Button, Group, LoadingOverlay, SimpleGrid, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { StaffInput, StaffUser } from "@/api/staff/staffApi";
import { useCreateStaff, useDeleteStaff, useStaff, useUpdateStaff } from "@/hooks/useStaff";
import { PageHeader, Surface } from "@/components/shared";
import { useAuthState } from "@/components/auth/AuthProvider";
import { formatLabel } from "@/utils/formatLabel";

const PAGE_SIZE = 10;

const getStaffSchema = (mode: "add" | "edit") =>
  Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string().optional(),
    role: Yup.string()
      .oneOf(["ADMIN", "DISPATCHER", "DRIVER", "MECHANIC"])
      .required("Role is required"),
    status: Yup.string()
      .oneOf(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"])
      .required(),
    password:
      mode === "add"
        ? Yup.string().required("Password is required").min(8)
        : Yup.string()
            .optional()
            .test(
              "empty-or-min",
              "Password must be at least 8 characters",
              (value) => !value || value.length >= 8,
            ),
    licenseNumber: Yup.string().when("role", {
      is: "DRIVER",
      then: (schema) => schema.required("License number is required"),
      otherwise: (schema) => schema.optional(),
    }),
    licenseExpiry: Yup.string().when("role", {
      is: "DRIVER",
      then: (schema) => schema.required("License expiry is required"),
      otherwise: (schema) => schema.optional(),
    }),
    yearsOfExperience: Yup.number().when("role", {
      is: "DRIVER",
      then: (schema) =>
        schema
          .typeError("Years of experience must be a number")
          .min(0)
          .required("Years of experience is required"),
      otherwise: (schema) => schema.optional(),
    }),
    emergencyContact: Yup.string().when("role", {
      is: "DRIVER",
      then: (schema) => schema.required("Emergency contact is required"),
      otherwise: (schema) => schema.optional(),
    }),
    emergencyContactPhone: Yup.string().when("role", {
      is: "DRIVER",
      then: (schema) => schema.required("Emergency contact phone is required"),
      otherwise: (schema) => schema.optional(),
    }),
  });

const emptyStaff: StaffInput & { status: string } = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: "DISPATCHER",
  status: "ACTIVE",
  password: "FleetWise123",
  licenseNumber: "",
  licenseExpiry: "",
  yearsOfExperience: "",
  emergencyContact: "",
  emergencyContactPhone: "",
};

export default function StaffPage() {
  const { user } = useAuthState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffUser | null>(null);

  const staffQuery = useStaff({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    role: roleFilter || undefined,
  });
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();

  const staff = (staffQuery.data?.data || []).filter((item) => item.id !== user?.id);
  const meta = staffQuery.data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage: page,
    pageSize: PAGE_SIZE,
  };

  const columns = useMemo<ColumnDef<StaffUser>[]>(
    () => [
      {
        header: "Name",
        id: "name",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      { header: "Email", accessorKey: "email" },
      { header: "Phone", cell: ({ row }) => row.original.phone || "-" },
      { header: "Role", cell: ({ row }) => formatLabel(row.original.role) },
      { header: "Status", cell: ({ row }) => formatLabel(row.original.status) },
      {
        header: "Details",
        id: "details",
        cell: ({ row }) => {
          if (row.original.role !== "DRIVER") {
            return row.original.phone || "-";
          }
          const driver = row.original.driver;
          if (!driver) return "-";
          return [
            `License ${driver.licenseNumber}`,
            `Exp ${driver.licenseExpiry?.slice(0, 10) || "-"}`,
            `${driver.yearsOfExperience ?? 0} yrs`,
            `Emergency ${driver.emergencyContact || "-"} ${driver.emergencyContactPhone || ""}`,
          ].join(" | ");
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString(),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <Group gap="xs" wrap="nowrap">
            <Button
              size="xs"
              variant="default"
              onClick={() => {
                setEditing(row.original);
                setFormOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              variant="light"
              onClick={() => setDeleteTarget(row.original)}
            >
              Deactivate
            </Button>
          </Group>
        ),
      },
    ],
    [],
  );

  const initialValues = editing
    ? {
        email: editing.email,
        firstName: editing.firstName,
        lastName: editing.lastName,
        phone: editing.phone || "",
        role: editing.role,
        status: editing.status,
        password: "",
        licenseNumber: editing.driver?.licenseNumber || "",
        licenseExpiry: editing.driver?.licenseExpiry?.slice(0, 10) || "",
        yearsOfExperience: editing.driver?.yearsOfExperience ?? "",
        emergencyContact: editing.driver?.emergencyContact || "",
        emergencyContactPhone: editing.driver?.emergencyContactPhone || "",
      }
    : emptyStaff;

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Access"
        title="User Management"
        description="Create admin, dispatcher, mechanic, and driver users that power the operational flow."
        actions={
        <Button
          leftSection={<IconPlus size={18} />}
          disabled={createStaff.isPending || updateStaff.isPending}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add User
        </Button>
        }
      />

      <Surface className="grid gap-3 md:grid-cols-[1fr_220px]">
        <TextInput
          placeholder="Search staff by name or email"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
        />
        <CustomSelect
          placeholder="Role"
          options={[
            { value: "", label: "All roles" },
            { value: "ADMIN", label: "Admin" },
            { value: "DISPATCHER", label: "Dispatcher" },
            { value: "DRIVER", label: "Driver" },
            { value: "MECHANIC", label: "Mechanic" },
          ]}
          value={{ value: roleFilter, label: roleFilter || "All roles" }}
          onChange={(option: any) => {
            setRoleFilter(option?.value || "");
            setPage(1);
          }}
        />
      </Surface>

      <CustomTable
        title="Managed Users"
        description="Admin-created users for dispatch, maintenance, driver route execution, and administration."
        columns={columns}
        data={staff}
        totalItems={meta.totalItems}
        pageCount={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setPage}
        isLoading={staffQuery.isLoading}
      />

      <CustomModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit User" : "Add User"}
        size="lg"
      >
        <div className="relative">
          <LoadingOverlay visible={createStaff.isPending || updateStaff.isPending} />
          <Formik
            initialValues={initialValues}
            validationSchema={getStaffSchema(editing ? "edit" : "add")}
            enableReinitialize
            onSubmit={(values) => {
              const payload: StaffInput = {
                ...values,
                password: values.password || undefined,
              };
              if (values.role === "DRIVER" && editing) {
                payload.driver = {
                  licenseNumber: values.licenseNumber,
                  licenseExpiry: values.licenseExpiry,
                  yearsOfExperience: values.yearsOfExperience,
                  emergencyContact: values.emergencyContact,
                  emergencyContactPhone: values.emergencyContactPhone,
                };
              }
              const action = editing
                ? updateStaff.mutateAsync({ id: editing.id, data: payload })
                : createStaff.mutateAsync(payload as StaffInput);

              action
                .then(() => {
                  toast.success(editing ? "User updated" : "User created");
                  setFormOpen(false);
                  setEditing(null);
                  setPage(1);
                })
                .catch((error: any) =>
                  toast.error(error?.message || "Failed to save user"),
                );
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Input label="Email" value={values.email} onChange={(e) => setFieldValue("email", e.target.value)} error={touched.email ? errors.email : undefined} />
                  <Input label="Phone" value={values.phone} onChange={(e) => setFieldValue("phone", e.target.value)} error={touched.phone ? errors.phone : undefined} />
                  <Input label="First Name" value={values.firstName} onChange={(e) => setFieldValue("firstName", e.target.value)} error={touched.firstName ? errors.firstName : undefined} />
                  <Input label="Last Name" value={values.lastName} onChange={(e) => setFieldValue("lastName", e.target.value)} error={touched.lastName ? errors.lastName : undefined} />
                  <CustomSelect
                    label="Role"
                    options={[
                      { value: "ADMIN", label: "Admin" },
                      { value: "DISPATCHER", label: "Dispatcher" },
                      { value: "DRIVER", label: "Driver" },
                      { value: "MECHANIC", label: "Mechanic" },
                    ]}
                    value={{ value: values.role, label: formatLabel(values.role) }}
                    onChange={(option: any) => setFieldValue("role", option?.value)}
                    error={touched.role ? errors.role : undefined}
                  />
                  <CustomSelect
                    label="Status"
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "INACTIVE", label: "Inactive" },
                      { value: "SUSPENDED", label: "Suspended" },
                    ]}
                    value={{ value: values.status, label: formatLabel(values.status) }}
                    onChange={(option: any) => setFieldValue("status", option?.value)}
                    error={touched.status ? errors.status : undefined}
                  />
                  <Input
                    label={editing ? "New Password" : "Password"}
                    type="password"
                    value={values.password || ""}
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    error={touched.password ? errors.password : undefined}
                  />
                  {values.role === "DRIVER" && (
                    <>
                      <Input
                        label="License Number"
                        value={values.licenseNumber || ""}
                        onChange={(e) => setFieldValue("licenseNumber", e.target.value)}
                        error={touched.licenseNumber ? errors.licenseNumber : undefined}
                      />
                      <Input
                        label="License Expiry"
                        type="date"
                        value={values.licenseExpiry || ""}
                        onChange={(e) => setFieldValue("licenseExpiry", e.target.value)}
                        error={touched.licenseExpiry ? errors.licenseExpiry : undefined}
                      />
                      <Input
                        label="Years of Experience"
                        type="number"
                        value={String(values.yearsOfExperience || "")}
                        onChange={(e) => setFieldValue("yearsOfExperience", e.target.value)}
                        error={touched.yearsOfExperience ? errors.yearsOfExperience : undefined}
                      />
                      <Input
                        label="Emergency Contact"
                        value={values.emergencyContact || ""}
                        onChange={(e) => setFieldValue("emergencyContact", e.target.value)}
                        error={touched.emergencyContact ? errors.emergencyContact : undefined}
                      />
                      <Input
                        label="Emergency Phone"
                        value={values.emergencyContactPhone || ""}
                        onChange={(e) => setFieldValue("emergencyContactPhone", e.target.value)}
                        error={
                          touched.emergencyContactPhone
                            ? errors.emergencyContactPhone
                            : undefined
                        }
                      />
                    </>
                  )}
                </SimpleGrid>
                <Group mt="xl" grow>
                  <Button
                    variant="default"
                    onClick={() => setFormOpen(false)}
                    disabled={createStaff.isPending || updateStaff.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={createStaff.isPending || updateStaff.isPending}
                    disabled={createStaff.isPending || updateStaff.isPending}
                  >
                    {editing ? "Save Changes" : "Create User"}
                  </Button>
                </Group>
              </Form>
            )}
          </Formik>
        </div>
      </CustomModal>

      <CustomModal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Deactivate User"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          This will deactivate the user login. Driver users are also removed from assignable driver lists.
        </p>
        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => setDeleteTarget(null)}
            disabled={deleteStaff.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={deleteStaff.isPending}
            disabled={deleteStaff.isPending}
            onClick={() => {
              if (!deleteTarget) return;
              deleteStaff.mutate(deleteTarget.id, {
                onSuccess: () => {
                  toast.success("User deactivated");
                  setDeleteTarget(null);
                },
                onError: (error: any) =>
                  toast.error(error?.message || "Deactivate failed"),
              });
            }}
          >
            Deactivate
          </Button>
        </Group>
      </CustomModal>
    </div>
  );
}
