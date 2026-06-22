import { z } from "zod";

export const createVoucherSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Code must be at most 20 characters"),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.coerce.number().min(1, "Discount value must be at least 1"),
  maxUsage: z.string().optional(),
  minOrderAmount: z.string().optional(),
  maxDiscount: z.string().optional(),
  storeId: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type CreateVoucherFormValues = z.infer<typeof createVoucherSchema>;
