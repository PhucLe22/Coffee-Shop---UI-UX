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
      fullName: "",
      email: "",
      password: "",
      joinRewards: false,
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerUser(data);
  };

  const errorMessage = error instanceof AxiosError 
    ? error.response?.data?.message 
    : "Something went wrong. Please try again.";

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h4-bold text-text-secondary">Begin Your Journey</h2>
        <p className="text-body-sm-reg text-text-muted leading-relaxed">
          Create an account to track your roasts and<br className="hidden lg:block" /> rewards.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        {error && (
          <div className="rounded-md bg-error/10 p-md text-body-sm-reg text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <Label htmlFor="fullName" className="text-text-secondary">FULL NAME</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            {...register("fullName")}
            className={errors.fullName ? "border-error focus-visible:ring-error" : "border-none"}
          />
          {errors.fullName && (
            <span className="text-overline text-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <Label htmlFor="email" className="text-text-secondary">EMAIL ADDRESS</Label>
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
          <Label htmlFor="password" className="text-text-secondary">PASSWORD</Label>
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
          <Checkbox id="joinRewards" {...register("joinRewards")} className="mt-1 border-text-primary/50 bg-[#ebe0d9] rounded-full" />
          <Label htmlFor="joinRewards" className="normal-case font-medium text-[13px] text-text-muted leading-tight">
            Join the Roastery Rewards program to<br />earn beans on every purchase.
          </Label>
        </div>

        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text uppercase font-bold">
          SIGN UP
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
          <span className="text-text-muted">Already have an account? </span>
          <Link href="/login" className="ml-1 text-text-primary hover:underline">
             Log in here
          </Link>
        </div>
      </div>

      <div className="mt-lg flex flex-col items-center gap-sm">
        <div className="flex items-center gap-md">
          <Link href="/privacy" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            PRIVACY POLICY
          </Link>
          <div className="size-1 rounded-full bg-text-secondary" />
          <Link href="/terms" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            TERMS OF SERVICE
          </Link>
        </div>
      </div>
    </div>
  );
}
