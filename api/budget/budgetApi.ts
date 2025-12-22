import { makeApiCall } from "@/api/api";
import { Budget, CreateBudgetInput, UpdateBudgetInput, GetApiResponse } from "@/types/api.types";

export const createBudget = async (data: CreateBudgetInput): Promise<Budget> => {
  try {
    const response = await makeApiCall<Budget>({
      url: "budgets",
      method: "POST",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to create budget");
  }
};

export const getBudgets = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPagination?: boolean;
}): Promise<GetApiResponse<Budget>> => {
  try {
    const response = await makeApiCall<GetApiResponse<Budget>>({
      url: "budgets",
      method: "GET",
      params,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch budgets");
  }
};

export const getBudget = async (id: number): Promise<Budget> => {
  try {
    const response = await makeApiCall<Budget>({
      url: `budgets/${id}`,
      method: "GET",
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch budget");
  }
};

export const updateBudget = async (id: number, data: UpdateBudgetInput): Promise<Budget> => {
  try {
    const response = await makeApiCall<Budget>({
      url: `budgets/${id}`,
      method: "PUT",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to update budget");
  }
};

export const deleteBudget = async (id: number): Promise<void> => {
  try {
    await makeApiCall({
      url: `budgets/${id}`,
      method: "DELETE",
    });
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to delete budget");
  }
};