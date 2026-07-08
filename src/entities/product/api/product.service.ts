import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { GetProductsQuery, Product, ApiResponse, PaginatedResponse, SearchProductQuery } from "../model/types";

export const ProductService = {
  getProducts: async (query?: GetProductsQuery): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: query,
    });
    return response.data;
  },

  getSearchProducts: async (query?: SearchProductQuery): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: query,
    });
    return response.data;
  },

  getNewProducts: async (limit = 5): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.NEW, {
      params: { limit },
    });
    return response.data;
  },

  getHotProducts: async (limit = 5): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.HOT, {
      params: { limit },
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

  createProduct: async (formData: FormData): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.INTERNAL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, data: FormData | any): Promise<ApiResponse<Product>> => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.INTERNAL_BY_ID(id), data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },

  getAdminProducts: async (query?: GetProductsQuery): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ADMIN, {
      params: query,
    });
    return response.data;
  },

  toggleActive: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PRODUCTS.TOGGLE_ACTIVE(id));
    return response.data;
  },

  deleteAdminProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.ADMIN_BY_ID(id));
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.INTERNAL_BY_ID(id));
    return response.data;
  },

  updateOptionGroup: async (productId: string, optionGroupId: string, data: any): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.OPTION_GROUPS(productId, optionGroupId), data);
    return response.data;
  },
};
