import { makeApiCall } from "@/api/api";

interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getTransactions(params?: GetTransactionsParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `transactions?${qp.toString()}` : `transactions`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch transactions");
  }
}

export async function getTransaction(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "GET", url: `transactions/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch transaction");
  }
}

export async function createTransaction(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `transactions`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create transaction");
  }
}

export async function updateTransaction(id: number, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `transactions/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update transaction");
  }
}

export async function deleteTransaction(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `transactions/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete transaction");
  }
}

export default {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
