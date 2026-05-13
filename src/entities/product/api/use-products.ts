import { useQuery } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import { GetProductsQuery } from "../model/types";

export const useProducts = (query?: GetProductsQuery) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => ProductService.getProducts(query),
  });
};
