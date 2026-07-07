import { useInfiniteQuery } from "@tanstack/react-query";
import { StoreService } from "./store.service";
import { GetStoresQuery } from "@/shared/api";

export const useInternalStores = (query?: Omit<GetStoresQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: ["stores", "internal", query],
    queryFn: ({ pageParam = 1 }) =>
      StoreService.getStoresInternal({
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
