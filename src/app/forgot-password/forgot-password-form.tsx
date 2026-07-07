"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "./forgot-password-schema";
import { useForgotPassword } from "./use-forgot-password";
import { AppButton, Input, Label } from "@/shared/ui";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const { mutate: submitForgotPassword, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    submitForgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className="flex w-full flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h2 className="text-h3-bold text-text-primary">Kiểm Tra Email</h2>
          <p className="text-body-md-reg text-text-secondary leading-normal">
            Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.
          </p>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-xs text-body-sm-semibold text-text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h3-bold text-text-primary">Quên Mật Khẩu</h2>
        <p className="text-body-md-reg text-text-secondary leading-normal">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <Label htmlFor="email" className="text-text-secondary">EMAIL</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            {...register("email")}
            className={errors.email ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.email && (
            <span className="text-overline text-error">{errors.email.message}</span>
          )}
        </div>

        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text">
          GỬI HƯỚNG DẪN
        </AppButton>
      </form>

      <div className="flex justify-center gap-xs text-body-sm-reg">
        <span className="text-text-secondary">Nhớ mật khẩu?</span>
        <Link href="/login" className="font-semibold text-text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
