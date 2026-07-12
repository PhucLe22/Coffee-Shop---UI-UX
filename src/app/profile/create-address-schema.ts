import { z } from "zod";

export const createAddressSchema = z.object({
  receiverName: z.string().min(1, "Vui lòng nhập tên người nhận"),
  receiverPhone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  addressLine: z.string().min(1, "Vui lòng nhập địa chỉ"),
  lat: z.number().optional(),
  lng: z.number().optional(),
  label: z.string().min(1, "Vui lòng nhập nhãn (VD: Nhà riêng, Cơ quan)"),
  isDefault: z.boolean().default(false),
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
