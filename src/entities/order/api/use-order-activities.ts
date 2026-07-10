import { useQuery } from '@tanstack/react-query';
import { OrderService } from './order.service';

export const useOrderActivities = (id: string | undefined) => {
  return useQuery({
    queryKey: ['order-activities', id],
    queryFn: () => OrderService.getOrderActivities(id!),
    enabled: !!id,
  });
};
