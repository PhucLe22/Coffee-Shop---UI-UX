import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { CategoryResponse } from "../model/types";

export const CategoryService = {
  getCategories: async (page = 1, limit = 10): Promise<CategoryResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE, {
      params: { page, limit },
    });
    return response.data;
  },
};
