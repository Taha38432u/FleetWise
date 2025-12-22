// api/features/authentication/hooks/useRequestPasswordReset.ts
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "../authenticationApi";
import { toast } from "react-toastify";
import { RequestPasswordResetType } from "@/types/auth.types";

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (data: RequestPasswordResetType) => requestPasswordReset(data),
        onSuccess: () => {
            toast.success("Password reset link sent! Check your email.");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to send password reset link");
        },
    });
}
