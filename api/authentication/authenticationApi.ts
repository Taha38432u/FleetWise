import { makeApiCall } from "@/api/api";
import { loginTypes, RequestPasswordResetType, signUpTypes } from "@/types/auth.types";

export const signUp = async (
    data: signUpTypes
) => {
    try {
        const response = await makeApiCall({
            url: "auth/signup",
            method: "POST",
            data: data,
        });

        return response;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.error?.message || "Failed to create user"
        );
    }
};

export const login = async (
    data: loginTypes
) => {
    try {
        const response = await makeApiCall({
            url: "auth/login",
            method: "POST",
            data: data,
        });

        return response;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.error?.message || "Failed to create user"
        );
    }
};

export const requestPasswordReset = async (data: RequestPasswordResetType) => {
    try {
        const response = await makeApiCall({
            url: "auth/forgot-password",
            method: "POST",
            data,
        });
        return response;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.error?.message || "Failed to request password reset"
        );
    }
};


export const resetPassword = async (token: string, password: string) => {
    try {
        const response = await makeApiCall({
            url: `auth/reset-password`,
            method: "POST",
            data: { token, newPassword: password },
        });

        return response;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.error?.message || "Failed to reset password"
        );
    }
};