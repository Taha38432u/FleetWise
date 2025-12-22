// api/accounts/accountApi.ts
import { makeApiCall } from "@/api/api";
import { Account, CreateAccountInput, GetApiResponse } from "@/types/api.types";

export const createAccount = async (data: CreateAccountInput) => {
  try {
    const response = await makeApiCall({
      url: "accounts",
      method: "POST",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to create account");
  }
};

export const getAccounts = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  isPagination?: boolean;
}): Promise<GetApiResponse<Account>> => {
  try {
    const response = await makeApiCall<GetApiResponse<Account>>({
      url: "accounts",
      method: "GET",
      params,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch accounts");
  }
};

export const updateAccount = async (id: number, data: CreateAccountInput): Promise<Account> => {
  try {
    const response = await makeApiCall<GetApiResponse<Account>>({
      url: `accounts/${id}`,
      method: "PUT",
      data,
    });
    return response.data[0];
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to update account");
  }
};

export const deleteAccount = async (id: number) => {
  try {
    const response = await makeApiCall({
      url: `accounts/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to delete account");
  }
};

export const transferMoney = async (data: {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}) => {
  try {
    const response = await makeApiCall({
      url: "accounts/transfer",
      method: "POST",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to transfer money");
  }
};