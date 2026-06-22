import { z } from "zod";
import { ProductType } from "@/entities/product";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(ProductType),
  basePrice: z.coerce.number().min(0, "Base price must be at least 0"),
  taxRate: z.coerce.number().min(0, "Tax rate must be at least 0"),
  categoryId: z.string().uuid("Invalid category ID"),
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
