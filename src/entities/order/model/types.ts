import { OrderOutput, GetOrdersQuery } from "@/shared/api";

export type { GetOrdersQuery };

export interface PaginatedData<T> {
  items: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: PaginatedData<OrderOutput>;
}

export type OrderStatus = 
  | 'NEW' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'REFUNDED'
  | 'placed' 
  | 'preparing' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled' 
  | 'in_process';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

export interface Order extends Partial<OrderOutput> {
  id?: string;
  status: OrderStatus;
  createdAt: string;
  
  // New API fields (aligning with API reality)
  total: number;
  store: {
    id?: string;
    name: string;
    address: string;
  };
  customer: {
    id?: string;
    name: string;
    phone: string;
    address?: string;
    tier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  };

  // Compatibility fields for old UI
  orderNumber?: string;
  totalPrice?: number;
  items?: OrderItem[];
  estimatedArrival?: string;
  estimatedArrivalText?: string;
  driver?: {
    name: string;
    avatarUrl?: string;
    phoneNumber?: string;
  };
}

export interface OrderStep {
  status: OrderStatus;
  label: string;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}
