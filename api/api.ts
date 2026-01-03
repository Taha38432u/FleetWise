import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify"

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;


interface basicParams extends AxiosRequestConfig {
    url: string;
    method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
    noAuth?: true;
    isFormData?: boolean;
}

interface paramsWithConfig extends basicParams {
    sendConfig: true;
}

interface paramsWithoutConfig extends basicParams {
    sendConfig?: never;
}

function makeApiCall<T>(
    params: paramsWithConfig
): Promise<AxiosResponse<T, any>>;
function makeApiCall<T>(params: paramsWithoutConfig): Promise<T>;

async function makeApiCall<T>({
    url,
    method = "GET",
    data,
    noAuth,
    sendConfig,
    isFormData = false,
    headers: customHeaders = {},
    ...config
}: paramsWithConfig | paramsWithoutConfig) {
    const accessToken = localStorage.getItem("accessToken");

    // @ts-ignore
    const headers: Record<string, string> = {
        ...(accessToken && !noAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...customHeaders,
    };

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await axios<T>({
            method,
            data,
            url: `${BASE_URL}/${url}`,
            headers,
            ...config,
        });

        return sendConfig ? response : response.data;
    } catch (error: any) {
        const response = error.response;

        // Handle 401: try refresh once (unless request was to refresh or marked noAuth)
        const isUnauthorized = response?.status === 401 && response?.data?.message === "Unauthorized access — token is missing or invalid.";
        const isRefreshEndpoint = String(url).includes("auth/refresh");

        if (isUnauthorized && !noAuth && !isRefreshEndpoint) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const refreshResp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken }, { headers: { "Content-Type": "application/json" } });
                    const respData = refreshResp.data;
                    const newAccessToken = respData?.accessToken;
                    const newRefreshToken = respData?.refreshToken;

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);
                        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
                        if (respData.user) localStorage.setItem("user", JSON.stringify(respData.user));

                        // retry original request with new token
                        const retryHeaders: any = {
                            ...(customHeaders || {}),
                        };
                        retryHeaders["Authorization"] = `Bearer ${newAccessToken}`;
                        if (!isFormData && !retryHeaders["Content-Type"]) {
                            retryHeaders["Content-Type"] = "application/json";
                        }

                        const retryResponse = await axios<T>({
                            method,
                            data,
                            url: `${BASE_URL}/${url}`,
                            headers: retryHeaders,
                            ...config,
                        });

                        return sendConfig ? retryResponse : retryResponse.data;
                    }
                } catch (refreshErr: any) {
                    // refresh failed -> fall through to clearing session below
                }
            }

            // If refresh didn't succeed, clear auth and redirect
            toast.error("Session expired or invalid. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        }

        if (response?.status === 403) {
            toast.error("You are not authorized to access this page.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/403";
        }

        throw error;
    }
}

export interface errType {
    message: string;
    code: number | string;
    err?: any;
}

function checkErrorHasMessage(err: any): err is errType {
    return err?.message !== undefined;
}

export { makeApiCall, checkErrorHasMessage };
