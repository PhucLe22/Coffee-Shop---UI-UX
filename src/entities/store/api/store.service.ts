import {
  API_ENDPOINTS,
  axiosInstance,
  BaseResponse,
  StoreOutput,
  GetStoresQuery,
} from '@/shared/api';

export const StoreService = {
  getStores: async (query?: GetStoresQuery): Promise<BaseResponse<StoreOutput[]>> => {
    const response = await axiosInstance.get<BaseResponse<StoreOutput[]>>(
      API_ENDPOINTS.STORES.BASE,
      { params: query }
    );
    return response.data;
  },
};
