"use client";

import React from "react";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { AppButton } from "@/shared/ui";

const CustomerCard = () => {
  return (
    <div className="flex h-auto w-full flex-col justify-between rounded-[32px] bg-surface-inverse p-6 text-inverse-text shadow-lg">
      <div className="flex flex-col gap-2">
        <h2 className="font-plus-jakarta text-[24px] font-bold leading-tight">
          Julian Estévez
        </h2>
        <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1">
          <div className="size-2 rounded-full bg-brand-primary" />
          <span className="font-inter text-sm font-semibold">Gold Member</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[16px] border border-text-muted/50 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-inter text-sm font-semibold uppercase tracking-wider text-inverse-text">
              COLLECTIVE POINTS
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-plus-jakarta text-[24px] font-bold text-brand-primary">
                2,450
              </span>
              <span className="font-inter text-sm text-inverse-text">pts</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-plus-jakarta text-[11px] text-inverse-text">
              Next Tier: Platinum
            </span>
            <span className="font-inter text-sm font-semibold text-text-muted">
              550 pts to go
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-brand-primary"
            style={{ width: "78%" }}
          />
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
  const accountOptions = [
    { icon: User, label: "Thông tin cá nhân" },
    { icon: MapPin, label: "Địa chỉ đã lưu" },
    { icon: CreditCard, label: "Phương thức thanh toán" },
    { icon: Bell, label: "Cài đặt thông báo" },
  ];

  const supportOptions = [
    { icon: HelpCircle, label: "Trung tâm trợ giúp" },
    { icon: ShieldCheck, label: "Điều khoản & Chính sách" },
  ];

  return (
    <div className="flex flex-1 flex-col bg-surface-accent p-md pb-10">
      {/* Customer Card */}
      <CustomerCard />

      {/* Menu Groups */}
      <div className="mt-8 flex flex-col gap-8">
        <SettingsGroup title="ACCOUNT & SECURITY" options={accountOptions} />
        <SettingsGroup title="SUPPORT & LEGAL" options={supportOptions} />
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <AppButton variant="danger" className="w-full font-bold">
          <LogOut className="size-5" />
          Đăng xuất
        </AppButton>
      </div>
    </div>
  );
}
