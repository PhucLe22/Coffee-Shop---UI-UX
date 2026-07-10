import { axiosInstance, API_ENDPOINTS, BaseResponse, ProfileOutput } from "@/shared/api";
import { useAuthStore } from "@/shared/auth";

export const AuthService = {
  logout: async (accessToken: string, refreshToken: string): Promise<BaseResponse<{ message: string }>> => {
    const response = await axiosInstance.post<BaseResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.LOGOUT,
      { message: "User logout" },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );
    return response.data;
  },
  getMe: async (): Promise<BaseResponse<any>> => {
    const response = await axiosInstance.get<BaseResponse<any>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data;
  },
  getProfile: async (): Promise<BaseResponse<ProfileOutput>> => {
    const response = await axiosInstance.get<BaseResponse<ProfileOutput>>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data;
  },
};
