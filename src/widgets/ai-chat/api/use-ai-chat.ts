import { useMutation } from "@tanstack/react-query";
import { AIChatService } from "./ai-chat.service";
import { AIChatInput, AIChatOutput } from "@/shared/api";

export const useAIChat = () => {
  return useMutation<AIChatOutput, Error, AIChatInput>({
    mutationFn: (data: AIChatInput) => AIChatService.chat(data),
  });
};
