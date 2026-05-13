import { useQuery } from "@tanstack/react-query";
import { ProductService } from "./product.service";

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => ProductService.getProductBySlug(slug),
    enabled: !!slug,
  });
};
