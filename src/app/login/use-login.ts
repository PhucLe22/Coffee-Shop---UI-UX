import { useMutation } from "@tanstack/react-query";
import { LoginService } from "./login.service";
import { useAuthStore } from "@/shared/auth";
import { setAccessToken } from "@/shared/api";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: LoginService.login,
    onSuccess: (data) => {
      setAuth(data);
      setAccessToken(data.accessToken);
      router.push("/");
    },
  });
};
