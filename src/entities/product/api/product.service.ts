import { axiosInstance } from "@/shared/api";
import { GetProductsQuery } from "../model/types";

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
