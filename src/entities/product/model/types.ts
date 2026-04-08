export const ProductType = {
  SIMPLE: "SIMPLE",
  COMBO: "COMBO",
  SERVICE: "SERVICE",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export interface GetProductsQuery {
  categoryId?: string;
  search?: string;
  limit?: number;
  page?: number;
}
