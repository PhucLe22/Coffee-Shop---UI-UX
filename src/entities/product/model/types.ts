export const ProductType = {
  SIMPLE: "SIMPLE",
  COMBO: "COMBO",
  SERVICE: "SERVICE",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export interface CategorySummary {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  basePrice: number;
  price: number | null;
  sortOrder: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  sortOrder: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  basePrice: number;
  costPrice: number;
  taxRate: number;
  thumbnail: string | null;
  images: string[];
  categoryId: string;
  category: CategorySummary;
  sortOrder: number | null;
  preparationTime: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  optionGroups?: ProductOptionGroup[];
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
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}
