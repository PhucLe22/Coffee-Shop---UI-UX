export type OrderStatus = 'placed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled' | 'in_process';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  estimatedArrival: string;
  estimatedArrivalText: string;
  driver?: {
    name: string;
    avatarUrl?: string;
    phoneNumber?: string;
  };
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export interface OrderStep {
  status: OrderStatus;
  label: string;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}
