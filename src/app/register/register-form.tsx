"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "./register-schema";
import { useRegister } from "./use-register";
import { AppButton, Input, Checkbox, Label } from "@/shared/ui";
import Link from "next/link";
import { AxiosError } from "axios";
import { Chrome } from "lucide-react";

export function RegisterForm() {
  const { mutate: registerUser, isPending, error } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      joinRewards: false,
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerUser(data);
  };

  const errorMessage = error instanceof AxiosError 
    ? error.response?.data?.message 
    : "Đã xảy ra lỗi. Vui lòng thử lại sau.";

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h4-bold text-text-secondary">Bắt Đầu Hành Trình</h2>
        <p className="text-body-sm-reg text-text-muted leading-relaxed">
          Tạo tài khoản để theo dõi đơn hàng và ưu đãi của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        {errorMessage && (
          <div className="rounded-md bg-error/10 p-md text-body-sm-reg text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <Label htmlFor="name" className="text-text-secondary">HỌ VÀ TÊN</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name")}
            className={errors.name ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.name && (
            <span className="text-overline text-error">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="email" className="text-text-secondary">ĐỊA CHỈ EMAIL</Label>
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

        <div className="flex flex-col gap-xs">
          <Label htmlFor="phone" className="text-text-secondary">SỐ ĐIỆN THOẠI</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0933710444"
            {...register("phone")}
            className={errors.phone ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.phone && (
            <span className="text-overline text-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="password" className="text-text-secondary">MẬT KHẨU</Label>
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

        <div className="flex items-start gap-sm">
          <Checkbox id="joinRewards" {...register("joinRewards")} className="mt-1 border-text-primary/50 bg-surface-muted rounded-full" />
          <Label htmlFor="joinRewards" className="normal-case font-medium text-[13px] text-text-muted leading-tight">
            Tham gia chương trình Roastery Rewards để<br />tích điểm cho mỗi đơn hàng.
          </Label>
        </div>

        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text uppercase font-bold">
          ĐĂNG KÝ
        </AppButton>
      </form>

      <div className="flex flex-col gap-md">
        <div className="flex gap-md">
          <button className="flex h-[46px] flex-1 items-center justify-center gap-sm rounded-[32px] border border-text-primary/50 px-md hover:bg-black/5 transition-colors">
            <Chrome className="size-5 text-text-primary" />
            <span className="text-body-sm-semibold text-text-primary">Google</span>
          </button>
          <button className="flex h-[46px] flex-1 items-center justify-center gap-sm rounded-[32px] border border-text-primary/50 px-md hover:bg-black/5 transition-colors">
            <div className="size-5 rounded-full bg-text-primary" />
            <span className="text-body-sm-semibold text-text-primary">Apple</span>
          </button>
        </div>

        <div className="flex justify-center text-body-sm-reg">
          <span className="text-text-muted">Đã có tài khoản? </span>
          <Link href="/login" className="ml-1 text-text-primary hover:underline">
             Đăng nhập tại đây
          </Link>
        </div>
      </div>

      <div className="mt-lg flex flex-col items-center gap-sm">
        <div className="flex items-center gap-md">
          <Link href="/privacy" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            CHÍNH SÁCH BẢO MẬT
          </Link>
          <div className="size-1 rounded-full bg-text-secondary" />
          <Link href="/terms" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            ĐIỀU KHOẢN DỊCH VỤ
          </Link>
        </div>
      </div>
    </div>
  );
}
