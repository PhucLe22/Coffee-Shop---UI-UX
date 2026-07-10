"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema, CreateStaffFormValues } from "../model/schema";
import { useRegisterStaff } from "@/entities/staff";
import { StoreService } from "@/entities/store";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";

interface CreateStaffFormProps {
  onSuccess?: () => void;
}

const STAFF_ROLES = [
  { value: "CASHIER", label: "Thu Ngân" },
  { value: "MANAGER", label: "Quản Lý" },
  { value: "KITCHEN", label: "Bếp" },
  { value: "SHIPPER", label: "Giao Hàng" },
] as const;

export const CreateStaffForm = ({ onSuccess }: CreateStaffFormProps) => {
  const { mutate: registerStaff, isPending } = useRegisterStaff();
  const { data: storesData } = useQuery({
    queryKey: ["stores", "internal", "all"],
    queryFn: () => StoreService.getStoresInternal({ limit: 100 }),
  });
  const stores = storesData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema as any),
  });

  const onSubmit = (values: CreateStaffFormValues) => {
    registerStaff(values, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Staff registered successfully");
          reset();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to register staff");
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
        <Label htmlFor="name" className="text-text-secondary font-bold">TÊN NHÂN VIÊN</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Nguyễn Văn A"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-secondary font-bold">EMAIL</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="staff@trasua.com"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-text-secondary font-bold">SỐ ĐIỆN THOẠI</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="0988111223"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-secondary font-bold">MẬT KHẨU</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Ít nhất 6 ký tự"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-text-secondary font-bold">VAI TRÒ</Label>
        <select
          id="role"
          {...register("role")}
          className="flex h-12 sm:h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none"
        >
          <option value="">Chọn vai trò</option>
          {STAFF_ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeId" className="text-text-secondary font-bold">CỬA HÀNG</Label>
        <select
          id="storeId"
          {...register("storeId")}
          className="flex h-12 sm:h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none"
        >
          <option value="">Chọn cửa hàng</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.storeId && <p className="text-red-500 text-xs">{errors.storeId.message}</p>}
      </div>

      <div className="flex justify-center pt-4">
        <AppButton
          type="submit"
          isLoading={isPending}
          className="w-full md:w-[240px]"
        >
          REGISTER STAFF
        </AppButton>
      </div>
    </form>
  );
};
