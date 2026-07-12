import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
