import { axiosInstance, API_ENDPOINTS, BaseResponse } from "@/shared/api";
import { Address, CreateAddressBody, UpdateAddressBody, AddressAutocompleteItem, AddressAutocompleteQuery } from "../model/address";

export const AddressService = {
  getAddresses: async (): Promise<BaseResponse<Address[]>> => {
    const response = await axiosInstance.get<BaseResponse<Address[]>>(
      API_ENDPOINTS.ADDRESSES.BASE
    );
    return response.data;
  },
  createAddress: async (body: CreateAddressBody): Promise<BaseResponse<Address>> => {
    const response = await axiosInstance.post<BaseResponse<Address>>(
      API_ENDPOINTS.ADDRESSES.BASE,
      body
    );
    return response.data;
  },
  updateAddress: async (id: string, body: UpdateAddressBody): Promise<BaseResponse<Address>> => {
    const response = await axiosInstance.put<BaseResponse<Address>>(
      API_ENDPOINTS.ADDRESSES.BY_ID(id),
      body
    );
    return response.data;
  },
  deleteAddress: async (id: string): Promise<BaseResponse<void>> => {
    const response = await axiosInstance.delete<BaseResponse<void>>(
      API_ENDPOINTS.ADDRESSES.BY_ID(id)
    );
    return response.data;
  },
  autocompleteAddress: async (query: AddressAutocompleteQuery): Promise<BaseResponse<AddressAutocompleteItem[]>> => {
    const response = await axiosInstance.get<BaseResponse<AddressAutocompleteItem[]>>(
      API_ENDPOINTS.ADDRESSES.AUTOCOMPLETE,
      { params: query }
    );
    return response.data;
  },
};
