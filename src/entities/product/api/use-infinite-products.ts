import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import { GetProductsQuery } from "../model/types";

export const useInfiniteProducts = (query?: Omit<GetProductsQuery, "page" | "limit">) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", query],
    queryFn: ({ pageParam = 1 }) => 
      ProductService.getProducts({ 
        ...query, 
        page: pageParam, 
        limit: 6 
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
