"use client";

import { ForgotPasswordForm } from "./forgot-password-form";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex h-[350px] w-full flex-col justify-end px-md pb-xl pt-2xl lg:h-auto lg:w-1/2 lg:justify-center lg:px-2xl lg:py-0 bg-text-primary">
        <Link
          href="/login"
          className="absolute left-md top-md z-20 flex items-center gap-xs text-body-sm-semibold text-inverse-text opacity-70 hover:opacity-100 transition-opacity lg:left-2xl lg:top-xl"
        >
          <ChevronLeft className="size-4" />
          Quay lại
        </Link>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920"
            alt="Steaming cup of specialty coffee"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-text-primary via-text-primary/40 to-transparent lg:bg-gradient-to-r lg:from-text-primary lg:to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col gap-lg lg:max-w-[480px]">
          <div className="flex items-center gap-md">
            <div className="h-[38px] w-[38px] rounded-full bg-text-primary border border-border-primary-50" />
            <span className="font-plus-jakarta text-h3-bold text-inverse-text tracking-tight">
              AMBER ROAST
            </span>
          </div>

          <h1 className="font-plus-jakarta text-h2-bold text-inverse-text leading-[1.2] lg:text-h1-bold">
            Quên Mật Khẩu?
          </h1>

          <p className="max-w-[320px] text-body-lg-reg text-inverse-text opacity-90 leading-relaxed">
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại tài khoản.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface-main px-md py-xl lg:px-2xl lg:py-0">
        <div className="w-full max-w-[360px] lg:max-w-[400px]">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
