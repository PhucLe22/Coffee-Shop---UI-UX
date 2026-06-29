import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import { GetProductsQuery } from "../model/types";

import { AxiosError } from "axios";

export const useInfiniteProducts = (query?: Omit<GetProductsQuery, "page" | "limit">) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", query],
    queryFn: ({ pageParam = 1 }) => 
      ProductService.getAdminProducts({ 
        ...query, 
        page: pageParam, 
        limit: 100
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (meta && meta.hasNext) {
        return meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
