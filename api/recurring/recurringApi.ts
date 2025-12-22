import { makeApiCall } from "@/api/api";
import { RecurringTransaction, CreateRecurringInput, UpdateRecurringInput, GetApiResponse } from "@/types/api.types";

export const createRecurring = async (data: CreateRecurringInput): Promise<RecurringTransaction> => {
    try {
        const response = await makeApiCall<RecurringTransaction>({
            url: "recurring",
            method: "POST",
            data,
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to create recurring transaction");
    }
};

export const getRecurringTransactions = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isPagination?: boolean;
}): Promise<GetApiResponse<RecurringTransaction>> => {
    try {
        const response = await makeApiCall<GetApiResponse<RecurringTransaction>>({
            url: "recurring",
            method: "GET",
            params,
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to fetch recurring transactions");
    }
};

export const getRecurringTransaction = async (id: number): Promise<RecurringTransaction> => {
    try {
        const response = await makeApiCall<RecurringTransaction>({
            url: `recurring/${id}`,
            method: "GET",
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to fetch recurring transaction");
    }
};

export const updateRecurringTransaction = async (id: number, data: UpdateRecurringInput): Promise<RecurringTransaction> => {
    try {
        const response = await makeApiCall<RecurringTransaction>({
            url: `recurring/${id}`,
            method: "PUT",
            data,
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to update recurring transaction");
    }
};

export const deleteRecurringTransaction = async (id: number): Promise<void> => {
    try {
        await makeApiCall({
            url: `recurring/${id}`,
            method: "DELETE",
        });
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to delete recurring transaction");
    }
};