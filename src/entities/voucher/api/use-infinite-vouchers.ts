"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { VoucherService } from "./voucher.service";
import { GetVouchersQuery } from "../model/types";

export const useInfiniteVouchers = (query?: Omit<GetVouchersQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: ["vouchers", "infinite", query],
    queryFn: ({ pageParam }) =>
      VoucherService.getVouchers({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNext ? (lastPage.meta.currentPage ?? 0) + 1 : undefined,
  });
};
