// api/transactions/transactionApi.ts
import { makeApiCall } from "@/api/api";
import { Transaction, CreateTransactionInput, GetApiResponse } from "@/types/api.types";

export const createTransaction = async (data: CreateTransactionInput) => {
  try {
    const response = await makeApiCall({
      url: "transactions",
      method: "POST",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to create transaction");
  }
};

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  accountId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  isPagination?: boolean;
}): Promise<GetApiResponse<Transaction>> => {
  try {
    const response = await makeApiCall<GetApiResponse<Transaction>>({
      url: "transactions",
      method: "GET",
      params,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch transactions");
  }
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  try {
    const response = await makeApiCall<GetApiResponse<Transaction>>({
      url: `transactions/${id}`,
      method: "GET",
    });
    return response.data[0];
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch transaction");
  }
};

export const updateTransaction = async (id: number, data: CreateTransactionInput): Promise<Transaction> => {
  try {
    const response = await makeApiCall<GetApiResponse<Transaction>>({
      url: `transactions/${id}`,
      method: "PUT",
      data,
    });
    return response.data[0];
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to update transaction");
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const response = await makeApiCall({
      url: `transactions/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to delete transaction");
  }
};