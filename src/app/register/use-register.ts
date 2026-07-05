import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { RegisterService } from "./register.service";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: RegisterService.register,
    onSuccess: () => {
      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    },
  });
};
