"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStaffSchema, UpdateStaffFormValues } from "../model/schema";
import { useUpdateStaff } from "@/entities/staff";
import { StoreService } from "@/entities/store";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { toast } from "sonner";
import { StaffOutput } from "@/shared/api";

interface UpdateStaffFormProps {
  staff: StaffOutput;
  onSuccess?: () => void;
}

const STAFF_ROLES = [
  { value: "CASHIER", label: "Thu Ngân" },
  { value: "MANAGER", label: "Quản Lý" },
  { value: "KITCHEN", label: "Bếp" },
  { value: "SHIPPER", label: "Giao Hàng" },
] as const;

export const UpdateStaffForm = ({ staff, onSuccess }: UpdateStaffFormProps) => {
  const { mutate: updateStaff, isPending } = useUpdateStaff();
  const { data: storesData } = useQuery({
    queryKey: ["stores", "internal", "all"],
    queryFn: () => StoreService.getStoresInternal({ limit: 100 }),
  });
  const apiStores = storesData?.data ?? [];
  const stores = apiStores.some((s) => s.id === staff.storeId)
    ? apiStores
    : [{ id: staff.storeId, name: staff.storeName, address: "", code: "", hotline: "", isActive: true, isDeleted: false, lat: null, lng: null }, ...apiStores];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStaffFormValues>({
    resolver: zodResolver(updateStaffSchema as any),
    defaultValues: {
      name: staff.name ?? "",
      email: staff.email,
      role: staff.role as UpdateStaffFormValues["role"],
      isActive: staff.isActive ? "true" : "false",
      storeId: staff.storeId,
    },
  });

  const onSubmit = (values: UpdateStaffFormValues) => {
    const body: Record<string, unknown> = {};
    if (values.name) body.name = values.name;
    if (values.email) body.email = values.email;
    if (values.role) body.role = values.role;
    body.storeId = values.storeId || staff.storeId;
    body.isActive = values.isActive === "true";

    updateStaff({ id: staff.id, data: body as any }, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Staff updated successfully");
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to update staff");
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
        <Label htmlFor="name" className="text-text-secondary font-bold">TÊN</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Tên nhân viên"
          className="bg-surface-muted border-0 rounded-md h-12 sm:h-14"
        />
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
        <Label htmlFor="role" className="text-text-secondary font-bold">VAI TRÒ</Label>
        <select
          id="role"
          {...register("role")}
          className="flex h-12 sm:h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none"
        >
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
          UPDATE STAFF
        </AppButton>
      </div>
    </form>
  );
};
