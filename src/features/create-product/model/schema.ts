import { z } from "zod";
import { ProductType } from "@/entities/product";

export const createProductSchema = z.object({
  sku: z.string().min(1, "Vui lòng nhập mã SKU"),
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  type: z.nativeEnum(ProductType),
  basePrice: z.coerce.number().min(0, "Giá cơ bản phải lớn hơn hoặc bằng 0"),
  taxRate: z.coerce.number().min(0, "Thuế suất phải lớn hơn hoặc bằng 0"),
  categoryId: z.string().uuid("ID danh mục không hợp lệ"),
  sortOrder: z.coerce.number().int().optional(),
  description: z.string().optional(),
  image: z.any().optional(), // We'll handle file validation separately or use z.instanceof(File) if available in this env
  optionGroups: z.array(z.object({
    optionGroupId: z.string().uuid(),
    sortOrder: z.number().int(),
    optionValues: z.array(z.object({
      optionId: z.string().uuid(),
      price: z.number().min(0)
    }))
  })).optional()
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
