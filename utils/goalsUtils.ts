import { Goal } from "@/types/api.types";

// Calculate goal progress
export const calculateGoalProgress = (goal: Goal) => {
  const progress = goal.progress || (goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0);
  const remaining = goal.targetAmount - goal.savedAmount;
  const daysRemaining = Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    progress: Math.min(progress, 100),
    remaining,
    isCompleted: goal.isCompleted,
    isOverdue: new Date() > new Date(goal.endDate) && !goal.isCompleted,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
  };
};

// Format goal period for display
export const formatGoalPeriod = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString();
  const endFormatted = end.toLocaleDateString();
  
  return `${startFormatted} - ${endFormatted}`;
};

// Check if goal is active
export const isGoalActive = (goal: Goal): boolean => {
  const now = new Date();
  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);
  
  return now >= start && now <= end && !goal.isCompleted;
};

// Check if goal is upcoming
export const isGoalUpcoming = (goal: Goal): boolean => {
  const now = new Date();
  const start = new Date(goal.startDate);
  
  return now < start && !goal.isCompleted;
};

// Check if goal is completed
export const isGoalCompleted = (goal: Goal): boolean => {
  return goal.isCompleted;
};

// Check if goal is expired
export const isGoalExpired = (goal: Goal): boolean => {
  const now = new Date();
  const end = new Date(goal.endDate);
  
  return now > end && !goal.isCompleted;
};

// Get goal status
export const getGoalStatus = (goal: Goal): 'active' | 'upcoming' | 'completed' | 'expired' => {
  if (goal.isCompleted) return 'completed';
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