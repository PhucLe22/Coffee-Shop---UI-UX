import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { VoucherOutput, CreateVoucherBody, UpdateVoucherBody, ApiResponse, PaginatedResponse, GetVouchersQuery, GetPromotionsQuery } from "../model/types";

export const VoucherService = {
  getVouchers: async (query?: GetVouchersQuery): Promise<PaginatedResponse<VoucherOutput>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.VOUCHERS.INTERNAL, {
      params: { ...query, page: query?.page ?? 1, limit: query?.limit ?? 10 },
    });
    return response.data;
  },

  createVoucher: async (body: CreateVoucherBody): Promise<ApiResponse<VoucherOutput>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.VOUCHERS.INTERNAL, body);
    return response.data;
  },

  updateVoucher: async (id: string, body: UpdateVoucherBody): Promise<ApiResponse<VoucherOutput>> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.VOUCHERS.INTERNAL_BY_ID(id), body);
    return response.data;
  },

  deleteVoucher: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.VOUCHERS.INTERNAL_BY_ID(id));
  },

  getPromotions: async (query?: GetPromotionsQuery): Promise<PaginatedResponse<VoucherOutput>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROMOTIONS.BASE, {
      params: query,
    });
    return response.data;
  },
};
