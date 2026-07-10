import { useQuery } from "@tanstack/react-query";
import { VoucherService } from "./voucher.service";
import { GetVouchersQuery } from "../model/types";

export const useVouchers = (query?: GetVouchersQuery) => {
  return useQuery({
    queryKey: ["vouchers", query],
    queryFn: () => VoucherService.getVouchers(query),
  });
};
