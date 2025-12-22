import { makeApiCall } from "@/api/api";
import { Goal, CreateGoalInput, UpdateGoalInput, GetApiResponse } from "@/types/api.types";

export const createGoal = async (data: CreateGoalInput): Promise<Goal> => {
  try {
    const response = await makeApiCall<Goal>({
      url: "goals",
      method: "POST",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to create goal");
  }
};

export const getGoals = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPagination?: boolean;
}): Promise<GetApiResponse<Goal>> => {
  try {
    const response = await makeApiCall<GetApiResponse<Goal>>({
      url: "goals",
      method: "GET",
      params,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch goals");
  }
};

export const getGoal = async (id: number): Promise<Goal> => {
  try {
    const response = await makeApiCall<Goal>({
      url: `goals/${id}`,
      method: "GET",
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to fetch goal");
  }
};

export const updateGoal = async (id: number, data: UpdateGoalInput): Promise<Goal> => {
  try {
    const response = await makeApiCall<Goal>({
      url: `goals/${id}`,
      method: "PUT",
      data,
    });
    return response;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to update goal");
  }
};

export const deleteGoal = async (id: number): Promise<void> => {
  try {
    await makeApiCall({
      url: `goals/${id}`,
      method: "DELETE",
    });
  } catch (err: any) {
    throw new Error(err?.response?.data?.error?.message || "Failed to delete goal");
  }
};