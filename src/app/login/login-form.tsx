"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "./login-schema";
import { useLogin } from "./use-login";
import { AppButton, Input, Label } from "@/shared/ui";
import Link from "next/link";
import { AxiosError } from "axios";

const IS_DEMO = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const DEMO_ACCOUNTS = [
  { identifier: "khachhang@demo.vn", label: "Khách hàng" },
  { identifier: "admin@demo.vn", label: "Admin" },
  { identifier: "cashier@demo.vn", label: "Thu ngân" },
  { identifier: "kitchen@demo.vn", label: "Bếp" },
  { identifier: "shipper@demo.vn", label: "Shipper" },
];

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    console.log("[LoginForm] onSubmit data:", { ...data, password: "***" });
    login(data);
  };

  const errorMessage = error instanceof AxiosError 
    ? error.response?.data?.message 
    : null;

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h3-bold text-text-primary">Chào Mừng Trở Lại</h2>
        <p className="text-body-md-reg text-text-secondary leading-normal">
          Đăng nhập để quản lý đơn hàng và thông tin cá nhân của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        {errorMessage && (
          <div className="rounded-md bg-error/10 p-md text-body-sm-reg text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <Label htmlFor="identifier" className="text-text-secondary">EMAIL HOẶC SỐ ĐIỆN THOẠI</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="email@example.com or 0917..."
            {...register("identifier")}
            className={errors.identifier ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.identifier && (
            <span className="text-overline text-error">{errors.identifier.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="password" className="text-text-secondary">MẬT KHẨU</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-error focus-visible:ring-error" : "border-none"}
            />
            {/* Password visibility toggle could be added here to match the 'Button' node in Figma */}
          </div>
          {errors.password && (
            <span className="text-overline text-error">{errors.password.message}</span>
          )}
        </div>

        <div className="flex justify-end -mt-sm">
          <Link href="/forgot-password" className="text-body-sm-semibold text-text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>


        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text">
          ĐĂNG NHẬP
        </AppButton>
      </form>

      {IS_DEMO && (
        <div className="flex flex-col gap-sm rounded-md border border-dashed border-border-primary-50 p-md">
          <span className="text-overline text-text-secondary">TÀI KHOẢN DEMO — BẤM ĐỂ ĐĂNG NHẬP</span>
          <div className="flex flex-wrap gap-xs">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.identifier}
                type="button"
                disabled={isPending}
                onClick={() => login({ identifier: account.identifier, password: "demo123" })}
                className="rounded-full bg-surface-accent px-md py-xs text-body-sm-semibold text-text-primary hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-xs text-body-sm-reg">
        <span className="text-text-secondary">Mới đến với Amber Roast?</span>
        <Link href="/register" className="font-semibold text-text-primary hover:underline">
          Tạo Tài Khoản
        </Link>
      </div>

      <div className="mt-lg flex flex-col items-center gap-sm">
        <div className="flex gap-lg">
          <Link href="/privacy" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            CHÍNH SÁCH BẢO MẬT
          </Link>
          <Link href="/terms" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            ĐIỀU KHOẢN DỊCH VỤ
          </Link>
        </div>
        <Link href="/accessibility" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
          TRỢ NĂNG
        </Link>
      </div>
    </div>
  );
}
