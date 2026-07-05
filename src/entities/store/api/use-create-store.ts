import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreService } from "./store.service";
import { CreateStoreBody } from "@/shared/api";

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateStoreBody) => StoreService.createStore(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};
