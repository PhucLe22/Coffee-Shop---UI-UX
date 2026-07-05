import {
  API_ENDPOINTS,
  axiosInstance,
  BaseResponse,
  StaffOutput,
  RegisterStaffBody,
  RegisterStaffResponse,
  UpdateStaffBody,
  GetStaffQuery,
} from '@/shared/api';

export const StaffService = {
  register: async (body: RegisterStaffBody): Promise<BaseResponse<RegisterStaffResponse>> => {
    const response = await axiosInstance.post<BaseResponse<RegisterStaffResponse>>(
      API_ENDPOINTS.STAFF.REGISTER,
      body,
    );
    return response.data;
  },

  getAll: async (query?: GetStaffQuery): Promise<BaseResponse<StaffOutput[]>> => {
    const { role, ...rest } = query ?? {};
    const response = await axiosInstance.get<BaseResponse<StaffOutput[]>>(
      API_ENDPOINTS.STAFF.BASE,
      { params: { ...rest, page: rest.page ?? 1, limit: rest.limit ?? 10, ...(role ? { role } : {}) } },
    );
    return response.data;
  },

  update: async (id: string, body: UpdateStaffBody): Promise<BaseResponse<StaffOutput>> => {
    const response = await axiosInstance.put<BaseResponse<StaffOutput>>(
      API_ENDPOINTS.STAFF.BY_ID(id),
      body,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.STAFF.BY_ID(id));
  },

  hardDelete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.STAFF.HARD_BY_ID(id));
  },
};
