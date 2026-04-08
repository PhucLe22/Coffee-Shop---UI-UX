/**
 * Generated TypeScript types from Zod contracts for Frontend usage
 */

// --- ENUMS (from constants/enum.js) ---

export const OrderType = {
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
  DELIVERY: "DELIVERY",
} as const;
export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const OrderStatus = {
  NEW: "NEW",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  CASH: "CASH",
  CARD: "CARD",
  MOMO: "MOMO",
  VNPAY: "VNPAY",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const StaffRole = {
  ROOT: "ROOT",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  KITCHEN: "KITCHEN",
  OWNER: "OWNER",
} as const;
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

export const DeliveryStatus = {
  PENDING: "PENDING",
  SHIPPER_ASSIGNED: "SHIPPER_ASSIGNED",
  PICKED_UP: "PICKED_UP",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export const PointType = {
  EARN: "EARN",
  REDEEM: "REDEEM",
  EXPIRE: "EXPIRE",
  ADJUST: "ADJUST",
} as const;
export type PointType = (typeof PointType)[keyof typeof PointType];

export const DiscountType = {
  PERCENT: "PERCENT",
  FIXED: "FIXED",
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const CustomerTier = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM",
} as const;
export type CustomerTier = (typeof CustomerTier)[keyof typeof CustomerTier];

export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  STATUS_CHANGE: "STATUS_CHANGE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PERMISSION_CHANGE: "PERMISSION_CHANGE",
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const VoucherScope = {
  PUBLIC: "PUBLIC",
  CUSTOMER: "CUSTOMER",
} as const;
export type VoucherScope = (typeof VoucherScope)[keyof typeof VoucherScope];

export const ProductType = {
  SIMPLE: "SIMPLE",
  COMBO: "COMBO",
  SERVICE: "SERVICE",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export const UserType = {
  CUSTOMER: "CUSTOMER",
  STAFF: "STAFF",
  GUEST: "GUEST",
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];

// --- AUTH (auth.output.schema.js) ---

export interface RegisterOutput {
  id: string;
  email: string;
  phone: string;
}

export interface LoginOutput {
  id: string;
  name: string;
  email: string;
  type: UserType;
  tier?: CustomerTier;
  points?: number;
  role?: StaffRole;
  storeName?: string;
  accessToken: string;
  refreshToken: string;
}

export interface GuestOutput {
  customerId: string;
  name: string;
  phone: string;
  tier: CustomerTier;
}

// --- ORDER (order.output.schema.js) ---

export interface CreateOrderBody {
  storeId: string;
  type: OrderType;
  note?: string;
  voucherCode?: string;
  items: Array<{
    productId: string;
    quantity: number;
    note?: string;
    options?: Array<{
      name: string;
      price: number;
    }>;
  }>;
  deliveryInfo?: {
    receiverName: string;
    receiverPhone: string;
    addressLine: string;
  };
}

export interface GetOrderHistoryQuery {
  status?:
    | "NEW"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED";
}

export interface GetOrderDetailParams {
  id: string;
}

// --- PAYMENT (payment.output.schema.js) ---

export interface InternalPaymentBody {
  orderId: string;
  amount: number;
  pin: string;
}

// --- PRODUCT (product.output.schema.js) ---

export interface GetProductsQuery {
  categoryId?: string;
  search?: string;
  limit?: number;
  page?: number;
}

// --- PROMOTIONS (promotions.output.schema.js) ---

export interface GetAvailableVouchersQuery {
  storeId?: string;
  orderAmount?: number;
}

// --- SHIP (ship.output.schema.js) ---

export interface GetDistanceMatrixQuery {
  locations: string;
  mode?: "driving" | "walking" | "cycling";
}

export interface OptimizeRouteBody {
  orderIds: string[];
  staffCapacity?: number;
  timeWindows: {
    startTime: string; // ISO Date String
    endTime: string; // ISO Date String
    maxServiceTime: number;
  };
  depotLocation: {
    lat: number;
    lng: number;
  };
}

export interface GetStaffScheduleParams {
  staff_id: string;
}

export interface GetStaffScheduleQuery {
  date?: string; // YYYY-MM-DD
}

// --- STAFF ACTION (staff/action.schema.js) ---

export interface UpdateProductStockParams {
  id: string;
}

export interface UpdateProductStockBody {
  isActive: boolean;
}

export interface UpdateDeliveryLocationParams {
  id: string;
}

export interface UpdateDeliveryLocationBody {
  lat: number;
  lng: number;
}

// --- STAFF ORDER (staff/order.schema.js) ---

export interface StaffCreateOrderBody {
  customerId?: string;
  type: OrderType;
  note?: string;
  items: Array<{
    productId: string;
    quantity: number;
    options?: Array<{
      name: string;
      price: number;
    }>;
  }>;
  paymentMethod?: string;
}

export interface UpdateOrderStatusParams {
  id: string;
}

export interface UpdateOrderStatusBody {
  status:
    | typeof OrderStatus.CONFIRMED
    | typeof OrderStatus.PREPARING
    | typeof OrderStatus.READY
    | typeof OrderStatus.COMPLETED
    | typeof OrderStatus.CANCELLED;
}

// --- STORE (store.output.schema.js) ---

export interface GetStoresQuery {
  lat?: number;
  lng?: number;
}

// --- USER (user.output.schema.js) ---

export interface BaseUserInfo {
  name: string;
  phone: string;
  email: string | null;
  role: StaffRole | string;
}

export interface CustomerInfo {
  name: string | null;
  phone: string;
  email: string | null;
  tier: CustomerTier;
  points: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
}

export interface StaffInfo {
  storeInfo: StoreInfo;
  userInfo: BaseUserInfo;
  managerInfo: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
  } | null;
}

export interface ManagerInfo {
  storeInfo: StoreInfo;
  userInfo: BaseUserInfo;
}

export interface AdminInfo {
  userInfo: BaseUserInfo;
}

export type UserInfo = CustomerInfo | StaffInfo | ManagerInfo | AdminInfo;

// --- ADMIN REPORT (admin/report.output.schema.js) ---

export interface AdminTopProductsQuery {
  limit?: number;
  storeId?: string;
}
