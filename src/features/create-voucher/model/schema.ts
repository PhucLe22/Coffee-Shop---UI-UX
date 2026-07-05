import { z } from "zod";

export const createVoucherSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã").max(20, "Mã không được vượt quá 20 ký tự"),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.coerce.number().min(1, "Giá trị giảm giá phải ít nhất là 1"),
  maxUsage: z.string().optional(),
  minOrderAmount: z.string().optional(),
  maxDiscount: z.string().optional(),
  storeId: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type CreateVoucherFormValues = z.infer<typeof createVoucherSchema>;
