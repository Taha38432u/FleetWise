import { makeApiCall } from "@/api/api";
import { UpdateMeDto } from "@/types/auth.types";

const BASE = "auth";

export const getMe = async (): Promise<any> => {
  const response = await makeApiCall<any>({
    method: "GET",
    url: `${BASE}/me`,
  });

  return response;
};

export const updateMe = async (data: UpdateMeDto): Promise<any> => {
  const response = await makeApiCall<any>({
    method: "PATCH",
    url: `${BASE}/me`,
    data,
  });

  return response;
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    // send refresh token to invalidate on server if available
    await makeApiCall({
      method: "POST",
      url: `${BASE}/logout`,
      data: { refreshToken },
      skipAuthError: true,
      // allow auth header to be sent normally
    });
  } catch (e) {
    // ignore errors during logout
  }
};

export default {
  getMe,
  updateMe,
  logout,
};
