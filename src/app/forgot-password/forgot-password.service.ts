import { axiosInstance, API_ENDPOINTS, BaseResponse } from "@/shared/api";
import { ForgotPasswordSchema } from "./forgot-password-schema";

export const ForgotPasswordService = {
  forgotPassword: async (data: ForgotPasswordSchema): Promise<{ message: string }> => {
    const response = await axiosInstance.post<BaseResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data.data;
  },
};
