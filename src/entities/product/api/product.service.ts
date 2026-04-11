import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { GetProductsQuery } from "../model/types";

export const ProductService = {
  getProducts: async (query?: GetProductsQuery) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: query,
    });
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },
};
