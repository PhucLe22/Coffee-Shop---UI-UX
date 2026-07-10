import { z } from "zod";

export const updateStaffSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  role: z.enum(["CASHIER", "MANAGER", "KITCHEN", "SHIPPER"]).optional(),
  isActive: z.string().optional(),
  storeId: z.string().optional(),
});

export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
