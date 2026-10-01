import { makeApiCall } from "@/api/api";

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getCategories(params?: GetCategoriesParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `categories?${qp.toString()}` : `categories`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch categories");
  }
}

export async function createCategory(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `categories`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create category");
  }
}

export async function updateCategory(id: string, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `categories/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update category");
  }
}

export async function deleteCategory(id: string): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `categories/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete category");
  }
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
