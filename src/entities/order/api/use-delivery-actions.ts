import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "./order.service";
import { DeliveryScheduleOutput } from "@/shared/api";

export const useConfirmPickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => OrderService.confirmPickup(orderId),
    onSuccess: (_data, orderId) => {
      const cached = queryClient.getQueryData<{ data: DeliveryScheduleOutput }>(["delivery-schedule"]);
      if (cached?.data?.shippers) {
        const updated = {
          ...cached,
          data: {
            ...cached.data,
            shippers: cached.data.shippers.map((shipper) => ({
              ...shipper,
              routes: shipper.routes.map((node) => {
                if (node.orderId === orderId && (node.type === "STORE" || node.type === "PICKUP")) {
                  return { ...node, status: "COMPLETED" };
                }
                if (node.orderId === orderId && node.type === "DELIVERY") {
                  return { ...node, status: "IN_PROGRESS" };
                }
                return node;
              }),
            })),
          },
        };
        queryClient.setQueryData(["delivery-schedule"], updated);
      }
      queryClient.invalidateQueries({ queryKey: ["delivery-schedule"] });
    },
  });
};

export const useReturnDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      OrderService.returnDelivery(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-schedule"] });
    },
  });
};

export const useCompleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => OrderService.completeDelivery(orderId),
    onSuccess: (_data, orderId) => {
      const cached = queryClient.getQueryData<{ data: DeliveryScheduleOutput }>(["delivery-schedule"]);
      if (cached?.data?.shippers) {
        const updated = {
          ...cached,
          data: {
            ...cached.data,
            shippers: cached.data.shippers.map((shipper) => ({
              ...shipper,
              routes: shipper.routes.map((node) =>
                node.orderId === orderId && node.type === "DELIVERY"
                  ? { ...node, status: "COMPLETED" }
                  : node,
              ),
            })),
          },
        };
        queryClient.setQueryData(["delivery-schedule"], updated);
      }
      queryClient.invalidateQueries({ queryKey: ["delivery-schedule"] });
    },
  });
};
