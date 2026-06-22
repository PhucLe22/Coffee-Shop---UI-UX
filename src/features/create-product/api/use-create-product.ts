import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/entities/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ProductService.createProduct(formData),
    onSuccess: () => {
      // Invalidate products cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
