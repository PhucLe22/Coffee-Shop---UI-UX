import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/entities/product";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | any }) => 
      ProductService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });
    },
  });
};

export const useUpdateOptionGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, optionGroupId, data }: { productId: string; optionGroupId: string; data: any }) => 
      ProductService.updateOptionGroup(productId, optionGroupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });
    },
  });
};
