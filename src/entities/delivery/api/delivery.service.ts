import { axiosInstance, API_ENDPOINTS } from "@/shared/api";
import { ShipperRoutesResponse, ShipperRoutesData } from "../model/types";

export const DeliveryService = {
  getShipperRoutes: async (shipperId?: string): Promise<ShipperRoutesResponse> => {
    const params = shipperId ? { shipperId } : undefined;
    const response = await axiosInstance.get(API_ENDPOINTS.DELIVERY.SHIPPER_ROUTES, { params });
    return response.data;
  },

  refreshShipperRoutes: async (): Promise<ShipperRoutesResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.DELIVERY.SHIPPER_ROUTES);
    return response.data;
  },
};
