import { useQuery } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import { GetProductsQuery, SearchProductQuery } from "../model/types";

export const useProducts = (query?: GetProductsQuery) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => ProductService.getProducts(query),
  });
};

export const useSearchProducts = (query: SearchProductQuery | null) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => ProductService.getSearchProducts(query!),
    enabled: !!query && query.q.trim().length > 0,
  });
};

export const useNewProducts = (limit = 5) => {
  return useQuery({
    queryKey: ["products", "new", limit],
    queryFn: () => ProductService.getNewProducts(limit),
  });
};

export const useHotProducts = (limit = 5) => {
  return useQuery({
    queryKey: ["products", "hot", limit],
    queryFn: () => ProductService.getHotProducts(limit),
  });
};
