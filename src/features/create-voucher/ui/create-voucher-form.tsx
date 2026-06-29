"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVoucherSchema, CreateVoucherFormValues } from "../model/schema";
import { useCreateVoucher } from "../api/use-create-voucher";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";

interface CreateVoucherFormProps {
  onSuccess?: () => void;
}

export const CreateVoucherForm = ({ onSuccess }: CreateVoucherFormProps) => {
  const { mutate: createVoucher, isPending } = useCreateVoucher();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateVoucherFormValues>({
    resolver: zodResolver(createVoucherSchema as any),
    defaultValues: {
      discountType: "PERCENT",
    },
  });

  const discountType = watch("discountType");

  const onSubmit = (values: CreateVoucherFormValues) => {
    const body: Record<string, unknown> = {
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
    };

    if (values.maxUsage) body.maxUsage = Number(values.maxUsage);
    if (values.minOrderAmount) body.minOrderAmount = Number(values.minOrderAmount);
    if (values.maxDiscount) body.maxDiscount = Number(values.maxDiscount);
    if (values.storeId) body.storeId = values.storeId;
    if (values.expiresAt) body.expiresAt = new Date(values.expiresAt).toISOString();

    console.log("[CreateVoucher] payload:", body);

    createVoucher(body as any, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Voucher created successfully");
          reset();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to create voucher");
        }
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-text-secondary font-bold">CODE</Label>
        <Input
          id="code"
          {...register("code")}
          placeholder="e.g. SUMMER10"
          className="bg-surface-muted border-0 rounded-md h-14 uppercase"
          maxLength={20}
        />
        {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountType" className="text-text-secondary font-bold">DISCOUNT TYPE</Label>
          <select
            id="discountType"
            {...register("discountType")}
            className="flex h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right:1rem_center] bg-no-repeat"
          >
            <option value="PERCENT">PERCENT</option>
            <option value="FIXED">FIXED</option>
          </select>
          {errors.discountType && <p className="text-red-500 text-xs">{errors.discountType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountValue" className="text-text-secondary font-bold">
            {discountType === "PERCENT" ? "DISCOUNT (%)" : "DISCOUNT AMOUNT"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            {...register("discountValue", { valueAsNumber: true })}
            placeholder={discountType === "PERCENT" ? "e.g. 10" : "e.g. 25000"}
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.discountValue && <p className="text-red-500 text-xs">{errors.discountValue.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxUsage" className="text-text-secondary font-bold">MAX USAGE</Label>
          <Input
            id="maxUsage"
            type="number"
            {...register("maxUsage")}
            placeholder="e.g. 100"
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.maxUsage && <p className="text-red-500 text-xs">{errors.maxUsage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderAmount" className="text-text-secondary font-bold">MIN ORDER AMOUNT</Label>
          <Input
            id="minOrderAmount"
            type="number"
            {...register("minOrderAmount")}
            placeholder="e.g. 50000"
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.minOrderAmount && <p className="text-red-500 text-xs">{errors.minOrderAmount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxDiscount" className="text-text-secondary font-bold">MAX DISCOUNT</Label>
          <Input
            id="maxDiscount"
            type="number"
            {...register("maxDiscount")}
            placeholder="e.g. 50000"
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.maxDiscount && <p className="text-red-500 text-xs">{errors.maxDiscount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="text-text-secondary font-bold">EXPIRES AT</Label>
          <Input
            id="expiresAt"
            type="date"
            {...register("expiresAt")}
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.expiresAt && <p className="text-red-500 text-xs">{errors.expiresAt.message}</p>}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <AppButton
          type="submit"
          isLoading={isPending}
          className="w-full md:w-[240px]"
        >
          CREATE VOUCHER
        </AppButton>
      </div>
    </form>
  );
};
