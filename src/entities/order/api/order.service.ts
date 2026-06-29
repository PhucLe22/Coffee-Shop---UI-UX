import {
  API_ENDPOINTS,
  axiosInstance,
  BaseResponse,
  CreateOrderBody,
  OrderOutput,
  StaffCreateOrderBody,
  DeliveryScheduleOutput,
} from '@/shared/api';
import { Order, GetOrdersQuery, OrderActivity } from '../model/types';
import { OrderResponse } from '../model/types';

export const OrderService = {
  getOrders: async (
    query?: GetOrdersQuery
  ): Promise<OrderResponse> => {
    const response = await axiosInstance.get<
      OrderResponse
    >(API_ENDPOINTS.ORDERS.BASE, {
      params: query,
    });
    return response.data;
  },

  getInternalOrders: async (
    query?: GetOrdersQuery
  ): Promise<OrderResponse> => {
    const response = await axiosInstance.get<
      OrderResponse
    >(API_ENDPOINTS.ORDERS.INTERNAL, {
      params: query,
    });
    return response.data;
  },

  createOrder: async (
    body: CreateOrderBody
  ): Promise<BaseResponse<OrderOutput>> => {
    const response = await axiosInstance.post<BaseResponse<OrderOutput>>(
      API_ENDPOINTS.ORDERS.BASE,
      body
    );
    return response.data;
  },

  getOrderByCode: async (
    code: string
  ): Promise<BaseResponse<OrderOutput>> => {
    const response = await axiosInstance.get<BaseResponse<OrderOutput>>(
      API_ENDPOINTS.ORDERS.BY_CODE(code)
    );
    return response.data;
  },

  createStaffOrder: async (
    body: StaffCreateOrderBody
  ): Promise<BaseResponse<OrderOutput>> => {
    const response = await axiosInstance.post<BaseResponse<OrderOutput>>(
      API_ENDPOINTS.ORDERS.INTERNAL,
      body
    );
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    status: string
  ): Promise<BaseResponse<OrderOutput>> => {
    const response = await axiosInstance.patch<BaseResponse<OrderOutput>>(
      API_ENDPOINTS.ORDERS.STATUS(id),
      { status }
    );
    return response.data;
  },

  getOrderActivities: async (id: string): Promise<OrderActivity[]> => {
    const response = await axiosInstance.get<BaseResponse<OrderActivity[]>>(
      API_ENDPOINTS.ORDERS.ACTIVITIES(id)
    );
    return response.data.data;
  },

  getDeliverySchedule: async (): Promise<BaseResponse<DeliveryScheduleOutput>> => {
    const response = await axiosInstance.get<BaseResponse<DeliveryScheduleOutput>>(
      API_ENDPOINTS.DELIVERY.SCHEDULE
    );
    return response.data;
  },
};

export const fetchOrderById = async (code: string): Promise<Order> => {
  const response = await OrderService.getOrderByCode(code);
  const data = response.data as any;
  if (data?.orderItems) {
    data.orderItems = data.orderItems.map((item: any) => ({
      ...item,
      options: item.options?.map((opt: any) => opt.name || opt) || [],
    }));
  }
  return data as Order;
};

export const createOrder = OrderService.createOrder;
