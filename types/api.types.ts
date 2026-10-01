export interface ApiMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetApiResponse<T = any> {
  ok: boolean;
  data: T[];
  meta: ApiMeta;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  description?: string | null;
  isArchived?: boolean;
}

export interface CreateAccountInput {
  name: string;
  type: string;
  balance?: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  type: string;
  accountId?: string | null;
  categoryId?: string | null;
  fromAccountId?: string | null;
  toAccountId?: string | null;
  amount: number;
  description: string;
  occurredAt: string;
  account?: Account | null;
  category?: Category | null;
}

export interface CreateTransactionInput {
  type: string;
  accountId?: string;
  categoryId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  description: string;
  occurredAt?: string;
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  maintenanceRecordId?: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  used?: number;
  remaining?: number | string;
  percentUsed?: number;
  startDate: string;
  endDate: string;
  accountId?: string | null;
  categoryId?: string | null;
  notes?: string | null;
}

export interface CreateBudgetInput {
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  accountId?: string;
  categoryId?: string;
  notes?: string;
}

export type UpdateBudgetInput = Partial<CreateBudgetInput>;

export interface Goal {
  id: string;
  title: string;
  metricType: string;
  targetValue: number;
  currentValue: number;
  dueDate?: string | null;
  status: string;
  notes?: string | null;
}

export interface CreateGoalInput {
  title: string;
  metricType: string;
  targetValue: number;
  currentValue?: number;
  dueDate?: string;
  status?: string;
  notes?: string;
}

export type UpdateGoalInput = Partial<CreateGoalInput>;

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  interval: string;
  nextRunAt: string;
  accountId?: string | null;
  categoryId?: string | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateRecurringInput {
  name: string;
  amount: number;
  interval: string;
  nextRunAt: string;
  accountId?: string;
  categoryId?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateRecurringInput = Partial<CreateRecurringInput>;

export type GetMeResponse = any;
