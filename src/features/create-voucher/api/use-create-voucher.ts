import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VoucherService } from "@/entities/voucher";
import { CreateVoucherBody } from "@/entities/voucher";

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVoucherBody) => VoucherService.createVoucher(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
};
