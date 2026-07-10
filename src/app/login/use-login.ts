import { useMutation } from "@tanstack/react-query";
import { LoginService } from "./login.service";
import { useCustomerAuthStore, useStaffAuthStore } from "@/shared/auth";
import { useRouter } from "next/navigation";
import { StaffRole } from "@/shared/api";
import { toast } from "sonner";

const getStaffRedirect = (role?: string) => {
  if (role === StaffRole.ADMIN) return "/internal/dashboard";
  if (role === StaffRole.SHIPPER) return "/internal/delivery";
  return "/internal/orders";
};

export const useLogin = () => {
  const setCustomerAuth = useCustomerAuthStore((state) => state.setAuth);
  const setStaffAuth = useStaffAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: LoginService.login,
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công!");
      if (data.type === "STAFF") {
        setStaffAuth(data);
        router.push(getStaffRedirect(data.role));
      } else {
        setCustomerAuth(data);
        router.push("/");
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message || "Email, số điện thoại hoặc mật khẩu không hợp lệ");
    },
  });
};
