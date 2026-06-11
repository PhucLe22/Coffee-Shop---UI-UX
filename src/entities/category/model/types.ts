export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}
