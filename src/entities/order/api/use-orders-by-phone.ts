import { useQuery } from "@tanstack/react-query";
import { OrderService } from "./order.service";

export const useOrdersByPhone = (phone: string | null) => {
  return useQuery({
    queryKey: ["orders", "phone", phone],
    queryFn: () => OrderService.getOrdersByPhone(phone!),
    enabled: !!phone && phone.trim().length > 0,
  });
};
