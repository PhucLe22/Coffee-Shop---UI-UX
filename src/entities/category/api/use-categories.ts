import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "./category.service";

export const useCategories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["categories", { page, limit }],
    queryFn: () => CategoryService.getCategories(page, limit),
  });
};
