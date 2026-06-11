import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { GetProductsQuery, Product, ApiResponse, PaginatedResponse } from "../model/types";

export const ProductService = {
  getProducts: async (query?: GetProductsQuery): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: query,
    });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },
};
