import { makeApiCall } from "@/api/api";
import {
    Category,
    CreateCategoryInput,
    GetApiResponse,
} from "@/types/api.types";

export const createCategory = async (data: CreateCategoryInput) => {
    try {
        const response = await makeApiCall({
            url: "categories",
            method: "POST",
            data,
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to create category");
    }
};

// api/categories/categoryApi.ts
export const getCategories = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isPagination?: boolean;
}): Promise<GetApiResponse<Category>> => {
    try {
        const response = await makeApiCall<GetApiResponse<Category>>({
            url: "categories",
            method: "GET",
            params: {
                page: params?.page,
                limit: params?.limit,
                search: params?.search,
                type: params?.type,
                isPagination: params?.isPagination,
            },
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to fetch categories");
    }
};

export const deleteCategory = async (id: number) => {
    try {
        const response = await makeApiCall({
            url: `categories/${id}`,
            method: "DELETE",
        });
        return response;
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to delete category");
    }
};

export const updateCategory = async (id: number, data: CreateCategoryInput): Promise<GetApiResponse<Category>> => {
    try {
        const response = await makeApiCall<GetApiResponse<Category>>({
            url: `categories/${id}`,
            method: "PUT",
            data,
        });
        return response // Assuming your API returns the updated category in data array
    } catch (err: any) {
        throw new Error(err?.response?.data?.error?.message || "Failed to update category");
    }
};
