import { useQuery } from "@tanstack/react-query";
import { VoucherService } from "./voucher.service";
import { SuggestVoucherQuery } from "../model/types";

export const useSuggestVouchers = (query?: SuggestVoucherQuery) => {
  return useQuery({
    queryKey: ["suggest-vouchers", query],
    queryFn: () => VoucherService.suggestVouchers(query),
    enabled: !!query?.storeId && !!query?.orderAmount,
  });
};
