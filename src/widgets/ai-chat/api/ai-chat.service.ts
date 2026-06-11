import { axiosInstance, API_ENDPOINTS, BaseResponse, AIChatInput, AIChatOutput } from "@/shared/api";

export const AIChatService = {
  chat: async (data: AIChatInput): Promise<AIChatOutput> => {
    const response = await axiosInstance.post<BaseResponse<AIChatOutput>>(
      API_ENDPOINTS.AI.CHAT,
      data
    );
    return response.data.data;
  },
};
