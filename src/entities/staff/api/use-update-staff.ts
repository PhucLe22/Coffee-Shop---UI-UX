import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "./staff.service";
import { UpdateStaffBody } from "@/shared/api";

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffBody }) =>
      StaffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => StaffService.hardDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};
