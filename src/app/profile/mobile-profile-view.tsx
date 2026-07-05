"use client";

import React from "react";
import {
  User,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { AppButton } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useCustomerAuthStore, AuthService } from "@/shared/auth";
import { useProfile } from "./use-profile";
import { PersonalInfoSection } from "./personal-info-section";
import { AddressSection } from "./address-section";
import { toast } from "sonner";

const CustomerCard = () => {
  const { user } = useCustomerAuthStore();

  const tierLabel = user?.tier
    ? user.tier.charAt(0) + user.tier.slice(1).toLowerCase() + " Member"
    : "Member";

  return (
    <div className="flex h-auto w-full flex-col justify-between rounded-[32px] bg-surface-inverse p-6 text-inverse-text shadow-lg">
      <div className="flex flex-col gap-2">
        <h2 className="font-plus-jakarta text-[24px] font-bold leading-tight">
          {user?.name ?? "Customer"}
        </h2>
        <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1">
          <div className="size-2 rounded-full bg-brand-primary" />
          <span className="font-inter text-sm font-semibold">{tierLabel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[16px] border border-text-muted/50 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-inter text-sm font-semibold uppercase tracking-wider text-inverse-text">
              ĐIỂM TÍCH LŨY
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-plus-jakarta text-[24px] font-bold text-brand-primary">
                {user?.points?.toLocaleString() ?? 0}
              </span>
              <span className="font-inter text-sm text-inverse-text">pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingOptionProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const SettingOption = ({ icon: Icon, label, onClick }: SettingOptionProps) => (
  <button
    onClick={onClick}
    className="flex h-20 w-full items-center justify-between px-4 transition-colors hover:bg-white/5 active:bg-white/10">
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-lg bg-surface-accent text-text-primary">
        <Icon className="size-5" />
      </div>
      <span className="font-inter text-base font-bold text-text-primary">
        {label}
      </span>
    </div>
    <ChevronRight className="size-5 text-text-muted/50" />
  </button>
);

const SettingsGroup = ({
  title,
  options,
}: {
  title: string;
  options: SettingOptionProps[];
}) => (
  <div className="flex flex-col gap-4">
    <h3 className="px-1 font-inter text-sm font-semibold uppercase tracking-wider text-text-primary">
      {title}
    </h3>
    <div className="overflow-hidden rounded-[16px] bg-surface-muted">
      <div className="divide-y divide-text-primary/5">
        {options.map((option, index) => (
          <SettingOption key={index} {...option} />
        ))}
      </div>
    </div>
  </div>
);

export function MobileProfileView() {
  const router = useRouter();
  const { logout, accessToken, refreshToken } = useCustomerAuthStore();
  useProfile();

  const handleLogout = async () => {
    try {
      if (accessToken && refreshToken) {
        await AuthService.logout(accessToken, refreshToken);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logout();
      toast.success('Đã đăng xuất');
      router.push('/');
    }
  };

  const accountOptions = [
    { icon: User, label: "Thông tin cá nhân" },
    { icon: ClipboardList, label: "Lịch sử đơn hàng", onClick: () => router.push("/orders") },
  ];

  const supportOptions = [
    { icon: HelpCircle, label: "Trung tâm trợ giúp" },
    { icon: ShieldCheck, label: "Điều khoản & Chính sách" },
  ];

  return (
    <div className="flex flex-1 flex-col bg-surface-accent p-md pb-10">
      {/* Customer Card */}
      <CustomerCard />

      {/* Personal Information */}
      <div className="mt-6">
        <PersonalInfoSection />
      </div>

      {/* Saved Addresses */}
      <div className="mt-6">
        <AddressSection />
      </div>

      {/* Menu Groups */}
      <div className="mt-8 flex flex-col gap-8">
        <SettingsGroup title="TÀI KHOẢN & BẢO MẬT" options={accountOptions} />
        <SettingsGroup title="HỖ TRỢ & PHÁP LÝ" options={supportOptions} />
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <AppButton variant="danger" className="w-full font-bold" onClick={handleLogout}>
          <LogOut className="size-5" />
          Đăng xuất
        </AppButton>
      </div>
    </div>
  );
}
