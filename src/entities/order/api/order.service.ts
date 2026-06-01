import {
  API_ENDPOINTS,
  axiosInstance,
  BaseResponse,
  CreateOrderBody,
  OrderOutput,
} from '@/shared/api';
import { Order, GetOrdersQuery, PaginatedData } from '../model/types';

export const orderMock: Order = {
  id: '8829-AC',
  orderNumber: '8829-AC',
  status: 'on_the_way',
  estimatedArrival: '12:45',
  estimatedArrivalText: 'Expected in 14 mins',
  driver: {
    name: 'Marco S.',
    phoneNumber: '+1 234 567 890',
  },
  items: [
    {
      id: '1',
      name: 'Single-Origin Espresso',
      quantity: 1,
      price: 4.50,
      options: ['OAT MILK', 'REGULAR'],
    },
    {
      id: '2',
      name: 'Artisan Sourdough Croissant',
      quantity: 1,
      price: 11.00,
      options: ['WARM', 'SALTED BUTTER'],
    },
  ],
  totalPrice: 15.50,
  total: 15.50,
  createdAt: '2026-04-09T12:10:00Z',
  store: {
    id: 'store-1',
    name: 'Main Store',
    address: '123 Main Street',
  },
  customer: {
    id: 'cust-1',
    name: 'John Doe',
    phone: '0123456789',
    tier: 'BRONZE',
  },
};

export const OrderService = {
  getOrders: async (
    query?: GetOrdersQuery
  ): Promise<BaseResponse<PaginatedData<OrderOutput>>> => {
    const response = await axiosInstance.get<
      BaseResponse<PaginatedData<OrderOutput>>
    >(API_ENDPOINTS.ORDERS.BASE, {
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
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...orderMock, id });
    }, 500);
  });
};

export const createOrder = OrderService.createOrder;
