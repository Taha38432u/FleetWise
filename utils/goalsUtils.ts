import { Goal } from "@/types/api.types";

// Calculate goal progress
export const calculateGoalProgress = (goal: Goal) => {
  const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
  const remaining = goal.targetValue - goal.currentValue;
  const dueDate = goal.dueDate ? new Date(goal.dueDate) : null;
  const daysRemaining = dueDate
    ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isCompleted = goal.status === "ACHIEVED";
  
  return {
    progress: Math.min(progress, 100),
    remaining,
    isCompleted,
    isOverdue: Boolean(dueDate) && new Date() > dueDate! && !isCompleted,
    daysRemaining: daysRemaining && daysRemaining > 0 ? daysRemaining : 0,
  };
};

// Format goal period for display
export const formatGoalPeriod = (startDate?: string | null, endDate?: string | null): string => {
  if (!startDate && !endDate) return "No date range";
  const start = startDate ? new Date(startDate).toLocaleDateString() : "Start";
  const end = endDate ? new Date(endDate).toLocaleDateString() : "No due date";
  
  return `${start} - ${end}`;
};

// Check if goal is active
export const isGoalActive = (goal: Goal): boolean => {
  const dueDate = goal.dueDate ? new Date(goal.dueDate) : null;
  return goal.status === "ACTIVE" && (!dueDate || new Date() <= dueDate);
};

// Check if goal is upcoming
export const isGoalUpcoming = (goal: Goal): boolean => {
  return goal.status === "PAUSED";
};

// Check if goal is completed
export const isGoalCompleted = (goal: Goal): boolean => {
  return goal.status === "ACHIEVED";
};

// Check if goal is expired
export const isGoalExpired = (goal: Goal): boolean => {
  const dueDate = goal.dueDate ? new Date(goal.dueDate) : null;
  return Boolean(dueDate) && new Date() > dueDate! && goal.status !== "ACHIEVED";
};

// Get goal status
export const getGoalStatus = (goal: Goal): 'active' | 'upcoming' | 'completed' | 'expired' => {
  if (isGoalCompleted(goal)) return 'completed';
  if (isGoalActive(goal)) return 'active';
  if (isGoalUpcoming(goal)) return 'upcoming';
  return 'expired';
};

// Filter goals by status
export const filterGoalsByStatus = (
  goals: Goal[], 
  status: 'active' | 'upcoming' | 'completed' | 'expired' | 'all'
): Goal[] => {
  if (status === 'all') return goals;
  
  return goals.filter(goal => getGoalStatus(goal) === status);
};
