import { axiosInstance, API_ENDPOINTS, BaseResponse } from "@/shared/api";

export interface SearchCustomerResult {
  id: string;
  name: string;
  phone: string;
}

export interface CreateGuestBody {
  phone: string;
  name: string;
}

export interface GuestOutput {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  tier: string;
  points: number;
}

export const CustomerService = {
  searchCustomers: async (query: string): Promise<BaseResponse<SearchCustomerResult[]>> => {
    const response = await axiosInstance.get<BaseResponse<SearchCustomerResult[]>>(
      `/internal/customers/search?query=${query}`
    );
    return response.data;
  },
  createGuest: async (body: CreateGuestBody): Promise<BaseResponse<GuestOutput>> => {
    const response = await axiosInstance.post<BaseResponse<GuestOutput>>(
      '/internal/auth/register/guest',
      body
    );
    return response.data;
  },
};
