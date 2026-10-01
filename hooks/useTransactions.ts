// hooks/transactions/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransaction,
  getFleetCostSummary,
} from "@/api/transactions/transactionApi";
import { CreateTransactionInput, GetApiResponse, Transaction } from "@/types/api.types";

// GET all transactions hook
export function useGetTransactions(params?: {
  page?: number;
  limit?: number;
  type?: string;
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  isPagination?: boolean;
  enabled?: boolean;
}) {
  return useQuery<GetApiResponse<Transaction>, Error>({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
    enabled: params?.enabled ?? true,
    placeholderData: (prevData: GetApiResponse<Transaction> | undefined) => prevData,
  });
}

// GET single transaction hook
export function useGetTransaction(id: string) {
  return useQuery<Transaction, Error>({
    queryKey: ["transactions", id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
}

// CREATE hook
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate accounts to update balances
    },
  });
}

// UPDATE hook
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTransactionInput }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

// DELETE hook
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useFleetCostSummary(params?: {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}) {
  return useQuery<any, Error>({
    queryKey: ["fleet-costs", "summary", params],
    queryFn: () => getFleetCostSummary(params),
    enabled: params?.enabled ?? true,
  });
}
