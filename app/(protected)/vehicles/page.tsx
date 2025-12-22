"use client";

import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { vehiclesData, Vehicle } from "@/data/vehicles";
import { VehicleStats } from "@/components/vehicles/VehicleStats";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  FilterSection,
  FilterControls,
  FilterControl,
  ActiveFilterBadges,
  ResultsSummary,
} from "@/components/common/Filters";
import CustomSelect from "@/components/common/Input/CustomSelect";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  // Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Actions
  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormMode("edit");
    setEditVehicle(vehicle);
    openForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleAdd = () => {
    setFormMode("add");
    setEditVehicle(null);
    openForm();
  };

  const handleFormSubmit = (values: Omit<Vehicle, "id">) => {
    if (formMode === "add") {
      const newVehicle: Vehicle = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        health_score: 100, // Default for new
      };
      setVehicles((prev) => [newVehicle, ...prev]);
    } else if (formMode === "edit" && editVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editVehicle.id ? { ...v, ...values } : v))
      );
    }
    closeForm();
  };

  // Filtering Logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plate.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesType = typeFilter ? v.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedData = filteredVehicles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Vehicles Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your fleet assets, track maintenance, and monitor health.
          </p>
        </div>
        <Button
          variant="filled"
          onClick={handleAdd}
          leftSection={<IconPlus size={16} />}
          size="md"
        >
          Add Vehicle
        </Button>
      </div>

      {/* Stats Section */}
      <VehicleStats vehicles={vehicles} />

      {/* Filter Section */}
      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={totalItems}
        totalCount={vehicles.length}
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
                    className="cursor-pointer text-gray-500"
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
              // @ts-ignore
              value={
                statusFilter
                  ? { value: statusFilter, label: statusFilter }
                  : null
              }
              onChange={(option: any) => setStatusFilter(option?.value || null)}
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <CustomSelect
              placeholder="Type"
              options={[
                { value: "Truck", label: "Truck" },
                { value: "Van", label: "Van" },
                { value: "Car", label: "Car" },
                { value: "Bike", label: "Bike" },
              ]}
              // @ts-ignore
              value={
                typeFilter ? { value: typeFilter, label: typeFilter } : null
              }
              onChange={(option: any) => setTypeFilter(option?.value || null)}
            />
          </FilterControl>
        </FilterControls>
        <ActiveFilterBadges filters={activeFilters} />
      </FilterSection>

      <ResultsSummary
        hasActiveFilters={hasActiveFilters}
        filteredCount={totalItems}
        totalCount={vehicles.length}
        onClearFilters={clearFilters}
        entityName="vehicles"
      />

      {/* Main Table */}
      <VehicleTable
        data={paginatedData}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Details Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      {/* Add/Edit Form Modal */}
      <VehicleForm
        opened={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialValues={editVehicle}
        mode={formMode}
      />
    </div>
  );
}
