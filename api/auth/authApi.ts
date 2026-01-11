import { makeApiCall } from "@/api/api";
import { GetMeResponse, UpdateMeDto } from "@/types/auth.types";

const BASE = "auth";

export const getMe = async () => {
  const response = await makeApiCall<GetMeResponse>({
    method: "GET",
    url: `${BASE}/me`,
  });

  // Return raw response -- caller will normalize either { data: MeUser } or MeUser
  return response;
};

export const updateMe = async (data: UpdateMeDto) => {
  const response = await makeApiCall<GetMeResponse>({
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
      // allow auth header to be sent normally
    });
  } catch (e) {
    // ignore errors during logout
  }
};

export default {
  getMe,
  updateMe,
};
