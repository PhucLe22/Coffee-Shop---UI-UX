import { useQuery } from "@tanstack/react-query";
import { VoucherService } from "./voucher.service";
import { GetPromotionsQuery } from "../model/types";

export const usePromotions = (query?: GetPromotionsQuery) => {
  return useQuery({
    queryKey: ["promotions", query],
    queryFn: () => VoucherService.getPromotions(query),
  });
};
