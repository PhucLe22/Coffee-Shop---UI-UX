"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAddressSchema,
  type CreateAddressSchema,
} from "./create-address-schema";
import { useCreateAddress } from "@/entities/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/ui/dialog";
import { AppButton, Input, Checkbox, Label } from "@/shared/ui";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib";
import { Address } from "@/entities/customer/model/address";

interface CreateAddressDialogProps {
  onCreated?: (address: Address) => void;
  trigger?: React.ReactNode;
}

export function CreateAddressDialog({ onCreated, trigger }: CreateAddressDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { mutate: createAddress, isPending } = useCreateAddress();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      addressLine: "",
      label: "",
      isDefault: false,
    },
  });

  const onSubmit = (data: CreateAddressSchema) => {
    createAddress(data, {
      onSuccess: (response) => {
        toast.success("Address created successfully");
        setOpen(false);
        reset();
        if (onCreated && response.data) {
          onCreated(response.data);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create address");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-text-primary hover:scale-110 transition-transform">
            <Plus className="size-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-surface-main rounded-md border-none">
        <DialogHeader>
          <DialogTitle className="text-body-md-bold text-text-primary uppercase tracking-[0.2em]">
            Add New Address
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-lg px-lg py-4">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="receiverName"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              RECEIVER NAME
            </Label>
            <Input
              id="receiverName"
              placeholder="e.g. Nguyen Van A"
              {...register("receiverName")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverName
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.receiverName && (
              <span className="text-overline text-error">
                {errors.receiverName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="receiverPhone"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              RECEIVER PHONE
            </Label>
            <Input
              id="receiverPhone"
              placeholder="e.g. 0912345678"
              {...register("receiverPhone")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverPhone
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.receiverPhone && (
              <span className="text-overline text-error">
                {errors.receiverPhone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="addressLine"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              ADDRESS LINE
            </Label>
            <Input
              id="addressLine"
              placeholder="e.g. 1 Vo Van Ngan, Thu Duc..."
              {...register("addressLine")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.addressLine
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.addressLine && (
              <span className="text-overline text-error">
                {errors.addressLine.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="label"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              LABEL
            </Label>
            <Input
              id="label"
              placeholder="e.g. Home, Work, Gym"
              {...register("label")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.label
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.label && (
              <span className="text-overline text-error">
                {errors.label.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-sm pt-2">
            <Checkbox
              id="isDefault"
              {...register("isDefault")}
              className="size-6 border-text-primary/20 bg-transparent rounded-sm checked:bg-brand-primary"
            />
            <Label
              htmlFor="isDefault"
              className="normal-case font-bold text-body-sm-reg text-text-primary">
              Set as default address
            </Label>
          </div>

          <DialogFooter>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border-text-muted/20 text-text-secondary hover:bg-surface-accent h-[54px]">
              CANCEL
            </AppButton>
            <AppButton
              type="submit"
              isLoading={isPending}
              className="w-full rounded-full text-inverse-text h-[54px]">
              SAVE ADDRESS
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
