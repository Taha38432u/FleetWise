import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudget
} from "@/api/budget/budgetApi";
import { Budget, CreateBudgetInput, UpdateBudgetInput, GetApiResponse } from "@/types/api.types";

// GET all budgets hook
export function useGetBudgets(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isPagination?: boolean;
    enabled?: boolean;
}) {
    return useQuery<GetApiResponse<Budget>, Error>({
        queryKey: ["budgets", params],
        queryFn: () => getBudgets(params),
        enabled: params?.enabled ?? true,
        placeholderData: (prevData) => prevData,
    });
}

// GET single budget hook
export function useGetBudget(id: number, enabled: boolean = true) {
    return useQuery<Budget, Error>({
        queryKey: ["budgets", id],
        queryFn: () => getBudget(id),
        enabled: enabled && !!id,
    });
}

// CREATE budget hook
export function useCreateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBudgetInput) => createBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });
}

// UPDATE budget hook
export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBudgetInput }) =>
            updateBudget(id, data),
        onSuccess: (updatedBudget) => {
            // Invalidate all budgets list and the specific budget
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["budgets", updatedBudget.id] });
        },
    });
}

// DELETE budget hook
export function useDeleteBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteBudget(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });
}

// Custom hook for budget progress calculations
export function useBudgetProgress(budget: Budget) {
    const progress = {
        used: budget.used || 0,
        remaining: budget.remaining || budget.amount,
        percentUsed: budget.percentUsed || 0,
        isOverBudget: (budget.used || 0) > budget.amount,
        isNearLimit: (budget.percentUsed || 0) >= 80,
    };

    return progress;
}