"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStoreSchema, UpdateStoreFormValues } from "../model/schema";
import { useUpdateStore } from "@/entities/store";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";
import { StoreOutput } from "@/shared/api";

interface UpdateStoreFormProps {
  store: StoreOutput;
  onSuccess?: () => void;
}

export const UpdateStoreForm = ({ store, onSuccess }: UpdateStoreFormProps) => {
  const { mutate: updateStore, isPending } = useUpdateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStoreFormValues>({
    resolver: zodResolver(updateStoreSchema as any),
    defaultValues: {
      code: store.code,
      name: store.name,
      address: store.address,
      hotline: store.hotline ?? "",
      isActive: store.isActive ? "true" : "false",
    },
  });

  const onSubmit = (values: UpdateStoreFormValues) => {
    const body: Record<string, unknown> = {};
    if (values.code) body.code = values.code;
    if (values.name) body.name = values.name;
    if (values.address) body.address = values.address;
    if (values.hotline) body.hotline = values.hotline;
    body.isActive = values.isActive === "true";

    updateStore({ id: store.id, data: body as any }, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Store updated successfully");
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to update store");
        }
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-text-secondary font-bold">MÃ</Label>
        <Input
          id="code"
          {...register("code")}
          placeholder="Để trống nếu giữ nguyên"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14 uppercase"
          maxLength={10}
        />
        {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-text-secondary font-bold">TÊN</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Để trống nếu giữ nguyên"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-text-secondary font-bold">ĐỊA CHỈ</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Để trống nếu giữ nguyên"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotline" className="text-text-secondary font-bold">HOTLINE</Label>
        <Input
          id="hotline"
          {...register("hotline")}
          placeholder="Để trống nếu giữ nguyên"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.hotline && <p className="text-red-500 text-xs">{errors.hotline.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive" className="text-text-secondary font-bold">TRẠNG THÁI</Label>
        <select
          id="isActive"
          {...register("isActive")}
          className="flex h-12 sm:h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="flex justify-center pt-4">
        <AppButton
          type="submit"
          isLoading={isPending}
          className="w-full md:w-[240px]"
        >
          UPDATE STORE
        </AppButton>
      </div>
    </form>
  );
};
