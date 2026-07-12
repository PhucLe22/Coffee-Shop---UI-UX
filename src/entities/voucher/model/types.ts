import { VoucherOutput } from "@/shared/api/contracts";
export type { VoucherOutput };
export type { CreateVoucherBody, UpdateVoucherBody, GetVouchersQuery, GetPromotionsQuery } from "@/shared/api/contracts";

export interface SuggestVoucherQuery {
  storeId?: string;
  orderAmount?: number;
  customerId?: string;
}

export interface SuggestVoucherItem {
  id: string;
  code: string;
  scope: string | null;
  discountType: string;
  discountValue: string;
  maxUsage: number;
  usedCount: number;
  minOrderAmount: string | null;
  maxDiscount: string | null;
  storeId: string | null;
  expiresAt: string | null;
  isActive: boolean;
  store: { id: string; name: string } | null;
  customerVouchers: unknown[];
  redemptions: unknown[];
  estimatedDiscount: number;
}

export interface ValidateVoucherBody {
  code: string;
  orderAmount: number;
  storeId?: string;
  customerId?: string;
}

export interface ValidateVoucherResponse {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  maxDiscount: number | null;
  minOrderAmount: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    totalItems: number;
    currentPage: number;
    pageSize?: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export type PaginatedResponse<T> = ApiResponse<T[]>;
