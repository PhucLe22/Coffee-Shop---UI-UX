import {
  API_ENDPOINTS,
  axiosInstance,
  BaseResponse,
  StoreOutput,
  GetStoresQuery,
  CreateStoreBody,
  UpdateStoreBody,
} from '@/shared/api';

export const StoreService = {
  getStores: async (query?: GetStoresQuery): Promise<BaseResponse<StoreOutput[]>> => {
    const response = await axiosInstance.get<BaseResponse<StoreOutput[]>>(
      API_ENDPOINTS.STORES.BASE,
      { params: query }
    );
    return response.data;
  },

  getStoresInternal: async (query?: GetStoresQuery): Promise<BaseResponse<StoreOutput[]>> => {
    const response = await axiosInstance.get<BaseResponse<StoreOutput[]>>(
      API_ENDPOINTS.STORES.INTERNAL,
      { params: { ...query, page: query?.page ?? 1, limit: query?.limit ?? 10 } }
    );
    return response.data;
  },

  createStore: async (body: CreateStoreBody): Promise<BaseResponse<StoreOutput>> => {
    const response = await axiosInstance.post<BaseResponse<StoreOutput>>(
      API_ENDPOINTS.STORES.INTERNAL,
      body
    );
    return response.data;
  },

  updateStore: async (id: string, body: UpdateStoreBody): Promise<BaseResponse<StoreOutput>> => {
    const response = await axiosInstance.put<BaseResponse<StoreOutput>>(
      API_ENDPOINTS.STORES.INTERNAL_BY_ID(id),
      body
    );
    return response.data;
  },

  deleteStore: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.STORES.INTERNAL_BY_ID(id));
  },
};
