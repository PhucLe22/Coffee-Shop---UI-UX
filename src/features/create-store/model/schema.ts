import { z } from "zod";

export const createStoreSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã").max(10, "Mã không được vượt quá 10 ký tự"),
  name: z.string().min(1, "Vui lòng nhập tên").max(100, "Tên quá dài"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  hotline: z.string().optional(),
});

export type CreateStoreFormValues = z.infer<typeof createStoreSchema>;
