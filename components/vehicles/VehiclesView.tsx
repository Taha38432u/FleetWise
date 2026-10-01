"use client";

import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { Vehicle, CreateVehicleDto } from "@/data/vehicles";
import { VehicleStats } from "@/components/vehicles/VehicleStats";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { VehicleDeleteModal } from "@/components/vehicles/VehicleDeleteModal";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  FilterSection,
  FilterControls,
  FilterControl,
  ActiveFilterBadges,
  ResultsSummary,
} from "@/components/common/Filters";
import CustomSelect from "@/components/common/Input/CustomSelect";
import {
  useGetVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from "@/hooks/useVehicles";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/shared";

const PAGE_SIZE = 10;

export default function VehiclesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // API Hooks
  const { data: vehiclesResponse, isLoading } = useGetVehicles({
    page: currentPage,
    pageSize: PAGE_SIZE,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  // Extract data
  const vehicles = vehiclesResponse?.data?.data || [];
  const meta = vehiclesResponse?.data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  };

  // Actions
  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormMode("edit");
    setEditVehicle(vehicle);
    openForm();
  };

  const handleDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete?.id) {
      deleteMutation.mutate(vehicleToDelete.id, {
        onSuccess: () => {
          toast.success("Vehicle deleted successfully");
          closeDeleteModal();
          setVehicleToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to delete vehicle");
        },
      });
    }
  };

  const handleAdd = () => {
    setFormMode("add");
    setEditVehicle(null);
    openForm();
  };

  const handleFormSubmit = (values: CreateVehicleDto) => {
    const toVehiclePayload = (input: any): CreateVehicleDto => ({
      plate: input.plate,
      type: input.type,
      model: input.model,
      year: Number(input.year),
      status: input.status,
      mileage: Number(input.mileage || 0),
      fuelEfficiency: Number(input.fuelEfficiency || 0),
      assignedDriverId: input.assignedDriverId || "",
      insuranceExpiry: input.insuranceExpiry || "",
      fitnessExpiry: input.fitnessExpiry || "",
      lastService: input.lastService || "",
      nextPredictedMaintenance: input.nextPredictedMaintenance || "",
      healthScore: Number(input.healthScore || 100),
    });
    const payload = toVehiclePayload(values);

    if (formMode === "add") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Vehicle created successfully");
          closeForm();
          setCurrentPage(1);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create vehicle");
        },
      });
    } else if (formMode === "edit" && editVehicle) {
      updateMutation.mutate(
        { id: editVehicle.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Vehicle updated successfully");
            closeForm();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update vehicle");
          },
        }
      );
    }
  };

  const hasActiveFilters = Boolean(search || statusFilter || typeFilter);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(null);
    setTypeFilter(null);
    setCurrentPage(1);
  };

  const activeFilters = [
    ...(search
      ? [
          {
            key: "search",
            label: `Search: ${search}`,
            value: search,
            onRemove: () => setSearch(""),
          },
        ]
      : []),
    ...(statusFilter
      ? [
          {
            key: "status",
            label: `Status: ${statusFilter}`,
            value: statusFilter,
            onRemove: () => setStatusFilter(null),
          },
        ]
      : []),
    ...(typeFilter
      ? [
          {
            key: "type",
            label: `Type: ${typeFilter}`,
            value: typeFilter,
            onRemove: () => setTypeFilter(null),
          },
        ]
      : []),
  ];

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Assets"
        title="Vehicles Management"
        description="Manage fleet assets, assignments, maintenance readiness, and operational status."
        actions={
        <Button
          variant="filled"
          onClick={handleAdd}
          leftSection={<IconPlus size={16} />}
          size="md"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          Add Vehicle
        </Button>
        }
      />

      <VehicleStats vehicles={vehicles} />

      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={meta.totalItems}
        totalCount={meta.totalItems}
        onClearFilters={clearFilters}
        title="Vehicle Filters"
      >
        <FilterControls>
          <FilterControl className="min-w-[200px] flex-1">
            <TextInput
              placeholder="Search plate or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
              rightSection={
                search ? (
                  <IconX
                    size={16}
                    className="cursor-pointer text-muted hover:text-primary"
                    onClick={() => setSearch("")}
                  />
                ) : null
              }
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <CustomSelect
              placeholder="Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Idle", label: "Idle" },
                { value: "In Maintenance", label: "In Maintenance" },
                { value: "Decommissioned", label: "Decommissioned" },
              ]}
              value={
                statusFilter
                  ? { value: statusFilter, label: statusFilter }
                  : null
              }
              onChange={(option: any) => setStatusFilter(option?.value || null)}
              isClearable
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <CustomSelect
              placeholder="Vehicle Type"
              options={[
                { value: "Truck", label: "Truck" },
                { value: "Van", label: "Van" },
                { value: "Car", label: "Car" },
                { value: "Bike", label: "Bike" },
              ]}
              value={
                typeFilter ? { value: typeFilter, label: typeFilter } : null
              }
              onChange={(option: any) => setTypeFilter(option?.value || null)}
              isClearable
            />
          </FilterControl>
        </FilterControls>
      </FilterSection>

      {hasActiveFilters && <ActiveFilterBadges filters={activeFilters} />}

      <ResultsSummary
        filteredCount={meta.totalItems}
        totalCount={meta.totalItems}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <VehicleTable
        data={vehicles}
        totalItems={meta.totalItems}
        totalPages={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {isFormOpen && (
        <VehicleForm
          opened={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          initialValues={editVehicle}
          mode={formMode}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VehicleDeleteModal
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        vehiclePlate={vehicleToDelete?.plate}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
