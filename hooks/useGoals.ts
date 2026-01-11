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
export function useGetGoal(id: number, enabled: boolean = true) {
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
        mutationFn: ({ id, data }: { id: number; data: UpdateGoalInput }) =>
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
        mutationFn: (id: number) => deleteGoal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
}

// Custom hook for goal progress calculations
export function useGoalProgress(goal: Goal) {
    const progress = goal.progress || (goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0);

    return {
        progress: Math.min(progress, 100),
        remaining: goal.targetAmount - goal.savedAmount,
        isCompleted: goal.isCompleted,
        isOverdue: new Date() > new Date(goal.endDate) && !goal.isCompleted,
        daysRemaining: Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    };
}