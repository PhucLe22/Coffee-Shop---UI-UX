import { axiosInstance, API_ENDPOINTS, BaseResponse } from "@/shared/api";

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export const ResetPasswordService = {
  resetPassword: async (data: ResetPasswordBody): Promise<{ message: string }> => {
    const response = await axiosInstance.post<BaseResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data.data;
  },
};
