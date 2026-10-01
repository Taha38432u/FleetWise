"use client";

import { useMemo, useState } from "react";
import { Button, Group, Loader, SimpleGrid, Tabs } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomModal from "@/components/common/Input/CustomModal";
import Input from "@/components/common/Input/CustomInput";
import CustomSelect from "@/components/common/Input/CustomSelect";
import { CustomTable } from "@/components/common/Table/CustomTable";
import { PageHeader } from "@/components/shared";
import { useGetAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { useFleetCostSummary, useGetTransactions, useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from "@/hooks/useTransactions";
import { useGetBudgets, useCreateBudget, useDeleteBudget, useUpdateBudget } from "@/hooks/useBudgets";
import { useGetGoals, useCreateGoal, useDeleteGoal, useUpdateGoal } from "@/hooks/useGoals";
import { useGetRecurringTransactions, useCreateRecurring, useDeleteRecurring, useUpdateRecurring } from "@/hooks/useRecurring";
import { useGetCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useGetDrivers } from "@/hooks/useDrivers";
import { useRoutes } from "@/hooks/useRoutes";
import { useGetVehicles } from "@/hooks/useVehicles";
import { formatLabel } from "@/utils/formatLabel";

type FinanceTab = "accounts" | "transactions" | "budgets" | "goals" | "recurring" | "categories";
type FinancePages = Record<FinanceTab, number>;
const PAGE_SIZE = 10;

const initialForms = {
  accounts: { name: "", type: "OPERATIONS", balance: "", description: "" },
  transactions: {
    type: "EXPENSE",
    accountId: "",
    categoryId: "",
    vehicleId: "",
    driverId: "",
    routeId: "",
    maintenanceRecordId: "",
    amount: "",
    description: "",
    occurredAt: "",
  },
  budgets: {
    name: "",
    amount: "",
    startDate: "",
    endDate: "",
    accountId: "",
    categoryId: "",
    notes: "",
  },
  goals: {
    title: "",
    metricType: "COST_REDUCTION",
    targetValue: "",
    currentValue: "",
    dueDate: "",
    notes: "",
  },
  recurring: {
    name: "",
    amount: "",
    interval: "MONTHLY",
    nextRunAt: "",
    accountId: "",
    categoryId: "",
    description: "",
  },
  categories: { name: "", description: "", color: "#3b82f6" },
};

const nullableNumber = Yup.number()
  .transform((value, originalValue) => (originalValue === "" ? undefined : value))
  .min(0, "Value cannot be negative");

const financeSchemas: Record<FinanceTab, Yup.ObjectSchema<any>> = {
  accounts: Yup.object({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type is required"),
    balance: nullableNumber.required("Balance is required"),
    description: Yup.string().optional(),
  }),
  transactions: Yup.object({
    type: Yup.string().oneOf(["EXPENSE", "INCOME"]).required("Type is required"),
    accountId: Yup.string().optional(),
    categoryId: Yup.string().optional(),
    vehicleId: Yup.string().optional(),
    driverId: Yup.string().optional(),
    routeId: Yup.string().optional(),
    maintenanceRecordId: Yup.string().optional(),
    amount: nullableNumber.required("Amount is required"),
    occurredAt: Yup.string().required("Date is required"),
    description: Yup.string().required("Description is required"),
  }),
  budgets: Yup.object({
    name: Yup.string().required("Name is required"),
    amount: nullableNumber.required("Amount is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    accountId: Yup.string().optional(),
    categoryId: Yup.string().optional(),
    notes: Yup.string().optional(),
  }),
  goals: Yup.object({
    title: Yup.string().required("Title is required"),
    metricType: Yup.string().required("Metric is required"),
    targetValue: nullableNumber.required("Target value is required"),
    currentValue: nullableNumber.optional(),
    dueDate: Yup.string().optional(),
    notes: Yup.string().optional(),
  }),
  recurring: Yup.object({
    name: Yup.string().required("Name is required"),
    amount: nullableNumber.required("Amount is required"),
    interval: Yup.string().required("Interval is required"),
    nextRunAt: Yup.string().required("Next run date is required"),
    accountId: Yup.string().optional(),
    categoryId: Yup.string().optional(),
    description: Yup.string().optional(),
  }),
  categories: Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().optional(),
    color: Yup.string().required("Color is required"),
  }),
};

const tabLabels: Record<FinanceTab, string> = {
  accounts: "Account",
  transactions: "Transaction",
  budgets: "Budget",
  goals: "Goal",
  recurring: "Recurring Expense",
  categories: "Category",
};

function option(value: string, label?: string) {
  return { value, label: label || value };
}

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function toDateTimeInput(value?: string | null) {
  return value ? value.slice(0, 16) : "";
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("accounts");
  const [formOpened, setFormOpened] = useState(false);
  const [editing, setEditing] = useState<{ tab: FinanceTab; id: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ tab: FinanceTab; id: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pages, setPages] = useState<FinancePages>({
    accounts: 1,
    transactions: 1,
    budgets: 1,
    goals: 1,
    recurring: 1,
    categories: 1,
  });

  const accountsQuery = useGetAccounts({ page: pages.accounts, limit: PAGE_SIZE });
  const categoriesQuery = useGetCategories({ page: pages.categories, limit: PAGE_SIZE });
  const transactionsQuery = useGetTransactions({ page: pages.transactions, limit: PAGE_SIZE });
  const budgetsQuery = useGetBudgets({ page: pages.budgets, limit: PAGE_SIZE });
  const goalsQuery = useGetGoals({ page: pages.goals, limit: PAGE_SIZE });
  const recurringQuery = useGetRecurringTransactions({ page: pages.recurring, limit: PAGE_SIZE });
  const costSummaryQuery = useFleetCostSummary();
  const vehiclesQuery = useGetVehicles({ page: 1, pageSize: 100 });
  const driversQuery = useGetDrivers({ page: 1, pageSize: 100 });
  const routesQuery = useRoutes({ page: 1, pageSize: 100 });

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const createRecurring = useCreateRecurring();
  const updateRecurring = useUpdateRecurring();
  const deleteRecurring = useDeleteRecurring();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const accounts = accountsQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];
  const transactions = transactionsQuery.data?.data || [];
  const budgets = budgetsQuery.data?.data || [];
  const goals = goalsQuery.data?.data || [];
  const recurring = recurringQuery.data?.data || [];
  const costSummary = costSummaryQuery.data?.data;
  const vehicles = vehiclesQuery.data?.data?.data || [];
  const drivers = driversQuery.data?.data?.data || [];
  const routes = routesQuery.data?.data || [];
  const queryByTab = {
    accounts: accountsQuery,
    transactions: transactionsQuery,
    budgets: budgetsQuery,
    goals: goalsQuery,
    recurring: recurringQuery,
    categories: categoriesQuery,
  };
  const dataByTab = {
    accounts,
    transactions,
    budgets,
    goals,
    recurring,
    categories,
  };

  const isLoading =
    accountsQuery.isLoading ||
    categoriesQuery.isLoading ||
    transactionsQuery.isLoading ||
    budgetsQuery.isLoading ||
    goalsQuery.isLoading ||
    recurringQuery.isLoading;

  const overview = {
    totalBalance: accounts.reduce(
      (sum: number, account: any) => sum + Number(account.balance || 0),
      0,
    ),
    totalBudget: budgets.reduce(
      (sum: number, budget: any) => sum + Number(budget.amount || 0),
      0,
    ),
    totalSpend: transactions
      .filter((tx: any) => tx.type === "EXPENSE")
      .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0),
    fleetCost: Number(costSummary?.total || 0),
    fuelCost: Number(costSummary?.totals?.fuel || 0),
    salaryCost: Number(costSummary?.totals?.driverSalaries || 0),
    mechanicLabor: Number(costSummary?.totals?.mechanicLabor || 0),
  };

  const accountOptions = [
    option("", "None"),
    ...accounts.map((account: any) => option(account.id, account.name)),
  ];
  const categoryOptions = [
    option("", "None"),
    ...categories.map((category: any) => option(category.id, category.name)),
  ];
  const vehicleOptions = [
    option("", "None"),
    ...vehicles.map((vehicle: any) =>
      option(vehicle.id, `${vehicle.plate || vehicle.registrationNumber || vehicle.model}`),
    ),
  ];
  const driverOptions = [
    option("", "None"),
    ...drivers.map((driver: any) =>
      option(driver.id, `${driver.user?.firstName || ""} ${driver.user?.lastName || ""}`.trim() || driver.id),
    ),
  ];
  const routeOptions = [
    option("", "None"),
    ...routes.map((route: any) => option(route.id, route.name || route.id)),
  ];

  const resetForm = () => {
    setEditing(null);
    setFormOpened(false);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpened(true);
  };

  const openEdit = (tab: FinanceTab, item: any) => {
    setActiveTab(tab);
    setEditing({ tab, id: item.id });
    setFormOpened(true);
  };

  const formInitialValues = editing
    ? mapItemToForm(editing.tab, dataByTab[editing.tab].find((item: any) => item.id === editing.id) || {})
    : (initialForms as any)[activeTab];

  const submit = async (values: any) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const targetTab = editing?.tab || activeTab;
      const payload = mapFormToPayload(targetTab, values);
      if (editing) {
        await updateForTab(targetTab, editing.id, payload);
        toast.success(`${tabLabels[targetTab]} updated`);
      } else {
        await createForTab(targetTab, payload);
        toast.success(`${tabLabels[targetTab]} created`);
        setPages((prev) => ({ ...prev, [targetTab]: 1 }));
      }
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const createForTab = (tab: FinanceTab, payload: any) => {
    if (tab === "accounts") return createAccount.mutateAsync(payload);
    if (tab === "transactions") return createTransaction.mutateAsync(payload);
    if (tab === "budgets") return createBudget.mutateAsync(payload);
    if (tab === "goals") return createGoal.mutateAsync(payload);
    if (tab === "recurring") return createRecurring.mutateAsync(payload);
    return createCategory.mutateAsync(payload);
  };

  const updateForTab = (tab: FinanceTab, id: string, payload: any) => {
    if (tab === "accounts") return updateAccount.mutateAsync({ id, data: payload });
    if (tab === "transactions") return updateTransaction.mutateAsync({ id, data: payload });
    if (tab === "budgets") return updateBudget.mutateAsync({ id, data: payload });
    if (tab === "goals") return updateGoal.mutateAsync({ id, data: payload });
    if (tab === "recurring") return updateRecurring.mutateAsync({ id, data: payload });
    return updateCategory.mutateAsync({ id, data: payload });
  };

  const deleteForTab = (tab: FinanceTab, id: string) => {
    if (tab === "accounts") return deleteAccount.mutateAsync(id);
    if (tab === "transactions") return deleteTransaction.mutateAsync(id);
    if (tab === "budgets") return deleteBudget.mutateAsync(id);
    if (tab === "goals") return deleteGoal.mutateAsync(id);
    if (tab === "recurring") return deleteRecurring.mutateAsync(id);
    return deleteCategory.mutateAsync(id);
  };

  const setPageForTab = (tab: FinanceTab, page: number) => {
    setPages((prev) => ({ ...prev, [tab]: page }));
  };

  const columns = useMemo(
    () => getFinanceColumns(activeTab, openEdit, setDeleteTarget),
    [activeTab],
  );
  const activeQuery = queryByTab[activeTab];
  const activeMeta = activeQuery.data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage: pages[activeTab],
    pageSize: PAGE_SIZE,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Finance"
        title="Fleet Costs"
        description="Manage fleet accounts, operating spend, recurring charges, budgets, and goals."
        actions={
          <Button onClick={openCreate} disabled={isSaving}>
            Add {tabLabels[activeTab]}
          </Button>
        }
      />
      <section className="ui-section">
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Summary label="Account Balance" value={`$${overview.totalBalance.toFixed(2)}`} />
          <Summary label="Fleet Cost" value={`$${overview.fleetCost.toFixed(2)}`} />
          <Summary label="Budgeted" value={`$${overview.totalBudget.toFixed(2)}`} />
          <Summary label="Fuel" value={`$${overview.fuelCost.toFixed(2)}`} />
          <Summary label="Driver Salaries" value={`$${overview.salaryCost.toFixed(2)}`} />
          <Summary label="Mechanic Labor" value={`$${overview.mechanicLabor.toFixed(2)}`} />
        </div>
      </section>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as FinanceTab)} variant="outline">
        <Tabs.List>
          <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
          <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
          <Tabs.Tab value="budgets">Budgets</Tabs.Tab>
          <Tabs.Tab value="goals">Goals</Tabs.Tab>
          <Tabs.Tab value="recurring">Recurring</Tabs.Tab>
          <Tabs.Tab value="categories">Categories</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab} pt="md">
          <CustomTable
            title={`${tabLabels[activeTab]}s`}
            description="Paged records with modal add, edit, and delete actions."
            columns={columns}
            data={dataByTab[activeTab]}
            totalItems={activeMeta.totalItems}
            pageCount={activeMeta.totalPages}
            currentPage={activeMeta.currentPage}
            onPageChange={(page) => setPageForTab(activeTab, page)}
            isLoading={activeQuery.isLoading}
          />
        </Tabs.Panel>
      </Tabs>

      <CustomModal
        opened={formOpened}
        onClose={resetForm}
        title={`${editing ? "Edit" : "Add"} ${tabLabels[activeTab]}`}
        size="xl"
      >
        <Formik
          initialValues={formInitialValues}
          validationSchema={financeSchemas[activeTab]}
          enableReinitialize
          onSubmit={submit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {renderFields(
                  activeTab,
                  values,
                  setFieldValue,
                  touched,
                  errors,
                  accountOptions,
                  categoryOptions,
                  vehicleOptions,
                  driverOptions,
                  routeOptions,
                )}
              </SimpleGrid>
              <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={resetForm} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" loading={isSaving} disabled={isSaving}>
                  {editing ? "Save Changes" : `Create ${tabLabels[activeTab]}`}
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomModal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget ? tabLabels[deleteTarget.tab] : "Item"}`}
        size="sm"
      >
        <p className="text-sm text-slate-600">Are you sure you want to delete this item?</p>
        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => setDeleteTarget(null)}
            disabled={Boolean(deletingId)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={deletingId === deleteTarget?.id}
            disabled={Boolean(deletingId)}
            onClick={async () => {
              if (!deleteTarget) return;
              setDeletingId(deleteTarget.id);
              try {
                await deleteForTab(deleteTarget.tab, deleteTarget.id);
                toast.success(`${tabLabels[deleteTarget.tab]} deleted`);
                setDeleteTarget(null);
              } catch (error: any) {
                toast.error(error?.message || "Delete failed");
              } finally {
                setDeletingId(null);
              }
            }}
          >
            Delete
          </Button>
        </Group>
      </CustomModal>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{label}</p>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
    </div>
  );
}

function getFinanceColumns(
  tab: FinanceTab,
  onEdit: (tab: FinanceTab, item: any) => void,
  onDelete: (target: { tab: FinanceTab; id: string }) => void,
): ColumnDef<any>[] {
  const actionColumn: ColumnDef<any> = {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Group gap="xs" wrap="nowrap">
        <Button size="xs" variant="default" onClick={() => onEdit(tab, row.original)}>
          Edit
        </Button>
        <Button
          size="xs"
          variant="light"
          color="red"
          onClick={() => onDelete({ tab, id: row.original.id })}
        >
          Delete
        </Button>
      </Group>
    ),
  };

  if (tab === "accounts") {
    return [
      { header: "Name", accessorKey: "name" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Balance",
        accessorKey: "balance",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      { header: "Description", accessorKey: "description" },
      actionColumn,
    ];
  }

  if (tab === "transactions") {
    return [
      { header: "Description", accessorKey: "description" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Date",
        accessorKey: "occurredAt",
        cell: ({ getValue }) =>
          getValue() ? new Date(String(getValue())).toLocaleDateString() : "-",
      },
      actionColumn,
    ];
  }

  if (tab === "budgets") {
    return [
      { header: "Name", accessorKey: "name" },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Used",
        accessorKey: "used",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      {
        header: "Period",
        id: "period",
        cell: ({ row }) =>
          `${toDateInput(row.original.startDate) || "-"} to ${toDateInput(row.original.endDate) || "-"}`,
      },
      actionColumn,
    ];
  }

  if (tab === "goals") {
    return [
      { header: "Title", accessorKey: "title" },
      { header: "Metric", cell: ({ row }) => formatLabel(row.original.metricType) },
      { header: "Target", accessorKey: "targetValue" },
      { header: "Current", accessorKey: "currentValue" },
      { header: "Status", cell: ({ row }) => formatLabel(row.original.status) },
      actionColumn,
    ];
  }

  if (tab === "recurring") {
    return [
      { header: "Name", accessorKey: "name" },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => `$${Number(getValue() || 0).toFixed(2)}`,
      },
      { header: "Interval", accessorKey: "interval" },
      {
        header: "Next Run",
        accessorKey: "nextRunAt",
        cell: ({ getValue }) =>
          getValue() ? new Date(String(getValue())).toLocaleString() : "-",
      },
      actionColumn,
    ];
  }

  return [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Color",
      accessorKey: "color",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border border-slate-200"
            style={{ backgroundColor: String(getValue() || "#3b82f6") }}
          />
          {String(getValue() || "#3b82f6")}
        </span>
      ),
    },
    actionColumn,
  ];
}

function renderFields(
  tab: FinanceTab,
  form: any,
  setField: (key: string, value: string) => void,
  touched: any,
  errors: any,
  accountOptions: { value: string; label: string }[],
  categoryOptions: { value: string; label: string }[],
  vehicleOptions: { value: string; label: string }[],
  driverOptions: { value: string; label: string }[],
  routeOptions: { value: string; label: string }[],
) {
  const selectValue = (options: { value: string; label: string }[], value: string) =>
    options.find((item) => item.value === value) || options[0] || null;
  const fieldError = (key: string) => (touched[key] ? errors[key] : undefined);

  if (tab === "accounts") {
    return (
      <>
        <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} error={fieldError("name")} />
        <CustomSelect
          label="Type"
          options={["CASH", "FUEL", "MAINTENANCE", "PAYROLL", "OPERATIONS", "SAVINGS"].map((type) => option(type))}
          value={option(form.type)}
          onChange={(item: any) => setField("type", item?.value || "OPERATIONS")}
          error={fieldError("type")}
        />
        <Input label="Balance" type="number" value={form.balance} onChange={(e) => setField("balance", e.target.value)} error={fieldError("balance")} />
        <Input label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} error={fieldError("description")} />
      </>
    );
  }

  if (tab === "transactions") {
    return (
      <>
        <CustomSelect label="Type" options={["EXPENSE", "INCOME"].map((type) => option(type))} value={option(form.type)} onChange={(item: any) => setField("type", item?.value || "EXPENSE")} error={fieldError("type")} />
        <CustomSelect label="Account" options={accountOptions} value={selectValue(accountOptions, form.accountId)} onChange={(item: any) => setField("accountId", item?.value || "")} error={fieldError("accountId")} />
        <CustomSelect label="Category" options={categoryOptions} value={selectValue(categoryOptions, form.categoryId)} onChange={(item: any) => setField("categoryId", item?.value || "")} error={fieldError("categoryId")} />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => setField("amount", e.target.value)} error={fieldError("amount")} />
        <Input label="Occurred At" type="date" value={form.occurredAt} onChange={(e) => setField("occurredAt", e.target.value)} error={fieldError("occurredAt")} />
        <Input label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} error={fieldError("description")} />
        <CustomSelect label="Vehicle" options={vehicleOptions} value={selectValue(vehicleOptions, form.vehicleId)} onChange={(item: any) => setField("vehicleId", item?.value || "")} error={fieldError("vehicleId")} />
        <CustomSelect label="Driver" options={driverOptions} value={selectValue(driverOptions, form.driverId)} onChange={(item: any) => setField("driverId", item?.value || "")} error={fieldError("driverId")} />
        <CustomSelect label="Route" options={routeOptions} value={selectValue(routeOptions, form.routeId)} onChange={(item: any) => setField("routeId", item?.value || "")} error={fieldError("routeId")} />
        <Input label="Maintenance Record ID" value={form.maintenanceRecordId} onChange={(e) => setField("maintenanceRecordId", e.target.value)} error={fieldError("maintenanceRecordId")} />
      </>
    );
  }

  if (tab === "budgets") {
    return (
      <>
        <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} error={fieldError("name")} />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => setField("amount", e.target.value)} error={fieldError("amount")} />
        <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setField("startDate", e.target.value)} error={fieldError("startDate")} />
        <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setField("endDate", e.target.value)} error={fieldError("endDate")} />
        <CustomSelect label="Account" options={accountOptions} value={selectValue(accountOptions, form.accountId)} onChange={(item: any) => setField("accountId", item?.value || "")} error={fieldError("accountId")} />
        <CustomSelect label="Category" options={categoryOptions} value={selectValue(categoryOptions, form.categoryId)} onChange={(item: any) => setField("categoryId", item?.value || "")} error={fieldError("categoryId")} />
        <Input label="Notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} error={fieldError("notes")} />
      </>
    );
  }

  if (tab === "goals") {
    return (
      <>
        <Input label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} error={fieldError("title")} />
        <CustomSelect label="Metric" options={["COST_REDUCTION", "FUEL_EFFICIENCY", "UTILIZATION", "MAINTENANCE_REDUCTION"].map((type) => option(type))} value={option(form.metricType)} onChange={(item: any) => setField("metricType", item?.value || "COST_REDUCTION")} error={fieldError("metricType")} />
        <Input label="Target Value" type="number" value={form.targetValue} onChange={(e) => setField("targetValue", e.target.value)} error={fieldError("targetValue")} />
        <Input label="Current Value" type="number" value={form.currentValue} onChange={(e) => setField("currentValue", e.target.value)} error={fieldError("currentValue")} />
        <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setField("dueDate", e.target.value)} error={fieldError("dueDate")} />
        <Input label="Notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} error={fieldError("notes")} />
      </>
    );
  }

  if (tab === "recurring") {
    return (
      <>
        <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} error={fieldError("name")} />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => setField("amount", e.target.value)} error={fieldError("amount")} />
        <CustomSelect label="Interval" options={["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"].map((interval) => option(interval))} value={option(form.interval)} onChange={(item: any) => setField("interval", item?.value || "MONTHLY")} error={fieldError("interval")} />
        <Input label="Next Run At" type="datetime-local" value={form.nextRunAt} onChange={(e) => setField("nextRunAt", e.target.value)} error={fieldError("nextRunAt")} />
        <CustomSelect label="Account" options={accountOptions} value={selectValue(accountOptions, form.accountId)} onChange={(item: any) => setField("accountId", item?.value || "")} error={fieldError("accountId")} />
        <CustomSelect label="Category" options={categoryOptions} value={selectValue(categoryOptions, form.categoryId)} onChange={(item: any) => setField("categoryId", item?.value || "")} error={fieldError("categoryId")} />
        <Input label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} error={fieldError("description")} />
      </>
    );
  }

  return (
    <>
      <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} error={fieldError("name")} />
      <Input label="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} error={fieldError("description")} />
      <Input label="Color" type="color" value={form.color} onChange={(e) => setField("color", e.target.value)} error={fieldError("color")} />
    </>
  );
}

function mapFormToPayload(tab: FinanceTab, form: any) {
  if (tab === "accounts") {
    return { ...form, balance: Number(form.balance || 0) };
  }
  if (tab === "transactions") {
    return {
      ...form,
      amount: Number(form.amount || 0),
      accountId: form.accountId || undefined,
      categoryId: form.categoryId || undefined,
      vehicleId: form.vehicleId || undefined,
      driverId: form.driverId || undefined,
      routeId: form.routeId || undefined,
      maintenanceRecordId: form.maintenanceRecordId || undefined,
    };
  }
  if (tab === "budgets") {
    return {
      ...form,
      amount: Number(form.amount || 0),
      accountId: form.accountId || undefined,
      categoryId: form.categoryId || undefined,
    };
  }
  if (tab === "goals") {
    return {
      ...form,
      targetValue: Number(form.targetValue || 0),
      currentValue: form.currentValue ? Number(form.currentValue) : undefined,
    };
  }
  if (tab === "recurring") {
    return {
      ...form,
      amount: Number(form.amount || 0),
      accountId: form.accountId || undefined,
      categoryId: form.categoryId || undefined,
    };
  }
  return form;
}

function mapItemToForm(tab: FinanceTab, item: any) {
  if (tab === "accounts") {
    return {
      name: item.name || "",
      type: item.type || "OPERATIONS",
      balance: String(item.balance || ""),
      description: item.description || "",
    };
  }
  if (tab === "transactions") {
    return {
      type: item.type || "EXPENSE",
      accountId: item.accountId || "",
      categoryId: item.categoryId || "",
      vehicleId: item.vehicleId || "",
      driverId: item.driverId || "",
      routeId: item.routeId || "",
      maintenanceRecordId: item.maintenanceRecordId || "",
      amount: String(item.amount || ""),
      description: item.description || "",
      occurredAt: toDateInput(item.occurredAt),
    };
  }
  if (tab === "budgets") {
    return {
      name: item.name || "",
      amount: String(item.amount || ""),
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
      accountId: item.accountId || "",
      categoryId: item.categoryId || "",
      notes: item.notes || "",
    };
  }
  if (tab === "goals") {
    return {
      title: item.title || "",
      metricType: item.metricType || "COST_REDUCTION",
      targetValue: String(item.targetValue || ""),
      currentValue: String(item.currentValue || ""),
      dueDate: toDateInput(item.dueDate),
      notes: item.notes || "",
    };
  }
  if (tab === "recurring") {
    return {
      name: item.name || "",
      amount: String(item.amount || ""),
      interval: item.interval || "MONTHLY",
      nextRunAt: toDateTimeInput(item.nextRunAt),
      accountId: item.accountId || "",
      categoryId: item.categoryId || "",
      description: item.description || "",
    };
  }
  return {
    name: item.name || "",
    description: item.description || "",
    color: item.color || "#3b82f6",
  };
}
