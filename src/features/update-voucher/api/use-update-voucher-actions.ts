import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VoucherService } from "@/entities/voucher";
import { UpdateVoucherBody } from "@/entities/voucher";

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVoucherBody }) =>
      VoucherService.updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VoucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
};
