import { useQuery } from '@tanstack/react-query';
import { OrderService } from './order.service';

export const useOrderByCode = (code: string | null) => {
  return useQuery({
    queryKey: ['order', code],
    queryFn: () => OrderService.getOrderByCode(code!),
    enabled: !!code,
  });
};
