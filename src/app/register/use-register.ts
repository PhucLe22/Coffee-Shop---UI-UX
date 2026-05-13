import { useMutation } from "@tanstack/react-query";
import { RegisterService } from "./register.service";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: RegisterService.register,
    onSuccess: () => {
      // Typically we'd login directly, but for now redirect to login
      router.push("/login");
    },
  });
};
