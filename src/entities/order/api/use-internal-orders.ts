import { useInfiniteQuery } from "@tanstack/react-query";
import { OrderService } from "./order.service";
import { GetOrdersQuery } from "../model/types";

export const useInternalOrders = (query?: GetOrdersQuery) => {
  return useInfiniteQuery({
    queryKey: ["internal-orders", query],
    queryFn: ({ pageParam = 1 }) => 
      OrderService.getInternalOrders({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta || {};
      if (currentPage && totalPages && currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};
