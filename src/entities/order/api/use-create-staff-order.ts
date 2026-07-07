import { useMutation } from '@tanstack/react-query';
import { OrderService } from './order.service';

export const useCreateStaffOrder = () => {
  return useMutation({
    mutationFn: OrderService.createStaffOrder,
  });
};
