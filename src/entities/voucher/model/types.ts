import { VoucherOutput } from "@/shared/api/contracts";
export type { VoucherOutput };
export type { CreateVoucherBody, UpdateVoucherBody, GetVouchersQuery, GetPromotionsQuery } from "@/shared/api/contracts";

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
