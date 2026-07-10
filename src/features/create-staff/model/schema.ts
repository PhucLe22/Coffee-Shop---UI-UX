import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhân viên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.enum(["CASHIER", "MANAGER", "KITCHEN", "SHIPPER"], "Role is required"),
  storeId: z.string().min(1, "Vui lòng chọn cửa hàng"),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
