import { useQuery } from "@tanstack/react-query";
import { OrderService } from "./order.service";
import { GetOrdersQuery } from "../model/types";

export const useOrders = (query?: GetOrdersQuery) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => OrderService.getOrders(query),
  });
};
