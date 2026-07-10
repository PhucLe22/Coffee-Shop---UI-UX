import { useQuery } from '@tanstack/react-query';
import { OrderService } from './order.service';

export const useDeliverySchedule = () => {
  return useQuery({
    queryKey: ['delivery-schedule'],
    queryFn: OrderService.getDeliverySchedule,
  });
};
