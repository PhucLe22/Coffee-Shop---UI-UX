import { axiosInstance, API_ENDPOINTS, LoginOutput, LoginApiResponse, BaseResponse } from "@/shared/api";
import { LoginSchema } from "./login-schema";

export const LoginService = {
  login: async (data: LoginSchema): Promise<LoginOutput> => {
    console.log("[LoginService] Sending payload:", { ...data, password: "***" });

    const response = await axiosInstance.post<BaseResponse<LoginApiResponse | LoginOutput>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    console.log("[LoginService] Raw response:", response.data);
    console.log("[LoginService] response.data.data:", response.data.data);

    const responseData = response.data.data;

    if (responseData && 'tokens' in responseData) {
      console.log("[LoginService] Detected nested shape (user + tokens)");
      const { user, tokens } = responseData as LoginApiResponse;
      return {
        ...user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }

    console.log("[LoginService] Detected flat shape (LoginOutput)");
    return responseData as LoginOutput;
  },
};
