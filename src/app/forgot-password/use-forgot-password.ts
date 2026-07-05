import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordService } from "./forgot-password.service";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ForgotPasswordService.forgotPassword,
    onSuccess: () => {
      toast.success("Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.");
    },
    onError: () => {
      toast.success("Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.");
    },
  });
};
