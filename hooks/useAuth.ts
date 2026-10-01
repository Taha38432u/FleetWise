import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "@/api/auth/authApi";

import { UpdateMeDto, MeUser } from "@/types/auth.types";

export const useGetMe = () => {
  return useQuery<MeUser | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const resp = await getMe();

        if (!resp) return null;

        // If API returned wrapper { data: MeUser }
        if ((resp as any).data) return (resp as any).data as MeUser;

        // If API returned MeUser directly
        return resp as MeUser;
      } catch (err) {
        return null;
      }
    },
    retry: false,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeDto) => updateMe(data),
    onSuccess: (resp: any) => {
      if (!resp) return;
      const data: MeUser = resp?.data ? resp.data : resp;
      try {
        localStorage.setItem("user", JSON.stringify(data));
      } catch (e) {}
      queryClient.setQueryData(["me"], data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export default { useGetMe, useUpdateMe };
