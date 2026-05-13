import { axiosInstance, API_ENDPOINTS, RegisterOutput } from "@/shared/api";
import { RegisterSchema } from "./register-schema";

export const RegisterService = {
  register: async (data: RegisterSchema): Promise<RegisterOutput> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
};
