"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "./login-schema";
import { useLogin } from "./use-login";
import { AppButton, Input, Checkbox, Label } from "@/shared/ui";
import Link from "next/link";
import { AxiosError } from "axios";

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
      keepLoggedIn: false,
    },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  const errorMessage = error instanceof AxiosError 
    ? error.response?.data?.message 
    : "Invalid email, phone or password";

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="text-h3-bold text-text-primary">Welcome Back</h2>
        <p className="text-body-md-reg text-text-secondary leading-normal">
          Log in to your artisan account to manage<br className="hidden lg:block" /> your subscription and journal entries.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
        {error && (
          <div className="rounded-md bg-error/10 p-md text-body-sm-reg text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <Label htmlFor="identifier" className="text-text-secondary">EMAIL OR PHONE NUMBER</Label>
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
          <Label htmlFor="password" className="text-text-secondary">PASSWORD</Label>
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

        <div className="flex items-center gap-sm h-9">
          <Checkbox id="keepLoggedIn" {...register("keepLoggedIn")} className="border-text-primary/50 bg-[#faf2eb] rounded-md" />
          <Label htmlFor="keepLoggedIn" className="normal-case font-medium text-body-sm-reg text-text-primary">
            Keep me logged in for 30 days
          </Label>
        </div>

        <AppButton type="submit" isLoading={isPending} className="w-full text-inverse-text">
          SIGN IN
        </AppButton>
      </form>

      <div className="flex justify-center gap-xs text-body-sm-reg">
        <span className="text-text-secondary">New to Amber Roast?</span>
        <Link href="/register" className="font-semibold text-text-primary hover:underline">
          Create an Account
        </Link>
      </div>

      <div className="mt-lg flex flex-col items-center gap-sm">
        <div className="flex gap-lg">
          <Link href="/privacy" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            PRIVACY POLICY
          </Link>
          <Link href="/terms" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
            TERMS OF SERVICE
          </Link>
        </div>
        <Link href="/accessibility" className="text-[11px] text-text-secondary hover:text-text-primary uppercase tracking-wider">
          ACCESSIBILITY
        </Link>
      </div>
    </div>
  );
}
