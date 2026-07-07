import { axiosInstance, API_ENDPOINTS, RegisterOutput, BaseResponse } from "@/shared/api";
import { RegisterSchema } from "./register-schema";

export const RegisterService = {
  register: async (data: RegisterSchema): Promise<RegisterOutput> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { joinRewards, ...apiData } = data;
    const response = await axiosInstance.post<BaseResponse<RegisterOutput>>(
      API_ENDPOINTS.AUTH.REGISTER, 
      apiData
    );
    return response.data.data;
  },
};
