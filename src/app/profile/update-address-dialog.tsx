"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAddressSchema, type CreateAddressSchema } from "./create-address-schema";
import { useUpdateAddress } from "@/entities/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/ui/dialog";
import { AppButton, Input, Checkbox, Label } from "@/shared/ui";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Address } from "@/entities/customer/model/address";

interface UpdateAddressDialogProps {
  address: Address;
}

export function UpdateAddressDialog({ address }: UpdateAddressDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { mutate: updateAddress, isPending } = useUpdateAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      addressLine: address.addressLine,
      label: address.label,
      isDefault: address.isDefault,
    },
  });

  const onSubmit = (data: CreateAddressSchema) => {
    updateAddress({ id: address.id, body: data }, {
      onSuccess: () => {
        toast.success("Address updated successfully");
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update address");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={cn(
          "p-2 rounded-full transition-all hover:bg-black/5",
          address.isDefault ? "text-inverse-text hover:bg-white/10" : "text-text-primary hover:bg-black/5"
        )}>
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-surface-main p-xl rounded-md border-none">
        <DialogHeader>
          <DialogTitle className="text-body-md-bold text-text-primary uppercase tracking-[0.2em] mb-4">
            Update Address
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg py-4">
          <div className="flex flex-col gap-xs">
            <Label htmlFor="receiverName" className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">TÊN NGƯỜI NHẬN</Label>
            <Input
              id="receiverName"
              placeholder="e.g. Nguyen Van A"
              {...register("receiverName")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverName ? "border-error focus-visible:ring-error" : "border-none"
              )}
            />
            {errors.receiverName && (
              <span className="text-overline text-error">{errors.receiverName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label htmlFor="receiverPhone" className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">SỐ ĐIỆN THOẠI NGƯỜI NHẬN</Label>
            <Input
              id="receiverPhone"
              placeholder="e.g. 0912345678"
              {...register("receiverPhone")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverPhone ? "border-error focus-visible:ring-error" : "border-none"
              )}
            />
            {errors.receiverPhone && (
              <span className="text-overline text-error">{errors.receiverPhone.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label htmlFor="addressLine" className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">ĐỊA CHỈ</Label>
            <Input
              id="addressLine"
              placeholder="e.g. 1 Vo Van Ngan, Thu Duc..."
              {...register("addressLine")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.addressLine ? "border-error focus-visible:ring-error" : "border-none"
              )}
            />
            {errors.addressLine && (
              <span className="text-overline text-error">{errors.addressLine.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label htmlFor="label" className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">NHÃN</Label>
            <Input
              id="label"
              placeholder="VD: Nhà riêng, Cơ quan, Phòng Gym"
              {...register("label")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.label ? "border-error focus-visible:ring-error" : "border-none"
              )}
            />
            {errors.label && (
              <span className="text-overline text-error">{errors.label.message}</span>
            )}
          </div>

          <div className="flex items-center gap-sm pt-2">
            <Checkbox 
              id="isDefault" 
              {...register("isDefault")}
              className="size-6 border-text-primary/20 bg-transparent rounded-sm checked:bg-brand-primary" 
            />
            <Label htmlFor="isDefault" className="normal-case font-bold text-body-sm-reg text-text-primary">
              Set as default address
            </Label>
          </div>

          <DialogFooter className="flex flex-row gap-md sm:gap-md pt-6">
            <AppButton 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border-text-muted/20 text-text-secondary hover:bg-surface-accent h-[54px]"
            >
              CANCEL
            </AppButton>
            <AppButton 
              type="submit" 
              isLoading={isPending} 
              className="flex-1 rounded-full text-inverse-text px-8 h-[54px]"
            >
              UPDATE ADDRESS
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
