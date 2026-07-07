import { useQuery, useMutation } from "@tanstack/react-query";
import { CustomerService } from "./customer.service";

export const useSearchCustomers = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["search-customers", query],
    queryFn: () => CustomerService.searchCustomers(query),
    enabled: enabled && query.length > 3,
  });
};

export const useCreateGuest = () => {
  return useMutation({
    mutationFn: CustomerService.createGuest,
  });
};
