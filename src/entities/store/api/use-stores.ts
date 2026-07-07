import { useQuery } from "@tanstack/react-query";
import { StoreService } from "./store.service";
import { GetStoresQuery } from "@/shared/api";

export const useStores = (query?: GetStoresQuery) => {
  return useQuery({
    queryKey: ["stores", query],
    queryFn: () => StoreService.getStores(query),
  });
};
