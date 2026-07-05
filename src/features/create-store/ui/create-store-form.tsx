"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStoreSchema, CreateStoreFormValues } from "../model/schema";
import { useCreateStore } from "@/entities/store";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";

interface CreateStoreFormProps {
  onSuccess?: () => void;
}

export const CreateStoreForm = ({ onSuccess }: CreateStoreFormProps) => {
  const { mutate: createStore, isPending } = useCreateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema as any),
  });

  const onSubmit = (values: CreateStoreFormValues) => {
    createStore(values, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Store created successfully");
          reset();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to create store");
        }
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-text-secondary font-bold">MÃ</Label>
        <Input
          id="code"
          {...register("code")}
          placeholder="VD: HCM01"
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
          placeholder="VD: Chi nhánh Trung Tâm"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-text-secondary font-bold">ĐỊA CHỈ</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="VD: 123 Đường, Quận 1"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotline" className="text-text-secondary font-bold">HOTLINE</Label>
        <Input
          id="hotline"
          {...register("hotline")}
          placeholder="VD: 0123456789"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.hotline && <p className="text-red-500 text-xs">{errors.hotline.message}</p>}
      </div>

      <div className="flex justify-center pt-4">
        <AppButton
          type="submit"
          isLoading={isPending}
          className="w-full md:w-[240px]"
        >
          CREATE STORE
        </AppButton>
      </div>
    </form>
  );
};
