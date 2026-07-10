import { useQuery } from "@tanstack/react-query";
import { OptionGroupService } from "./option-group.service";

export const useOptionGroups = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["option-groups", page, limit],
    queryFn: () => OptionGroupService.getAll(page, limit),
  });
};
