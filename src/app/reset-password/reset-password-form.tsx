"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "./reset-password-schema";
import { useResetPassword } from "./use-reset-password";
import { AppButton, Input, Label } from "@/shared/ui";
import Link from "next/link";
import { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";

export function ResetPasswordForm() {
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPassword({ password: data.password });
  };

  const errorMessage = error instanceof AxiosError
    ? error.response?.data?.message
    : error?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h3-bold text-text-primary">Đặt Lại Mật Khẩu</h2>
        <p className="text-body-md-reg text-text-secondary leading-normal">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        {error && (
          <div className="rounded-md bg-error/10 p-md text-body-sm-reg text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <Label htmlFor="password" className="text-text-secondary">MẬT KHẨU MỚI</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.password && (
            <span className="text-overline text-error">{errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="confirmPassword" className="text-text-secondary">XÁC NHẬN MẬT KHẨU</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.confirmPassword && (
            <span className="text-overline text-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text">
          ĐẶT LẠI MẬT KHẨU
        </AppButton>
      </form>

      <div className="flex justify-center gap-xs text-body-sm-reg">
        <Link href="/login" className="flex items-center gap-xs font-semibold text-text-primary hover:underline">
          <ChevronLeft className="size-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
