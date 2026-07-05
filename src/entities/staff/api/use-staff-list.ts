import { useQuery } from "@tanstack/react-query";
import { StaffService } from "./staff.service";
import { GetStaffQuery } from "@/shared/api";

export const useStaffList = (query?: GetStaffQuery) => {
  return useQuery({
    queryKey: ["staff", query],
    queryFn: () => StaffService.getAll(query),
  });
};
