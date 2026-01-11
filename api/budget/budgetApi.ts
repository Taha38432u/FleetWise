import { makeApiCall } from "@/api/api";

interface GetBudgetsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getBudgets(params?: GetBudgetsParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `budgets?${qp.toString()}` : `budgets`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch budgets");
  }
}

export async function getBudget(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "GET", url: `budgets/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch budget");
  }
}

export async function createBudget(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `budgets`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create budget");
  }
}

export async function updateBudget(id: number, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `budgets/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update budget");
  }
}

export async function deleteBudget(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `budgets/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete budget");
  }
}

export default {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
