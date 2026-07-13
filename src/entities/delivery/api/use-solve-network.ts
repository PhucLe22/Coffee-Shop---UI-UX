import { useMutation } from "@tanstack/react-query";
import { DeliveryService } from "./delivery.service";
import { toast } from "sonner";

export const useSolveNetwork = () => {
  return useMutation({
    mutationFn: (tardinessWeight?: number) =>
      DeliveryService.solveNetwork(tardinessWeight),
    onSuccess: () => {
      toast.success("Kích hoạt solver thành công!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Kích hoạt solver thất bại";
      toast.error(message);
    },
  });
};
