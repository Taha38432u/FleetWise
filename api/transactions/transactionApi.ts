import { makeApiCall } from "@/api/api";

interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getTransactions(params?: GetTransactionsParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);
    if (params?.type) qp.append("type", params.type);
    if (params?.accountId) qp.append("accountId", params.accountId);
    if (params?.categoryId) qp.append("categoryId", params.categoryId);
    if (params?.startDate) qp.append("startDate", params.startDate);
    if (params?.endDate) qp.append("endDate", params.endDate);

    const url = qp.toString() ? `transactions?${qp.toString()}` : `transactions`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch transactions");
  }
}

export async function getFleetCostSummary(params?: {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
}): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.from) qp.append("from", params.from);
    if (params?.to) qp.append("to", params.to);
    if (params?.startDate) qp.append("startDate", params.startDate);
    if (params?.endDate) qp.append("endDate", params.endDate);

    const url = qp.toString()
      ? `fleet-costs/summary?${qp.toString()}`
      : "fleet-costs/summary";
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch fleet cost summary");
  }
}

export async function getTransaction(id: string): Promise<any> {
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

export async function updateTransaction(id: string, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `transactions/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update transaction");
  }
}

export async function deleteTransaction(id: string): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `transactions/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete transaction");
  }
}

export default {
  getTransactions,
  getTransaction,
  getFleetCostSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
