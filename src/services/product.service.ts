import axiosInstance from "@/lib/axios";
import { GetProductsQuery } from "@/types/contracts";

export const ProductService = {
  getProducts: async (query?: GetProductsQuery) => {
    const response = await axiosInstance.get("/products", {
      params: query,
    });
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/products/${slug}`);
    return response.data;
  },
};
