import { axiosInstance, API_ENDPOINTS, LoginOutput, BaseResponse } from "@/shared/api";
import { LoginSchema } from "./login-schema";

export const LoginService = {
  login: async (data: LoginSchema): Promise<LoginOutput> => {
    const response = await axiosInstance.post<BaseResponse<LoginOutput>>(
      API_ENDPOINTS.AUTH.LOGIN, 
      data
    );
    return response.data.data;
  },
};
