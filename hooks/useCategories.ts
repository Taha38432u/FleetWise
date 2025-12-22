// hooks/categories/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, deleteCategory, updateCategory } from "@/api/categories/categoryApi";
import { CreateCategoryInput, GetApiResponse, Category } from "@/types/api.types";

export function useGetCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isPagination?: boolean;
    enabled?: boolean;
}) {
    return useQuery<GetApiResponse<Category>, Error>({
        queryKey: ["categories", params],
        queryFn: () => getCategories(params),
        enabled: params?.enabled ?? true,
        placeholderData: (prevData) => prevData,
    });
}

// CREATE hook
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryInput) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

// UPDATE hook
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateCategoryInput }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

// DELETE hook
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}