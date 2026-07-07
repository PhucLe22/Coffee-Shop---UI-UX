import { useInfiniteQuery } from "@tanstack/react-query";
import { StoreService } from "./store.service";
import { GetStoresQuery } from "@/shared/api";

export const useInfiniteStores = (query?: Omit<GetStoresQuery, "page" | "limit">) => {
  return useInfiniteQuery({
    queryKey: ["stores-infinite", query],
    queryFn: ({ pageParam = 1 }) =>
      StoreService.getStores({
        ...query,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (meta && meta.hasNext) {
        return meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
