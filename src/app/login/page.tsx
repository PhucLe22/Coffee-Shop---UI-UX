"use client";

import { LoginForm } from "./login-form";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerAuthStore, useStaffAuthStore } from "@/shared/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const customerAuth = useCustomerAuthStore();
  const staffAuth = useStaffAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (staffAuth._hasHydrated && staffAuth.user) {
      router.replace("/internal/dashboard");
      return;
    }
    
    if (customerAuth._hasHydrated && customerAuth.user) {
      router.replace("/");
      return;
    }
  }, [customerAuth.user, customerAuth._hasHydrated, staffAuth.user, staffAuth._hasHydrated, router]);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
...
      <div className="relative flex h-[350px] w-full flex-col justify-end px-md pb-xl pt-2xl lg:h-auto lg:w-1/2 lg:justify-center lg:px-2xl lg:py-0 bg-[#330f00]">
        <Link 
          href="/" 
          className="absolute left-md top-md z-20 flex items-center gap-xs text-body-sm-semibold text-inverse-text opacity-70 hover:opacity-100 transition-opacity lg:left-2xl lg:top-xl"
        >
          <ChevronLeft className="size-4" />
          Back to Home
        </Link>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920"
            alt="Steaming cup of specialty coffee"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#330f00] via-[#330f00]/40 to-transparent lg:bg-gradient-to-r lg:from-[#330f00] lg:to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-lg lg:max-w-[480px]">
          <div className="flex items-center gap-md">
            <div className="h-[38px] w-[38px] rounded-full bg-[#330f00] border border-border-primary-50" />
            <span className="font-plus-jakarta text-h3-bold text-inverse-text tracking-tight">
              AMBER ROAST
            </span>
          </div>
          
          <h1 className="font-plus-jakarta text-h2-bold text-inverse-text leading-[1.2] lg:text-h1-bold">
            Crafting Rituals,<br />
            One Bean at a<br />
            Time.
          </h1>
          
          <p className="max-w-[320px] text-body-lg-reg text-inverse-text opacity-90 leading-relaxed">
            Join our community of artisans and access exclusive roasts and rewards.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center bg-surface-main px-md py-xl lg:px-2xl lg:py-0">
        <div className="w-full max-w-[360px] lg:max-w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
