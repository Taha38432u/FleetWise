import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";

export const BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

interface basicParams extends AxiosRequestConfig {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  noAuth?: true;
  skipAuthError?: true;
  isFormData?: boolean;
}

interface paramsWithConfig extends basicParams {
  sendConfig: true;
}

interface paramsWithoutConfig extends basicParams {
  sendConfig?: never;
}

function makeApiCall<T>(params: paramsWithConfig): Promise<AxiosResponse<T, any>>;
function makeApiCall<T>(params: paramsWithoutConfig): Promise<T>;

async function makeApiCall<T>({
  url,
  method = "GET",
  data,
  noAuth,
  skipAuthError,
  sendConfig,
  isFormData = false,
  headers: customHeaders = {},
  ...config
}: paramsWithConfig | paramsWithoutConfig) {
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL configuration.");
  }

  const accessToken = localStorage.getItem("accessToken");

  // @ts-expect-error allow flexible header typing
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
    const isUnauthorized = response?.status === 401;
    const isRefreshEndpoint = String(url).includes("auth/refresh");

    if (isUnauthorized && !noAuth && !isRefreshEndpoint && !skipAuthError) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshResp = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } },
          );
          const respData = refreshResp.data;
          const newAccessToken = respData?.accessToken;
          const newRefreshToken = respData?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
            if (respData.user) {
              localStorage.setItem("user", JSON.stringify(respData.user));
            }

            const retryHeaders: Record<string, string> = {
              ...(customHeaders as Record<string, string>),
              Authorization: `Bearer ${newAccessToken}`,
            };

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
        } catch (_refreshErr: any) {
          // Refresh failed. Fall through to local cleanup.
        }
      }

      toast.error("Session expired or invalid. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    if (response?.status === 403) {
      toast.error(
        response?.data?.message ||
          response?.data?.error?.message ||
          "You are not authorized to perform this action.",
      );
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
