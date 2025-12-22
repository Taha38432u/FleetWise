export interface MetaData {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface GetApiResponse<T> {
    ok: boolean;
    data: {
        data: T[];
        meta: MetaData;
    };
}

export interface Category {
    id: number;
    userId: number;
    name: string;
    type: "income" | "expense";
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryInput {
    name: string;
    type: "income" | "expense";
    color: string;
}


export interface Account {
    id: number;
    userId: number;
    name: string;
    type: "checking" | "savings" | "credit" | "investment" | "cash";
    balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAccountInput {
    name: string;
    type: "checking" | "savings" | "credit" | "investment" | "cash";
    balance: number;
    currency: string;
}


// Add to your types/api.types.ts
export interface Transaction {
    id: number;
    userId: number;
    accountId: number;
    categoryId: number;
    type: "income" | "expense";
    amount: number;
    note?: string;
    date: string;
    receiptUrl?: string;
    createdAt: string;
    updatedAt: string;
    account?: Account;
    category?: Category;
}

export interface CreateTransactionInput {
    accountId: number;
    categoryId: number;
    type: "income" | "expense";
    amount: number;
    note?: string;
    date?: string;
    receiptUrl?: string;
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>


export interface Budget {
    id: number;
    userId: number;
    categoryId: number;
    amount: number;
    startDate: string;
    endDate: string;
    rollover: boolean;
    createdAt: string;
    updatedAt: string;
    // Progress fields (calculated)
    used?: number;
    remaining?: number;
    percentUsed?: number;
    // Relations
    category?: Category;
}

export interface CreateBudgetInput {
    categoryId: number;
    amount: number;
    startDate: string;
    endDate: string;
    rollover?: boolean;
}

export interface UpdateBudgetInput {
    categoryId?: number;
    amount?: number;
    startDate?: string;
    endDate?: string;
    rollover?: boolean;
}

// Add to your existing types/api.types.ts

export interface Goal {
    id: number;
    userId: number;
    name: string;
    targetAmount: number;
    savedAmount: number;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    progress?: number; // Calculated field
}

export interface CreateGoalInput {
    name: string;
    targetAmount: number;
    startDate: string;
    endDate: string;
}

export interface UpdateGoalInput {
    name?: string;
    targetAmount?: number;
    savedAmount?: number;
    startDate?: string;
    endDate?: string;
    isCompleted?: boolean;
}


// Add to your existing types/api.types.ts

export interface RecurringTransaction {
    id: number;
    userId: number;
    accountId: number;
    categoryId: number;
    type: "income" | "expense" | "transfer";
    amount: number;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    nextRunDate: string;
    active: boolean;
    note?: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    account?: Account;
    category?: Category;
}

export interface CreateRecurringInput {
    accountId: number;
    categoryId: number;
    type: "income" | "expense" | "transfer";
    amount: number;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    nextRunDate: string;
    note?: string;
    active?: boolean;
}

export interface UpdateRecurringInput {
    accountId?: number;
    categoryId?: number;
    type?: "income" | "expense" | "transfer";
    amount?: number;
    frequency?: "daily" | "weekly" | "monthly" | "yearly";
    nextRunDate?: string;
    note?: string;
    active?: boolean;
}