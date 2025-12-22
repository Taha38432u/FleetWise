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
    const token = localStorage.getItem("authToken");

    // @ts-ignore
    const headers: Record<string, string> = {
        ...(token && !noAuth ? { Authorization: `Bearer ${token}` } : {}),
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

        if (
            response?.status === 401 &&
            response?.data?.message ===
            "Unauthorized access — token is missing or invalid."
        ) {
            toast.error("Session expired or invalid. Please log in again.");
            localStorage.clear();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        }

        if (response?.status === 403) {
            toast.error("You are not authorized to access this page.");
            localStorage.clear();
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
