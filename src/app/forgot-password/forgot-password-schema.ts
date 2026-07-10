import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
