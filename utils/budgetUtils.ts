import { Budget } from "@/types/api.types";

// Calculate budget progress
export const calculateBudgetProgress = (budget: Budget) => {
  const used = budget.used || 0;
  const remaining = budget.remaining || (budget.amount - used);
  const percentUsed = budget.percentUsed || (budget.amount > 0 ? (used / budget.amount) * 100 : 0);
  
  return {
    used,
    remaining,
    percentUsed: Math.min(percentUsed, 100), // Cap at 100%
    isOverBudget: used > budget.amount,
    isNearLimit: percentUsed >= 80,
  };
};

// Format budget period for display
export const formatBudgetPeriod = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString();
  const endFormatted = end.toLocaleDateString();
  
  return `${startFormatted} - ${endFormatted}`;
};

// Check if budget is active
export const isBudgetActive = (budget: Budget): boolean => {
  const now = new Date();
  const start = new Date(budget.startDate);
  const end = new Date(budget.endDate);
  
  return now >= start && now <= end;
};

// Check if budget is upcoming
export const isBudgetUpcoming = (budget: Budget): boolean => {
  const now = new Date();
  const start = new Date(budget.startDate);
  
  return now < start;
};

// Check if budget is expired
export const isBudgetExpired = (budget: Budget): boolean => {
  const now = new Date();
  const end = new Date(budget.endDate);
  
  return now > end;
};

// Get budget status
export const getBudgetStatus = (budget: Budget): 'active' | 'upcoming' | 'expired' => {
  if (isBudgetActive(budget)) return 'active';
  if (isBudgetUpcoming(budget)) return 'upcoming';
  return 'expired';
};

// Filter budgets by status
export const filterBudgetsByStatus = (
  budgets: Budget[], 
  status: 'active' | 'upcoming' | 'expired' | 'all'
): Budget[] => {
  if (status === 'all') return budgets;
  
  return budgets.filter(budget => getBudgetStatus(budget) === status);
};