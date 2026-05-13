export const ProductType = {
  SIMPLE: "SIMPLE",
  COMBO: "COMBO",
  SERVICE: "SERVICE",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string | null;
  slug?: string;
  calories?: string;
  size?: string;
  badge?: string;
}

export interface GetProductsQuery {
  categoryId?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
