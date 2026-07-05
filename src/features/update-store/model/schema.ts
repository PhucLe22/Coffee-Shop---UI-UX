import { z } from "zod";

export const updateStoreSchema = z.object({
  code: z.string().max(10, "Mã không được vượt quá 10 ký tự").optional(),
  name: z.string().max(100, "Tên quá dài").optional(),
  address: z.string().optional(),
  hotline: z.string().optional(),
  isActive: z.string().optional(),
});

export type UpdateStoreFormValues = z.infer<typeof updateStoreSchema>;
