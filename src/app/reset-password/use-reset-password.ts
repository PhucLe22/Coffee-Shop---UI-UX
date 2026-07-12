import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordService } from "./reset-password.service";
import { useRouter, useSearchParams } from "next/navigation";

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  return useMutation({
    mutationFn: async (data: { password: string }) => {
      if (!token) throw new Error("Token không hợp lệ");
      return ResetPasswordService.resetPassword({ token, password: data.password });
    },
    onSuccess: () => {
      toast.success("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    },
  });
};
