import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { OptionGroup } from "../model/types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export const OptionGroupService = {
  getAll: async (page = 1, limit = 100): Promise<PaginatedResponse<OptionGroup>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.OPTION_GROUPS.BASE, {
      params: { page, limit },
    });
    return response.data;
  },
};
