"use client";

import { useMemo, useState } from "react";
import { Button, Group, Loader, SimpleGrid } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { LatLngValue, LocationPickerMap } from "@/components/map/LocationPickerMap";
import { formatLocation, parseLocationParts, reverseGeocode } from "@/components/map/locationUtils";
import { useGetDrivers } from "@/hooks/useDrivers";
import { useGetVehicles } from "@/hooks/useVehicles";
import {
  useCreateRoute,
  useDeleteRoute,
  useGetRouteLocation,
  useRequestRouteLocation,
  useRoutes,
  useUpdateRoute,
} from "@/hooks/useRoutes";
import { PageHeader } from "@/components/shared";
import { formatLabel } from "@/utils/formatLabel";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

const initialRouteForm = {
  name: "",
  startLocation: "",
  endLocation: "",
  scheduledAt: "",
  driverId: "",
  vehicleId: "",
  status: "SCHEDULED",
  estimatedDistance: "",
  estimatedDurationMinutes: "",
  notes: "",
};

const PAGE_SIZE = 10;

const routeSchema = Yup.object({
  name: Yup.string().required("Route name is required").min(3),
  startLocation: Yup.string().required("Start location is required"),
  endLocation: Yup.string().required("End location is required"),
  scheduledAt: Yup.string().required("Scheduled date/time is required"),
  driverId: Yup.string().optional(),
  vehicleId: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .required(),
  estimatedDistance: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(0)
    .optional(),
  estimatedDurationMinutes: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .min(0)
    .optional(),
  notes: Yup.string().optional(),
});

const statusOptions = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
  (status) => ({ value: status, label: formatLabel(status) }),
);

function parseLocation(value?: string): LatLngValue | null {
  return parseLocationParts(value).point;
}

function distanceKm(from: LatLngValue, to: LatLngValue) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RoutesPage() {
  const { isDemo, blockWrite } = useDemoReadOnly();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialRouteForm);
  const [formOpened, setFormOpened] = useState(false);
  const [pickingField, setPickingField] = useState<"startLocation" | "endLocation" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailRoute, setDetailRoute] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const routesQuery = useRoutes({ page: currentPage, pageSize: PAGE_SIZE });
  const driversQuery = useGetDrivers({ page: 1, pageSize: 100 });
  const vehiclesQuery = useGetVehicles({ page: 1, pageSize: 100 });
  const createMutation = useCreateRoute();
  const updateMutation = useUpdateRoute();
  const deleteMutation = useDeleteRoute();
  const getRouteLocation = useGetRouteLocation();
  const requestRouteLocation = useRequestRouteLocation();

  const routes = routesQuery.data?.data || [];
  const meta = routesQuery.data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage,
    pageSize: PAGE_SIZE,
  };
  const drivers = useMemo(
    () => driversQuery.data?.data?.data || [],
    [driversQuery.data],
  );
  const vehicles = useMemo(
    () => vehiclesQuery.data?.data?.data || [],
    [vehiclesQuery.data],
  );

  const driverOptions = useMemo(
    () => [
      { value: "", label: "Unassigned" },
      ...drivers.map((driver: any) => ({
        value: driver.id,
        label: `${driver.user?.firstName || ""} ${driver.user?.lastName || ""}`.trim() || driver.id,
      })),
    ],
    [drivers],
  );

  const vehicleOptions = useMemo(
    () => [
      { value: "", label: "Unassigned" },
      ...vehicles.map((vehicle: any) => ({
        value: vehicle.id,
        label: `${vehicle.plate} - ${vehicle.model}`,
      })),
    ],
    [vehicles],
  );

  const resetForm = () => {
    setForm(initialRouteForm);
    setEditingId(null);
    setFormOpened(false);
  };

  const openCreate = () => {
    if (blockWrite("Creating routes")) return;
    setForm(initialRouteForm);
    setEditingId(null);
    setFormOpened(true);
  };

  const openEdit = (route: any) => {
    if (blockWrite("Editing routes")) return;
    setEditingId(route.id);
    setForm({
      name: route.name,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      scheduledAt: route.scheduledAt.slice(0, 16),
      driverId: route.driverId || "",
      vehicleId: route.vehicleId || "",
      status: route.status,
      estimatedDistance: route.estimatedDistance ? String(route.estimatedDistance) : "",
      estimatedDurationMinutes: route.estimatedDurationMinutes
        ? String(route.estimatedDurationMinutes)
        : "",
      notes: route.notes || "",
    });
    setFormOpened(true);
  };

  const submit = (values: typeof initialRouteForm) => {
    const payload = {
      ...values,
      estimatedDistance: values.estimatedDistance
        ? Number(values.estimatedDistance)
        : null,
      estimatedDurationMinutes: values.estimatedDurationMinutes
        ? Number(values.estimatedDurationMinutes)
        : null,
      driverId: values.driverId || null,
      vehicleId: values.vehicleId || null,
    };

    const action = editingId
      ? updateMutation.mutateAsync({ id: editingId, data: payload })
      : createMutation.mutateAsync(payload);

    action
      .then(() => {
        toast.success(editingId ? "Route updated" : "Route created");
        resetForm();
        setCurrentPage(1);
      })
      .catch((error: any) => {
        toast.error(error?.message || "Failed to save route");
      });
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: "Route", accessorKey: "name" },
      {
        header: "Start",
        accessorKey: "startLocation",
        cell: ({ getValue }) => {
          const parts = parseLocationParts(String(getValue() || ""));
          return (
            <div>
              <p className="font-semibold text-ink">{parts.label || "Unnamed point"}</p>
              <p className="text-xs text-muted">{parts.coordinates}</p>
            </div>
          );
        },
      },
      {
        header: "End",
        accessorKey: "endLocation",
        cell: ({ getValue }) => {
          const parts = parseLocationParts(String(getValue() || ""));
          return (
            <div>
              <p className="font-semibold text-ink">{parts.label || "Unnamed point"}</p>
              <p className="text-xs text-muted">{parts.coordinates}</p>
            </div>
          );
        },
      },
      {
        header: "Driver",
        accessorKey: "driver",
        cell: ({ row }) =>
          row.original.driver?.user
            ? `${row.original.driver.user.firstName} ${row.original.driver.user.lastName}`
            : "Unassigned",
      },
      {
        header: "Vehicle",
        accessorKey: "vehicle",
        cell: ({ row }) => row.original.vehicle?.plate || "Unassigned",
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
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <Group gap="xs" wrap="nowrap">
            <Button
              variant="default"
              size="xs"
              disabled={deleteMutation.isPending || createMutation.isPending || updateMutation.isPending}
              onClick={() => setDetailRoute(row.original)}
            >
              Details
            </Button>
            <Button
              variant="default"
              size="xs"
              disabled={deleteMutation.isPending || createMutation.isPending || updateMutation.isPending}
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="light"
              size="xs"
              disabled={getRouteLocation.isPending || !row.original.vehicleId}
              onClick={() =>
                getRouteLocation.mutate(row.original.id, {
                  onSuccess: (response: any) => {
                    const location = response?.data?.location;
                    setDetailRoute({
                      ...row.original,
                      vehicle: {
                        ...row.original.vehicle,
                        gpsLogs: location ? [location] : [],
                      },
                    });
                    toast.success(location ? "Current location loaded" : "No GPS update yet");
                  },
                  onError: (error: any) =>
                    toast.error(
                      error?.response?.data?.message ||
                        error?.message ||
                        "Location lookup failed",
                    ),
                })
              }
            >
              Get Location
            </Button>
            <Button
              variant="light"
              size="xs"
              disabled={
                requestRouteLocation.isPending ||
                !row.original.driverId ||
                row.original.status !== "IN_PROGRESS"
              }
              onClick={() =>
                requestRouteLocation.mutate(row.original.id, {
                  onSuccess: () => toast.success("Location request sent to driver"),
                  onError: (error: any) =>
                    toast.error(
                      error?.response?.data?.message ||
                        error?.message ||
                        "Could not request location",
                    ),
                })
              }
            >
              Ping Driver
            </Button>
            <Button
              variant="light"
              color="red"
              size="xs"
              disabled={deleteMutation.isPending || createMutation.isPending || updateMutation.isPending}
              onClick={() => setDeleteId(row.original.id)}
            >
              Delete
            </Button>
          </Group>
        ),
      },
    ],
    [
      createMutation.isPending,
      deleteMutation.isPending,
      updateMutation.isPending,
      getRouteLocation,
      requestRouteLocation,
    ],
  );

  if (routesQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Dispatch"
        title="Route Dispatch"
        description="Assign routes to driver and vehicle pairs, then track execution progress from one queue."
        actions={
          <Button
            onClick={openCreate}
            disabled={
              isDemo ||
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending
            }
          >
            Add Route
          </Button>
        }
      />

      <CustomTable
        title="Dispatch Board"
        description="Paged route assignments across drivers and vehicles."
        columns={columns}
        data={routes}
        totalItems={meta.totalItems}
        pageCount={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setCurrentPage}
        isLoading={routesQuery.isLoading}
      />

      <CustomModal
        opened={Boolean(detailRoute)}
        onClose={() => setDetailRoute(null)}
        title="Route Details"
        size="lg"
      >
        {detailRoute && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(() => {
              const start = parseLocationParts(detailRoute.startLocation);
              const end = parseLocationParts(detailRoute.endLocation);
              return [
              ["Route", detailRoute.name],
              ["Driver", detailRoute.driver?.user ? `${detailRoute.driver.user.firstName} ${detailRoute.driver.user.lastName}` : "Unassigned"],
              ["Vehicle", detailRoute.vehicle?.plate || "Unassigned"],
              ["Destination name", end.label || "Unnamed destination"],
              ["Destination point", end.coordinates],
              ["Start name", start.label || "Unnamed start point"],
              ["Start point", start.coordinates],
              ["Status", formatLabel(detailRoute.status)],
              ["Scheduled", new Date(detailRoute.scheduledAt).toLocaleString()],
              ["Current location", detailRoute.vehicle?.gpsLogs?.[0] ? `${detailRoute.vehicle.gpsLogs[0].latitude}, ${detailRoute.vehicle.gpsLogs[0].longitude}` : "No GPS update yet"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-line bg-surface p-4">
                <p className="ui-kicker">{label}</p>
                <p className="mt-2 text-sm font-bold text-ink">{value}</p>
              </div>
            ));
            })()}
          </div>
        )}
      </CustomModal>

      <CustomModal
        opened={formOpened}
        onClose={resetForm}
        title={editingId ? "Edit Route" : "Add Route"}
        size="xl"
      >
        <Formik
          initialValues={form}
          validationSchema={routeSchema}
          enableReinitialize
          onSubmit={(values) => submit(values)}
        >
          {({ values, errors, touched, setFieldValue }) => {
            const startPoint = parseLocation(values.startLocation);
            const endPoint = parseLocation(values.endLocation);
              const updateRoutePoint = async (
                field: "startLocation" | "endLocation",
                point: LatLngValue,
              ) => {
              const label = await reverseGeocode(point).catch(() => "");
              const nextValue = formatLocation(point, label);
              setFieldValue(field, nextValue);

              const nextStart = field === "startLocation" ? point : startPoint;
              const nextEnd = field === "endLocation" ? point : endPoint;
              if (nextStart && nextEnd) {
                setFieldValue("estimatedDistance", distanceKm(nextStart, nextEnd).toFixed(1));
              }
            };

            return (
            <Form>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Input
                  label="Route Name"
                  value={values.name}
                  onChange={(event) => setFieldValue("name", event.target.value)}
                  error={touched.name ? errors.name : undefined}
                />
                <Input
                  label="Scheduled At"
                  type="datetime-local"
                  value={values.scheduledAt}
                  onChange={(event) => setFieldValue("scheduledAt", event.target.value)}
                  error={touched.scheduledAt ? errors.scheduledAt : undefined}
                />
                <div className="space-y-2">
                  <Input
                    label="Start Location"
                    value={values.startLocation}
                    readOnly
                    placeholder="Pick start point from map"
                    error={touched.startLocation ? errors.startLocation : undefined}
                  />
                  <Button
                    type="button"
                    variant="default"
                    leftSection={<IconMapPin size={16} />}
                    onClick={() => setPickingField("startLocation")}
                    fullWidth
                  >
                    Pick Start On Map
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    label="End Location"
                    value={values.endLocation}
                    readOnly
                    placeholder="Pick destination from map"
                    error={touched.endLocation ? errors.endLocation : undefined}
                  />
                  <Button
                    type="button"
                    variant="default"
                    leftSection={<IconMapPin size={16} />}
                    onClick={() => setPickingField("endLocation")}
                    fullWidth
                  >
                    Pick End On Map
                  </Button>
                </div>
                <CustomSelect
                  label="Driver"
                  options={driverOptions}
                  value={driverOptions.find((option) => option.value === values.driverId) || driverOptions[0]}
                  onChange={(option: any) => setFieldValue("driverId", option?.value || "")}
                />
                <CustomSelect
                  label="Vehicle"
                  options={vehicleOptions}
                  value={vehicleOptions.find((option) => option.value === values.vehicleId) || vehicleOptions[0]}
                  onChange={(option: any) => setFieldValue("vehicleId", option?.value || "")}
                />
                <CustomSelect
                  label="Status"
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === values.status) || null}
                  onChange={(option: any) => setFieldValue("status", option?.value || "SCHEDULED")}
                  error={touched.status ? errors.status : undefined}
                />
                <Input
                  label="Estimated Distance"
                  type="number"
                  value={values.estimatedDistance}
                  onChange={(event) => setFieldValue("estimatedDistance", event.target.value)}
                  error={touched.estimatedDistance ? errors.estimatedDistance : undefined}
                />
                <Input
                  label="Duration Minutes"
                  type="number"
                  value={values.estimatedDurationMinutes}
                  onChange={(event) => setFieldValue("estimatedDurationMinutes", event.target.value)}
                  error={touched.estimatedDurationMinutes ? errors.estimatedDurationMinutes : undefined}
                />
                <Input
                  label="Notes"
                  value={values.notes}
                  onChange={(event) => setFieldValue("notes", event.target.value)}
                />
              </SimpleGrid>

              <Group justify="flex-end" mt="xl">
                <Button
                  variant="default"
                  onClick={resetForm}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Save Changes" : "Create Route"}
                </Button>
              </Group>

              <CustomModal
                opened={Boolean(pickingField)}
                onClose={() => setPickingField(null)}
                title={
                  pickingField === "startLocation"
                    ? "Pick Start Location"
                    : "Pick End Location"
                }
                size="xl"
              >
                <LocationPickerMap
                  label={
                    pickingField === "startLocation"
                      ? "Route Start"
                      : "Route Destination"
                  }
                    markerColor={pickingField === "startLocation" ? "#157347" : "#0b3d27"}
                  value={
                    pickingField === "startLocation" ? startPoint : endPoint
                  }
                  onChange={(point) => {
                    if (!pickingField) return;
                    updateRoutePoint(pickingField, point);
                  }}
                />
                <Group justify="space-between" mt="md">
                  <p className="text-sm text-slate-600">
                    {pickingField === "startLocation"
                      ? values.startLocation || "No start point selected"
                      : values.endLocation || "No end point selected"}
                  </p>
                  <Button type="button" onClick={() => setPickingField(null)}>
                    Use This Location
                  </Button>
                </Group>
              </CustomModal>
            </Form>
            );
          }}
        </Formik>
      </CustomModal>

      <CustomModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Route"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this route?
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
              if (!deleteId) return;
              deleteMutation.mutate(deleteId, {
                onSuccess: () => {
                  toast.success("Route deleted");
                  setDeleteId(null);
                },
                onError: (error: any) =>
                  toast.error(error?.message || "Delete failed"),
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
