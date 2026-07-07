import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "./staff.service";
import { RegisterStaffBody } from "@/shared/api";

export const useRegisterStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RegisterStaffBody) => StaffService.register(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};
