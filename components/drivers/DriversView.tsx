"use client";

import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { Driver, CreateDriverDto, UpdateDriverDto } from "@/types/driver.types";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverForm } from "@/components/drivers/DriverForm";
import { DriverModal } from "@/components/drivers/DriverModal";
import { DriverDeleteModal } from "@/components/drivers/DriverDeleteModal";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  FilterSection,
  FilterControls,
  FilterControl,
} from "@/components/common/Filters";
import CustomSelect from "@/components/common/Input/CustomSelect";
import {
  useGetDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "@/hooks/useDrivers";
import { toast } from "react-toastify";
import { LicenseStatus, AvailabilityStatus } from "@/types/driver.types";
import { PageHeader } from "@/components/shared";

const PAGE_SIZE = 10;

export default function DriversPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isFormOpen, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  // Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [licenseStatusFilter, setLicenseStatusFilter] = useState<string | null>(
    null
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // API Hooks
  const { data: driversResponse, isLoading } = useGetDrivers({
    page: currentPage,
    pageSize: PAGE_SIZE,
    licenseStatus: licenseStatusFilter as LicenseStatus | undefined,
    availabilityStatus: availabilityFilter as AvailabilityStatus | undefined,
    search: debouncedSearch || undefined,
  });

  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  // Extract data
  const drivers = driversResponse?.data?.data || [];
  const meta = driversResponse?.data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  };

  // Actions
  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleEdit = (driver: Driver) => {
    setFormMode("edit");
    setEditDriver(driver);
    openForm();
  };

  const handleDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (driverToDelete?.id) {
      deleteMutation.mutate(driverToDelete.id, {
        onSuccess: () => {
          toast.success("Driver deleted successfully");
          closeDeleteModal();
          setDriverToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to delete driver");
        },
      });
    }
  };

  const handleAdd = () => {
    setFormMode("add");
    setEditDriver(null);
    openForm();
  };

  const handleFormSubmit = (values: CreateDriverDto | UpdateDriverDto) => {
    if (formMode === "add") {
      createMutation.mutate(values as CreateDriverDto, {
        onSuccess: () => {
          toast.success("Driver created successfully");
          closeForm();
          setCurrentPage(1);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create driver");
        },
      });
    } else if (formMode === "edit" && editDriver) {
      updateMutation.mutate(
        { 
          id: editDriver.id, 
          data: values as any 
        },
        {
          onSuccess: () => {
            toast.success("Driver updated successfully");
            closeForm();
            setEditDriver(null);
            setCurrentPage(1);
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update driver");
          },
        }
      );
    }
  };

  const hasActiveFilters = Boolean(
    search || licenseStatusFilter || availabilityFilter
  );

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="People"
        title="Drivers Management"
        description="Manage driver profiles, license state, availability, and route readiness from one operational table."
        actions={
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={handleAdd}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          Add Driver
        </Button>
        }
      />

      <FilterSection
        filtersExpanded={filtersExpanded}
        setFiltersExpanded={setFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
        filteredCount={meta.totalItems}
        totalCount={meta.totalItems}
        onClearFilters={() => {
          setSearch("");
          setLicenseStatusFilter(null);
          setAvailabilityFilter(null);
          setCurrentPage(1);
        }}
      >
        <FilterControls>
          <FilterControl className="min-w-[250px]">
            <TextInput
              placeholder="Search by license, name, or email..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                search && (
                  <IconX
                    size={16}
                    className="cursor-pointer"
                    onClick={() => setSearch("")}
                  />
                )
              }
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setCurrentPage(1);
              }}
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <CustomSelect
              placeholder="License Status"
              options={[
                { value: "Valid", label: "Valid" },
                { value: "Expired", label: "Expired" },
                { value: "Suspended", label: "Suspended" },
                {
                  value: "Pending Verification",
                  label: "Pending Verification",
                },
              ]}
              value={
                licenseStatusFilter
                  ? { value: licenseStatusFilter, label: licenseStatusFilter }
                  : null
              }
              onChange={(option: any) =>
                setLicenseStatusFilter(option?.value || null)
              }
              isClearable
            />
          </FilterControl>

          <FilterControl className="min-w-[180px]">
            <CustomSelect
              placeholder="Availability"
              options={[
                { value: "Available", label: "Available" },
                { value: "On Duty", label: "On Duty" },
                { value: "Off Duty", label: "Off Duty" },
                { value: "On Leave", label: "On Leave" },
              ]}
              value={
                availabilityFilter
                  ? { value: availabilityFilter, label: availabilityFilter }
                  : null
              }
              onChange={(option: any) =>
                setAvailabilityFilter(option?.value || null)
              }
              isClearable
            />
          </FilterControl>
        </FilterControls>
      </FilterSection>

      <DriverTable
        data={drivers}
        totalItems={meta.totalItems}
        totalPages={meta.totalPages}
        currentPage={meta.currentPage}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {selectedDriver && (
        <DriverModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}

      <DriverForm
        opened={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialValues={editDriver}
        mode={formMode}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DriverDeleteModal
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        driver={driverToDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
