"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Group, Loader, Modal, NumberInput, Stack } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { useMaintenance, useUpdateMaintenance } from "@/hooks/useMaintenance";
import { PageHeader } from "@/components/shared";
import { useDemoReadOnly } from "@/hooks/useDemoReadOnly";

export default function MechanicsPage() {
  const { isDemo, blockWrite } = useDemoReadOnly();
  const [costJob, setCostJob] = useState<any | null>(null);
  const [costValue, setCostValue] = useState<number | string>("");
  const activeQuery = useMaintenance({ pageSize: 50, status: "IN_PROGRESS" });
  const backlogQuery = useMaintenance({ pageSize: 50, status: "PENDING" });
  const updateMutation = useUpdateMaintenance();

  const setJobStatus = useCallback(
    (job: any, status: "IN_PROGRESS" | "COMPLETED") => {
      if (blockWrite(status === "COMPLETED" ? "Completing jobs" : "Starting jobs")) return;
      updateMutation.mutate(
        {
          id: job.id,
          data: {
            status,
            completedAt: status === "COMPLETED" ? new Date().toISOString() : null,
          },
        },
        {
          onSuccess: () =>
            toast.success(status === "COMPLETED" ? "Job completed" : "Job started"),
          onError: (error: any) =>
            toast.error(
              error?.response?.data?.message || error?.message || "Update failed",
            ),
        },
      );
    },
    [blockWrite, updateMutation],
  );

  const activeJobs = activeQuery.data?.data || [];
  const backlog = backlogQuery.data?.data || [];

  const openCostEditor = (job: any) => {
    if (blockWrite("Updating cost")) return;
    setCostJob(job);
    setCostValue(job.cost ?? 0);
  };

  const saveCost = () => {
    if (!costJob || blockWrite("Updating cost")) return;
    updateMutation.mutate(
      {
        id: costJob.id,
        data: { cost: Number(costValue || 0) },
      },
      {
        onSuccess: () => {
          toast.success("Cost updated");
          setCostJob(null);
          setCostValue("");
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message || error?.message || "Cost update failed"),
      },
    );
  };

  const jobColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Vehicle",
        accessorKey: "vehicle",
        cell: ({ row }) => row.original.vehicle?.plate || "Unassigned",
      },
      { header: "Type", accessorKey: "type" },
      { header: "Description", accessorKey: "description" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => String(getValue() || "").replaceAll("_", " "),
      },
      {
        header: "Scheduled",
        accessorKey: "scheduledAt",
        cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
      },
      {
        header: "Completed",
        accessorKey: "completedAt",
        cell: ({ getValue }) =>
          getValue() ? new Date(String(getValue())).toLocaleString() : "-",
      },
      {
        header: "Cost",
        accessorKey: "cost",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Notes",
        accessorKey: "notes",
        cell: ({ getValue }) => String(getValue() || "-"),
      },
      {
        header: "Mechanic",
        accessorKey: "mechanic",
        cell: ({ row }) =>
          row.original.mechanic
            ? `${row.original.mechanic.firstName} ${row.original.mechanic.lastName}`
            : "Unassigned",
      },
      {
        header: "Action",
        id: "action",
        cell: ({ row }) => (
          <Group gap="xs" wrap="nowrap">
            <Button
              size="xs"
              variant="default"
              disabled={isDemo || updateMutation.isPending}
              onClick={() => openCostEditor(row.original)}
            >
              Cost
            </Button>
            {row.original.status === "PENDING" ? (
              <Button
                size="xs"
                loading={updateMutation.isPending}
                disabled={isDemo || updateMutation.isPending}
                onClick={() => setJobStatus(row.original, "IN_PROGRESS")}
              >
                Start
              </Button>
            ) : (
              <Button
                size="xs"
                loading={updateMutation.isPending}
                disabled={isDemo || updateMutation.isPending}
                onClick={() => setJobStatus(row.original, "COMPLETED")}
              >
                Complete
              </Button>
            )}
          </Group>
        ),
      },
    ],
    [isDemo, setJobStatus, updateMutation.isPending],
  );

  if (activeQuery.isLoading || backlogQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Mechanic"
        title="Mechanics Control"
        description="Pending jobs are backlog. Start work, log cost, and complete tickets for reports."
        actions={
          isDemo ? (
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-muted">
              Read-only demo
            </span>
          ) : null
        }
      />

      <Group grow align="stretch">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            Backlog
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{backlog.length}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            Active Jobs
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {activeJobs.length}
          </p>
        </div>
      </Group>

      <CustomTable
        title="Backlog"
        description="Pending maintenance records ready for a mechanic to start."
        columns={jobColumns}
        data={backlog}
        totalItems={backlog.length}
        pageCount={1}
        currentPage={1}
        onPageChange={() => undefined}
        isLoading={backlogQuery.isLoading}
      />

      <CustomTable
        title="Active Jobs"
        description="Maintenance work currently in progress."
        columns={jobColumns}
        data={activeJobs}
        totalItems={activeJobs.length}
        pageCount={1}
        currentPage={1}
        onPageChange={() => undefined}
        isLoading={activeQuery.isLoading}
      />

      <Modal
        opened={Boolean(costJob)}
        onClose={() => setCostJob(null)}
        title="Update maintenance cost"
        centered
        zIndex={400}
      >
        <Stack gap="md">
          <NumberInput
            label="Cost"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            value={costValue}
            onChange={setCostValue}
          />
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setCostJob(null)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={saveCost}
              loading={updateMutation.isPending}
              disabled={isDemo || updateMutation.isPending}
            >
              Save Cost
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
