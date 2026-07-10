"use client";

import React from "react";
import { useCustomerAuthStore } from "@/shared/auth";
import { useProfile } from "./use-profile";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex flex-col gap-2 p-4">
    <span className="text-body-sm-semibold uppercase tracking-wider text-text-muted">
      {label}
    </span>
    <span className="text-body-md-bold text-text-primary">
      {value}
    </span>
  </div>
);

export function PersonalInfoSection() {
  const { user } = useCustomerAuthStore();
  useProfile();

  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-4 py-4 md:px-8">
        <h3 className="text-h5-bold text-text-primary">Thông Tin Cá Nhân</h3>
        <button className="text-body-sm-semibold text-text-primary hover:underline transition-all">
          Chỉnh Sửa
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 p-4">
        <InfoItem label="Họ và Tên" value={user?.name ?? ""} />
        <InfoItem label="Địa chỉ Email" value={user?.email ?? ""} />
        <InfoItem label="Số Điện Thoại" value={user?.phone ?? ""} />
      </div>
    </section>
  );
}
