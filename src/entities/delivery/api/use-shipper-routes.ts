import { useQuery } from "@tanstack/react-query";
import { DeliveryService } from "./delivery.service";

export const useShipperRoutes = (shipperId?: string) => {
  return useQuery({
    queryKey: ["shipper-routes", shipperId],
    queryFn: () => DeliveryService.getShipperRoutes(shipperId),
  });
};
