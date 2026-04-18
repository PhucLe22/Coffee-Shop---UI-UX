import { axiosInstance, API_ENDPOINTS, LoginOutput } from "@/shared/api";
import { LoginSchema } from "./login-schema";

export const LoginService = {
  login: async (data: LoginSchema): Promise<LoginOutput> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },
};
