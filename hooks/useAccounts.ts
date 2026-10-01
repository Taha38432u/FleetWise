// hooks/accounts/useAccounts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccounts, createAccount, updateAccount, deleteAccount, transferMoney } from "@/api/accounts/accountApi";
import { CreateAccountInput, GetApiResponse, Account } from "@/types/api.types";

// GET hook
export function useGetAccounts(params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  isPagination?: boolean;
  enabled?: boolean;
}) {
  return useQuery<GetApiResponse<Account>, Error>({
    queryKey: ["accounts", params],
    queryFn: () => getAccounts(params),
    enabled: params?.enabled ?? true,
    placeholderData: (prevData: GetApiResponse<Account> | undefined) => prevData,
  });
}

// CREATE hook
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountInput) => createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

// UPDATE hook
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAccountInput }) =>
      updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

// DELETE hook
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useTransferMoney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      description?: string;
    }) => transferMoney(data),
    onSuccess: () => {
      // Invalidate both accounts and transactions queries
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
