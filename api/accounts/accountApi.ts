import { makeApiCall } from "@/api/api";

interface GetAccountsParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export async function getAccounts(params?: GetAccountsParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.type) qp.append("type", params.type);
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `accounts?${qp.toString()}` : `accounts`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch accounts");
  }
}

export async function createAccount(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `accounts`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create account");
  }
}

export async function updateAccount(id: number, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `accounts/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update account");
  }
}

export async function deleteAccount(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `accounts/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete account");
  }
}

export async function transferMoney(payload: { fromAccountId: number; toAccountId: number; amount: number; description?: string; }): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `accounts/transfer`, data: payload });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to transfer money");
  }
}
