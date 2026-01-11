import { makeApiCall } from "@/api/api";

interface GetGoalsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getGoals(params?: GetGoalsParams): Promise<any> {
  try {
    const qp = new URLSearchParams();
    if (params?.page !== undefined) qp.append("page", String(params.page));
    if (params?.limit !== undefined) qp.append("limit", String(params.limit));
    if (params?.search) qp.append("search", params.search);

    const url = qp.toString() ? `goals?${qp.toString()}` : `goals`;
    return await makeApiCall({ method: "GET", url });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch goals");
  }
}

export async function getGoal(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "GET", url: `goals/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to fetch goal");
  }
}

export async function createGoal(data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "POST", url: `goals`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to create goal");
  }
}

export async function updateGoal(id: number, data: any): Promise<any> {
  try {
    return await makeApiCall({ method: "PUT", url: `goals/${id}`, data });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to update goal");
  }
}

export async function deleteGoal(id: number): Promise<any> {
  try {
    return await makeApiCall({ method: "DELETE", url: `goals/${id}` });
  } catch (err: any) {
    throw Error(err?.response?.data?.error?.message || "Failed to delete goal");
  }
}

export default {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
};
