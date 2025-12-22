import { RecurringTransaction } from "@/types/api.types";

// Format frequency for display
export const formatFrequency = (frequency: string): string => {
    const frequencyMap: { [key: string]: string } = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly",
    };
    return frequencyMap[frequency] || frequency;
};

// Format next run date for display
export const formatNextRunDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
        return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    } else {
        return date.toLocaleDateString();
    }
};

// Calculate days until next run
export const getDaysUntilNextRun = (nextRunDate: string): number => {
    const nextRun = new Date(nextRunDate);
    const now = new Date();
    const diffTime = nextRun.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get status information
export const getRecurringStatus = (recurring: RecurringTransaction) => {
    const daysUntilNextRun = getDaysUntilNextRun(recurring.nextRunDate);

    return {
        isActive: recurring.active,
        isOverdue: daysUntilNextRun < 0,
        daysUntilNextRun: Math.abs(daysUntilNextRun),
        status: !recurring.active ? "paused" : daysUntilNextRun < 0 ? "overdue" : "active",
    };
};

// Filter recurring transactions by status
export const filterRecurringByStatus = (
    transactions: RecurringTransaction[],
    status: 'active' | 'paused' | 'overdue' | 'all'
): RecurringTransaction[] => {
    if (status === 'all') return transactions;

    return transactions.filter(transaction => {
        const transactionStatus = getRecurringStatus(transaction);
        return transactionStatus.status === status;
    });
};

// Get frequency options for select
export const getFrequencyOptions = () => [
    { value: "daily", label: "🔄 Daily" },
    { value: "weekly", label: "📅 Weekly" },
    { value: "monthly", label: "📆 Monthly" },
    { value: "yearly", label: "🎉 Yearly" },
];

// Get type options for select
export const getTypeOptions = () => [
    { value: "income", label: "💰 Income" },
    { value: "expense", label: "💸 Expense" },
    { value: "transfer", label: "🔄 Transfer" },
];