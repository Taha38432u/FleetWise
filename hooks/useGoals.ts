import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoal
} from "@/api/goals/goalsApi";
import { Goal, CreateGoalInput, UpdateGoalInput, GetApiResponse } from "@/types/api.types";

// GET all goals hook
export function useGetGoals(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isPagination?: boolean;
    enabled?: boolean;
}) {
    return useQuery<GetApiResponse<Goal>, Error>({
        queryKey: ["goals", params],
        queryFn: () => getGoals(params),
        enabled: params?.enabled ?? true,
        placeholderData: (prevData: GetApiResponse<Goal> | undefined) => prevData,
    });
}

// GET single goal hook
export function useGetGoal(id: string, enabled: boolean = true) {
    return useQuery<Goal, Error>({
        queryKey: ["goals", id],
        queryFn: () => getGoal(id),
        enabled: enabled && !!id,
    });
}

// CREATE goal hook
export function useCreateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGoalInput) => createGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
}

// UPDATE goal hook
export function useUpdateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateGoalInput }) =>
            updateGoal(id, data),
        onSuccess: (updatedGoal) => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
            queryClient.invalidateQueries({ queryKey: ["goals", updatedGoal.id] });
        },
    });
}

// DELETE goal hook
export function useDeleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteGoal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
}

// Custom hook for goal progress calculations
export function useGoalProgress(goal: Goal) {
    const progress =
        goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
    const dueDate = goal.dueDate ? new Date(goal.dueDate) : null;

    return {
        progress: Math.min(progress, 100),
        remaining: goal.targetValue - goal.currentValue,
        isCompleted: goal.status === "ACHIEVED",
        isOverdue: Boolean(dueDate) && new Date() > dueDate! && goal.status !== "ACHIEVED",
        daysRemaining: dueDate
            ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null,
    };
}
