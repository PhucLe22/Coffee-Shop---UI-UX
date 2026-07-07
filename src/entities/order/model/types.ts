import { OrderOutput, GetOrdersQuery, OrderStatus as SharedOrderStatus, CustomerTier } from "@/shared/api";

export type { GetOrdersQuery };

export interface OrderResponse {
  success: boolean;
  message: string;
  data: OrderOutput[];
  meta?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export type OrderStatus = 
  | SharedOrderStatus
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

export interface Order extends Omit<Partial<OrderOutput>, 'status'> {
  id?: string;
  status: OrderStatus;
  createdAt: string;
  
  // Compatibility fields for old UI and internal logic
  orderNumber?: string;
  totalPrice?: number;
  items?: OrderItem[];
  estimatedArrival?: string;
  driver?: {
    name: string;
    avatarUrl?: string;
    phoneNumber?: string;
  };
}

export interface OrderActivity {
  status: string;
  label: string;
  time: string | null;
  isPast: boolean;
  description?: string;
  isEstimate?: boolean;
}

export interface OrderStep {
  status: OrderStatus;
  label: string;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}
