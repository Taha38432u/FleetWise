import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getRecurringTransactions, 
  createRecurring, 
  updateRecurringTransaction, 
  deleteRecurringTransaction, 
  getRecurringTransaction 
} from "@/api/recurring/recurringApi";
import { RecurringTransaction, CreateRecurringInput, UpdateRecurringInput, GetApiResponse } from "@/types/api.types";

// GET all recurring transactions hook
export function useGetRecurringTransactions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPagination?: boolean;
  enabled?: boolean;
}) {
  return useQuery<GetApiResponse<RecurringTransaction>, Error>({
    queryKey: ["recurring-transactions", params],
    queryFn: () => getRecurringTransactions(params),
    enabled: params?.enabled ?? true,
    placeholderData: (prevData: GetApiResponse<RecurringTransaction> | undefined) => prevData,
  });
}

// GET single recurring transaction hook
export function useGetRecurringTransaction(id: string, enabled: boolean = true) {
  return useQuery<RecurringTransaction, Error>({
    queryKey: ["recurring-transactions", id],
    queryFn: () => getRecurringTransaction(id),
    enabled: enabled && !!id,
  });
}

// CREATE recurring transaction hook
export function useCreateRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecurringInput) => createRecurring(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    },
  });
}

// UPDATE recurring transaction hook
export function useUpdateRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringInput }) =>
      updateRecurringTransaction(id, data),
    onSuccess: (updatedRecurring) => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions", updatedRecurring.id] });
    },
  });
}

// DELETE recurring transaction hook
export function useDeleteRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    },
  });
}

// Custom hook for recurring transaction calculations
export function useRecurringTransactionInfo(recurring: RecurringTransaction) {
  const nextRunDate = new Date(recurring.nextRunAt);
  const now = new Date();
  const daysUntilNextRun = Math.ceil((nextRunDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const frequencyLabels: Record<string, string> = {
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    YEARLY: "Yearly",
  };

  return {
    nextRunDate,
    daysUntilNextRun: daysUntilNextRun > 0 ? daysUntilNextRun : 0,
    isOverdue: daysUntilNextRun < 0,
    frequencyLabel: frequencyLabels[recurring.interval] || recurring.interval,
    isActive: recurring.isActive,
  };
}
