import { useMutation } from "@tanstack/react-query";
import { LoginService } from "./login.service";
import { useCustomerAuthStore, useStaffAuthStore } from "@/shared/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const setCustomerAuth = useCustomerAuthStore((state) => state.setAuth);
  const setStaffAuth = useStaffAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: LoginService.login,
    onSuccess: (data) => {
      if (data.type === "STAFF") {
        setStaffAuth(data);
        router.push("/internal/dashboard");
      } else {
        setCustomerAuth(data);
        router.push("/");
      }
    },
  });
};
