import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { OrderService } from "./order.service";
import { OrderResponse } from "../model/types";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      OrderService.updateOrderStatus(id, status),
    
    // Optimistic Update
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["internal-orders"] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData(["internal-orders"]);

      // Optimistically update to the new value
      queryClient.setQueriesData<InfiniteData<OrderResponse>>(
        { queryKey: ["internal-orders"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((order) =>
                order.id === id ? { ...order, status } : order
              ),
            })),
          };
        }
      );

      return { previousOrders };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueriesData({ queryKey: ["internal-orders"] }, context.previousOrders);
      }
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-orders"] });
    },
  });
};
