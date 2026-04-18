import { RegisterForm } from "./register-form";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Amber Roast | Create Your Account",
  description: "Join our community of artisans and access exclusive roasts and rewards.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#fff8f3] py-2xl px-md lg:py-3xl">
      <Link 
        href="/" 
        className="absolute left-md top-md flex items-center gap-xs text-body-sm-semibold text-text-secondary opacity-70 hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="size-4" />
        Back to Home
      </Link>
      
      {/* Brand Header */}
      <div className="mb-2xl flex flex-col items-center gap-sm text-center">
        <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-brand-primary" />
        </div>
        <h1 className="font-plus-jakarta text-[36px] font-extrabold text-text-secondary leading-tight">
          Amber Roast
        </h1>
        <p className="text-body-sm-semibold text-text-muted tracking-tight">
          The Artisanal Ledger of Specialty Coffee
        </p>
      </div>

      {/* Main Sign Up Card */}
      <div className="w-full max-w-[420px] overflow-hidden rounded-[32px] border border-text-primary/10 bg-[#faf2eb] shadow-xl">
        {/* Visual Accent Header */}
        <div className="relative h-[128px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920"
            alt="Coffee ritual"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#330f00] via-[#330f00]/40 to-transparent" />
        </div>

        {/* Form Content */}
        <div className="px-xl py-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
