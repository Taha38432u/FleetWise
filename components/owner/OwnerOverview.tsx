"use client";

import { Button, Group, Loader } from "@mantine/core";
import { PageHeader, Surface } from "@/components/shared";
import {
  useDeactivateOwnerOrganization,
  useOwnerOverview,
  useOwnerSubscriptions,
  useOwnerUsers,
  useResetOwnerOrganization,
} from "@/hooks/useSuperAdmin";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { OwnerCharts } from "./OwnerCharts";
import { formatLabel } from "@/utils/formatLabel";
import { toast } from "react-toastify";

const subscriptionColumns: ColumnDef<any>[] = [
  { header: "User", cell: ({ row }) => row.original.user?.email || row.original.userId },
  { header: "Plan", cell: ({ row }) => formatLabel(row.original.plan) },
  { header: "Status", cell: ({ row }) => formatLabel(row.original.status) },
  { header: "Payment", cell: ({ row }) => formatLabel(row.original.paymentStatus) },
  { header: "Provider", accessorKey: "provider" },
];

export default function OwnerOverview() {
  const overviewQuery = useOwnerOverview();
  const usersQuery = useOwnerUsers({ pageSize: 10 });
  const subscriptionsQuery = useOwnerSubscriptions({ pageSize: 10 });
  const deactivateMutation = useDeactivateOwnerOrganization();
  const resetMutation = useResetOwnerOrganization();
  const isMutating = deactivateMutation.isPending || resetMutation.isPending;

  const userColumns: ColumnDef<any>[] = [
    { header: "Organization", cell: ({ row }) => row.original.organization?.name || `${row.original.firstName}'s Fleet` },
    { header: "Owner", cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}` },
    { header: "Email", accessorKey: "email" },
    { header: "Status", cell: ({ row }) => formatLabel(row.original.status) },
    { header: "Plan", cell: ({ row }) => formatLabel(row.original.subscription?.plan || "NONE") },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <Button
            size="xs"
            color="red"
            variant="light"
            disabled={isMutating}
            onClick={() => {
              const ok = window.confirm(
                `Deactivate ${row.original.organization?.name || row.original.email}? All users in this organization will be inactive.`,
              );
              if (!ok) return;
              deactivateMutation.mutate(row.original.id, {
                onSuccess: () => toast.success("Organization deactivated"),
                onError: (error: any) =>
                  toast.error(error?.message || "Deactivate failed"),
              });
            }}
          >
            Deactivate
          </Button>
          <Button
            size="xs"
            color="orange"
            variant="light"
            disabled={isMutating}
            onClick={() => {
              const ok = window.confirm(
                `Reset ${row.original.organization?.name || row.original.email}? Fleet, staff, finance, routes, maintenance, and tracking data will be cleared. Owner account and subscription stay.`,
              );
              if (!ok) return;
              resetMutation.mutate(row.original.id, {
                onSuccess: () => toast.success("Organization reset"),
                onError: (error: any) =>
                  toast.error(error?.message || "Reset failed"),
              });
            }}
          >
            Reset
          </Button>
        </Group>
      ),
    },
  ];

  if (overviewQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const overview = overviewQuery.data?.data;
  const payment = overview?.paymentStatus || {};

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="SaaS Owner"
        title="Owner Console"
        description="Monitor paying admin accounts, trials, payment states, subscriptions, and plan distribution across FleetWise."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Admin Accounts", overview?.totalUsers || 0],
          ["Pending Payments", payment.pendingPayments || 0],
          ["Active Trials", payment.activeTrials || 0],
          ["Expired Trials", payment.expiredTrials || 0],
          ["Active Subscriptions", payment.activeSubscriptions || 0],
          ["Cancelled", payment.cancelledPlans || 0],
          ["Expired Plans", payment.expiredPlans || 0],
        ].map(([label, value]) => (
          <Surface key={label} compact className="p-5">
            <p className="ui-kicker">{label}</p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
          </Surface>
        ))}
      </section>

      <OwnerCharts overview={overview} />

      <CustomTable
        title="Subscribed Admin Accounts"
        description="Only admin account owners are counted here. Staff, mechanics, dispatchers, and drivers are excluded."
        columns={userColumns}
        data={usersQuery.data?.data || []}
        totalItems={usersQuery.data?.meta?.totalItems || 0}
        pageCount={usersQuery.data?.meta?.totalPages || 1}
        currentPage={usersQuery.data?.meta?.currentPage || 1}
        onPageChange={() => undefined}
        isLoading={usersQuery.isLoading}
      />

      <CustomTable
        title="Subscriptions"
        description="Payment and subscription state by account."
        columns={subscriptionColumns}
        data={subscriptionsQuery.data?.data || []}
        totalItems={subscriptionsQuery.data?.meta?.totalItems || 0}
        pageCount={subscriptionsQuery.data?.meta?.totalPages || 1}
        currentPage={subscriptionsQuery.data?.meta?.currentPage || 1}
        onPageChange={() => undefined}
        isLoading={subscriptionsQuery.isLoading}
      />
    </div>
  );
}
