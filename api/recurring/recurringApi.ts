import { makeApiCall } from "@/api/api";

interface GetRecurringParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getRecurringTransactions(params?: GetRecurringParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `recurring?${qp.toString()}` : `recurring`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch recurring transactions");
  }
}

export async function getRecurringTransaction(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "GET", url: `recurring/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch recurring transaction");
  }
}

export async function createRecurringTransaction(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `recurring`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create recurring transaction");
  }
}

// Backwards-compatible alias expected by hooks
export const createRecurring = createRecurringTransaction;

export async function updateRecurringTransaction(id: number, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `recurring/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update recurring transaction");
  }
}

export async function deleteRecurringTransaction(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `recurring/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete recurring transaction");
  }
}

export default {
  getRecurringTransactions,
  getRecurringTransaction,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};
