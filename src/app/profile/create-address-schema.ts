import { z } from "zod";

export const createAddressSchema = z.object({
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  addressLine: z.string().min(1, "Address is required"),
  label: z.string().min(1, "Label is required (e.g. Home, Work)"),
  isDefault: z.boolean().default(false),
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
